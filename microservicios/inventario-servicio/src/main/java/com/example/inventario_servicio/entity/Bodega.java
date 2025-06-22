package com.example.inventario_servicio.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "bodega")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bodega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String ubicacion;

    @OneToMany(mappedBy = "bodega", cascade = CascadeType.ALL)
@JsonManagedReference("bodega-stock")
private List<Stock> stocks;
}
