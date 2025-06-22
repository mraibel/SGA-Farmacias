package com.example.usuario_servicio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@EnableDiscoveryClient
@SpringBootApplication
@RestController
public class UsuarioServicioApplication {

	public static void main(String[] args) {
		SpringApplication.run(UsuarioServicioApplication.class, args);
	}

	@GetMapping("/")
	public String home() {
		return "Mostar al pipe";
	}
}
