package com.example.inventario_servicio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventario_servicio.entity.Producto;
import com.example.inventario_servicio.repository.ProductoRepository;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> obtenerTodos(){
        return productoRepository.findAll();
    }

    public Producto guardar(Producto producto){
        System.out.println("Guardando producto: " + producto);
        return productoRepository.save(producto);
    }

    public void eliminar(Long id){
        productoRepository.deleteById(id);
    }

    public List<Producto> buscarPorIds(List<Long> ids) {
        List<Producto> productos = productoRepository.findAllById(ids);
        if (productos.isEmpty()) {
            throw new RuntimeException("No se encontraron productos con los IDs proporcionados: " + ids);
        }
        return productos;
    }

}
