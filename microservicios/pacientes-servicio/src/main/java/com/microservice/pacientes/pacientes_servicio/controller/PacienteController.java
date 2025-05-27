package com.microservice.pacientes.pacientes_servicio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.microservice.pacientes.pacientes_servicio.dto.PacienteDTO;
import com.microservice.pacientes.pacientes_servicio.service.PacienteService;

@RestController
@RequestMapping(value = "/pacientes", produces = "application/json")
public class PacienteController {
    
    @Autowired
    private PacienteService pacienteService;

    @GetMapping
    public ResponseEntity<List<PacienteDTO>> obtenerPacientes() {
        List<PacienteDTO> pacientes = pacienteService.obtenerTodos();
        if (pacientes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(pacientes);
    }

    @PostMapping
    public ResponseEntity<PacienteDTO> crearPaciente(PacienteDTO pacienteDTO) {
        PacienteDTO nuevoPaciente = pacienteService.guardar(pacienteDTO);
        return ResponseEntity.ok(nuevoPaciente);
    }
}
