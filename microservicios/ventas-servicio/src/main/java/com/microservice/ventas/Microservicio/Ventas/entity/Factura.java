package com.microservice.ventas.Microservicio.Ventas.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Factura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double total;
    private MetodoPago metodo_pago;

    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FacturaDetalle> detalles = new ArrayList<>();

    @OneToOne(mappedBy = "factura", orphanRemoval = true)
    @JsonIgnore
    private Venta venta;

    public void agregarDetalle(FacturaDetalle detalle) {
        detalles.add(detalle);
        detalle.setFactura(this);
    }
}
