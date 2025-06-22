import LoginForm from "@/app/components/LoginForm";
import React from "react";

export default function page() {
  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Panel izquierdo */}
      <div className="relative hidden h-full flex-col p-10 text-white lg:flex bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500">
        {/* Fondo con imagen */}
        <div className="absolute inset-0">
          <img
            src="/fondo-inicio.avif"
            alt="Fondo Farmacia"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-blue-900/60" />
        </div>

        {/* Logo y título */}
        <div className="relative z-20 flex items-center text-lg font-medium gap-2">
          {/* <img src="/logo.svg" alt="Logo" className="h-8" /> */}
          SGA Farmacias comunales
        </div>

        {/* Frase motivadora */}
        <div className="relative z-20 flex-1 flex items-center justify-center text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold leading-snug">
              Bienvenido al Sistema de Gestión
            </h2>
            <p className="text-white/80 text-sm">
              Apoyamos la gestión y transparencia de farmacias comunales para
              brindar un mejor servicio a la comunidad.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <footer className="text-sm">Desarrollado por Formidata</footer>
          </blockquote>
        </div>
      </div>

      {/* Panel derecho: Login */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Iniciar sesión
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingrese sus credenciales para acceder al sistema
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Al continuar, acepta nuestros términos de servicio y política de
            privacidad.
          </p>
        </div>
      </div>
    </div>
  );
}
