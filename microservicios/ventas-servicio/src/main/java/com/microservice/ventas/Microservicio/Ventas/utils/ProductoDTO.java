package com.microservice.ventas.Microservicio.Ventas.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private Double precioCosto;
    private Double precioVenta; 
    private String categoria;    

}
