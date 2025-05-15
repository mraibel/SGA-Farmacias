package com.example.usuario_servicio.service;

import com.example.usuario_servicio.entity.Usuario;
import com.example.usuario_servicio.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario guardar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Optional<Usuario> login(String correo, String contrasena) {
        return usuarioRepository.findByCorreoAndContrasena(correo, contrasena);
    }

}
