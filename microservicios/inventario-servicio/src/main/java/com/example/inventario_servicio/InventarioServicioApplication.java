package com.example.inventario_servicio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
@RestController
public class InventarioServicioApplication {

	public static void main(String[] args) {
		SpringApplication.run(InventarioServicioApplication.class, args);
	}

	@GetMapping("/")
	public String home() {
		return "INVENTARIO";
	}
	
}
