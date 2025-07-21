package com.microservice.compras.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.microservice.compras.entity.Compra;
import com.microservice.compras.repository.CompraRepository;

@Service
public class CompraService {
    @Autowired
    private CompraRepository compraRepository;

    public List<Compra> obtenerTodos() {
        return compraRepository.findAll();
    }

    public Compra guardar(Compra compra) {
        return compraRepository.save(compra);
    }

    public void eliminar(Long id) {
        compraRepository.deleteById(id);
    }
}
