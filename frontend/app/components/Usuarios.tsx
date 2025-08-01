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
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(
    null
  );
  const [openEliminarDialog, setOpenEliminarDialog] = useState(false);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    rolId: "",
  });


  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    fetch(`${apiUrl}/usuarios/usuariosdatos`)
      .then((res) => res.json())
      .then((data: any) => setUsuarios(data))
      .catch((err) => console.error("Error al cargar usuarios:", err));

    fetch(`${apiUrl}/usuarios/roles`)
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

    const response = await fetch(`${apiUrl}/usuarios/usuariosdatos`, {
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

  const handleEliminarUsuario = async () => {
    if (!usuarioAEliminar) return;

    const response = await fetch(
      `${apiUrl}/usuarios/usuariosdatos/` + usuarioAEliminar.id,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setUsuarios(usuarios.filter((u) => u.id !== usuarioAEliminar.id));
      setUsuarioAEliminar(null);
      setOpenEliminarDialog(false);
    } else {
      alert("Error al eliminar el usuario");
    }
  };

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
            <Button className="bg-blue-500 text-white">Nuevo Usuario</Button>
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
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuariosFiltrados.map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell>{usuario.nombre}</TableCell>
              <TableCell>{usuario.apellido}</TableCell>
              <TableCell>{usuario.correo}</TableCell>
              <TableCell>{usuario.rol?.tipo ?? "Sin rol"}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setUsuarioAEliminar(usuario);
                    setOpenEliminarDialog(true);
                  }}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={openEliminarDialog} onOpenChange={setOpenEliminarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <p>
            ¿Estás seguro de que deseas eliminar al usuario{" "}
            <strong>
              {usuarioAEliminar?.nombre} {usuarioAEliminar?.apellido}
            </strong>
            ?
          </p>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setOpenEliminarDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleEliminarUsuario}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
