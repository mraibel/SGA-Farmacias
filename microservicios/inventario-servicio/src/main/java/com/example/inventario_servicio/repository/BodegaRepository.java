package com.example.inventario_servicio.repository;

import com.example.inventario_servicio.entity.Bodega;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BodegaRepository extends JpaRepository<Bodega, Long> {
}
