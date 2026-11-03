// Apunte de estudio: Aquí guardo el estado compartido de PagoPage y las acciones que lo actualizan.
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

const moneda = (centavos: number) => (centavos / 100).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
export default function PagoPage() {
  const { items, totalPrecio, pagarSimulado } = useCart();
  const navigate = useNavigate();
  const ocupado = useRef(false);
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);
  function confirmar() {
    if (ocupado.current) return;
    ocupado.current = true;
    setProcesando(true);
    setError("");
    try {
      const id = pagarSimulado();
      navigate(`/mis-ordenes?pedido=${encodeURIComponent(id)}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar la simulación.");
      ocupado.current = false;
      setProcesando(false);
    }
  }
  if (!items.length) return <section className="mx-auto max-w-3xl p-6 sm:p-10"><h1 className="text-3xl font-bold">Tu carrito está vacío</h1><Link to="/productos" className="mt-5 inline-block text-green-700 underline">Explorar productos</Link></section>;
  return <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <Link to="/carrito" className="text-green-700 underline">← Volver al carrito</Link>
    <h1 className="mt-5 text-3xl font-bold text-green-950">Confirmar compra de prueba</h1>
    <p className="mt-4 rounded-xl bg-amber-50 p-4 text-amber-900">Pago simulado para clase. No se cobra dinero, no necesitas ingresar datos de tarjeta y no se realiza un envío.</p>
    <div className="mt-6 rounded-2xl border border-green-100 bg-white p-5">
      <h2 className="text-xl font-semibold">Resumen del pedido</h2>
      <ul className="mt-4 divide-y divide-gray-100">{items.map(({ producto, cantidad }) => <li key={producto.id} className="flex justify-between gap-4 py-4"><span>{producto.name}<span className="block text-sm text-gray-500">Cantidad: {cantidad}</span></span><strong>{moneda(Math.round(Number(producto.price) * 100) * cantidad)}</strong></li>)}</ul>
      <p className="mt-4 flex justify-between border-t pt-4 text-xl font-bold"><span>Total de prueba</span><span>{moneda(Math.round(totalPrecio * 100))} MXN</span></p>
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}
      <button type="button" onClick={confirmar} disabled={procesando} className="mt-6 w-full rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50">{procesando ? "Confirmando..." : "Confirmar pago simulado"}</button>
      <p className="mt-3 text-sm text-gray-500">El comprobante se guarda en este navegador. Podrás verlo en Mis órdenes.</p>
    </div>
  </section>;
}
