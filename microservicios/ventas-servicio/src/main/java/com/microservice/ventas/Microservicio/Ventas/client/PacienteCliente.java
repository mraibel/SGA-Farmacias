package com.microservice.ventas.Microservicio.Ventas.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.microservice.ventas.Microservicio.Ventas.utils.PacienteDTO;

@FeignClient(name = "pacientes-servicio")
public interface PacienteCliente {

    @GetMapping("/api/pacientes/pacientes/{id}")
    PacienteDTO obtenerPacientePorId(@PathVariable Long id);
    
}
