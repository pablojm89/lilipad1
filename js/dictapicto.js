// ============================================================================
//  FRASES CON DIBUJOS  ·  estilo "Dictapicto"
//  Dices o escribes una frase → se muestra como una secuencia de pictogramas.
//  - Busca primero en nuestros pictogramas locales y, si no, en ARASAAC.
//  - Artículos/preposiciones/monosílabos se muestran en LETRAS GRANDES (sin dibujo).
//  - Si una palabra tiene varios dibujos, puedes ELEGIR cuál (se recuerda).
//  - Puedes elegir "Solo letras" para cualquier palabra (se recuerda).
//  - Puedes GUARDAR frases favoritas para reutilizarlas.
//  - Móvil en horizontal → la frase se ve grande a pantalla completa.
// ============================================================================

import { PALABRAS } from "./datos.js";
import { Reconocedor, decirEnVozAlta } from "./reconocimiento.js";

const $ = (s) => document.querySelector(s);
const elResultado = $("#dicta-resultado");
const elInput     = $("#dicta-input");
const elMic       = $("#dicta-mic");
const elAviso     = $("#dicta-aviso");

const TEXTO = "__TEXTO__";   // marca para "mostrar solo letras"

// Normaliza: minúsculas, sin acentos, solo letras
const norm = (s) => (s || "").toLowerCase().normalize("NFD")
  .replace(/[̀-ͯ]/g, "").replace(/[^a-zñ]/g, "");

// Palabras "función" que normalmente se muestran como letras, no como dibujo
// (artículos, preposiciones, conjunciones y pronombres cortos)
const FUNCION = new Set([
  "el","la","los","las","un","una","unos","unas","lo","al","del",
  "a","de","en","con","por","para","sin","sobre","entre","hasta","desde","hacia","ante","tras",
  "y","e","o","u","ni","que","si","pero","como","porque","pues",
  "me","te","se","le","les","nos","os","mi","tu","su","mis","tus","sus","yo",
]);

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

// Palabras usadas recientemente (las más recientes primero, sin repetir)
let recientes = [];
try { recientes = JSON.parse(localStorage.getItem("dicta-rec") || "[]"); } catch {}
const guardarRecientes = () => localStorage.setItem("dicta-rec", JSON.stringify(recientes));
function anotarRecientes(palabras) {
  palabras.forEach((p) => {
    const t = (p || "").trim(); const n = norm(t);
    if (!n) return;
    recientes = recientes.filter((x) => norm(x) !== n);   // quita duplicado
    recientes.unshift(t);                                 // al principio
  });
  recientes = recientes.slice(0, 40);                     // guarda las últimas 40
  guardarRecientes();
}

let huboArrastre = false;   // true justo tras arrastrar (evita abrir el selector)

const URL_ARASAAC = (id) => `https://static.arasaac.org/pictograms/${id}/${id}_300.png`;

// Decide qué mostrar para una palabra: {texto:true} | {src} | {src:null}
async function buscarPicto(palabra) {
  const w = norm(palabra);
  if (!w) return { src: null };
  if (prefs[w] === TEXTO) return { texto: true };
  if (prefs[w]) return { src: prefs[w] };
  if (FUNCION.has(w)) return { texto: true };
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

// Varias opciones de dibujo para una palabra (para el selector)
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
  return out.filter((s, i) => out.indexOf(s) === i);
}

// Pinta el contenido de una celda: dibujo o letras grandes
function pintar(celda, palabra, res) {
  const cont = celda.querySelector(".picto-img");
  cont.classList.remove("cargando", "sin-picto");
  cont.innerHTML = "";
  celda.classList.toggle("celda-letras", !!res.texto);
  if (res.texto) {
    const s = document.createElement("span");
    s.className = "picto-letras";
    s.textContent = palabra.toUpperCase();
    cont.appendChild(s);
  } else if (res.src) {
    const img = new Image();
    img.alt = palabra;
    img.onerror = () => cont.classList.add("sin-picto");
    img.src = res.src;
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
      `<span class="picto-txt">${palabra}</span>`;
    elResultado.appendChild(celda);

    // Tocar el dibujo abre el selector (salvo que se acabe de arrastrar)
    celda.querySelector(".picto-img").addEventListener("click", () => {
      if (!huboArrastre) abrirChooser(palabra, celda);
    });
    buscarPicto(palabra).then((res) => pintar(celda, palabra, res));
  });

  anotarRecientes(palabras);   // recuerda las palabras usadas
}

// Reconstruye el texto escrito a partir de las celdas que quedan (tras quitar
// una palabra), para que "Leer frase" y "Guardar" sigan coincidiendo.
function sincronizarTexto() {
  const palabras = [...elResultado.querySelectorAll(".picto-celda .picto-txt")]
    .map((s) => s.textContent.trim()).filter(Boolean);
  elInput.value = palabras.join(" ");
  if (!palabras.length) {
    elResultado.innerHTML = `<p class="dicta-ayuda">Escribe o di una frase y la verás en dibujos.</p>`;
  }
}

// Leer la frase completa en voz alta
function leerFrase() {
  const texto = (elInput.value || "").trim();
  if (texto) decirEnVozAlta(texto, { rate: 0.9 });
}

// ============================================================================
//  SELECTOR DE DIBUJO  ·  varias opciones + "Solo letras"
// ============================================================================
const overlayChooser = $("#overlay-chooser");
const chooserGrid    = $("#chooser-grid");

async function abrirChooser(palabra, celda) {
  const w = norm(palabra);
  overlayFavs.hidden = true;
  overlayRec.hidden = true;
  $("#chooser-palabra").textContent = palabra;
  chooserGrid.innerHTML = `<p class="dicta-ayuda">Buscando dibujos…</p>`;
  overlayChooser.hidden = false;

  const opciones = await buscarVarias(palabra);
  chooserGrid.innerHTML = "";

  // Opción "Automático" (olvida la preferencia)
  const auto = document.createElement("button");
  auto.className = "opcion-picto opcion-especial";
  auto.innerHTML = "🔄<br>Automático";
  auto.onclick = () => {
    delete prefs[w]; guardarPrefs(); cache.delete(w);
    buscarPicto(palabra).then((res) => pintar(celda, palabra, res));
    overlayChooser.hidden = true;
  };
  chooserGrid.appendChild(auto);

  // Opción "Solo letras" (artículos, preposiciones, monosílabos…)
  const soloTexto = document.createElement("button");
  soloTexto.className = "opcion-picto opcion-especial opcion-letras";
  soloTexto.innerHTML = `<b>${palabra.toUpperCase()}</b><br>Solo letras`;
  soloTexto.onclick = () => {
    prefs[w] = TEXTO; guardarPrefs();
    pintar(celda, palabra, { texto: true });
    overlayChooser.hidden = true;
  };
  chooserGrid.appendChild(soloTexto);

  // Opción "Quitar" (eliminar esta palabra de la frase)
  const quitar = document.createElement("button");
  quitar.className = "opcion-picto opcion-especial opcion-quitar";
  quitar.innerHTML = "🗑️<br>Quitar";
  quitar.onclick = () => {
    celda.remove();
    sincronizarTexto();
    overlayChooser.hidden = true;
  };
  chooserGrid.appendChild(quitar);

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
      pintar(celda, palabra, { src });
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
  overlayRec.hidden = true;
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

// ============================================================================
//  PALABRAS RECIENTES  ·  tocar una la añade a la frase
// ============================================================================
const overlayRec = $("#overlay-recientes");
const recLista   = $("#rec-lista");

function abrirRecientes() {
  overlayChooser.hidden = true;
  overlayFavs.hidden = true;
  recLista.innerHTML = "";
  if (!recientes.length) {
    recLista.innerHTML = `<p class="dicta-ayuda">Aún no hay palabras recientes.<br>Crea alguna frase y aparecerán aquí.</p>`;
  } else {
    recientes.forEach((palabra) => {
      const b = document.createElement("button");
      b.className = "rec-chip";
      b.textContent = palabra;
      b.onclick = () => {
        elInput.value = ((elInput.value || "").trim() + " " + palabra).trim();
        overlayRec.hidden = true;
        convertir();
      };
      recLista.appendChild(b);
    });
  }
  overlayRec.hidden = false;
}

// ============================================================================
//  ARRASTRAR PARA REORDENAR  ·  mueve los dibujos para cambiar el orden
// ============================================================================
let arrastrando = null, movido = false, arrX = 0, arrY = 0;

function celdaBajoPunto(x, y, excepto) {
  for (const c of elResultado.querySelectorAll(".picto-celda")) {
    if (c === excepto) continue;
    const r = c.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return c;
  }
  return null;
}

elResultado.addEventListener("pointerdown", (e) => {
  const celda = e.target.closest(".picto-celda");
  if (!celda) return;
  arrastrando = celda; movido = false; arrX = e.clientX; arrY = e.clientY;
  try { celda.setPointerCapture(e.pointerId); } catch {}
});

elResultado.addEventListener("pointermove", (e) => {
  if (!arrastrando) return;
  if (!movido) {
    if (Math.hypot(e.clientX - arrX, e.clientY - arrY) < 10) return;  // umbral
    movido = true;
    arrastrando.classList.add("arrastrando");
  }
  const obj = celdaBajoPunto(e.clientX, e.clientY, arrastrando);
  if (obj) {
    const r = obj.getBoundingClientRect();
    const despues = e.clientX > r.left + r.width / 2;
    elResultado.insertBefore(arrastrando, despues ? obj.nextSibling : obj);
  }
});

function finArrastre(e) {
  if (!arrastrando) return;
  const seMovio = movido;
  arrastrando.classList.remove("arrastrando");
  try { arrastrando.releasePointerCapture(e.pointerId); } catch {}
  arrastrando = null; movido = false;
  if (seMovio) {
    huboArrastre = true;                          // que el clic no abra el selector
    setTimeout(() => { huboArrastre = false; }, 60);
    sincronizarTexto();                           // guarda el nuevo orden en el texto
  }
}
elResultado.addEventListener("pointerup", finArrastre);
elResultado.addEventListener("pointercancel", finArrastre);

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

$("#dicta-rec").addEventListener("click", abrirRecientes);
$("#chooser-cerrar").addEventListener("click", () => { overlayChooser.hidden = true; });
$("#favs-cerrar").addEventListener("click", () => { overlayFavs.hidden = true; });
$("#rec-cerrar").addEventListener("click", () => { overlayRec.hidden = true; });
overlayChooser.addEventListener("click", (e) => { if (e.target === overlayChooser) overlayChooser.hidden = true; });
overlayFavs.addEventListener("click", (e) => { if (e.target === overlayFavs) overlayFavs.hidden = true; });
overlayRec.addEventListener("click", (e) => { if (e.target === overlayRec) overlayRec.hidden = true; });

// Mostrar/ocultar el texto bajo los dibujos
$("#boton-texto").addEventListener("click", () => {
  document.body.classList.toggle("ocultar-texto");
});
