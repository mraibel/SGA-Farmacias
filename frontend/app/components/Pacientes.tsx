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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Badge
} from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Paciente } from "../interfaces/paciente";

export function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openNewPacienteDialog, setOpenNewPacienteDialog] = useState(false);
  const [editandoPaciente, setEditandoPaciente] = useState<Paciente | null>(null);


  const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    direccion: "",
    telefono: 0,
    correo: "",
    estado: true,
    fechaNacimiento: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/pacientes/pacientes`)
      .then((res) => res.json())
      .then((data: any) => {
        setPacientes(data);
      }).catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  function validarRut(rut: string): boolean {
    if (!/^\d{7,8}[kK\d]$/.test(rut)) {
      return false;
    }
    rut = rut.toUpperCase();
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);

    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
    return dv === dvCalculado;
  }

  const handleCrearPaciente = async () => {

    if(!nuevoPaciente.nombre || !nuevoPaciente.apellido || !nuevoPaciente.rut || !nuevoPaciente.correo || !nuevoPaciente.fechaNacimiento) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    //Validación de RUT
    if (!validarRut(nuevoPaciente.rut)) {
      alert("Por favor, ingrese un RUT válido.");
      return;
    }

    //Vaidación de Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(nuevoPaciente.correo)) {
      alert("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    try {
      const url = `${apiUrl}/pacientes/pacientes` + (editandoPaciente ? `/${editandoPaciente.id}` : ``);
      const method = editandoPaciente ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoPaciente)
      })

      if(response.ok) {
        const data = await response.json();

        if (editandoPaciente) {
          setPacientes(pacientes.map(p => p.id === data.id ? data : p));
        }else{
          setPacientes([...pacientes, data]);
        }

        setNuevoPaciente({
          nombre: "",
          apellido: "",
          rut: "",
          direccion: "",
          telefono: 0,
          correo: "",
          estado: true,
          fechaNacimiento: "",
        });
        setEditandoPaciente(null);
        setOpenNewPacienteDialog(false);
      }else {
        alert("Error al crear el paciente. Por favor, intente nuevamente.");
      }
    } catch (error) {
      alert("Hubo un error al crear el paciente");
      console.error("Error al crear el paciente:", error);
    }
  };

  const handleEditarPaciente = (paciente: Paciente) => {

    setNuevoPaciente({
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      rut: paciente.rut,
      direccion: paciente.direccion || "",
      telefono: Number(paciente.telefono) || 0,
      correo: paciente.correo || "",
      estado: paciente.estado,
      fechaNacimiento: paciente.fechaNacimiento || "",
    });
    setEditandoPaciente(paciente);
    setOpenNewPacienteDialog(true);
  };

  const handleEliminarPaciente = async (pacienteId: number) => {
    const confirm = window.confirm("¿Estás seguro de que deseas eliminar este paciente?");
    if (!confirm) return;
    
    try {
      const response = await fetch(`${apiUrl}/pacientes/pacientes/${pacienteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPacientes(prevPacientes => prevPacientes.filter(p => p.id !== pacienteId));
      } else {
        alert("Error al eliminar el paciente. Por favor, intente nuevamente.");
      }
    }catch (error) {
      alert("Hubo un error al eliminar el paciente");
      console.error("Error al eliminar el paciente:", error);
    }
  }

  const pacientesFiltrados = pacientes.filter((p) =>
    `${p.nombre} ${p.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
        <p className="text-muted-foreground">
          Gestión de pacientes registrados en el sistema
        </p>
      </div>

      <div className="flex gap-4 items-end">
        <Input
          placeholder="Buscar por nombre o apellido"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />

        <Dialog
          open={openNewPacienteDialog}
          onOpenChange={setOpenNewPacienteDialog}
        >
          <DialogTrigger asChild>
            <Button>Nuevo Paciente</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar nuevo paciente</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input
                    value={nuevoPaciente.nombre}
                    onChange={(e) =>
                      setNuevoPaciente({ ...nuevoPaciente, nombre: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Apellido</Label>
                  <Input
                    value={nuevoPaciente.apellido}
                    onChange={(e) =>
                      setNuevoPaciente({ ...nuevoPaciente, apellido: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>RUT</Label>
                <Input
                  value={nuevoPaciente.rut}
                  placeholder="Sin puntos ni guión"
                  onChange={(e) =>
                    setNuevoPaciente({ ...nuevoPaciente, rut: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Dirección</Label>
                <Input
                  value={nuevoPaciente.direccion}
                  onChange={(e) =>
                    setNuevoPaciente({ ...nuevoPaciente, direccion: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Teléfono</Label>
                <Input
                  value={nuevoPaciente.telefono}
                  onChange={(e) =>
                    setNuevoPaciente({ ...nuevoPaciente, telefono: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label>Correo</Label>
                <Input
                  type="email"
                  value={nuevoPaciente.correo}
                  onChange={(e) =>
                    setNuevoPaciente({ ...nuevoPaciente, correo: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Fecha de Nacimiento</Label>
                <Input
                  type="date"
                  value={nuevoPaciente.fechaNacimiento}
                  onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, fechaNacimiento: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Estado</Label>
                <select
                  value={nuevoPaciente.estado ? "true" : "false"}
                  onChange={(e) =>
                    setNuevoPaciente({
                      ...nuevoPaciente,
                      estado: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
              
            </div>

            <DialogFooter>
              <Button onClick={handleCrearPaciente}>Registrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>RUT</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pacientesFiltrados.map((paciente) => (
            <TableRow key={paciente.id}>
              <TableCell>{paciente.nombre}</TableCell>
              <TableCell>{paciente.apellido}</TableCell>
              <TableCell>{paciente.rut}</TableCell>
              <TableCell>{paciente.correo ?? "—"}</TableCell>
              <TableCell>{paciente.telefono ?? "—"}</TableCell>
              <TableCell>
                <Badge variant={paciente.estado ? "success" : "destructive"}>
                  {paciente.estado === true ? "Activo" : "Inactivo"}
                  </Badge>
                  </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-accent transition">⋮</button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEditarPaciente(paciente)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEliminarPaciente(paciente.id)}>
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
