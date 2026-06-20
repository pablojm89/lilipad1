// ============================================================================
//  FRASES CON DIBUJOS  ·  estilo "Dictapicto"
//  Dices o escribes una frase → se muestra como una secuencia de pictogramas.
//  Usa primero nuestros pictogramas locales y, si no, los busca en ARASAAC.
// ============================================================================

import { PALABRAS } from "./datos.js";
import { Reconocedor, decirEnVozAlta } from "./reconocimiento.js";

const $ = (s) => document.querySelector(s);
const elResultado = $("#dicta-resultado");
const elInput     = $("#dicta-input");
const elMic       = $("#dicta-mic");
const elAviso     = $("#dicta-aviso");

// Normaliza: minúsculas, sin acentos, solo letras
const norm = (s) => (s || "").toLowerCase().normalize("NFD")
  .replace(/[̀-ͯ]/g, "").replace(/[^a-zñ]/g, "");

// Índice de pictogramas LOCALES (palabra y variantes → archivo)
const LOCAL = new Map();
PALABRAS.forEach((p) => {
  LOCAL.set(norm(p.palabra), p.pictograma);
  (p.variantes || []).forEach((v) => { const k = norm(v); if (k && !LOCAL.has(k)) LOCAL.set(k, p.pictograma); });
});

// Caché de búsquedas para no repetir llamadas a ARASAAC
const cache = new Map();

// Busca el pictograma de una palabra: local → ARASAAC (bestsearch → search)
async function buscarPicto(palabra) {
  const w = norm(palabra);
  if (!w) return { src: null };
  if (cache.has(w)) return cache.get(w);

  let res = { src: null };
  if (LOCAL.has(w)) {
    res = { src: `img/pictogramas/${LOCAL.get(w)}` };
  } else {
    try {
      let r = await fetch(`https://api.arasaac.org/api/pictograms/es/bestsearch/${encodeURIComponent(w)}`);
      let d = await r.json();
      if (!Array.isArray(d) || !d.length) {
        r = await fetch(`https://api.arasaac.org/api/pictograms/es/search/${encodeURIComponent(w)}`);
        d = await r.json();
      }
      if (Array.isArray(d) && d.length) {
        res = { src: `https://static.arasaac.org/pictograms/${d[0]._id}/${d[0]._id}_300.png` };
      }
    } catch { /* sin internet u otro fallo → se mostrará solo el texto */ }
  }
  cache.set(w, res);
  return res;
}

// Convierte la frase del input en una fila de pictogramas
function convertir() {
  const texto = (elInput.value || "").trim();
  elResultado.innerHTML = "";
  const palabras = texto.split(/\s+/).filter((w) => norm(w));
  if (!palabras.length) {
    elResultado.innerHTML = `<p class="dicta-ayuda">Escribe o di una frase y la verás en dibujos.</p>`;
    return;
  }
  elAviso.textContent = navigator.onLine ? "" : "⚠️ Sin internet: solo se ven las palabras que ya tenemos guardadas.";

  palabras.forEach((palabra) => {
    const celda = document.createElement("div");
    celda.className = "picto-celda";
    celda.innerHTML =
      `<div class="picto-img cargando"></div><span class="picto-txt">${palabra}</span>`;
    elResultado.appendChild(celda);

    buscarPicto(palabra).then((res) => {
      const cont = celda.querySelector(".picto-img");
      cont.classList.remove("cargando");
      if (res.src) {
        const img = new Image();
        img.alt = palabra;
        img.onerror = () => cont.classList.add("sin-picto");
        img.src = res.src;
        cont.appendChild(img);
      } else {
        cont.classList.add("sin-picto");   // no hay dibujo: queda solo el texto
      }
    });
  });
}

// Leer la frase completa en voz alta
function leerFrase() {
  const texto = (elInput.value || "").trim();
  if (texto) decirEnVozAlta(texto, { rate: 0.9 });
}

// ---- Micrófono (dictar la frase) -------------------------------------------
const rec = new Reconocedor();
function dictar() {
  if (!rec.soportado) {
    elAviso.textContent = "Este navegador no oye. Escribe la frase (mejor en Chrome).";
    return;
  }
  elMic.classList.add("escuchando");
  elAviso.textContent = "Te escucho… 👂";
  rec.escuchar({
    onResultado: (alts) => {
      elMic.classList.remove("escuchando");
      elAviso.textContent = "";
      elInput.value = (alts && alts[0]) ? alts[0] : "";
      convertir();
    },
    onError: () => { elMic.classList.remove("escuchando"); elAviso.textContent = ""; },
    onFin:   () => { elMic.classList.remove("escuchando"); },
  });
}

// ---- Conexiones ------------------------------------------------------------
elMic.addEventListener("click", dictar);
$("#dicta-ver").addEventListener("click", convertir);
$("#dicta-leer").addEventListener("click", leerFrase);
$("#dicta-borrar").addEventListener("click", () => {
  elInput.value = "";
  elAviso.textContent = "";
  elResultado.innerHTML = `<p class="dicta-ayuda">Escribe o di una frase y la verás en dibujos.</p>`;
  elInput.focus();
});
elInput.addEventListener("keydown", (e) => { if (e.key === "Enter") convertir(); });

// Mostrar/ocultar el texto bajo los dibujos
$("#boton-texto").addEventListener("click", () => {
  document.body.classList.toggle("ocultar-texto");
});
