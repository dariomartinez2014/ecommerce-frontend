import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function cargarServicio(path, imports = []) {
  let fuente = await readFile(new URL(path, import.meta.url), 'utf8');
  for (const [patron, reemplazo] of imports) fuente = fuente.replace(patron, reemplazo);
  const { outputText } = ts.transpileModule(fuente, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const productos = Array.from({ length: 237 }, (_, i) => ({
  id: i + 1, name: `Artículo ${i + 1}`, category: i % 3 === 0 ? 'Otra' : 'Bebidas', price: 100, stock: 5,
}));
const llamadas = [];
globalThis.__apiPrueba = { async get(_url, { params, signal }) {
  signal?.throwIfAborted();
  llamadas.push(params);
  const datos = productos.filter((p) => !params.category || p.category === params.category);
  return { data: datos.slice(params.skip, params.skip + params.limit) };
} };
const { productosService } = await cargarServicio('../src/services/productos.ts', [
  [/import \{ api \} from "..\/lib\/axios";/, 'const api = globalThis.__apiPrueba;'],
  [/import \{ CATEGORIAS_PERMITIDAS \} from "..\/constants\/categorias";/, 'const CATEGORIAS_PERMITIDAS = ["Bebidas", "Lácteos"];'],
]);
const primera = await productosService.getPagina(1, 6, 'Todas', '');
const segunda = await productosService.getPagina(2, 6, 'Todas', '');
assert.equal(primera.productos.length, 6);
assert.equal(primera.hayMas, true);
assert.ok(primera.productos.every((p) => p.category === 'Bebidas'));
assert.ok(segunda.productos.every((p) => !primera.productos.some((otro) => otro.id === p.id)));
const ultima = await productosService.getPagina(27, 6, 'Todas', '');
assert.equal(ultima.productos.length, 2);
assert.equal(ultima.hayMas, false);
assert.ok(llamadas.some((p) => p.skip === 200));
const vacia = await productosService.getPagina(28, 6, 'Todas', '');
assert.equal(vacia.productos.length, 0);
assert.equal(vacia.hayMas, false);
await productosService.getPagina(1, 6, 'Bebidas', '');
assert.equal(llamadas.at(-1).category, 'Bebidas');
const busqueda = await productosService.getPagina(1, 6, 'Todas', 'articulo 236');
assert.deepEqual(busqueda.productos.map((p) => p.id), [236]);
const controller = new AbortController();
controller.abort();
await assert.rejects(productosService.getPagina(1, 6, 'Todas', '', controller.signal));
globalThis.__apiPrueba.get = async () => { throw new Error('Sin conexión'); };
await assert.rejects(productosService.getPagina(1, 6, 'Todas', ''), /Sin conexión/);

const { tipoCambioService } = await cargarServicio('../src/services/tipoCambio.ts');
const fetchOriginal = globalThis.fetch;
try {
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ result: 'success', rates: { MXN: 20 } }) });
  const tasa = await tipoCambioService.obtenerMxnPorDolar();
  assert.equal(100 / tasa, 5);
  for (const valor of [0, -1, null, undefined]) {
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ result: 'success', rates: { MXN: valor } }) });
    await assert.rejects(tipoCambioService.obtenerMxnPorDolar(), /válido/);
  }
  globalThis.fetch = async () => ({ ok: false, status: 503 });
  await assert.rejects(tipoCambioService.obtenerMxnPorDolar(), /503/);
} finally {
  globalThis.fetch = fetchOriginal;
  delete globalThis.__apiPrueba;
}
console.log('OK: páginas sin duplicados, categorías, búsqueda, última página, cancelación, errores y conversión MXN/USD.');
