package com.example.inventario_servicio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "stock")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int cantidad;

    private String lote;

    private LocalDate vencimiento;

    @ManyToOne
@JoinColumn(name = "producto_id")
@JsonBackReference("producto-stock")
private Producto producto;

@ManyToOne
@JoinColumn(name = "bodega_id")
@JsonBackReference("bodega-stock")
private Bodega bodega;
}
