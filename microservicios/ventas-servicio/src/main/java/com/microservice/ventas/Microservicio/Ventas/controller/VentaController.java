package com.microservice.ventas.Microservicio.Ventas.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.microservice.ventas.Microservicio.Ventas.entity.Venta;
import com.microservice.ventas.Microservicio.Ventas.service.VentaService;
import com.microservice.ventas.Microservicio.Ventas.utils.VentaAIngresar;
import com.microservice.ventas.Microservicio.Ventas.utils.VentaDTO;

@RestController
@RequestMapping("/ventasDatos")
public class VentaController {

    @Autowired
    private VentaService ventasService;
    
    @GetMapping("/")
    public List<VentaDTO> obtenerVentas() {
        try {
            return ventasService.obtenerVentas();
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error fetching ventas: " + e.getMessage());
            e.printStackTrace();
            // Return an empty list in case of an error
            return List.of();
        }
    }

    @PostMapping("/")
    public Venta guardarVenta(@RequestBody VentaAIngresar ventaAIngresar) {
        try {
            return ventasService.guardar(ventaAIngresar);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error saving venta: " + e.getMessage());
            e.printStackTrace();
            // Handle the error appropriately, e.g., throw a custom exception or return null
            return null;
        }
    }


}
