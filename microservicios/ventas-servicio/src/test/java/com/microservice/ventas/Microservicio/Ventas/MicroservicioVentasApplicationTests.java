package com.microservice.ventas.Microservicio.Ventas;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import static org.mockito.Mockito.when;
import org.springframework.test.context.ActiveProfiles;

import com.microservice.ventas.Microservicio.Ventas.client.InventarioCliente;

@ActiveProfiles("test")
@SpringBootTest
public class MicroservicioVentasApplicationTests {

    @MockBean
    private InventarioCliente inventarioCliente;

    @Test
    void contextoCargaCorrectamente() {
        when(inventarioCliente.obtenerProductosInventario(null)).thenReturn(null); // Replace null with appropriate mock return value
        when(inventarioCliente.obtenerProductosInventario(null));

        // test real
    }
}
