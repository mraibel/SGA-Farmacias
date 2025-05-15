package com.microservice.producto.controller;

import com.microservice.producto.entity.Producto;
import com.microservice.producto.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private ProductoService service;

    @GetMapping
    public List<Producto> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Producto getById(@PathVariable Long id) {
        return service.findById(id).orElse(null);
    }

    @PostMapping
    public Producto save(@RequestBody Producto producto) {
        return service.save(producto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}
