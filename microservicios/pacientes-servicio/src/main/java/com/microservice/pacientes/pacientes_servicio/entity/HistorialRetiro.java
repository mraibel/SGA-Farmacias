package com.microservice.pacientes.pacientes_servicio.entity;


import java.sql.Date;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialRetiro {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_retiro")
    private Date fechaRetiro;

    @Column(name = "producto_id")
    private Long productoId;

    private Long cantidad;

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;
}
