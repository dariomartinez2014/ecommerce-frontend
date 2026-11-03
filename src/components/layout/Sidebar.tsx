// Apunte de estudio: Aquí preparo el componente Sidebar para reutilizar su presentación y los eventos que recibe.
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const opcionesMenu = [
  {
    nombre: "Dashboard",
    ruta: "/admin",
    icono: LayoutDashboard,
    exacta: true,
  },
  {
    nombre: "Productos",
    ruta: "/admin/productos",
    icono: Package,
  },
  {
    nombre: "Órdenes",
    ruta: "/admin/ordenes",
    icono: ClipboardList,
  },
  {
    nombre: "Usuarios",
    ruta: "/admin/usuarios",
    icono: Users,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Fondo oscuro en dispositivos móviles */}
      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-green-100 bg-white
          transition-transform duration-200
          lg:static lg:z-auto lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Cabecera del Sidebar */}
        <div className="flex h-16 items-center justify-between border-b border-green-100 px-5">
          <div>
            <p className="font-semibold text-green-800">Panel de control</p>
            <p className="text-xs text-gray-500">Administración</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded-lg p-2 text-gray-500 hover:bg-green-50 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Menú principal
          </p>

          {opcionesMenu.map((opcion) => {
            const Icono = opcion.icono;

            return (
              <NavLink
                key={opcion.ruta}
                to={opcion.ruta}
                end={opcion.exacta}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-800"
                  }`
                }
              >
                <Icono size={20} />
                <span>{opcion.nombre}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Acciones inferiores */}
        <div className="space-y-1 border-t border-green-100 p-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-600 hover:bg-green-50"
          >
            <Settings size={20} />
            Configuración
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
