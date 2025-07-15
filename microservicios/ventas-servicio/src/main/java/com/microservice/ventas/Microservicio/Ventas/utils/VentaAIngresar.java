package com.microservice.ventas.Microservicio.Ventas.utils;

import java.util.List;

import com.microservice.ventas.Microservicio.Ventas.entity.MetodoPago;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VentaAIngresar {
    
    private Long id_paciente;
    private List<ItemCarro> productos;
    private MetodoPago metodo_pago;
    
}
