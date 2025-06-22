package com.microservice.pacientes.pacientes_servicio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    public ResponseEntity<PacienteDTO> crearPaciente(@RequestBody PacienteDTO pacienteDTO) {
        PacienteDTO nuevoPaciente = pacienteService.guardar(pacienteDTO);
        return ResponseEntity.ok(nuevoPaciente);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarPaciente(@PathVariable Long id) {
        pacienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<PacienteDTO> actualizarPaciente(@RequestBody PacienteDTO pacienteDTO, @PathVariable Long id) {
        boolean actualizado = pacienteService.actualizar(pacienteDTO, id);
        if (actualizado) {
            PacienteDTO pacienteActualizado = pacienteService.obtenerPorId(id);
            return ResponseEntity.ok(pacienteActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
