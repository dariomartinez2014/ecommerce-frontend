// Apunte de estudio: Aquí preparo el componente Header para reutilizar su presentación y los eventos que recibe.
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import {
  Menu,
  Search,
  ShoppingCart,
  UserRound,
  Bell,
  Leaf,
  X,
} from "lucide-react";

type HeaderProps = {
  variant: "store" | "admin";
  onMenuClick?: () => void;
};

export default function Header({ variant, onMenuClick }: HeaderProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const { totalUnidades } = useCart();

  const esAdmin = variant === "admin";

  return (
    <header className="sticky top-0 z-30 border-b border-green-100 bg-white">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo y botón del menú */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={esAdmin ? onMenuClick : () => setMenuAbierto(!menuAbierto)}
            className="rounded-lg p-2 text-gray-600 hover:bg-green-50 lg:hidden"
            aria-label="Abrir menú"
          >
            {menuAbierto && !esAdmin ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link
            to={esAdmin ? "/admin" : "/"}
            className="flex items-center gap-2"
          >
            <span className="rounded-xl bg-green-100 p-2 text-green-700">
              <Leaf size={22} />
            </span>

            <span className="hidden font-bold text-green-800 sm:inline">
              Abarrotes Verde
            </span>
          </Link>
        </div>

        {/* Buscador */}
        {esAdmin ? (
          <div className="hidden max-w-md flex-1 md:block">
            <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="search"
                placeholder="Buscar en administración..."
                className="w-full bg-transparent text-sm outline-none"
                aria-label="Buscar en administración"
              />
            </div>
          </div>
        ) : (
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm font-medium text-green-800">
              Inicio
            </Link>
            <Link
              to="/productos"
              className="text-sm text-gray-600 hover:text-green-700"
            >
              Productos
            </Link>
            <Link
              to="/mis-ordenes"
              className="text-sm text-gray-600 hover:text-green-700"
            >
              Mis órdenes
            </Link>
          </nav>
        )}

        {/* Acciones del usuario */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          {esAdmin ? (
            <>
              <button
                type="button"
                aria-label="Notificaciones"
                className="rounded-lg p-2 text-gray-600 hover:bg-green-50"
              >
                <Bell size={20} />
              </button>

              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-gray-800">
                  Administrador
                </p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/carrito"
                aria-label={`Ver carrito (${totalUnidades} productos)`}
                className="relative rounded-lg p-2 text-gray-600 hover:bg-green-50"
              >
                <ShoppingCart size={21} />
                {totalUnidades > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-green-700 px-1 text-center text-xs leading-5 text-white">{totalUnidades}</span>}
              </Link>

              <Link
                to="/login"
                aria-label="Iniciar sesión"
                className="rounded-lg p-2 text-gray-600 hover:bg-green-50"
              >
                <UserRound size={21} />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Menú móvil de la tienda */}
      {!esAdmin && menuAbierto && (
        <nav className="border-t border-green-100 bg-white p-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={() => setMenuAbierto(false)}>
              Inicio
            </Link>
            <Link to="/productos" onClick={() => setMenuAbierto(false)}>
              Productos
            </Link>
            <Link to="/mis-ordenes" onClick={() => setMenuAbierto(false)}>
              Mis órdenes
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
