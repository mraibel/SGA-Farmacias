package com.example.inventario_servicio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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
    @JsonIgnoreProperties("stocks")
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "bodega_id")
    @JsonIgnoreProperties("stocks")
    private Bodega bodega;
}
