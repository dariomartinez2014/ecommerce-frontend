// Apunte de estudio: Aquí preparo la consulta del tipo de cambio y su estado para mostrar los precios.
import { useApi } from "./useApi";
import { tipoCambioService } from "../services/tipoCambio";

export function useTipoCambio() {
  const { data, ...estado } = useApi(tipoCambioService.obtenerMxnPorDolar);
  return { mxnPorDolar: data, ...estado };
}
