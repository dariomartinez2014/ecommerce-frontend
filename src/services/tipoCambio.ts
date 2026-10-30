interface RespuestaTipoCambio {
  result: string;
  rates: Record<string, number>;
}

export const tipoCambioService = {
  async obtenerMxnPorDolar(signal?: AbortSignal): Promise<number> {
    const respuesta = await fetch("https://open.er-api.com/v6/latest/USD", { signal });
    if (!respuesta.ok) throw new Error(`Error ${respuesta.status} al obtener el tipo de cambio`);
    const datos: RespuestaTipoCambio = await respuesta.json();
    const tasa = datos.rates?.MXN;
    if (datos.result !== "success" || !Number.isFinite(tasa) || tasa <= 0) {
      throw new Error("La API no devolvió un tipo de cambio MXN válido");
    }
    return tasa;
  },
};
