package com.example.inventario_servicio.repository;

import com.example.inventario_servicio.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, Long> {
}
