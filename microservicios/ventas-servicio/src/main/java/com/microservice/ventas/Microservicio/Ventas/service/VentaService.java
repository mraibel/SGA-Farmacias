package com.microservice.ventas.Microservicio.Ventas.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.microservice.ventas.Microservicio.Ventas.client.PacienteCliente;
import com.microservice.ventas.Microservicio.Ventas.entity.Estado;
import com.microservice.ventas.Microservicio.Ventas.entity.Factura;
import com.microservice.ventas.Microservicio.Ventas.entity.FacturaDetalle;
import com.microservice.ventas.Microservicio.Ventas.entity.MetodoPago;
import com.microservice.ventas.Microservicio.Ventas.entity.Venta;
import com.microservice.ventas.Microservicio.Ventas.repository.VentaRepository;
import com.microservice.ventas.Microservicio.Ventas.utils.ItemCarro;
import com.microservice.ventas.Microservicio.Ventas.utils.VentaAIngresar;
import com.microservice.ventas.Microservicio.Ventas.utils.VentaDTO;

@Service
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;
    @Autowired
    private PacienteCliente pacienteCliente;

    public List<VentaDTO> obtenerVentas() {
        List<Venta> ventas = ventaRepository.findAll();

        if (ventas.isEmpty()) {
            return new ArrayList<VentaDTO>(); // Retorna una lista vacía si no hay ventas
        }
        List<VentaDTO> ventasDTO = new ArrayList<VentaDTO>();

        for (Venta venta : ventas) {
            VentaDTO ventaDTO = new VentaDTO();
            ventaDTO.setId(venta.getId());
            ventaDTO.setFecha_venta(venta.getFecha());
            // Poner logica nombre paciente
            String nombrePaciente = pacienteCliente.obtenerPacientePorId(venta.getPaciente_id()).getNombre();
            String apellidoPaciente = pacienteCliente.obtenerPacientePorId(venta.getPaciente_id()).getApellido();
            ventaDTO.setNombre_paciente(nombrePaciente + " " + apellidoPaciente);
            ventaDTO.setTotal_productos(venta.getFactura().getDetalles().size());
            ventaDTO.setTotal_venta(venta.getFactura().getTotal());
            ventaDTO.setMetodo_pago(venta.getFactura().getMetodo_pago());
            ventaDTO.setEstado(venta.getEstado());
            ventaDTO.setId_factura(venta.getFactura().getId());
            ventasDTO.add(ventaDTO);
        }

        return ventasDTO;
    }

    public Venta guardar(VentaAIngresar ventaAIngresar) {

        // Creación de la factura
        Factura factura = new Factura();
        MetodoPago metodoPago = ventaAIngresar.getMetodo_pago();
        factura.setMetodo_pago(metodoPago);
        
        Double sumaTotal = 0.0;

        // Agregar detalles a la factura
        List<ItemCarro> productos = ventaAIngresar.getProductos();

        for (ItemCarro item : productos) {
            FacturaDetalle detalle = new FacturaDetalle();
            detalle.setProducto_id(item.getId_producto());
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(item.getPrecio_unitario());
            sumaTotal += item.getCantidad() * item.getPrecio_unitario();
            factura.agregarDetalle(detalle);
        }

        // Establecer el total de la factura
        factura.setTotal(sumaTotal);

        // Crear venta
        Venta venta = new Venta();
        venta.setFactura(factura);
        venta.setPaciente_id(ventaAIngresar.getId_paciente());
        venta.setEstado(Estado.PENDIENTE);
        venta.setFecha(new Date());

        return ventaRepository.save(venta);
        
    }
    
}
