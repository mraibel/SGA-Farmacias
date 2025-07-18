package com.microservice.ventas.Microservicio.Ventas.utils;

import java.sql.Date;

import lombok.Data;

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

    public PacienteDTO() {
    }

    public PacienteDTO(Long id, String nombre, String apellido, String rut, int telefono, String correo,
            String direccion, boolean estado, java.sql.Date fechaNacimiento) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.rut = rut;
        this.telefono = telefono;
        this.correo = correo;
        this.direccion = direccion;
        this.estado = estado;
        this.fechaNacimiento = fechaNacimiento;
    }
}
