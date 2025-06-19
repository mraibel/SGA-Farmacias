"use client";


import { useEffect, useState } from "react";
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

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<string | null>(
    null
  );
  const [bodegasUnicas, setBodegasUnicas] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/inventario/productos")
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
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
