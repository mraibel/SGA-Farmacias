package com.microservice.ventas.Microservicio.Ventas.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.microservice.ventas.Microservicio.Ventas.utils.ProductoDTO;

@FeignClient(name = "inventario-servicio")
public interface InventarioCliente {
    
    @GetMapping("/api/inventario/productos")
    List<ProductoDTO> obtenerProductosInventario(@RequestParam("ids") List<Long> ids);
}
