import { createContext, useCallback, useRef, useState, type ReactNode } from "react";
import type { Producto } from "../types/producto";
import type { EstadoCompra, ItemCarrito, OrdenSimulada } from "../types/compra";
import { CLAVE_COMPRA, confirmarCompra, leerCompra, totalCentavos } from "../lib/compra";
export type { ItemCarrito } from "../types/compra";

type CartContextType = {
  items: ItemCarrito[];
  ordenes: OrdenSimulada[];
  totalUnidades: number;
  totalPrecio: number;
  errorGuardado: string | null;
  agregar: (producto: Producto) => void;
  aumentar: (id: number) => void;
  disminuir: (id: number) => void;
  eliminar: (id: number) => void;
  vaciar: () => void;
  pagarSimulado: () => string;
};
export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState(() => leerCompra(localStorage));
  const actual = useRef(estado);
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null);
  const actualizarCarrito = useCallback((transformar: (items: ItemCarrito[]) => ItemCarrito[]) => {
    const siguiente = { ...actual.current, items: transformar(actual.current.items) };
    try {
      localStorage.setItem(CLAVE_COMPRA, JSON.stringify(siguiente));
      setErrorGuardado(null);
    } catch {
      setErrorGuardado("El navegador no permite guardar tu carrito. Si cierras o recargas, podrías perder los cambios.");
    }
    actual.current = siguiente;
    setEstado(siguiente);
  }, []);
  const agregar = useCallback((producto: Producto) => {
    if (producto.stock <= 0) return;
    actualizarCarrito((items) => {
      const existente = items.find((item) => item.producto.id === producto.id);
      if (!existente) return [...items, { producto, cantidad: 1 }];
      if (existente.cantidad >= producto.stock) return items;
      return items.map((item) => item.producto.id === producto.id ? { producto, cantidad: item.cantidad + 1 } : item);
    });
  }, [actualizarCarrito]);
  const aumentar = useCallback((id: number) => actualizarCarrito((items) => items.map((item) =>
    item.producto.id === id && item.cantidad < item.producto.stock ? { ...item, cantidad: item.cantidad + 1 } : item,
  )), [actualizarCarrito]);
  const disminuir = useCallback((id: number) => actualizarCarrito((items) => items.map((item) =>
    item.producto.id === id ? { ...item, cantidad: item.cantidad - 1 } : item,
  ).filter((item) => item.cantidad > 0)), [actualizarCarrito]);
  const eliminar = useCallback((id: number) => actualizarCarrito((items) => items.filter((item) => item.producto.id !== id)), [actualizarCarrito]);
  const vaciar = useCallback(() => actualizarCarrito(() => []), [actualizarCarrito]);
  const pagarSimulado = useCallback(() => {
    const id = `SIM-${crypto.randomUUID()}`;
    const siguiente: EstadoCompra = confirmarCompra(actual.current, id, new Date().toISOString());
    // Guardar pedido y vaciar carrito juntos antes de mostrar la confirmación.
    try { localStorage.setItem(CLAVE_COMPRA, JSON.stringify(siguiente)); }
    catch { throw new Error("No se pudo guardar el comprobante. Habilita el almacenamiento del navegador y vuelve a intentar; tu carrito se conserva."); }
    actual.current = siguiente;
    setEstado(siguiente);
    setErrorGuardado(null);
    return id;
  }, []);
  return <CartContext.Provider value={{
    items: estado.items, ordenes: estado.ordenes, errorGuardado,
    totalUnidades: estado.items.reduce((total, item) => total + item.cantidad, 0),
    totalPrecio: totalCentavos(estado.items) / 100,
    agregar, aumentar, disminuir, eliminar, vaciar, pagarSimulado,
  }}>{children}</CartContext.Provider>;
}
