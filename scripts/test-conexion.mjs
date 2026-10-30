import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import axios from 'axios';
import ts from 'typescript';
const fuente = (await readFile(new URL('../src/lib/axios.ts', import.meta.url), 'utf8'))
  .replace('from "axios"', `from ${JSON.stringify(import.meta.resolve('axios'))}`)
  .replace('import.meta.env.VITE_API_URL', 'undefined');
const { outputText } = ts.transpileModule(fuente, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
globalThis.localStorage = { getItem: () => null };
const { api } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
let intentos = 0;
api.defaults.adapter = async (config) => {
  intentos++;
  if (intentos === 1) throw new axios.AxiosError('Servidor temporalmente caído', 'ERR_BAD_RESPONSE', config, null, { status: 500, config });
  return { data: ['ok'], status: 200, statusText: 'OK', headers: {}, config };
};
assert.deepEqual((await api.get('/products/')).data, ['ok']);
assert.equal(intentos, 2);
for (const [metodo, status, esperados] of [['get', 500, 2], ['get', 400, 1], ['post', 500, 1]]) {
  intentos = 0;
  api.defaults.adapter = async (config) => {
    intentos++;
    throw new axios.AxiosError('Error', 'ERR_BAD_RESPONSE', config, null, { status, config });
  };
  await assert.rejects(api.request({ method: metodo, url: '/prueba' }), new RegExp(String(status)));
  assert.equal(intentos, esperados);
}
intentos = 0;
api.defaults.adapter = async (config) => { intentos++; throw new axios.AxiosError('Sin red', 'ERR_NETWORK', config); };
await assert.rejects(api.get('/products/'), /No se pudo conectar/);
assert.equal(intentos, 2);
delete globalThis.localStorage;
console.log('OK: recupera un GET tras 500; limita reintentos; no repite POST ni errores 400; informa fallos de red.');
