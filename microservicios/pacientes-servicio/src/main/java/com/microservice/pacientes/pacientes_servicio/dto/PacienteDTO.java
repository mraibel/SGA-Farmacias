package com.microservice.pacientes.pacientes_servicio.dto;

import java.sql.Date;

import lombok.*;

@Data
public class PacienteDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String rut;
    private int telefono;
    private String correo;
    private boolean estado;
    private String direccion;
    private Date fechaNacimiento;
}
