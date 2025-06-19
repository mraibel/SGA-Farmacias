package com.example.inventario_servicio.controller;

import com.example.inventario_servicio.entity.Bodega;
import com.example.inventario_servicio.repository.BodegaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/bodegas")
public class BodegaController {

    private final BodegaRepository bodegaRepository;

    public BodegaController(BodegaRepository bodegaRepository) {
        this.bodegaRepository = bodegaRepository;
    }

    @GetMapping
    public List<Bodega> getAll() {
        return bodegaRepository.findAll();
    }

    @PostMapping
    public Bodega create(@RequestBody Bodega bodega) {
        return bodegaRepository.save(bodega);
    }
}
