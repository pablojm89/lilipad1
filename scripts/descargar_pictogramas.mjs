#!/usr/bin/env node
// ============================================================================
//  DESCARGA DE PICTOGRAMAS DE ARASAAC
// ============================================================================
//
//  Lee la lista de palabras de  js/datos.js  y descarga el pictograma de cada
//  una desde ARASAAC (https://arasaac.org) a la carpeta  img/pictogramas/.
//
//  USO:
//      node scripts/descargar_pictogramas.mjs
//      node scripts/descargar_pictogramas.mjs --forzar   (vuelve a descargar todo)
//
//  Cómo elige la imagen:
//    - Si la palabra tiene un id fijo (campo "arasaac"), usa ese.
//    - Si no, busca por el término "buscar" y coge el primer resultado.
//  Si algún pictograma no te convence, reemplaza el PNG a mano en img/pictogramas/.
//
//  Pictogramas: ARASAAC (https://arasaac.org). Autor de los pictogramas:
//  Sergio Palao. Origen: ARASAAC (http://arasaac.org). Licencia: Creative
//  Commons BY-NC-SA. Propiedad: Gobierno de Aragón (España).
// ============================================================================

import { PALABRAS } from "../js/datos.js";
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(__dirname, "..");
const DESTINO = join(RAIZ, "img", "pictogramas");
const FORZAR = process.argv.includes("--forzar");

const API_BUSCAR = (texto) =>
  `https://api.arasaac.org/api/pictograms/es/search/${encodeURIComponent(texto)}`;
const URL_IMAGEN = (id) =>
  `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;

async function existe(ruta) {
  try { await access(ruta); return true; } catch { return false; }
}

async function buscarId(palabra) {
  if (palabra.arasaac) return palabra.arasaac;
  const res = await fetch(API_BUSCAR(palabra.buscar));
  if (!res.ok) throw new Error(`búsqueda falló (${res.status})`);
  const datos = await res.json();
  if (!Array.isArray(datos) || datos.length === 0) {
    throw new Error(`sin resultados para "${palabra.buscar}"`);
  }
  return datos[0]._id;
}

async function descargarImagen(id, destino) {
  const res = await fetch(URL_IMAGEN(id));
  if (!res.ok) throw new Error(`descarga falló (${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(destino, buffer);
}

async function main() {
  await mkdir(DESTINO, { recursive: true });
  console.log(`\n📥 Descargando ${PALABRAS.length} pictogramas en img/pictogramas/\n`);

  let ok = 0, saltados = 0, fallos = 0;

  for (const palabra of PALABRAS) {
    const destino = join(DESTINO, palabra.pictograma);
    const etiqueta = palabra.palabra.padEnd(6);

    // Imágenes propias (compuestas a mano): nunca se descargan ni se sobrescriben
    if (palabra.local) {
      console.log(`  🖐️  ${etiqueta} imagen propia (no se descarga)`);
      saltados++;
      continue;
    }

    if (!FORZAR && (await existe(destino))) {
      console.log(`  ⏭️  ${etiqueta} ya existe (usa --forzar para rehacer)`);
      saltados++;
      continue;
    }

    try {
      const id = await buscarId(palabra);
      await descargarImagen(id, destino);
      console.log(`  ✅ ${etiqueta} → ARASAAC #${id}  (${palabra.pictograma})`);
      ok++;
    } catch (err) {
      console.log(`  ❌ ${etiqueta} ${err.message}`);
      fallos++;
    }

    // Pequeña pausa para ser amables con el servidor de ARASAAC
    await new Promise((r) => setTimeout(r, 150));
  }

  console.log(`\n✨ Listo: ${ok} descargados, ${saltados} ya existían, ${fallos} con error.\n`);
  if (fallos > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error("\n💥 Error inesperado:", err);
  process.exit(1);
});
