package com.example.usuario_servicio.service;

import com.example.usuario_servicio.entity.LogAcceso;
import com.example.usuario_servicio.entity.Usuario;
import com.example.usuario_servicio.repository.LogAccesoRepository;
import com.example.usuario_servicio.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private LogAccesoRepository logAccesoRepository;

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
        Optional<Usuario> usuarioOpt = usuarioRepository.findByCorreoAndContrasena(correo, contrasena);
        usuarioOpt.ifPresent(usuario -> {
            LogAcceso log = new LogAcceso();
            log.setUsuario(usuario);
            log.setFechaHora(LocalDateTime.now());
            log.setAccion("Entrar");
            logAccesoRepository.save(log);

        });
        return usuarioOpt;
    }

}
