// Apunte de estudio: Aquí valido y transformo el carrito y las órdenes simuladas que se guardan en el navegador.
import type { EstadoCompra, ItemCarrito, OrdenSimulada } from "../types/compra";

export const CLAVE_COMPRA = "abarrotes-verde-compra-v1";
export const compraVacia = (): EstadoCompra => ({ items: [], ordenes: [] });
export function totalCentavos(items: ItemCarrito[]): number {
  return items.reduce((total, { producto, cantidad }) => total + Math.round(Number(producto.price) * 100) * cantidad, 0);
}
function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}
function itemValido(valor: unknown): valor is ItemCarrito {
  if (!esObjeto(valor) || !esObjeto(valor.producto)) return false;
  const p = valor.producto;
  return Number.isSafeInteger(valor.cantidad) && Number(valor.cantidad) > 0 &&
    Number.isSafeInteger(p.id) && typeof p.name === "string" &&
    (typeof p.price === "number" || typeof p.price === "string") &&
    String(p.price).trim() !== "" && Number.isFinite(Number(p.price)) && Number(p.price) >= 0 &&
    Number.isSafeInteger(p.stock) && Number(p.stock) >= Number(valor.cantidad);
}
export function leerCompra(storage: Pick<Storage, "getItem">): EstadoCompra {
  try {
    const raw = storage.getItem(CLAVE_COMPRA);
    if (!raw) return compraVacia();
    const dato: unknown = JSON.parse(raw);
    if (!esObjeto(dato) || !Array.isArray(dato.items) || !dato.items.every(itemValido) || !Array.isArray(dato.ordenes)) return compraVacia();
    const ordenes = dato.ordenes.filter((orden): orden is OrdenSimulada =>
      esObjeto(orden) && typeof orden.id === "string" && typeof orden.fecha === "string" &&
      !Number.isNaN(Date.parse(orden.fecha)) && orden.moneda === "MXN" &&
      Array.isArray(orden.items) && orden.items.length > 0 && orden.items.every(itemValido) &&
      Number.isSafeInteger(orden.totalCentavos) && orden.totalCentavos === totalCentavos(orden.items),
    );
    return { items: dato.items, ordenes };
  } catch {
    return compraVacia();
  }
}
export function confirmarCompra(estado: EstadoCompra, id: string, fecha: string): EstadoCompra {
  if (!estado.items.length) throw new Error("Tu carrito está vacío.");
  if (!estado.items.every(itemValido)) throw new Error("Revisa las cantidades y precios del carrito.");
  const total = totalCentavos(estado.items);
  if (!Number.isSafeInteger(total)) throw new Error("El total del carrito no es válido.");
  const orden: OrdenSimulada = {
    id, fecha, moneda: "MXN", totalCentavos: total,
    items: estado.items.map((item) => ({ ...item, producto: { ...item.producto } })),
  };
  return { items: [], ordenes: [orden, ...estado.ordenes] };
}
