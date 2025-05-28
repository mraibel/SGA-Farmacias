package com.example.inventario_servicio.controller;

import com.example.inventario_servicio.entity.Stock;
import com.example.inventario_servicio.repository.StockRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/stocks")
public class StockController {

    private final StockRepository stockRepository;

    public StockController(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @GetMapping
    public List<Stock> getAll() {
        return stockRepository.findAll();
    }

    @PostMapping
    public Stock create(@RequestBody Stock stock) {
        return stockRepository.save(stock);
    }
}
