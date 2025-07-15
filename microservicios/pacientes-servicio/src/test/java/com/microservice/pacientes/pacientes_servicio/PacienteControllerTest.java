package com.microservice.pacientes.pacientes_servicio;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.sql.Date;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.microservice.pacientes.pacientes_servicio.controller.PacienteController;
import com.microservice.pacientes.pacientes_servicio.service.PacienteService;
import com.microservice.pacientes.pacientes_servicio.dto.PacienteDTO;

@WebMvcTest(PacienteController.class)
public class PacienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PacienteService pacienteService;

    @Test
    void testCrearPaciente() throws Exception {
        PacienteDTO paciente = new PacienteDTO(1L, "Felipe", "Toro", "22135626k", 24235252, "prueba@gmail.com",
                "Calle Falsa 123", true, Date.valueOf("1990-01-01"));

        when(pacienteService.guardar(any(PacienteDTO.class))).thenReturn(paciente);

        mockMvc.perform(post("/pacientes")
                .contentType(APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(paciente)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Felipe"))
                .andExpect(jsonPath("$.apellido").value("Toro"))
                .andExpect(jsonPath("$.rut").value("22135626k"));

    }

}
