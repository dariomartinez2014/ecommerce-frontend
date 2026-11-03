// Apunte de estudio: Aquí guardo el estado compartido de HomePage y las acciones que lo actualizan.
import { Link } from "react-router-dom";
import { ShoppingBasket, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="grid items-center gap-10 rounded-3xl bg-green-50 p-6 sm:p-10 lg:grid-cols-2 lg:p-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-green-800">
            <ShoppingBasket size={18} />
            Tu tienda de confianza
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-green-950 sm:text-5xl">
            Todo lo que necesitas para tu hogar.
          </h1>

          <p className="mt-5 max-w-lg leading-7 text-gray-600">
            Encuentra tus productos favoritos, descubre ofertas y haz tus
            compras de forma sencilla.
          </p>

          <Link
            to="/productos"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Ver productos
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white p-8">
          <ShoppingBasket
            size={120}
            strokeWidth={1.2}
            className="text-green-600"
          />
        </div>
      </div>
    </section>
  );
}
