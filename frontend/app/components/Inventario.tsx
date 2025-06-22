"use client";

import { use, useEffect, useState } from "react";
import { Filter, Search, AlertCircle } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Producto } from "@/app/interfaces/inventario"; // Interface Producto
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<string | null>(
    null
  );
  const [bodegasUnicas, setBodegasUnicas] = useState<string[]>([]);

  //Eliminar Producto
  const [openEliminarDialog, setOpenEliminarDialog] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(
    null
  );

  // Editar Producto
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);
  const [openEditarDialog, setOpenEditarDialog] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    precioCosto: 0,
    precioVenta: 0,
  });

  //===========================================================================================================/

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Cargar productos al iniciar
  useEffect(() => {
    fetch(`${apiUrl}/inventario/productos`)
      .then((res) => res.json())
      .then((data: any) => {
        setProductos(data);

        // Extraer bodegas únicas
        const nombresBodegas = new Set<string>();
        data.forEach((producto: Producto) => {
          producto.stocks.forEach((stock) => {
            if (stock.bodega?.nombre) {
              nombresBodegas.add(stock.bodega.nombre);
            }
          });
        });
        setBodegasUnicas(Array.from(nombresBodegas));
      })
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  // MANEJO CREACIÓN DE UN PRODUCTO
  const handleCrearProducto = async () => {
    const producto = {
      nombre: nuevoProducto.nombre,
      descripcion: nuevoProducto.descripcion,
      categoria: nuevoProducto.categoria,
      precioCosto: nuevoProducto.precioCosto,
      precioVenta: nuevoProducto.precioVenta,
      stocks: [],
    };

    try {
      const res = await fetch(`${apiUrl}/inventario/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });

      if (res.ok) {
        const creado = await res.json();
        setProductos((prev) => [...prev, creado]);
        setNuevoProducto({
          nombre: "",
          descripcion: "",
          categoria: "",
          precioCosto: 0,
          precioVenta: 0,
        });
      } else {
        console.error("Error al crear producto");
      }
    } catch (error) {
      console.error("Error de red al crear producto:", error);
    }
  };

  // Filtrar productos por nombre/código y bodega
  const productosFiltrados = productos.filter((producto) => {
    const coincideFiltro =
      producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      producto.id?.toString().includes(filtro);

    const contieneBodega =
      !bodegaSeleccionada ||
      producto.stocks.some(
        (stock) => stock.bodega?.nombre === bodegaSeleccionada
      );

    return coincideFiltro && contieneBodega;
  });

  const criticalStock = productos.flatMap((producto) =>
    producto.stocks.filter((stock) => stock.cantidad < 100)
  );

  const handleEliminarProducto = async () => {
    if (!productoAEliminar) return;

    const response = await fetch(
      `${apiUrl}/inventario/productos/` + productoAEliminar.id,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setProductos(productos.filter((p) => p.id !== productoAEliminar.id));
      setProductoAEliminar(null);
      setOpenEliminarDialog(false);
    } else {
      console.error("Error al eliminar producto");
      alert("Error al eliminar el producto");
    }
  };

  // MANEJO EDITAR PRODUCTO

  const abrirDialogoEditar = (producto: Producto) => {
    setProductoAEditar(producto);
    setNuevoProducto({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      categoria: producto.categoria,
      precioCosto: producto.precioCosto,
      precioVenta: producto.precioVenta,
    });
    setOpenEditarDialog(true);
  };

  const handleActualizarProducto = async () => {
    if (!productoAEditar) return;

    const actualizado = {
      ...productoAEditar,
      nombre: nuevoProducto.nombre,
      descripcion: nuevoProducto.descripcion,
      categoria: nuevoProducto.categoria,
      precioCosto: nuevoProducto.precioCosto,
      precioVenta: nuevoProducto.precioVenta,
    };

    const res = await fetch(
      `${apiUrl}/inventario/productos/${productoAEditar.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actualizado),
      }
    );

    if (res.ok) {
      const productoActualizado = await res.json();
      setProductos((prev) =>
        prev.map((p) =>
          p.id === productoActualizado.id ? productoActualizado : p
        )
      );
      setProductoAEditar(null);
      setOpenEditarDialog(false);
    } else {
      console.error("Error al actualizar producto");
      alert("Error al actualizar el producto");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
        <p className="text-muted-foreground">Gestión de productos</p>
      </div>
      <Tabs defaultValue="productos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="productos">Inventario</TabsTrigger>
        </TabsList>

        <TabsContent value="productos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventario</CardTitle>
              <CardDescription>Productos y su stock detallado.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Input
                  placeholder="Buscar producto por código o nombre..."
                  className="max-w-sm"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
                <Button variant="outline" size="icon" onClick={() => {}}>
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>

                {/* Mover el Popover aquí para que esté al lado */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="whitespace-nowrap">
                      Filtrar por Bodega{" "}
                      {bodegaSeleccionada && `: ${bodegaSeleccionada}`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0">
                    <Command>
                      <CommandInput placeholder="Buscar bodega..." />
                      <CommandEmpty>No se encontró bodega.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => setBodegaSeleccionada(null)}
                        >
                          Todas
                        </CommandItem>
                        {bodegasUnicas.map((nombre) => (
                          <CommandItem
                            key={nombre}
                            onSelect={() => setBodegaSeleccionada(nombre)}
                          >
                            {nombre}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Nuevo Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear nuevo producto</DialogTitle>
                      <DialogDescription>
                        Ingresa los datos para añadir un nuevo producto al
                        inventario.
                      </DialogDescription>
                    </DialogHeader>

                    {/* FORMULARIO DEL PRODUCTO */}
                    <div className="grid gap-4 py-4">
                      <Input
                        placeholder="Nombre"
                        value={nuevoProducto.nombre}
                        onChange={(e) =>
                          setNuevoProducto({
                            ...nuevoProducto,
                            nombre: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Descripción"
                        value={nuevoProducto.descripcion}
                        onChange={(e) =>
                          setNuevoProducto({
                            ...nuevoProducto,
                            descripcion: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Categoría"
                        value={nuevoProducto.categoria}
                        onChange={(e) =>
                          setNuevoProducto({
                            ...nuevoProducto,
                            categoria: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Precio costo"
                        type="number"
                        value={nuevoProducto.precioCosto}
                        onChange={(e) =>
                          setNuevoProducto({
                            ...nuevoProducto,
                            precioCosto: parseFloat(e.target.value),
                          })
                        }
                      />
                      <Input
                        placeholder="Precio venta"
                        type="number"
                        value={nuevoProducto.precioVenta}
                        onChange={(e) =>
                          setNuevoProducto({
                            ...nuevoProducto,
                            precioVenta: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>

                    <DialogFooter>
                      <Button onClick={handleCrearProducto}>Crear</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>

            {/* ALERTA DE STOCK CRÍTICO */}
            {criticalStock.length > 0 && (
              <CardContent>
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Stock crítico</AlertTitle>
                  <AlertDescription>
                    {criticalStock.length} producto
                    {criticalStock.length > 1 ? "s han" : " ha"} alcanzado su
                    nivel de stock crítico.
                  </AlertDescription>
                </Alert>
              </CardContent>
            )}

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Costo</TableHead>
                    <TableHead>Venta</TableHead>
                    <TableHead>Bodega</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productosFiltrados.map((producto) =>
                    producto.stocks.length > 0 ? (
                      producto.stocks.map((stock) => {
                        const isCritico = stock.cantidad < 100;
                        return (
                          <TableRow key={`${producto.id}-${stock.id}`}>
                            <TableCell>{producto.nombre}</TableCell>
                            <TableCell>{producto.descripcion}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {producto.categoria}
                              </Badge>
                            </TableCell>
                            <TableCell>${producto.precioCosto}</TableCell>
                            <TableCell>${producto.precioVenta}</TableCell>
                            <TableCell>
                              {stock.bodega?.nombre} ({stock.bodega?.ubicacion})
                            </TableCell>
                            <TableCell>{stock.cantidad}</TableCell>
                            <TableCell>{stock.vencimiento}</TableCell>
                            <TableCell>
                              {isCritico ? (
                                <Badge
                                  variant="destructive"
                                  className="uppercase"
                                >
                                  Crítico
                                </Badge>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="uppercase"
                                >
                                  Normal
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  setProductoAEliminar(producto);
                                  setOpenEliminarDialog(true);
                                }}
                                className="mr-2"
                              >
                                Eliminar
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => abrirDialogoEditar(producto)}
                                className="mr-2"
                              >
                                Editar
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow key={producto.id}>
                        <TableCell>{producto.nombre}</TableCell>
                        <TableCell>{producto.descripcion}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {producto.categoria}
                          </Badge>
                        </TableCell>
                        <TableCell>${producto.precioCosto}</TableCell>
                        <TableCell>${producto.precioVenta}</TableCell>
                        <TableCell
                          colSpan={3}
                          className="text-muted-foreground italic"
                        >
                          Sin stock disponible
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setProductoAEliminar(producto);
                              setOpenEliminarDialog(true);
                            }}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
              <Dialog
                open={openEliminarDialog}
                onOpenChange={setOpenEliminarDialog}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar eliminación</DialogTitle>
                  </DialogHeader>
                  <p>
                    ¿Estás seguro de que deseas eliminar al usuario{" "}
                    <strong>{productoAEliminar?.nombre}</strong>?
                  </p>
                  <DialogFooter>
                    <Button
                      variant="secondary"
                      onClick={() => setOpenEliminarDialog(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleEliminarProducto}
                    >
                      Eliminar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={openEditarDialog}
                onOpenChange={setOpenEditarDialog}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar producto</DialogTitle>
                    <DialogDescription>
                      Modifica los campos necesarios.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <Input
                      placeholder="Nombre"
                      value={nuevoProducto.nombre}
                      onChange={(e) =>
                        setNuevoProducto({
                          ...nuevoProducto,
                          nombre: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Descripción"
                      value={nuevoProducto.descripcion}
                      onChange={(e) =>
                        setNuevoProducto({
                          ...nuevoProducto,
                          descripcion: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Categoría"
                      value={nuevoProducto.categoria}
                      onChange={(e) =>
                        setNuevoProducto({
                          ...nuevoProducto,
                          categoria: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Precio costo"
                      type="number"
                      value={nuevoProducto.precioCosto}
                      onChange={(e) =>
                        setNuevoProducto({
                          ...nuevoProducto,
                          precioCosto: parseFloat(e.target.value),
                        })
                      }
                    />
                    <Input
                      placeholder="Precio venta"
                      type="number"
                      value={nuevoProducto.precioVenta}
                      onChange={(e) =>
                        setNuevoProducto({
                          ...nuevoProducto,
                          precioVenta: parseFloat(e.target.value),
                        })
                      }
                    />
                  </div>

                  <DialogFooter>
                    <Button onClick={handleActualizarProducto}>
                      Actualizar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
