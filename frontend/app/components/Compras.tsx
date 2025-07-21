"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Compra, Proveedor } from "@/app/interfaces/compra";
import { Medicamento } from "@/app/interfaces/medicamento";

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [filtro, setFiltro] = useState("");
  const [openNuevaCompra, setOpenNuevaCompra] = useState(false);
  const [proveedorForm, setProveedorForm] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
  });
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [nuevaCompra, setNuevaCompra] = useState({
    proveedorId: "",
    numeroFactura: "",
    fecha: "",
    total: 0,
  });
  const [medicamentosProveedor, setMedicamentosProveedor] = useState<Medicamento[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<string>("");
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>("");
  const [productosCompra, setProductosCompra] = useState<{ id: number, nombre: string, precio: number, cantidad: number }[]>([]);
  const [tabValue, setTabValue] = useState("compras");

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/compras`;

  const fetchCompras = () => {
    fetch(`${apiUrl}/compras`)
      .then((res) => res.json())
      .then(setCompras)
      .catch(() => setCompras([]));
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  // Obtener proveedores al montar
  useEffect(() => {
    fetch(`${apiUrl}/proveedor`)
      .then((res) => res.json())
      .then(setProveedores)
      .catch(() => setProveedores([]));
  }, []);

  const comprasFiltradas = compras.filter((compra) =>
    compra.numeroFactura.toLowerCase().includes(filtro.toLowerCase()) ||
    (compra.fecha && compra.fecha.toString().includes(filtro))
  );

  const handleCrearProveedor = async (proveedor: Omit<Proveedor, "id">) => {
    try {
      const response = await fetch(`${apiUrl}/proveedor`, {
        method: "POST",
        headers : {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proveedor),
      });
      if (!response.ok) {
        throw new Error("Error al crear el proveedor");
      }
    } catch (error) {
      console.error("Error al crear el proveedor:", error);
      alert("No se pudo crear el proveedor. Intente nuevamente.");
    }
  }

  const handleProveedorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProveedorForm({
      ...proveedorForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitProveedor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleCrearProveedor(proveedorForm);
    setProveedorForm({ nombre: "", telefono: "", direccion: "" });
  };

  const handleNuevaCompraInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setNuevaCompra({
      ...nuevaCompra,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitNuevaCompra = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/compras`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroFactura: nuevaCompra.numeroFactura,
          fecha: nuevaCompra.fecha,
          total: totalCompra,
          proveedorId: Number(nuevaCompra.proveedorId),
          bodegaId: 1,
        }),
      });
      if (!response.ok) throw new Error("Error al crear la compra");
      setNuevaCompra({
        proveedorId: "",
        numeroFactura: "",
        fecha: "",
        total: 0,
      });
      setProductosCompra([]); 
      setProductoSeleccionado("");
      setMedicamentosProveedor([]); 
      setProveedorSeleccionado("");
      setOpenNuevaCompra(false);
    } catch (err) {
      alert("No se pudo crear la compra");
    }
  };

  const handleProveedorChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const proveedorId = e.target.value;
    setNuevaCompra({ ...nuevaCompra, proveedorId });
    setProveedorSeleccionado(proveedorId);

    if (proveedorId) {
      try {
        const response = await fetch(`${apiUrl}/proveedor/${proveedorId}/medicamentos`);
        if (response.ok) {
          const data = await response.json();
          setMedicamentosProveedor(data);
          setProductoSeleccionado("");
        } else {
          setMedicamentosProveedor([]);
          setProductoSeleccionado("");
        }
      } catch (err) {
        setMedicamentosProveedor([]);
        setProductoSeleccionado("");
        console.error("Error al obtener medicamentos:", err);
      }
    } else {
      setMedicamentosProveedor([]);
      setProductoSeleccionado("");
    }
  };

  const handleProductoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductoSeleccionado(e.target.value);
  };

  const handleAgregarProducto = () => {
    const med = medicamentosProveedor.find(m => m.id === Number(productoSeleccionado));
    if (med) {
      setProductosCompra([
        ...productosCompra,
        { id: med.id, nombre: med.nombre, precio: med.precio ?? 0, cantidad: 1 }
      ]);
      setProductoSeleccionado("");
    }
  };

  const totalCompra = productosCompra.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Compras</h1>
        <p className="text-muted-foreground">
          Gestión de compras, proveedores y recepción de productos
        </p>
      </div>
      <Tabs
        defaultValue="compras"
        value={tabValue}
        onValueChange={(val) => {
          setTabValue(val);
          if (val === "compras") fetchCompras();
        }}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="compras">Compras</TabsTrigger>
          <TabsTrigger value="nueva">Nueva compra</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
        </TabsList>

        <TabsContent value="compras" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compras</CardTitle>
              <CardDescription>
                Listado de compras realizadas y su estado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Input
                  placeholder="Buscar compras..."
                  className="max-w-sm"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
                <Button variant="default" onClick={() => setOpenNuevaCompra(true)}>
                  + Nueva compra
                </Button>
                <Button variant="outline">Exportar</Button>
              </div>
            </CardContent>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>N° Factura</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comprasFiltradas.map((compra) => (
                    <TableRow key={compra.id}>
                      <TableCell>{compra.fecha}</TableCell>
                      <TableCell>
                        {proveedores.find((p) => p.id === compra.proveedorId)?.nombre || compra.proveedorId}
                      </TableCell>
                      <TableCell>{compra.numeroFactura}</TableCell>
                      <TableCell>${compra.total.toLocaleString("es-CL")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-muted-foreground">
                  Mostrando {comprasFiltradas.length} de {compras.length} compras
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Anterior</Button>
                  <Button variant="outline" size="sm">Siguiente</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="nueva" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crear nueva compra</CardTitle>
              <CardDescription>
                Registre una nueva compra en el sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmitNuevaCompra}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-medium">Proveedor</label>
                    <select
                      className="border rounded-md h-10 px-2"
                      name="proveedorId"
                      value={nuevaCompra.proveedorId}
                      onChange={handleProveedorChange}
                      required
                    >
                      <option value="" disabled>Seleccionar proveedor</option>
                      {proveedores.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-medium">N° Factura</label>
                    <Input
                      name="numeroFactura"
                      value={nuevaCompra.numeroFactura}
                      onChange={handleNuevaCompraInput}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-medium">Fecha</label>
                    <Input
                      type="date"
                      name="fecha"
                      value={nuevaCompra.fecha}
                      onChange={handleNuevaCompraInput}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 col-span-1">
                    <label className="font-medium">Producto</label>
                    <div className="flex gap-2">
                      <select
                        className="border rounded-md h-10 px-2 w-full"
                        value={productoSeleccionado}
                        onChange={handleProductoChange}
                        disabled={medicamentosProveedor.length === 0}
                      >
                        <option value="" disabled>Seleccionar producto</option>
                        {medicamentosProveedor.map((m) => (
                          <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                      </select>
                      <Button type="button" className="h-10" onClick={handleAgregarProducto}>Agregar</Button>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productosCompra.map((prod, idx) => (
                        <TableRow key={prod.id}>
                          <TableCell>{prod.nombre}</TableCell>
                          <TableCell>${prod.precio.toLocaleString("es-CL")}</TableCell>
                          <TableCell>
                            <Input
                              className="w-20 text-center"
                              type="number"
                              min={1}
                              value={prod.cantidad}
                              onChange={e => {
                                const cantidad = Number(e.target.value);
                                setProductosCompra(productosCompra.map((p, i) =>
                                  i === idx ? { ...p, cantidad } : p
                                ));
                              }}
                            />
                          </TableCell>
                          <TableCell>${(prod.precio * prod.cantidad).toLocaleString("es-CL")}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => setProductosCompra(productosCompra.filter((_, i) => i !== idx))}>🗑️</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-4">
                  <div className="flex flex-col items-end w-full md:w-1/2 mt-2 md:mt-0">
                    <span className="text-muted-foreground text-sm">Total</span>
                    <span className="text-3xl font-bold">
                      ${totalCompra.toLocaleString("es-CL")}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" type="button" onClick={() => setOpenNuevaCompra(false)}>Cancelar</Button>
                  <Button type="submit" className="bg-blue-600 text-white">Guardar orden</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="proveedores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Proveedores</CardTitle>
              <CardDescription>
                Registre y gestione los proveedores de la farmacia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4 max-w-lg" onSubmit={handleSubmitProveedor}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-medium">Nombre</label>
                    <Input
                      name="nombre"
                      value={proveedorForm.nombre}
                      onChange={handleProveedorInput}
                      placeholder="Nombre del proveedor"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-medium">Teléfono</label>
                    <Input
                      name="telefono"
                      value={proveedorForm.telefono}
                      onChange={handleProveedorInput}
                      placeholder="Ej: +56 9 1234 5678"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-medium">Dirección</label>
                    <Input
                      name="direccion"
                      value={proveedorForm.direccion}
                      onChange={handleProveedorInput}
                      placeholder="Dirección del proveedor"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="reset"
                    onClick={() => setProveedorForm({ nombre: "", telefono: "", direccion: "" })}
                  >
                    Limpiar
                  </Button>
                  <Button type="submit" className="bg-blue-600 text-white">
                    Guardar proveedor
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Aquí irían los otros tabs: Nueva compra, Proveedores, Notas de crédito */}
      </Tabs>
      <Dialog open={openNuevaCompra} onOpenChange={setOpenNuevaCompra}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-1">Nueva orden de compra</DialogTitle>
            <span className="text-muted-foreground text-sm mb-4">Registre una nueva orden de compra en el sistema.</span>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
