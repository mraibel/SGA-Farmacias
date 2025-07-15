package com.example.inventario_servicio.controller;

import com.example.inventario_servicio.entity.Producto;
import com.example.inventario_servicio.repository.ProductoRepository;
import com.example.inventario_servicio.service.ProductoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoRepository productoRepository;

    @Autowired
    private ProductoService productoService;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Producto> getAll() {
        return productoRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable long id) {
        productoService.eliminar(id);
    }

    @PostMapping(consumes = "application/json")
    public Producto create(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

    @PutMapping("/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody Producto productoActualizado) {
        Producto productoExistente = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));

        productoExistente.setNombre(productoActualizado.getNombre());
        productoExistente.setDescripcion(productoActualizado.getDescripcion());
        productoExistente.setCategoria(productoActualizado.getCategoria());
        productoExistente.setPrecioCosto(productoActualizado.getPrecioCosto());
        productoExistente.setPrecioVenta(productoActualizado.getPrecioVenta());

        return productoRepository.save(productoExistente);
    }

    @GetMapping("/buscarPorIds")
    public List<Producto> obtenerProductosPorIds(@RequestParam List<Long> ids) {
        return productoService.buscarPorIds(ids);
    }

}
