// Apunte de estudio: Aquí valido y transformo el carrito y las órdenes simuladas que se guardan en el navegador.
import type { Producto } from "./producto";

export type ItemCarrito = { producto: Producto; cantidad: number };
export type OrdenSimulada = {
  id: string;
  fecha: string;
  items: ItemCarrito[];
  totalCentavos: number;
  moneda: "MXN";
};
export type EstadoCompra = { items: ItemCarrito[]; ordenes: OrdenSimulada[] };
