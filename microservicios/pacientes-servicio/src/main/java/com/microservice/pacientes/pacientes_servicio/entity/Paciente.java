package com.microservice.pacientes.pacientes_servicio.entity;

import java.sql.Date;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paciente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;
    private String rut;
    private int telefono;
    private String correo;
    private String direccion;
    private Boolean estado; //activo o inactivo
    
    @Column(name = "fecha_nacimiento")
    private Date fechaNacimiento;

}
