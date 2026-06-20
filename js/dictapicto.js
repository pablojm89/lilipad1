// ============================================================================
//  FRASES CON DIBUJOS  ·  estilo "Dictapicto"
//  Dices o escribes una frase → se muestra como una secuencia de pictogramas.
//  - Busca primero en nuestros pictogramas locales y, si no, en ARASAAC.
//  - Si una palabra tiene varios dibujos, puedes ELEGIR cuál (se recuerda).
//  - Puedes GUARDAR frases favoritas para reutilizarlas.
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

// Caché de búsquedas (durante la sesión) para no repetir llamadas
const cache = new Map();

// Preferencia de dibujo por palabra (la elige el adulto y se recuerda siempre)
let prefs = {};
try { prefs = JSON.parse(localStorage.getItem("dicta-pref") || "{}"); } catch {}
const guardarPrefs = () => localStorage.setItem("dicta-pref", JSON.stringify(prefs));

// Frases favoritas
let favs = [];
try { favs = JSON.parse(localStorage.getItem("dicta-fav") || "[]"); } catch {}
const guardarFavs = () => localStorage.setItem("dicta-fav", JSON.stringify(favs));

const URL_ARASAAC = (id) => `https://static.arasaac.org/pictograms/${id}/${id}_300.png`;

// Busca EL dibujo de una palabra: preferencia → local → ARASAAC
async function buscarPicto(palabra) {
  const w = norm(palabra);
  if (!w) return { src: null };
  if (prefs[w]) return { src: prefs[w] };
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
      if (Array.isArray(d) && d.length) res = { src: URL_ARASAAC(d[0]._id) };
    } catch { /* sin internet → solo texto */ }
  }
  cache.set(w, res);
  return res;
}

// Busca VARIAS opciones de dibujo para una palabra (para el selector)
async function buscarVarias(palabra) {
  const w = norm(palabra);
  const out = [];
  if (LOCAL.has(w)) out.push(`img/pictogramas/${LOCAL.get(w)}`);
  try {
    let r = await fetch(`https://api.arasaac.org/api/pictograms/es/search/${encodeURIComponent(w)}`);
    let d = await r.json();
    if (!Array.isArray(d) || !d.length) {
      r = await fetch(`https://api.arasaac.org/api/pictograms/es/bestsearch/${encodeURIComponent(w)}`);
      d = await r.json();
    }
    (Array.isArray(d) ? d : []).slice(0, 18).forEach((p) => out.push(URL_ARASAAC(p._id)));
  } catch { /* sin internet */ }
  return out.filter((s, i) => out.indexOf(s) === i);   // sin duplicados
}

// Pinta el dibujo dentro de una celda
function pintarImagen(cont, palabra, src) {
  cont.classList.remove("cargando", "sin-picto");
  cont.innerHTML = "";
  if (src) {
    const img = new Image();
    img.alt = palabra;
    img.onerror = () => cont.classList.add("sin-picto");
    img.src = src;
    cont.appendChild(img);
  } else {
    cont.classList.add("sin-picto");
  }
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
      `<div class="picto-img cargando" role="button" tabindex="0" aria-label="Cambiar dibujo de ${palabra}"></div>` +
      `<span class="cambiar-badge" aria-hidden="true">🔄</span>` +
      `<span class="picto-txt">${palabra}</span>`;
    elResultado.appendChild(celda);

    const cont = celda.querySelector(".picto-img");
    cont.addEventListener("click", () => abrirChooser(palabra, celda));

    buscarPicto(palabra).then((res) => pintarImagen(cont, palabra, res.src));
  });
}

// Leer la frase completa en voz alta
function leerFrase() {
  const texto = (elInput.value || "").trim();
  if (texto) decirEnVozAlta(texto, { rate: 0.9 });
}

// ============================================================================
//  SELECTOR DE DIBUJO  ·  varias opciones cuando una palabra tiene varias
// ============================================================================
const overlayChooser = $("#overlay-chooser");
const chooserGrid    = $("#chooser-grid");

async function abrirChooser(palabra, celda) {
  const w = norm(palabra);
  overlayFavs.hidden = true;
  $("#chooser-palabra").textContent = palabra;
  chooserGrid.innerHTML = `<p class="dicta-ayuda">Buscando dibujos…</p>`;
  overlayChooser.hidden = false;

  const cont = celda.querySelector(".picto-img");
  const opciones = await buscarVarias(palabra);
  chooserGrid.innerHTML = "";

  // Botón "automático" (olvida la preferencia y vuelve a elegir solo)
  const auto = document.createElement("button");
  auto.className = "opcion-picto opcion-auto";
  auto.innerHTML = "🔄<br>Automático";
  auto.onclick = () => {
    delete prefs[w]; guardarPrefs(); cache.delete(w);
    buscarPicto(palabra).then((res) => pintarImagen(cont, palabra, res.src));
    overlayChooser.hidden = true;
  };
  chooserGrid.appendChild(auto);

  if (!opciones.length) {
    const p = document.createElement("p");
    p.className = "dicta-ayuda";
    p.textContent = navigator.onLine ? "No hay más dibujos para esta palabra." : "Necesitas internet para buscar más dibujos.";
    chooserGrid.appendChild(p);
    return;
  }

  opciones.forEach((src) => {
    const b = document.createElement("button");
    b.className = "opcion-picto";
    const img = new Image();
    img.alt = palabra;
    img.onerror = () => b.remove();
    img.src = src;
    b.appendChild(img);
    b.onclick = () => {
      prefs[w] = src; guardarPrefs(); cache.set(w, { src });
      pintarImagen(cont, palabra, src);
      overlayChooser.hidden = true;
    };
    chooserGrid.appendChild(b);
  });
}

// ============================================================================
//  FRASES FAVORITAS
// ============================================================================
const overlayFavs = $("#overlay-favs");
const favsLista   = $("#favs-lista");

function guardarFraseActual() {
  const t = (elInput.value || "").trim();
  if (!t) { elAviso.textContent = "Escribe una frase para guardarla."; return; }
  if (!favs.includes(t)) { favs.unshift(t); guardarFavs(); }
  elAviso.textContent = "Guardada en favoritas ⭐";
  setTimeout(() => { elAviso.textContent = ""; }, 1800);
}

function abrirFavs() {
  overlayChooser.hidden = true;
  favsLista.innerHTML = "";
  if (!favs.length) {
    favsLista.innerHTML = `<p class="dicta-ayuda">Aún no tienes frases guardadas.<br>Escribe una y toca <b>⭐ Guardar</b>.</p>`;
  } else {
    favs.forEach((frase, i) => {
      const fila = document.createElement("div");
      fila.className = "fav-item";
      const btn = document.createElement("button");
      btn.className = "fav-texto";
      btn.textContent = frase;
      btn.onclick = () => { elInput.value = frase; overlayFavs.hidden = true; convertir(); };
      const del = document.createElement("button");
      del.className = "fav-borrar";
      del.setAttribute("aria-label", "Borrar frase");
      del.textContent = "✕";
      del.onclick = () => { favs.splice(i, 1); guardarFavs(); abrirFavs(); };
      fila.appendChild(btn); fila.appendChild(del);
      favsLista.appendChild(fila);
    });
  }
  overlayFavs.hidden = false;
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
$("#dicta-guardar").addEventListener("click", guardarFraseActual);
$("#dicta-favs").addEventListener("click", abrirFavs);
$("#dicta-borrar").addEventListener("click", () => {
  elInput.value = "";
  elAviso.textContent = "";
  elResultado.innerHTML = `<p class="dicta-ayuda">Escribe o di una frase y la verás en dibujos.</p>`;
  elInput.focus();
});
elInput.addEventListener("keydown", (e) => { if (e.key === "Enter") convertir(); });

// Cerrar overlays
$("#chooser-cerrar").addEventListener("click", () => { overlayChooser.hidden = true; });
$("#favs-cerrar").addEventListener("click", () => { overlayFavs.hidden = true; });
overlayChooser.addEventListener("click", (e) => { if (e.target === overlayChooser) overlayChooser.hidden = true; });
overlayFavs.addEventListener("click", (e) => { if (e.target === overlayFavs) overlayFavs.hidden = true; });

// Mostrar/ocultar el texto bajo los dibujos
$("#boton-texto").addEventListener("click", () => {
  document.body.classList.toggle("ocultar-texto");
});
