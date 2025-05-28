package com.example.usuario_servicio.controller;

import com.example.usuario_servicio.entity.Rol;
import com.example.usuario_servicio.service.RolService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    @GetMapping
    public List<Rol> getAllRoles() {
        return rolService.findAll();
    }
}

