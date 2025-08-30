package com.incidents;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class IncidentsManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(IncidentsManagementApplication.class, args);
    }
}
