package com.microservice.compras;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.RestController;

@EnableDiscoveryClient
@SpringBootApplication
@RestController
public class ComprasServicioApplication {

	public static void main(String[] args) {
		SpringApplication.run(ComprasServicioApplication.class, args);
	}

}
