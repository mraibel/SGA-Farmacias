package com.example.usuario_servicio.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String correo;
    private String contrasena;
}
