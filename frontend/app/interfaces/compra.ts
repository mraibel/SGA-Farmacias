export interface Proveedor {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface Compra {
  id?: number;
  numeroFactura: string;
  fecha: string; // formato: "yyyy-MM-dd"
  total: number;
  proveedorId: number;
  bodegaId: number;
  notas?: string;
}
