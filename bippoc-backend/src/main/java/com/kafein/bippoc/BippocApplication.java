package com.kafein.bippoc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class BippocApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(BippocApplication.class, args);
	}

}
