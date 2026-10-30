import { api } from "../lib/axios";
import { CATEGORIAS_PERMITIDAS } from "../constants/categorias";
import type { Producto } from "../types/producto";

export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
const permitidas = new Set<string>(CATEGORIAS_PERMITIDAS.map(normalizar));

export const productosService = {
  async getPagina(pagina: number, porPagina: number, categoria: string, busqueda: string, signal?: AbortSignal) {
    // Filtrar antes de paginar evita páginas incompletas por categorías ajenas
    // a esta tienda. La API soporta category, skip y limit, pero no búsqueda.
    const filtrados: Producto[] = [];
    const necesarios = pagina * porPagina + 1;
    const texto = normalizar(busqueda);
    let skip = 0;
    const limit = 100;
    while (filtrados.length < necesarios) {
      const { data } = await api.get<Producto[]>("/products/", {
        params: { skip, limit, ...(categoria !== "Todas" ? { category: categoria } : {}) }, signal,
      });
      if (!Array.isArray(data)) throw new Error("La API devolvió un catálogo inválido");
      filtrados.push(...data.filter((producto) =>
        permitidas.has(normalizar(producto.category ?? "")) &&
        (categoria === "Todas" || normalizar(producto.category ?? "") === normalizar(categoria)) &&
        normalizar(producto.name).includes(texto),
      ));
      if (data.length < limit) break;
      skip += data.length;
    }
    return {
      productos: filtrados.slice((pagina - 1) * porPagina, pagina * porPagina),
      hayMas: filtrados.length > pagina * porPagina,
    };
  },
};
