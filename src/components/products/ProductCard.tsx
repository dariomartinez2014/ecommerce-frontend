import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { Producto } from "../../types/producto";

type ProductCardProps = {
  producto: Producto;
  mxnPorDolar?: number | null;
  onAgregar: (producto: Producto) => void;
};

export default function ProductCard({ producto, onAgregar, mxnPorDolar }: ProductCardProps) {
  const [imagenFallida, setImagenFallida] = useState<string | null>(null);
  const agotado = producto.stock <= 0;
  const precio = Number(producto.price);

  return (
    <article className="overflow-hidden rounded-2xl border border-green-100 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-square bg-green-50">
        {producto.image_url && imagenFallida !== producto.image_url ? (
          <img
            src={producto.image_url}
            alt={producto.name}
            className="h-full w-full object-contain p-5"
            loading="lazy"
            onError={() => setImagenFallida(producto.image_url)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            Imagen no disponible
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <p className="text-xs font-medium uppercase text-green-700">
          {producto.category}
        </p>

        <h3 className="font-semibold text-gray-900">{producto.name}</h3>

        <p className="line-clamp-2 text-sm text-gray-500">
          {producto.description}
        </p>

        <p className="text-xl font-bold text-green-800">
          {precio.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
          })} MXN
        </p>

        {mxnPorDolar != null && mxnPorDolar > 0 && (
          <p className="text-sm text-gray-600">
            ≈ {(precio / mxnPorDolar).toLocaleString("es-MX", { style: "currency", currency: "USD", currencyDisplay: "narrowSymbol" })} USD
          </p>
        )}

        <p className="text-xs text-gray-500">
          {agotado ? "Sin existencias" : `${producto.stock} disponibles`}
        </p>

        <button
          type="button"
          disabled={agotado}
          onClick={() => onAgregar(producto)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <ShoppingCart size={18} />
          {agotado ? "No disponible" : "Agregar al carrito"}
        </button>
      </div>
    </article>
  );
}
