'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className={`bg-gray-100 text-black w-64 flex-shrink-0 flex flex-col transition-transform duration-300 ${sidebarOpen ? '' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold">SGA Farmacias</span>
                    </Link>
                    <button
                        className="text-white hover:text-gray-400"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        ☰
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div>
                        <h2 className="text-sm font-semibold uppercase text-gray-400 mb-2">Principal</h2>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-300 ${pathname === '/' ? 'bg-gray-300' : ''}`}>
                                    <span>🏠</span>
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold uppercase text-gray-400 mb-2">Módulos</h2>
                        <ul className="space-y-2">
                            {[
                                { path: '/dashboard/inventario', label: 'Inventario', icon: '📦' },
                                { path: '/dashboard/pacientes', label: 'Pacientes', icon: '🧍' },
                                { path: '/dashboard/ventas', label: 'Ventas y Caja', icon: '💳' },
                                { path: '/dashboard/compras', label: 'Compras', icon: '🛒' },
                                { path: '/dashboard/informes', label: 'Informes', icon: '📊' },
                            ].map((item) => (
                                <li key={item.path}>
                                    <Link href={item.path} className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-300 ${pathname === item.path ? 'bg-gray-300' : ''}`}>
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold uppercase text-gray-400 mb-2">Administración</h2>
                        <ul className="space-y-2">
                            {[
                                { path: '/dashboard/users', label: 'Usuarios', icon: '👤' },
                                { path: '/dashboard/configuration', label: 'Configuración', icon: '⚙️' },
                            ].map((item) => (
                                <li key={item.path}>
                                    <Link href={item.path} className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-300 ${pathname === item.path ? 'bg-gray-300' : ''}`}>
                                        <span>{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/usuario.png" alt="Usuario" className="h-8 w-8 rounded-full" />
                        <div>
                            <p className="text-sm font-medium">Admin</p>
                            <p className="text-xs text-gray-400">admin@sga.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto bg-gray-100 text-gray-900 dark:text-white p-4">
                <div className="max-w-7xl mx-auto">{children}</div>
            </main>
        </div>
    )
}
