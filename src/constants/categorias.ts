// Apunte de estudio: Aquí reúno los valores de categorias que utiliza la aplicación; este archivo por sí solo no es una base de datos.
export const CATEGORIAS_PERMITIDAS = [
  "Abarrotes",
  "Limpieza",
  "Bebidas",
  "Snacks",
  "Lácteos",
] as const;

export type CategoriaProducto = (typeof CATEGORIAS_PERMITIDAS)[number];
