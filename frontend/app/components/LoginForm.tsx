'use client'

import Link from 'next/link'
import React, { useState } from 'react'

export default function LoginForm() {

    const [correo, setCorreo] = useState<string>('')
    const [contrasena, setContrasena] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate a login request
        setTimeout(() => {
            setIsLoading(false)
            fetch('http://localhost:8082/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo, contrasena }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Error en la solicitud')
                    }
                    return response.json()
                })
                .then((data) => {
                    console.log(data)
                    // Redirigir a la página de inicio
                    window.location.href = '/dashboard'
                })
                .catch((error) => {
                    console.error(error)
                    alert('Error al iniciar sesión')
            })
        }, 2000)
    }

    return (
        <div className="grid gap-6">

            <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Usuario o Email
                    </label>
                    <input
                        id="email"
                        type="text"
                        placeholder="nombre@ejemplo.com"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label htmlFor="password" className="text-sm font-medium">
                            Contraseña
                        </label>
                        <Link href="#" className="text-sm text-blue-600 hover:underline">
                            ¿Olvidó su contraseña?
                        </Link>
                    </div>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500 focus:outline-none"
                        >
                            {showPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    {isLoading ? 'Cargando...' : 'Iniciar sesión'}
                </button>
            </form>
        </div>
    )
}