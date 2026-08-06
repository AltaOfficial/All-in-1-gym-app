package com.strive.app.security;

import com.strive.app.domain.entities.UserEntity;
import com.strive.app.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

/**
 * Resolves the authenticated {@link UserEntity} for the current request, regardless of
 * which security filter chain authenticated it.
 * <p>
 * The app has two distinct authentication schemes on two different filter chains:
 * <ul>
 *   <li>The mobile-facing chain (see {@code SecurityConfig#securityFilterChain}) authenticates
 *   with the app's own JJWT tokens and populates the {@link org.springframework.security.core.context.SecurityContext}
 *   with an {@link AppUserDetails} principal wrapping the already-loaded {@link UserEntity}.</li>
 *   <li>The MCP resource-server chain (see {@code SecurityConfig#mcpAuthorizationFilterChain}) authenticates
 *   with OAuth2 JWTs from the co-located authorization server and populates the context with a raw
 *   {@link Jwt} principal, whose subject is currently the user's email.</li>
 * </ul>
 * MCP tool classes should depend on this instead of reading {@code SecurityContextHolder} directly.
 */
@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final UserService userService;

    /**
     * @return the current user, or {@link Optional#empty()} if no user can be resolved
     * from the current security context (e.g. anonymous access).
     */
    public Optional<UserEntity> find() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof AppUserDetails appUserDetails) {
            return Optional.ofNullable(appUserDetails.getUser());
        }

        if (principal instanceof Jwt jwt) {
            String email = jwt.getClaimAsString("email");
            if (email == null) {
                email = jwt.getSubject();
            }
            return findByEmail(email);
        }

        if (principal instanceof UserDetails userDetails) {
            return findByEmail(userDetails.getUsername());
        }

        return Optional.empty();
    }

    /**
     * @return the current user.
     * @throws IllegalStateException with a message safe to surface to an MCP client if no
     * user can be resolved.
     */
    public UserEntity require() {
        return find().orElseThrow(() -> new IllegalStateException(
                "Your Strive account could not be resolved from this session. Please reconnect the Strive connector."));
    }

    public UUID requireId() {
        return require().getId();
    }

    private Optional<UserEntity> findByEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        try {
            return Optional.ofNullable(userService.findByEmail(email));
        } catch (UsernameNotFoundException ex) {
            return Optional.empty();
        }
    }
}
