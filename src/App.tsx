// Apunte de estudio: Aquí organizo la aplicación: junto las pantallas o componentes que se ven al entrar.
import { BrowserRouter, HashRouter, Routes, Route, Navigate, Link } from "react-router-dom";

const Router = import.meta.env.BASE_URL === "/" ? BrowserRouter : HashRouter;

import StoreLayout from "./components/layout/StoreLayout";
import AdminLayout from "./components/layout/AdminLayout";

import HomePage from "./pages/store/HomePage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProductosPage from "./pages/store/ProductosPage";
import CarritoPage from "./pages/store/CarritoPage";
import PagoPage from "./pages/store/PagoPage";
import MisOrdenesPage from "./pages/store/MisOrdenesPage";

function PaginaPendiente({ titulo }: { titulo: string }) {
  return (
    <section className="mx-auto max-w-7xl p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-gray-900">{titulo}</h1>

      <p className="mt-2 text-gray-500">
        Esta sección estará disponible próximamente.
      </p>

      <Link to="/" className="mt-4 inline-block text-green-700 hover:underline">
        Volver a la tienda
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<HomePage />} />

          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/pago" element={<PagoPage />} />
          <Route
            path="mis-ordenes"
            element={<MisOrdenesPage />}
          />


          <Route
            path="login"
            element={<PaginaPendiente titulo="Iniciar sesión" />}
          />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />

          <Route
            path="productos"
            element={<PaginaPendiente titulo="Administrar productos" />}
          />

          <Route
            path="ordenes"
            element={<PaginaPendiente titulo="Administrar órdenes" />}
          />

          <Route
            path="usuarios"
            element={<PaginaPendiente titulo="Administrar usuarios" />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
