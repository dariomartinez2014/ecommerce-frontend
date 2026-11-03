// Apunte de estudio: Aquí accedo al carrito compartido desde un hook para no repetir el acceso al contexto.
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export function useCart() {
  const contexto = useContext(CartContext);

  if (contexto === undefined) {
    throw new Error("useCart debe utilizarse dentro de un CartProvider");
  }

  return contexto;
}
