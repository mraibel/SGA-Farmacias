package com.example.inventario_servicio.repository;

import com.example.inventario_servicio.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
