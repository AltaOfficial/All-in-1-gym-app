package com.strive.app;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@SpringBootApplication
public class AppApplication implements CommandLineRunner {
    private final DataSource dataSource;

    public AppApplication(final DataSource dataSource) {
        this.dataSource = dataSource;
    }

	public static void main(String[] args) {
		SpringApplication.run(AppApplication.class, args);
	}

    @Override
    public void run(String... args) {
        System.out.println("hello");
        final JdbcTemplate restTemplate = new JdbcTemplate(dataSource);
        restTemplate.execute("select 1");
    }
}
