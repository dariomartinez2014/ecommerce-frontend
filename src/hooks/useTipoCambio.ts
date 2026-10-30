import { useApi } from "./useApi";
import { tipoCambioService } from "../services/tipoCambio";

export function useTipoCambio() {
  const { data, ...estado } = useApi(tipoCambioService.obtenerMxnPorDolar);
  return { mxnPorDolar: data, ...estado };
}
