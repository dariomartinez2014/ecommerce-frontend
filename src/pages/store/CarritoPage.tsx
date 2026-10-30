import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { useCart } from "../../hooks/useCart";

export default function CarritoPage() {
  const {
    items,
    totalUnidades,
    totalPrecio,
    aumentar,
    disminuir,
    eliminar,
    vaciar,
    errorGuardado,
  } = useCart();

  const formatoMoneda = (precio: number) =>
    precio.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });

  if (items.length === 0) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-green-100 text-green-700">
            <ShoppingCart size={36} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Tu carrito está vacío
          </h1>

          <p className="mt-3 text-gray-500">
            Todavía no has agregado productos. ¡Encuentra tus favoritos en
            nuestro catálogo!
          </p>

          <Link
            to="/productos"
            className="mt-6 inline-flex rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Explorar productos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi carrito</h1>
            <p className="mt-2 text-gray-500">
              {totalUnidades} {totalUnidades === 1 ? "producto" : "productos"}{" "}
              en tu carrito
            </p>
          </div>

          <button
            type="button"
            onClick={vaciar}
            className="text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_340px]">
          <section className="space-y-4">
            {items.map(({ producto, cantidad }) => (
              <article
                key={producto.id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
              >
                <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-green-50">
                  {producto.image_url ? (
                    <img
                      src={producto.image_url}
                      alt={producto.name}
                      className="size-full object-contain p-2"
                    />
                  ) : (
                    <ShoppingCart className="text-green-300" size={32} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase text-green-700">
                    {producto.category ?? "Sin categoría"}
                  </p>

                  <h2 className="mt-1 font-semibold text-gray-900">
                    {producto.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {formatoMoneda(Number(producto.price))} por unidad
                  </p>

                  <p className="mt-2 font-semibold text-gray-900">
                    Subtotal: {formatoMoneda(Number(producto.price) * cantidad)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-1">
                    <button
                      type="button"
                      onClick={() => disminuir(producto.id)}
                      aria-label={`Disminuir cantidad de ${producto.name}`}
                      className="rounded-lg p-2 hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="min-w-5 text-center font-semibold">
                      {cantidad}
                    </span>

                    <button
                      type="button"
                      onClick={() => aumentar(producto.id)}
                      disabled={cantidad >= producto.stock}
                      aria-label={`Aumentar cantidad de ${producto.name}`}
                      className="rounded-lg p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => eliminar(producto.id)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </article>
            ))}

            <Link
              to="/productos"
              className="inline-block pt-2 text-sm font-semibold text-green-700 hover:text-green-800"
            >
              ← Seguir comprando
            </Link>
          </section>

          <aside className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-xl font-bold text-gray-900">
              Resumen de compra
            </h2>

            <div className="mt-5 flex justify-between gap-4 text-sm text-gray-600">
              <span>Productos ({totalUnidades})</span>
              <span>{formatoMoneda(totalPrecio)}</span>
            </div>

            <div className="my-5 border-t border-gray-100" />

            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-green-800">
                {formatoMoneda(totalPrecio)}
              </span>
            </div>

            {errorGuardado && <p role="alert" className="mt-4 text-sm text-amber-800">{errorGuardado}</p>}
            <Link to="/pago" className="mt-6 block w-full rounded-xl bg-green-700 px-4 py-3 text-center font-semibold text-white hover:bg-green-800">
              Continuar al pago simulado
            </Link>

            <p className="mt-3 text-center text-xs text-gray-400">
              Práctica de clase: no se cobra dinero.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
