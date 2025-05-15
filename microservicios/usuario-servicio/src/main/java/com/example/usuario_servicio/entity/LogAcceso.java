package com.example.usuario_servicio.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogAcceso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accion;

    private LocalDateTime fechaHora;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
