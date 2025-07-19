"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Producto } from "@/app/interfaces/inventario";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Informe() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/inventario/productos`)
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
      })
      .catch((err) => console.error("Error al cargar productos:", err));
  }, [apiUrl]);

  const productosFiltrados = productos.filter((producto) => {
    return (
      producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      producto.id?.toString().includes(filtro)
    );
  });

  const productosConStock = productosFiltrados.map((producto) => {
    const totalStock = producto.stocks.reduce(
      (acc, stock) => acc + stock.cantidad,
      0
    );
    return { ...producto, totalStock };
  });

  const stockNormal = productosConStock.filter((p) => p.totalStock >= 100);
  const stockBajo = productosConStock.filter((p) => p.totalStock < 100);

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Título principal
    doc.setFontSize(18);
    doc.text("Informe de Inventario", 14, 15);

    // Primera tabla - stock normal
    autoTable(doc, {
      head: [["Nombre", "Descripción", "Precio Venta", "Stock Total"]],
      body: stockNormal.map((p) => [
        p.nombre,
        p.descripcion,
        `$${p.precioVenta}`,
        p.totalStock.toString(),
      ]),
      startY: 20,
      headStyles: { fillColor: [22, 160, 133] }, // verde azulado
      alternateRowStyles: { fillColor: [240, 240, 240] },
      theme: "striped",
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        // Puedes añadir un footer o header aquí si quieres
      },
    });

    // Obtener la posición Y para la siguiente tabla
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Segunda tabla - stock bajo
    doc.setFontSize(16);
    doc.text("Productos a reponer (Stock < 100)", 14, finalY);

    autoTable(doc, {
      head: [["Nombre", "Descripción", "Precio Venta", "Stock Total"]],
      body: stockBajo.map((p) => [
        p.nombre,
        p.descripcion,
        `$${p.precioVenta}`,
        p.totalStock.toString(),
      ]),
      startY: finalY + 5,
      headStyles: { fillColor: [192, 57, 43] }, // rojo oscuro
      alternateRowStyles: { fillColor: [255, 235, 230] },
      theme: "striped",
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });

    doc.save("reporte_inventario.pdf");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Informe de Inventario
          </h1>
          <p className="text-muted-foreground">
            Consulta detallada del estado actual de productos y stock.
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={exportToPDF}>Exportar a PDF</Button>
        </div>
      </div>

      <Input
        placeholder="Buscar por nombre o código..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="max-w-md"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1">
        {/* Productos en stock normal */}
        <Card>
          <CardHeader>
            <CardTitle>Productos en stock normal</CardTitle>
            <CardDescription>
              Productos con stock ≥ 100 unidades.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Precio Venta</TableHead>
                  <TableHead>Stock Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockNormal.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.descripcion}</TableCell>
                    <TableCell>${producto.precioVenta}</TableCell>
                    <TableCell>{producto.totalStock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Productos a reponer */}
        <Card>
          <CardHeader>
            <CardTitle>Productos a reponer</CardTitle>
            <CardDescription>Stock menor a 100 unidades.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Precio Venta</TableHead>
                  <TableHead>Stock Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockBajo.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.descripcion}</TableCell>
                    <TableCell>${producto.precioVenta}</TableCell>
                    <TableCell>{producto.totalStock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
