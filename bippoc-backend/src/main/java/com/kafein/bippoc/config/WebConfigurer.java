package com.kafein.bippoc.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class WebConfigurer {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Collections.unmodifiableList(Collections.singletonList("*")));
        config.setAllowedHeaders(Collections.unmodifiableList(Collections.singletonList("*")));
        config.setAllowedMethods(Collections.unmodifiableList(Arrays.asList("GET", "HEAD", "POST", "DELETE", "PUT", "OPTIONS")));
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }

}
