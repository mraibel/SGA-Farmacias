package com.example.usuario_servicio.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.usuario_servicio.entity.Usuario;
import com.example.usuario_servicio.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
public class ControllerTest {

    private JacksonTester<Usuario> jsonUser;
    private MockMvc mockMvc;
    @Mock
    private UsuarioService usuarioService;
    @InjectMocks
    private UsuarioController usuarioController;

    @BeforeEach
    void setup() {
        JacksonTester.initFields(this, new ObjectMapper());
        mockMvc = MockMvcBuilders.standaloneSetup(usuarioController).build();
    }

    @Test
    void testObtenerTodosLosUsuarios() throws Exception {
        Usuario usuario1 = new Usuario();
        usuario1.setId(1L);
        usuario1.setNombre("Juan");
        usuario1.setApellido("Pérez");
        usuario1.setCorreo("juan@correo.com");

        Usuario usuario2 = new Usuario();
        usuario2.setId(2L);
        usuario2.setNombre("Ana");
        usuario2.setApellido("García");
        usuario2.setCorreo("ana@correo.com");

        List<Usuario> usuarios = new ArrayList<>();
        usuarios.add(usuario1);
        

        when(usuarioService.obtenerTodos()).thenReturn(usuarios);

        MockHttpServletResponse response = mockMvc
                .perform(MockMvcRequestBuilders.get("/usuariosdatos"))
                .andReturn()
                .getResponse();

        assertEquals(HttpStatus.OK.value(), response.getStatus());
        String expectedJson = jsonUser.write(usuario1).getJson();
        String actualJson = response.getContentAsString();
        assertEquals(expectedJson, actualJson);
        
    }
}
