package com.strive.app.config;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.strive.app.repositories.UserRepository;
import com.strive.app.security.AppUserDetailsService;
import com.strive.app.security.JwtAuthenticationFilter;
import com.strive.app.services.AuthenticationService;
import org.springaicommunity.mcp.security.authorizationserver.config.McpAuthorizationServerConfigurer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.ObjectPostProcessor;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.authorization.OAuth2ClientRegistration;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2ClientRegistrationAuthenticationContext;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2ClientRegistrationAuthenticationProvider;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2ClientRegistrationAuthenticationValidator;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.converter.OAuth2ClientRegistrationRegisteredClientConverter;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.time.Duration;
import java.util.function.Consumer;

@Configuration
public class SecurityConfig {

    @Value("${RSA_JWK}")
    private String jwkJson;

    // azure autopopulates WEBSITE_HOSTNAME
    @Value("${WEBSITE_HOSTNAME:localhost:8000}")
    private String hostname;

    private String serverHost() {
        return hostname.startsWith("localhost") ? "http://" + hostname : "https://" + hostname;
    }

    @Bean
    @Order(1)
    public SecurityFilterChain authorizationServerFilterChain(HttpSecurity httpSecurity) throws Exception {
        var mcpAuthorizationServer = McpAuthorizationServerConfigurer.mcpAuthorizationServer()
                .dynamicClientRegistrationValidator(new Consumer<>() {
                    private final OAuth2ClientRegistrationAuthenticationValidator validator = new OAuth2ClientRegistrationAuthenticationValidator();

                    @Override
                    public void accept(OAuth2ClientRegistrationAuthenticationContext context){

                    }
                })
                .authorizationServer(authServer -> authServer.addObjectPostProcessor(
                        new ObjectPostProcessor<OAuth2ClientRegistrationAuthenticationProvider>() {
                            private final Converter<OAuth2ClientRegistration, RegisteredClient> oAuth2ClientRegistrationToRegisteredClientConverter =
                                    new OAuth2ClientRegistrationRegisteredClientConverter();

                            // since mcpAuthorizationServer doesn't listen to our YAML we need to add refresh token as a grant type,
                            // reuseRefreshTokens to false, and refresh token time to live here
                            @Override
                            public <O extends OAuth2ClientRegistrationAuthenticationProvider> O postProcess(O provider) {
                                provider.setRegisteredClientConverter(clientRegistration -> {
                                    RegisteredClient registeredClient = oAuth2ClientRegistrationToRegisteredClientConverter.convert(clientRegistration);
                                    return RegisteredClient.from(registeredClient) // creates a new builder using registeredClient so all the metadata passes over
                                            .authorizationGrantType(AuthorizationGrantType.REFRESH_TOKEN)
                                            .tokenSettings(TokenSettings.builder().reuseRefreshTokens(false).accessTokenTimeToLive(Duration.ofHours(1)).refreshTokenTimeToLive(Duration.ofHours(168)).build())
                                            .build();
                                });
                                return provider;
                            }
                        }));

        httpSecurity
                .securityMatcher(
                        "/oauth2/**",
                        "/connect/**",
                        "/userinfo",
                        "/.well-known/oauth-authorization-server/**",
                        "/.well-known/openid-configuration",
                        "/login")
                .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
                .with(mcpAuthorizationServer, Customizer.withDefaults())
                .formLogin(Customizer.withDefaults());
        return httpSecurity.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain mcpAuthorizationFilterChain(HttpSecurity httpSecurity) throws Exception {
        // since we have the auth server and the mcp on the same server,
        // this code is here instead of the default to stop the mcp from eagerly calling the auth server on startup before its ready
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(serverHost() + "/oauth2/jwks").build();
        decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(serverHost()));

        httpSecurity.securityMatcher("/mcp", "/.well-known/oauth-protected-resource", "/.well-known/oauth-protected-resource/**")
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/.well-known/oauth-protected-resource/**", "/.well-known/oauth-protected-resource").permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(o -> o.jwt(jwt -> jwt.decoder(decoder))
                        .protectedResourceMetadata(prm -> prm
                                .protectedResourceMetadataCustomizer(metadata -> metadata
                                        .resource(serverHost() + "/mcp")
                                        .authorizationServer(serverHost()))
                        ))
                .csrf(csrf -> csrf.disable());
        return httpSecurity.build();
    }

    @Bean
    @Order(3)
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity, AuthenticationService authenticationService) throws Exception {
        httpSecurity.authorizeHttpRequests(auth -> auth
                                .requestMatchers( "/auth/**").permitAll()
                        .anyRequest().authenticated()
        )
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JwtAuthenticationFilter(authenticationService), UsernamePasswordAuthenticationFilter.class);
        return httpSecurity.build();
    }

    @Bean
    public JWKSource<SecurityContext> jwkSource() throws Exception {
        RSAKey rsaKey = RSAKey.parse(jwkJson);
        JWKSet jwkSet = new JWKSet(rsaKey);
        return ((jwkSelector, context) ->  jwkSelector.select(jwkSet));
    }

    @Bean
    public AppUserDetailsService appUserDetailsService(UserRepository userRepository) {
        return new AppUserDetailsService(userRepository);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder(); // uses bcrypt
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
