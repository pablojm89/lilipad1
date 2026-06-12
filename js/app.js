// ============================================================================
//  JUEGO DE PRONUNCIACIÓN  ·  lógica principal
// ============================================================================

import { PALABRAS, TIPOS, SILABAS, CATEGORIAS } from "./datos.js";
import { Reconocedor, evaluar, decirEnVozAlta, NIVELES } from "./reconocimiento.js";

// ---- Estado guardado (el adulto lo configura; se recuerda entre sesiones) --
const AJUSTES_DEFECTO = {
  modo: "silabas",                 // "silabas" | "categoria"
  silabas: [1],                    // nº de sílabas activos (en modo "silabas")
  tipos: ["directa", "trabada"],   // tipos activos (en modo "silabas")
  categorias: ["animales"],        // campos activos (en modo "categoria")
  nivel: 1,
};
function cargarAjustes() {
  try { return { ...AJUSTES_DEFECTO, ...JSON.parse(localStorage.getItem("ajustes") || "{}") }; }
  catch { return { ...AJUSTES_DEFECTO }; }
}
function guardarAjustes() { localStorage.setItem("ajustes", JSON.stringify(ajustes)); }

let ajustes = cargarAjustes();
let mazo = [];          // palabras de esta ronda (barajadas)
let indice = 0;         // posición en el mazo
let aciertos = 0;       // estrellas conseguidas en la ronda
let contadorRecompensa = 0;       // aciertos acumulados hacia el globo
const META_RECOMPENSA = 5;        // cada 5 aciertos (no hace falta racha) → globo
const reconocedor = new Reconocedor();

// ---- Atajos al DOM ---------------------------------------------------------
const $ = (sel) => document.querySelector(sel);
const elPicto   = $("#pictograma");
const elPalabra = $("#palabra");
const elMic     = $("#boton-mic");
const elEstado  = $("#estado");
const elEstrellas = $("#estrellas");
const elFeedback = $("#feedback");
const elTarjeta = $("#tarjeta");

// ============================================================================
//  PREPARAR LA RONDA
// ============================================================================
function barajar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Filtra las palabras según el modo de juego elegido por el adulto
function palabrasFiltradas() {
  if (ajustes.modo === "categoria") {
    return PALABRAS.filter((p) => ajustes.categorias.includes(p.categoria));
  }
  // modo "silabas": por nº de sílabas + tipo de sílaba
  return PALABRAS.filter(
    (p) => ajustes.silabas.includes(p.silabas) && ajustes.tipos.includes(p.tipo)
  );
}

function prepararMazo() {
  mazo = barajar(palabrasFiltradas());
  indice = 0;
  aciertos = 0;
  if (mazo.length === 0) {
    elPalabra.textContent = "—";
    elEstado.textContent = "Elige opciones en ⚙️";
    return;
  }
  mostrarPalabra();
}

function palabraActual() { return mazo[indice]; }

function mostrarPalabra() {
  const p = palabraActual();
  if (!p) return;
  elPicto.src = `img/pictogramas/${p.pictograma}`;
  elPicto.alt = p.palabra;
  elPalabra.textContent = p.palabra;
  elEstado.textContent = reconocedor.soportado
    ? "Toca el micro y di la palabra"
    : "Toca ✓ cuando lo diga bien";
  elTarjeta.classList.remove("acierto");
  actualizarEstrellas();
}

function actualizarEstrellas() {
  elEstrellas.textContent =
    "⭐".repeat(aciertos) + "·".repeat(Math.max(0, mazo.length - aciertos));
}

// ============================================================================
//  ¡ACIERTO!  ·  celebración y avance
// ============================================================================
function acertar() {
  reconocedor.parar();
  elMic.classList.remove("pista");
  aciertos++;
  contadorRecompensa++;
  actualizarEstrellas();
  elTarjeta.classList.add("acierto");
  celebrar();
  decirEnVozAlta("¡Muy bien!");

  // Cada 5 aciertos (acumulados, sin necesidad de racha) → recompensa del globo
  if (contadorRecompensa >= META_RECOMPENSA) {
    contadorRecompensa = 0;
    setTimeout(lanzarGlobo, 1500);
  } else {
    setTimeout(siguiente, 1700);
  }
}

function celebrar() {
  elFeedback.textContent = ["🎉", "🌟", "👏", "💖", "🥳"][Math.floor(Math.random() * 5)];
  elFeedback.classList.add("mostrar");
  setTimeout(() => elFeedback.classList.remove("mostrar"), 1500);
}

// ============================================================================
//  RECOMPENSA GRANDE  ·  un globo vuela por la pantalla y hay que explotarlo
// ============================================================================
const capaGlobo = $("#globo-capa");
const globoVuelo = $("#globo-vuelo");
const elGlobo = $("#globo");
let globoActivo = false;

function lanzarGlobo() {
  globoActivo = true;
  capaGlobo.classList.add("activa");
  capaGlobo.classList.remove("explotada");
  elGlobo.textContent = "🎈";
  elGlobo.classList.remove("explotando");
  // Posición horizontal de partida aleatoria, para que "vuele" distinto cada vez
  globoVuelo.style.setProperty("--inicio-x", (10 + Math.random() * 70) + "vw");
  globoVuelo.style.setProperty("--fin-x", (10 + Math.random() * 70) + "vw");
  decirEnVozAlta("¡Premio! Explota el globo", { rate: 0.9 });
}

function explotarGlobo() {
  if (!globoActivo) return;
  globoActivo = false;
  capaGlobo.classList.add("explotada");   // congela el vuelo en su sitio
  elGlobo.textContent = "💥";
  elGlobo.classList.add("explotando");
  decirEnVozAlta("¡Bravo!", { pitch: 1.3 });
  // Lluvia de confeti
  elFeedback.textContent = "🎊";
  elFeedback.classList.add("mostrar");
  setTimeout(() => elFeedback.classList.remove("mostrar"), 1400);
  setTimeout(() => {
    capaGlobo.classList.remove("activa");
    siguiente();
  }, 1100);
}

function siguiente() {
  indice++;
  if (indice >= mazo.length) {
    // Ronda terminada: barajar de nuevo y seguir (juego sin fin, sin pantallas
    // de "fin" que puedan frustrar). Reinicia estrellas.
    mazo = barajar(mazo);
    indice = 0;
    aciertos = 0;
  }
  mostrarPalabra();
}

// ----------------------------------------------------------------------------
//  REINTENTO CON AYUDA  ·  cuando no lo dice bien, la app le da un modelo claro
//  ("Escucha: SOL… ¡otra vez!") y hace parpadear el micro para invitarla.
// ----------------------------------------------------------------------------
function animarReintento(p) {
  elEstado.textContent = "Escucha… 👂 ¡y otra vez! 💪";
  elTarjeta.classList.add("anima-pista");
  setTimeout(() => elTarjeta.classList.remove("anima-pista"), 700);
  // La app pronuncia "Escucha. PALABRA. Otra vez." despacio, y al terminar
  // hace parpadear el micro para que ella sepa que le toca hablar.
  decirEnVozAlta(`Escucha. ${p.palabra}. Otra vez.`, {
    rate: 0.7,
    alFinal: () => {
      elMic.classList.add("pista");
      setTimeout(() => elMic.classList.remove("pista"), 3000);
    },
  });
}

// ============================================================================
//  ESCUCHAR
// ============================================================================
function escuchar() {
  const p = palabraActual();
  if (!p) return;
  if (!reconocedor.soportado) {
    elEstado.textContent = "Este navegador no oye. Usa Chrome o el botón ✓";
    return;
  }
  elMic.classList.remove("pista");
  elMic.classList.add("escuchando");
  elEstado.textContent = "Te escucho… 👂";

  reconocedor.escuchar({
    onResultado: (alternativas) => {
      const bien = evaluar(alternativas, p, ajustes.nivel);
      if (bien) {
        acertar();
      } else {
        animarReintento(p);
      }
    },
    onError: (motivo) => {
      if (motivo === "no-speech") elEstado.textContent = "No te oí… inténtalo otra vez 🙂";
      else if (motivo === "not-allowed") elEstado.textContent = "Da permiso al micrófono 🎤";
      else elEstado.textContent = "Toca el micro y di la palabra";
    },
    onFin: () => { elMic.classList.remove("escuchando"); },
  });
}

// ============================================================================
//  PANEL DEL ADULTO
// ============================================================================
const panel = $("#panel");
function abrirPanel()  { panel.classList.add("abierto"); construirPanel(); }
function cerrarPanel() { panel.classList.remove("abierto"); }

// Crea un botón "chip" reutilizable
function chip({ activo, disabled, html, onclick }) {
  const b = document.createElement("button");
  b.className = "chip" + (activo ? " activo" : "");
  b.disabled = !!disabled;
  b.innerHTML = html;
  if (onclick) b.onclick = onclick;
  return b;
}

// Alterna un valor dentro de una lista de selección múltiple (nunca la deja vacía)
function alternar(lista, valor) {
  let nueva = lista.includes(valor) ? lista.filter((x) => x !== valor) : [...lista, valor];
  return nueva.length === 0 ? [valor] : nueva;
}

const MODOS = [
  { id: "silabas",   nombre: "Por sílabas", emoji: "🔤" },
  { id: "categoria", nombre: "Por campos",  emoji: "🗂️" },
];

function construirPanel() {
  // --- MODO DE JUEGO ---
  const cm = $("#opciones-modo");
  cm.innerHTML = "";
  MODOS.forEach((m) => cm.appendChild(chip({
    activo: ajustes.modo === m.id,
    html: `${m.emoji} ${m.nombre}`,
    onclick: () => { ajustes.modo = m.id; guardarAjustes(); construirPanel(); prepararMazo(); },
  })));

  // Mostrar solo la sección del modo elegido
  $("#seccion-silabas").style.display = ajustes.modo === "silabas" ? "" : "none";
  $("#seccion-categorias").style.display = ajustes.modo === "categoria" ? "" : "none";

  // --- Nº DE SÍLABAS ---
  const cs = $("#opciones-silabas");
  cs.innerHTML = "";
  SILABAS.forEach((s) => {
    const hay = PALABRAS.some((p) => p.silabas === s.id);
    cs.appendChild(chip({
      activo: ajustes.silabas.includes(s.id),
      disabled: !hay,
      html: s.nombre + (hay ? "" : " <small>(próx.)</small>"),
      onclick: () => { ajustes.silabas = alternar(ajustes.silabas, s.id); guardarAjustes(); construirPanel(); prepararMazo(); },
    }));
  });

  // --- TIPO DE SÍLABA --- (disponibilidad según las sílabas elegidas)
  const ct = $("#opciones-tipo");
  ct.innerHTML = "";
  TIPOS.forEach((t) => {
    const hay = PALABRAS.some((p) => p.tipo === t.id && ajustes.silabas.includes(p.silabas));
    ct.appendChild(chip({
      activo: ajustes.tipos.includes(t.id) && hay,
      disabled: !hay,
      html: `${t.emoji} ${t.nombre}` + (hay ? "" : " <small>(no hay)</small>"),
      onclick: () => { ajustes.tipos = alternar(ajustes.tipos, t.id); guardarAjustes(); construirPanel(); prepararMazo(); },
    }));
  });

  // --- CAMPOS SEMÁNTICOS --- (solo categorías que tienen palabras)
  const cc = $("#opciones-categoria");
  cc.innerHTML = "";
  CATEGORIAS.forEach((c) => {
    if (!PALABRAS.some((p) => p.categoria === c.id)) return;
    cc.appendChild(chip({
      activo: ajustes.categorias.includes(c.id),
      html: `${c.emoji} ${c.nombre}`,
      onclick: () => { ajustes.categorias = alternar(ajustes.categorias, c.id); guardarAjustes(); construirPanel(); prepararMazo(); },
    }));
  });

  // --- NIVEL DE VOZ ---
  const cn = $("#opciones-nivel");
  cn.innerHTML = "";
  NIVELES.forEach((n) => cn.appendChild(chip({
    activo: ajustes.nivel === n.id,
    html: `${n.emoji} ${n.nombre}<small>${n.ayuda}</small>`,
    onclick: () => { ajustes.nivel = n.id; guardarAjustes(); construirPanel(); },
  })));

  // Aviso sobre el micrófono
  $("#aviso-micro").textContent = reconocedor.soportado
    ? "🎤 Reconocimiento de voz disponible en este dispositivo."
    : "⚠️ Este navegador no reconoce voz (típico en iPhone). Usa el botón verde ✓ para validar tú.";
}

// ============================================================================
//  ARRANQUE  ·  conectar botones
// ============================================================================
function iniciar() {
  elMic.addEventListener("click", escuchar);
  // Tocar el pictograma también suena la palabra (además del botón 🔊)
  elPicto.addEventListener("click", () => decirEnVozAlta(palabraActual()?.palabra || ""));
  // Explotar el globo de recompensa
  elGlobo.addEventListener("click", explotarGlobo);
  capaGlobo.addEventListener("click", explotarGlobo);

  $("#boton-correcto").addEventListener("click", acertar);      // ✓ del adulto
  $("#boton-saltar").addEventListener("click", siguiente);      // ⏭️ saltar
  $("#boton-oir").addEventListener("click", () => decirEnVozAlta(palabraActual()?.palabra || ""));

  $("#boton-ajustes").addEventListener("click", abrirPanel);
  $("#cerrar-panel").addEventListener("click", cerrarPanel);

  prepararMazo();
}

document.addEventListener("DOMContentLoaded", iniciar);
