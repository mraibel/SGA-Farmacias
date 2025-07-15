package com.microservice.pacientes.pacientes_servicio;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

import java.sql.Date;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.microservice.pacientes.pacientes_servicio.dto.PacienteDTO;
import com.microservice.pacientes.pacientes_servicio.entity.Paciente;
import com.microservice.pacientes.pacientes_servicio.repository.PacienteRepository;
import com.microservice.pacientes.pacientes_servicio.service.PacienteService;

@ExtendWith(MockitoExtension.class)
public class PacienteServiceTest {

    @InjectMocks
    private PacienteService pacienteService;

    @Mock
    private PacienteRepository pacienteRepository;

    @Test
    void testObtenerPacientePorId_Existe() {
        Paciente paciente = new Paciente(1L, "Felipe", "Toro", "22135626k", 24235252, "prueba@gmail.com",
                "Calle Falsa 123", true, Date.valueOf("1990-01-01"));

        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));

        PacienteDTO resultado = pacienteService.obtenerPorId(1L);

        assertEquals("Felipe", resultado.getNombre());
        assertEquals("Toro", resultado.getApellido());
    }

    @Test
    void testObtenerPacientePorId_NoExiste() {
        when(pacienteRepository.findById(1L)).thenReturn(Optional.empty());

        PacienteDTO resultado = pacienteService.obtenerPorId(1L);

        assertEquals(null, resultado);
    }

    @Test
    void testCrearPaciente() {
        PacienteDTO nuevo = new PacienteDTO(null, "Topa", "Yevenes", "123456789", 12345678, "topa@gmail.com",
                "Calle Falsa 456", true, Date.valueOf("1995-05-05"));

        Paciente guardado = new Paciente(1L, "Topa", "Yevenes", "123456789", 12345678, "topa@gmail.com",
                "Calle Falsa 456", true, Date.valueOf("1995-05-05"));

        when(pacienteRepository.save(any(Paciente.class))).thenReturn(guardado);

        PacienteDTO resultado = pacienteService.guardar(nuevo);

        assertNotNull(resultado.getId());
        assertEquals("Topa", resultado.getNombre());
    }
}
