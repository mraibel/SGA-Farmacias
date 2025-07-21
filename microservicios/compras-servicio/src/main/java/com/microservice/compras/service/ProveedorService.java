package com.microservice.compras.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.microservice.compras.entity.Medicamento;
import com.microservice.compras.entity.Proveedor;
import com.microservice.compras.repository.ProveedorRepository;

@Service
public class ProveedorService {
    @Autowired
    private ProveedorRepository proveedorRepository;

    public List<Proveedor> obtenerTodos() {
        return proveedorRepository.findAll();
    }

    public Proveedor guardar(Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    public List<Medicamento> getMedicamentosByProveedor(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id).orElseThrow();
        return proveedor.getMedicamentos();
    }

    public void eliminar(Long id) {
        proveedorRepository.deleteById(id);
    }
}
