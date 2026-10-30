import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { useApi } from "../../hooks/useApi";
import { useTipoCambio } from "../../hooks/useTipoCambio";
import { productosService } from "../../services/productos";
import { Search, SlidersHorizontal } from "lucide-react";

import ProductCard from "../../components/products/ProductCard";
import { CATEGORIAS_PERMITIDAS } from "../../constants/categorias";
import type { Producto } from "../../types/producto";
import { useCart } from "../../hooks/useCart";

const POR_PAGINA = 6;

export default function ProductosPage() {
  const [params, setParams] = useSearchParams();
  const numeroPagina = Number(params.get("pagina") ?? 1);
  const pagina = Number.isSafeInteger(numeroPagina) && numeroPagina > 0 ? numeroPagina : 1;
  const categoriaUrl = params.get("categoria") ?? "Todas";
  const categoriaSeleccionada = CATEGORIAS_PERMITIDAS.some((c) => c === categoriaUrl) ? categoriaUrl : "Todas";
  const busqueda = params.get("buscar") ?? "";
  const busquedaPausada = useDebounce(busqueda, 500);
  const [mensaje, setMensaje] = useState("");
  const consulta = useCallback((signal: AbortSignal) =>
    productosService.getPagina(pagina, POR_PAGINA, categoriaSeleccionada, busquedaPausada, signal),
    [pagina, categoriaSeleccionada, busquedaPausada]);
  const { data, cargando, error, recargar } = useApi(consulta);
  const { mxnPorDolar, error: errorCambio, recargar: recargarCambio } = useTipoCambio();
  const esperando = cargando || busqueda !== busquedaPausada;
  const productosFiltrados = data?.productos ?? [];

  function cambiarFiltros(categoria: string, buscar: string) {
    setParams((anteriores) => {
      const siguientes = new URLSearchParams(anteriores);
      siguientes.set("pagina", "1");
      if (categoria === "Todas") siguientes.delete("categoria");
      else siguientes.set("categoria", categoria);
      if (buscar) siguientes.set("buscar", buscar);
      else siguientes.delete("buscar");
      return siguientes;
    }, { replace: true });
  }
  function irAPagina(nueva: number) {
    setParams((anteriores) => {
      const siguientes = new URLSearchParams(anteriores);
      siguientes.set("pagina", String(nueva));
      return siguientes;
    });
  }

  const { agregar } = useCart();

  function manejarAgregar(producto: Producto) {
    agregar(producto);
    setMensaje(`${producto.name} agregado al carrito.`);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <section className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-700">
            Abarrotes Verde
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Nuestro catálogo
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Encuentra todo lo que necesitas para tu hogar en un solo lugar.
          </p>
        </section>

        {/* Búsqueda */}
        <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <label
            htmlFor="buscar-productos"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Buscar productos
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100">
            <Search size={20} className="shrink-0 text-gray-400" />

            <input
              id="buscar-productos"
              type="search"
              value={busqueda}
              onChange={(event) => cambiarFiltros(categoriaSeleccionada, event.target.value)}
              placeholder="Ej. arroz, leche, detergente..."
              className="w-full border-0 bg-transparent py-3 text-sm outline-none focus:ring-0"
            />
          </div>
        </section>

        {/* Filtro por categoría */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-green-700" />
            <h2 className="font-semibold text-gray-800">
              Filtrar por categoría
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Todas", ...CATEGORIAS_PERMITIDAS].map((categoria) => {
              const seleccionada = categoriaSeleccionada === categoria;

              return (
                <button
                  key={categoria}
                  type="button"
                  onClick={() => cambiarFiltros(categoria, busqueda)}
                  aria-pressed={seleccionada}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    seleccionada
                      ? "border-green-700 bg-green-700 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-green-600 hover:text-green-700"
                  }`}
                >
                  {categoria}
                </button>
              );
            })}
          </div>
        </section>

        {/* Resultados */}
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              {categoriaSeleccionada === "Todas"
                ? "Todos los productos"
                : categoriaSeleccionada}
            </h2>

            <p className="text-sm text-gray-500">
              {productosFiltrados.length}{" "}
              {productosFiltrados.length === 1
                ? "producto en esta página"
                : "productos en esta página"}
            </p>
          </div>

          {mensaje && (
            <p
              role="status"
              className="mb-5 rounded-xl bg-green-50 p-3 text-sm text-green-800"
            >
              {mensaje}
            </p>
          )}

          {errorCambio && <p role="status" className="mb-4 text-sm text-amber-800">No se pudo obtener la conversión a USD. Los precios en MXN siguen disponibles. <button type="button" onClick={recargarCambio} className="underline">Reintentar conversión</button></p>}
          {esperando ? <p role="status">Cargando productos...</p> : error ? (
            <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">
              <p>No se pudo cargar el catálogo: {error}</p>
              <button type="button" onClick={recargar} className="mt-2 underline">Reintentar</button>
            </div>
          ) : productosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productosFiltrados.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  mxnPorDolar={mxnPorDolar}
                  onAgregar={manejarAgregar}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <Search size={36} className="mx-auto mb-4 text-gray-300" />

              <h3 className="font-semibold text-gray-800">
                No encontramos productos
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Prueba con otro nombre o selecciona otra categoría.
              </p>

              <button
                type="button"
                onClick={() => {
                  cambiarFiltros("Todas", "");
                }}
                className="mt-5 font-semibold text-green-700 hover:text-green-800"
              >
                Limpiar filtros
              </button>
            </div>
          )}
          <nav aria-label="Paginación del catálogo" className="mt-8 flex items-center justify-center gap-4">
            <button type="button" disabled={esperando || pagina <= 1} onClick={() => irAPagina(pagina - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Anterior</button>
            <span aria-live="polite">Página {pagina}</span>
            <button type="button" disabled={esperando || !!error || !data?.hayMas} onClick={() => irAPagina(pagina + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Siguiente</button>
          </nav>
        </section>
      </div>
    </main>
  );
}
