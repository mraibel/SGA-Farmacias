"use client";

import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Rol = {
  id: number;
  tipo: string;
};

type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena?: string;
  rol: Rol;
};

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rolFiltro, setRolFiltro] = useState("todos");
  const [openNewUserDialog, setOpenNewUserDialog] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    rolId: "",
  });

  useEffect(() => {
    fetch("http://localhost:8081/api/usuarios/usuariodatos")
      .then((res) => res.json())
      .then((data) => console.log(data))
      .then((data: any) => setUsuarios(data))
      .catch((err) => console.error("Error al cargar usuarios:", err));

    fetch("http://localhost:8081/api/usuarios/roles")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRoles(data);
        } else {
          console.error("La respuesta de roles no es un arreglo:", data);
        }
      })
      .catch((err) => console.error("Error al cargar roles:", err));
  }, []);

  const handleCrearUsuario = async () => {
    const usuario = {
      nombre: nuevoUsuario.nombre,
      apellido: nuevoUsuario.apellido,
      correo: nuevoUsuario.correo,
      contrasena: nuevoUsuario.contrasena,
      rol: { id: parseInt(nuevoUsuario.rolId) },
    };

    const response = await fetch("http://localhost:8081/api/usuarios/usuariosdatos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    if (response.ok) {
      const nuevo = await response.json();
      setUsuarios([...usuarios, nuevo]);
      setNuevoUsuario({
        nombre: "",
        apellido: "",
        correo: "",
        contrasena: "",
        rolId: "",
      });
      setOpenNewUserDialog(false);
    } else {
      alert("Error al crear el usuario");
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideNombre = `${u.nombre} ${u.apellido}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const coincideRol =
      rolFiltro === "todos" || u.rol?.id === parseInt(rolFiltro);
    return coincideNombre && coincideRol;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestión de usuarios, roles y permisos
        </p>
      </div>

      <div className="flex gap-4 items-end">
        <Input
          placeholder="Buscar por nombre o apellido"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />

        <Select value={rolFiltro} onValueChange={setRolFiltro}>
          <SelectTrigger className="w-1/4">
            <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            {Array.isArray(roles) &&
              roles.map((rol) => (
                <SelectItem key={rol.id} value={rol.id.toString()}>
                  {rol.tipo}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Dialog open={openNewUserDialog} onOpenChange={setOpenNewUserDialog}>
          <DialogTrigger asChild>
            <Button>Nuevo Usuario</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nuevo usuario</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input
                    value={nuevoUsuario.nombre}
                    onChange={(e) =>
                      setNuevoUsuario({
                        ...nuevoUsuario,
                        nombre: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Apellido</Label>
                  <Input
                    value={nuevoUsuario.apellido}
                    onChange={(e) =>
                      setNuevoUsuario({
                        ...nuevoUsuario,
                        apellido: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Correo</Label>
                <Input
                  value={nuevoUsuario.correo}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      correo: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Contraseña</Label>
                <Input
                  type="password"
                  value={nuevoUsuario.contrasena}
                  onChange={(e) =>
                    setNuevoUsuario({
                      ...nuevoUsuario,
                      contrasena: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Rol</Label>
                <Select
                  value={nuevoUsuario.rolId}
                  onValueChange={(value) =>
                    setNuevoUsuario({ ...nuevoUsuario, rolId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(roles) &&
                      roles.map((rol) => (
                        <SelectItem key={rol.id} value={rol.id.toString()}>
                          {rol.tipo}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleCrearUsuario}>Crear</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuariosFiltrados.map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell>{usuario.nombre}</TableCell>
              <TableCell>{usuario.apellido}</TableCell>
              <TableCell>{usuario.correo}</TableCell>
              <TableCell>{usuario.rol?.tipo ?? "Sin rol"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
