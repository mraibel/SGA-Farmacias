package com.example.inventario_servicio.controller;

import com.example.inventario_servicio.entity.Producto;
import com.example.inventario_servicio.repository.ProductoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/productosss")
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Producto> getAll() {
        return productoRepository.findAll();
    }

    @PostMapping(consumes = "application/json")
    public Producto create(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

}
