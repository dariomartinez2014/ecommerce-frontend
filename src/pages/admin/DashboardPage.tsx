// Apunte de estudio: Aquí organizo la pantalla DashboardPage con sus datos, controles y componentes visibles.
import { Package, ClipboardList, Users } from "lucide-react";

const metricas = [
  {
    titulo: "Productos",
    valor: "128",
    icono: Package,
  },
  {
    titulo: "Órdenes",
    valor: "24",
    icono: ClipboardList,
  },
  {
    titulo: "Usuarios",
    valor: "86",
    icono: Users,
  },
];

export default function DashboardPage() {
  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-sm font-medium text-green-700">Resumen general</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Bienvenido al panel de administración de tu tienda.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metricas.map((metrica) => {
          const Icono = metrica.icono;

          return (
            <article
              key={metrica.titulo}
              className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{metrica.titulo}</p>

                <span className="rounded-xl bg-green-50 p-3 text-green-700">
                  <Icono size={22} />
                </span>
              </div>

              <p className="mt-4 text-3xl font-bold text-gray-900">
                {metrica.valor}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
