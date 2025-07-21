package com.microservice.compras;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableDiscoveryClient
@SpringBootApplication
@RestController
@EnableFeignClients
public class ComprasServicioApplication {

	public static void main(String[] args) {
		SpringApplication.run(ComprasServicioApplication.class, args);
	}

}
