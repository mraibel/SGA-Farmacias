package com.microservice.ventas.Microservicio.Ventas.utils;

import java.util.Date;

import com.microservice.ventas.Microservicio.Ventas.entity.Estado;
import com.microservice.ventas.Microservicio.Ventas.entity.MetodoPago;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VentaDTO {

    private Long id;
    private Date fecha_venta;
    private String nombre_paciente;
    private Integer total_productos;
    private Double total_venta;
    private MetodoPago metodo_pago;
    private Estado estado;
    private Long id_factura;
    
}
