'use client'

import { useEffect, useState } from "react";
import { VentaTabla } from "../interfaces/venta";
import { ArrowRight, Calendar, CreditCard, Download, Filter, MoreHorizontal, Plus, Search, ShoppingCart, Trash, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Producto } from "../interfaces/inventario";

interface ProductoCarro {
    id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    total: number;
}

export default function VentasPage() {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const [ventas, setVentas] = useState<VentaTabla[]>([]);
    const [filteredData, setFilteredData] = useState<VentaTabla[]>([]);
    const [loadingVentas, setLoadingVentas] = useState(true);

    const [productos, setProductos] = useState<Producto[]>([]);
    const [loadingProductos, setLoadingProductos] = useState(true);

    const [searchTerm, setSearchTerm] = useState("")
    const [openNewSaleDialog, setOpenNewSaleDialog] = useState(false)

    // Filtrar ventas por término de búsqueda
    useEffect(() => {
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const filtered = ventas.filter((venta) =>
                venta.nombre_paciente.toLowerCase().includes(lowerCaseSearchTerm) ||
                venta.id.toString().includes(lowerCaseSearchTerm)
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(ventas);
        }
    }, [searchTerm, ventas]);

    // Carrito compras
    const [cartItems, setCartItems] = useState<ProductoCarro[]>([])
    const cartTotal = cartItems.reduce((sum, item) => sum + item.total, 0)

    const [productoSeleccionadoId, setProductoSeleccionadoId] = useState<string>("");
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState<number>(1);

    const addToCart = () => {
        if (!productoSeleccionadoId) return;
        const producto = productos.find((p: Producto) => p.id.toString() === productoSeleccionadoId);
        if (!producto) return;

        // Verifica si ya está en el carrito
        const existente = cartItems.find((item) => item.id === producto.id.toString());
        if (existente) {
            setCartItems(cartItems.map(item =>
                item.id === producto.id.toString()
                    ? { ...item, cantidad: item.cantidad + cantidadSeleccionada, total: (item.cantidad + cantidadSeleccionada) * item.precio }
                    : item
            ));
        } else {
            setCartItems([
                ...cartItems,
                {
                    id: producto.id.toString(),
                    nombre: producto.nombre,
                    precio: producto.precioVenta,
                    cantidad: cantidadSeleccionada,
                    total: producto.precioVenta * cantidadSeleccionada,
                },
            ]);
        }
    };

    const deleteFromCart = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    }

    // fetch ventas
    const fetchVentas = () => {
        fetch(`${apiUrl}/ventas/ventasDatos/`)
            .then((res) => res.json())
            .then((data: any) => {
                console.log("Ventas cargadas:", data);
                setVentas(data)
                setLoadingVentas(false)
            })
            .catch((err) => console.error("Error al cargar ventas:", err));
    }

    // fetch productos
    const fetchProductos = () => {
        fetch(`${apiUrl}/inventario/productos`)
            .then((res) => res.json())
            .then((data: any) => {
                console.log("Productos cargadas:", data);
                setProductos(data)
                setLoadingProductos(false)
            })
            .catch((err) => console.error("Error al cargar los productos:", err));
    }

    // Cargar ventas al iniciar
    useEffect(() => {
        fetchVentas();
        fetchProductos();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Ventas y Caja</h1>
                <p className="text-muted-foreground">Gestión de ventas, facturación y caja</p>
            </div>

            <Tabs defaultValue="sales" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="sales">Ventas</TabsTrigger>
                    <TabsTrigger value="new-sale">Nueva venta</TabsTrigger>
                </TabsList>

                {/* Ventas*/}
                <TabsContent value="sales" className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-1 items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Buscar ventas..."
                                    className="pl-8 w-full md:w-[300px]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Dialog open={openNewSaleDialog} onOpenChange={setOpenNewSaleDialog}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nueva venta
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                        <DialogTitle>Nueva venta</DialogTitle>
                                        <DialogDescription>Registre una nueva venta en el sistema.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="patient" className="text-right">
                                                Paciente
                                            </Label>
                                            <div className="col-span-3">
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar paciente" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="juan">Juan Pérez</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="product" className="text-right">
                                                Producto
                                            </Label>
                                            <div className="col-span-3 flex gap-2">
                                                <Select value={productoSeleccionadoId} onValueChange={setProductoSeleccionadoId}>
                                                    <SelectTrigger className="flex-1">
                                                        <SelectValue placeholder="Seleccionar producto" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingProductos ? (
                                                            <p>Cargando productos...</p>
                                                        ) : (
                                                            productos.map((producto: Producto) => (
                                                                <SelectItem key={producto.id} value={producto.id.toString()}>
                                                                    {producto.nombre} - ${producto.precioVenta.toLocaleString()}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={cantidadSeleccionada}
                                                    onChange={e => setCantidadSeleccionada(Number(e.target.value))}
                                                />
                                                <Button id="addCartModal" onClick={addToCart}>Agregar</Button>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Producto</TableHead>
                                                        <TableHead className="text-right">Precio</TableHead>
                                                        <TableHead className="text-center">Cantidad</TableHead>
                                                        <TableHead className="text-right">Total</TableHead>
                                                        <TableHead className="w-[50px]"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {cartItems.map((item: ProductoCarro) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>{item.nombre}</TableCell>
                                                            <TableCell className="text-right">${item.precio.toLocaleString()}</TableCell>
                                                            <TableCell className="text-center">{item.cantidad}</TableCell>
                                                            <TableCell className="text-right">${item.total.toLocaleString()}</TableCell>
                                                            <TableCell>
                                                                <Button onClick={() => deleteFromCart(item.id)} variant="ghost" size="icon">
                                                                    <Trash className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {cartItems.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="h-24 text-center">
                                                                No hay productos en el carrito
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <div>
                                                <Label>Método de pago</Label>
                                                <Select defaultValue="efectivo">
                                                    <SelectTrigger className="w-[180px] mt-1">
                                                        <SelectValue placeholder="Método de pago" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="efectivo">Efectivo</SelectItem>
                                                        <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                                        <SelectItem value="transferencia">Transferencia</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-muted-foreground">Total</div>
                                                <div className="text-2xl font-bold">${cartTotal}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setOpenNewSaleDialog(false)}>
                                            Cancelar
                                        </Button>
                                        <Button onClick={() => setOpenNewSaleDialog(false)}>Completar venta</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Exportar
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Factura</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Paciente</TableHead>
                                        <TableHead className="text-center">Productos</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead>Método de pago</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loadingVentas ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center">
                                                Cargando ventas...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center">
                                                No se encontraron ventas
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredData.map((venta: VentaTabla) => (
                                            <TableRow key={venta.id}>
                                                <TableCell className="font-medium">{venta.id}</TableCell>
                                                <TableCell>{new Date(venta.fecha_venta).toLocaleDateString()}</TableCell>
                                                <TableCell>{venta.nombre_paciente}</TableCell>
                                                <TableCell className="text-center">{venta.total_productos}</TableCell>
                                                <TableCell className="text-right">${venta.total_venta}</TableCell>
                                                <TableCell>{venta.metodo_pago}</TableCell>
                                                <TableCell>
                                                    {venta.estado === "COMPLETADA" ? (
                                                        <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Completada</span>
                                                    ) : venta.estado === "PENDIENTE" ? (
                                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Pendiente</span>
                                                    ) : (
                                                        <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">Cancelada</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Abrir menú</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                            <DropdownMenuItem>
                                                                <span>Ver detalles</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <span>Imprimir factura</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between border-t p-4">
                            <div className="text-sm text-muted-foreground">
                                Mostrando {filteredData.length} de {ventas.length} ventas
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" disabled>
                                    Anterior
                                </Button>
                                <Button variant="outline" size="sm">
                                    Siguiente
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>


                {/* Nueva venta */}
                <TabsContent value="new-sale" className="space-y-4">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información de venta</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="patient-select">Paciente</Label>
                                        <div className="flex gap-2">
                                            <Select>
                                                <SelectTrigger className="flex-1">
                                                    <SelectValue placeholder="Seleccionar paciente" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="juan">Juan Pérez</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button variant="outline" size="icon">
                                                <User className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="product-search">Buscar producto</Label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="product-search"
                                                    type="search"
                                                    placeholder="Código o nombre del producto..."
                                                    className="pl-8"
                                                />
                                            </div>
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Agregar
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="border rounded-md">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Producto</TableHead>
                                                    <TableHead className="text-right">Precio</TableHead>
                                                    <TableHead className="text-center">Cantidad</TableHead>
                                                    <TableHead className="text-right">Total</TableHead>
                                                    <TableHead className="w-[50px]"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {cartItems.map((item: ProductoCarro) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.nombre}</TableCell>
                                                        <TableCell className="text-right">${item.precio.toLocaleString()}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Input type="number" value={item.cantidad} className="w-16 mx-auto" />
                                                        </TableCell>
                                                        <TableCell className="text-right">${item.total.toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            <Button variant="ghost" size="icon">
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {cartItems.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="h-24 text-center">
                                                            No hay productos en el carrito
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Resumen de venta</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>${cartTotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Descuento</span>
                                            <span>$0</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">IVA (19%)</span>
                                            <span>${Math.round(cartTotal * 0.19).toLocaleString()}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-bold">
                                            <span>Total</span>
                                            <span>${Math.round(cartTotal * 1.19).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Método de pago</Label>
                                        <Select defaultValue="efectivo">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar método" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="efectivo">Efectivo</SelectItem>
                                                <SelectItem value="tarjeta">Tarjeta de crédito/débito</SelectItem>
                                                <SelectItem value="transferencia">Transferencia bancaria</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Notas</Label>
                                        <Input id="notes" placeholder="Notas adicionales..." />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-2">
                                    <Button className="w-full">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Completar venta
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        Guardar como borrador
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle>Acciones rápidas</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" className="justify-start">
                                        <User className="mr-2 h-4 w-4" />
                                        Nuevo paciente
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Agendar cita
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        Abrir caja
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                        Ver ventas
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}