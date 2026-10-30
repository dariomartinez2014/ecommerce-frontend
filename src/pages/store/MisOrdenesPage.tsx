import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

const moneda = (centavos: number) => (centavos / 100).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
export default function MisOrdenesPage() {
  const { ordenes } = useCart();
  const [params] = useSearchParams();
  const confirmado = ordenes.some((orden) => orden.id === params.get("pedido"));
  return <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
    <h1 className="text-3xl font-bold text-green-950">Mis órdenes</h1>
    <p className="mt-3 text-gray-600">Compras simuladas guardadas en este navegador. No hay cargos reales ni envíos.</p>
    {confirmado && <div role="status" className="mt-6 rounded-xl bg-green-50 p-5 text-green-900"><h2 className="text-xl font-bold">¡Pago simulado completado!</h2><p className="mt-2">Tu comprobante está listo y el carrito quedó vacío. No se cobró dinero.</p></div>}
    {!ordenes.length ? <p className="mt-8 rounded-xl border border-dashed p-8 text-center">Todavía no tienes compras de prueba.</p> : <div className="mt-6 space-y-6">{ordenes.map((orden) => <article key={orden.id} className="rounded-2xl border border-green-100 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap justify-between gap-3"><h2 className="font-bold">Comprobante de pago simulado</h2><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">Simulación completada</span></div>
      <p className="mt-3 break-all text-xs text-gray-500">{orden.id}</p>
      <p className="mt-1 text-sm text-gray-500">{new Date(orden.fecha).toLocaleString("es-GT")}</p>
      <ul className="mt-4 divide-y divide-gray-100">{orden.items.map(({ producto, cantidad }) => <li key={producto.id} className="flex justify-between gap-4 py-3"><span>{cantidad} × {producto.name}</span><span>{moneda(Math.round(Number(producto.price) * 100) * cantidad)}</span></li>)}</ul>
      <p className="mt-4 flex justify-between border-t pt-4 font-bold"><span>Total simulado</span><span>{moneda(orden.totalCentavos)} MXN</span></p>
    </article>)}</div>}
    <Link to="/productos" className="mt-8 inline-block rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800">Seguir comprando</Link>
  </section>;
}
