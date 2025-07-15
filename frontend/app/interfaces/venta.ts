export interface VentaTabla {
    id: string;
    fecha_venta: Date;
    nombre_paciente: string;
    total_productos: number;
    total_venta: number;
    metodo_pago: string;
    estado: string;
    id_factura: string,
}

export interface Factura {
    id: string;
    total: number;
    totalElementos: number;
    metodoPago: string;
    detalles: DetalleFactura[];
}

interface DetalleFactura {
    id: string;
    producto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}