package com.microservice.pacientes.pacientes_servicio.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.microservice.pacientes.pacientes_servicio.dto.PacienteDTO;
import com.microservice.pacientes.pacientes_servicio.entity.Paciente;
import com.microservice.pacientes.pacientes_servicio.repository.PacienteRepository;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    public List<PacienteDTO> obtenerTodos() {
        List<Paciente> pacientes = pacienteRepository.findAll();
        List<PacienteDTO> pacienteDTOs;
        pacienteDTOs = convertListDTOAList(pacientes);
        return pacienteDTOs;
    }

    public PacienteDTO guardar(PacienteDTO paciente) {
        Paciente nuevoPaciente = convertDTOToEntity(paciente);
        return convertEntityToDTO(pacienteRepository.save(nuevoPaciente));
    }

    public PacienteDTO obtenerPorId(Long id) {
        Paciente paciente = pacienteRepository.findById(id).orElse(null);
        if (paciente != null) {
            return convertEntityToDTO(paciente);
        } else {
            return null;
        }
    }

    public void eliminar(Long id) {
        if (pacienteRepository != null) {
            pacienteRepository.deleteById(id);
        }
    }

    public boolean actualizar(PacienteDTO pacienteDTO, Long id) {
        if (pacienteDTO == null)
            return false;

        Paciente pacienteActualizado = pacienteRepository.findById(id).orElse(null);
        if (pacienteActualizado == null)
            return false;

        if (pacienteDTO.getNombre() != null) {
            pacienteActualizado.setNombre(pacienteDTO.getNombre());
        }
        if (pacienteDTO.getApellido() != null) {
            pacienteActualizado.setApellido(pacienteDTO.getApellido());
        }
        if (pacienteDTO.getRut() != null) {
            pacienteActualizado.setRut(pacienteDTO.getRut());
        }
        if (pacienteDTO.getTelefono() != 0) {
            pacienteActualizado.setTelefono(pacienteDTO.getTelefono());
        }
        if (pacienteDTO.getCorreo() != null) {
            pacienteActualizado.setCorreo(pacienteDTO.getCorreo());
        }
        if (pacienteDTO.getDireccion() != null) {
            pacienteActualizado.setDireccion(pacienteDTO.getDireccion());
        }
        if (pacienteDTO.getFechaNacimiento() != null) {
            pacienteActualizado.setFechaNacimiento(pacienteDTO.getFechaNacimiento());
        }
        pacienteActualizado.setEstado(pacienteDTO.isEstado());

        pacienteRepository.saveAndFlush(pacienteActualizado);
        return true;
    }

    /* AUXILIARES */
    public PacienteDTO convertEntityToDTO(Paciente paciente) {
        PacienteDTO pacienteDTO = new PacienteDTO();
        pacienteDTO.setId(paciente.getId());
        pacienteDTO.setNombre(paciente.getNombre());
        pacienteDTO.setApellido(paciente.getApellido());
        pacienteDTO.setRut(paciente.getRut());
        pacienteDTO.setTelefono(paciente.getTelefono());
        pacienteDTO.setCorreo(paciente.getCorreo());
        pacienteDTO.setDireccion(paciente.getDireccion());
        pacienteDTO.setFechaNacimiento(paciente.getFechaNacimiento());
        pacienteDTO.setEstado(paciente.getEstado());
        return pacienteDTO;
    }

    public Paciente convertDTOToEntity(PacienteDTO pacienteDTO) {
        Paciente paciente = new Paciente();
        if (pacienteDTO.getId() != null) {
            paciente.setId(pacienteDTO.getId());
        }
        paciente.setNombre(pacienteDTO.getNombre());
        paciente.setApellido(pacienteDTO.getApellido());
        paciente.setRut(pacienteDTO.getRut());
        paciente.setTelefono(pacienteDTO.getTelefono());
        paciente.setCorreo(pacienteDTO.getCorreo());
        paciente.setDireccion(pacienteDTO.getDireccion());
        paciente.setFechaNacimiento(pacienteDTO.getFechaNacimiento());
        paciente.setEstado(pacienteDTO.isEstado());
        return paciente;
    }

    public List<PacienteDTO> convertListDTOAList(List<Paciente> listaPacientes) {
        List<PacienteDTO> listaPacientesDTO = new ArrayList<PacienteDTO>();
        for (Paciente paciente : listaPacientes) {
            PacienteDTO pacienteDTO = new PacienteDTO();
            pacienteDTO.setId(paciente.getId());
            pacienteDTO.setNombre(paciente.getNombre());
            pacienteDTO.setApellido(paciente.getApellido());
            pacienteDTO.setRut(paciente.getRut());
            pacienteDTO.setTelefono(paciente.getTelefono());
            pacienteDTO.setEstado(paciente.getEstado());
            pacienteDTO.setCorreo(paciente.getCorreo());
            pacienteDTO.setDireccion(paciente.getDireccion());
            pacienteDTO.setFechaNacimiento(paciente.getFechaNacimiento());
            listaPacientesDTO.add(pacienteDTO);
        }

        return listaPacientesDTO;
    }
}
