package com.microservice.compras.repository;

import com.microservice.compras.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompraRepository extends JpaRepository<Compra, Long> {

}
