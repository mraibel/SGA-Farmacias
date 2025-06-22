"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState<boolean | null>(null); // Inicializar en null

  useEffect(() => {
    // Aquí se ejecuta solo en el cliente
    setSidebarOpen(true); // Establecer el valor inicial del sidebar
  }, []);

  if (sidebarOpen === null) return null; // Mostrar nada hasta que el estado se haya inicializado en el cliente

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-blue-500 text-black w-64 flex-shrink-0 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-800">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">SGA Farmacias</span>
          </Link>
          <button
            className="text-white hover:text-blue-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h2 className="text-sm font-semibold uppercase text-blue-800 mb-2">
              Principal
            </h2>
            <ul className="space-y-2 text-white">
              <li>
                <Link
                  href="/"
                  className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-400 ${
                    pathname === "/" ? "bg-blue-600" : ""
                  }`}
                >
                  <span>🏠</span>
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase text-blue-800 mb-2">
              Módulos
            </h2>
            <ul className="space-y-2 text-white">
              {[
                {
                  path: "/dashboard/inventario",
                  label: "Inventario",
                  icon: "📦",
                },
                {
                  path: "/dashboard/pacientes",
                  label: "Pacientes",
                  icon: "🧍",
                },
                {
                  path: "/dashboard/ventas",
                  label: "Ventas y Caja",
                  icon: "💳",
                },
                { path: "/dashboard/compras", label: "Compras", icon: "🛒" },
                { path: "/dashboard/informes", label: "Informes", icon: "📊" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-400 ${
                      pathname === item.path ? "bg-blue-600" : ""
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase text-blue-800 mb-2">
              Administración
            </h2>
            <ul className="space-y-2 text-white">
              {[
                { path: "/dashboard/users", label: "Usuarios", icon: "👤" },
                {
                  path: "/dashboard/configuration",
                  label: "Configuración",
                  icon: "⚙️",
                },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-400 ${
                      pathname === item.path ? "bg-blue-600" : ""
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-white">admin@sga.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-100 text-gray-900 dark:text-white p-4">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
