package com.example.usuario_servicio.repository;

import com.example.usuario_servicio.entity.LogAcceso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LogAccesoRepository extends JpaRepository<LogAcceso, Long> {
}
