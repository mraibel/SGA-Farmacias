package com.microservice.pacientes.pacientes_servicio.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.microservice.pacientes.pacientes_servicio.entity.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    
}
