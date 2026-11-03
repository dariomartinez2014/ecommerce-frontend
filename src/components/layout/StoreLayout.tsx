// Apunte de estudio: Aquí reúno la lógica de StoreLayout que utiliza esta parte del proyecto.
import { Outlet, Link } from "react-router-dom";
import Header from "./Header";

export default function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header variant="store" />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-green-100 bg-green-50 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-green-900">
            © {new Date().getFullYear()} Abarrotes Verde
          </p>

          <a href={`${import.meta.env.BASE_URL}reporte-hooks.html`} className="text-sm text-green-700 hover:text-green-900">
            Reporte de custom hooks
          </a>
          <Link
            to="/productos"
            className="text-sm text-green-700 hover:text-green-900"
          >
            Explorar productos
          </Link>
        </div>
      </footer>
    </div>
  );
}
