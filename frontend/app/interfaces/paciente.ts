export type Paciente = {
    id: number;
    nombre: string;
    apellido: string;
    rut: string;
    direccion?: string;
    telefono?: string;
    estado: boolean;
    correo?: string;
    fechaNacimiento?: string;
};