package com.microservice.ventas.Microservicio.Ventas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableDiscoveryClient
@SpringBootApplication
@RestController
@EnableFeignClients
public class MicroservicioVentasApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicroservicioVentasApplication.class, args);
	}

	@GetMapping("/")
	public String home() {
		return "Servicio de Ventas Activo";
	}

}
