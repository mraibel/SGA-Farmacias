export interface Bodega {
  nombre: string;
  ubicacion: string;
}

export interface Stock {
  id: number;
  cantidad: number;
  lote: string;
  vencimiento: string;
  bodega: Bodega;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precioCosto: number;
  precioVenta: number;
  categoria: string;
  stocks: Stock[];
}
