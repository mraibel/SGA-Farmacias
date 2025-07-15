package com.microservice.ventas.Microservicio.Ventas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservice.ventas.Microservicio.Ventas.entity.Venta;

public interface VentaRepository extends JpaRepository<Venta, Long> {
    
}
