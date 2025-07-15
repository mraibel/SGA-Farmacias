package com.microservice.ventas.Microservicio.Ventas.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemCarro {
    
    private Long id_producto;
    private Long cantidad;
    private Double precio_unitario;

}
