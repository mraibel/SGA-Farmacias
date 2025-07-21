package com.microservice.compras.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.microservice.compras.entity.Compra;
import com.microservice.compras.service.CompraService;

@RestController
@RequestMapping("/compras")
public class CompraController {

    private final CompraService compraService;

    public CompraController(CompraService compraService) {
        this.compraService = compraService;
    }

    @GetMapping
    public List<Compra> obtenerTodas() {
        return compraService.obtenerTodos();
    }

    @PostMapping
    public Compra crearCompra(@RequestBody Compra compra) {
        return compraService.guardar(compra);
    }
}
