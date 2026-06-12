// ============================================================================
//  JUEGO DE PRONUNCIACIÓN  ·  lógica principal
// ============================================================================

import { PALABRAS, TIPOS } from "./datos.js";
import { Reconocedor, evaluar, decirEnVozAlta, NIVELES } from "./reconocimiento.js";

// ---- Estado guardado (el adulto lo configura; se recuerda entre sesiones) --
const AJUSTES_DEFECTO = { tipos: ["directa", "trabada"], nivel: 1 };
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

function prepararMazo() {
  const filtradas = PALABRAS.filter((p) => ajustes.tipos.includes(p.tipo));
  mazo = barajar(filtradas);
  indice = 0;
  aciertos = 0;
  if (mazo.length === 0) {
    elPalabra.textContent = "—";
    elEstado.textContent = "Elige un tipo de sílaba en ⚙️";
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

function construirPanel() {
  // Botones de TIPO de sílaba (selección múltiple)
  const cont = $("#opciones-tipo");
  cont.innerHTML = "";
  TIPOS.forEach((t) => {
    const hay = PALABRAS.some((p) => p.tipo === t.id);
    const b = document.createElement("button");
    b.className = "chip" + (ajustes.tipos.includes(t.id) ? " activo" : "");
    b.disabled = !hay;
    b.innerHTML = `${t.emoji} ${t.nombre}` + (hay ? "" : " <small>(próximamente)</small>");
    b.onclick = () => {
      if (ajustes.tipos.includes(t.id)) ajustes.tipos = ajustes.tipos.filter((x) => x !== t.id);
      else ajustes.tipos.push(t.id);
      if (ajustes.tipos.length === 0) ajustes.tipos = [t.id]; // nunca vacío
      guardarAjustes(); construirPanel(); prepararMazo();
    };
    cont.appendChild(b);
  });

  // Botones de NIVEL de voz
  const cont2 = $("#opciones-nivel");
  cont2.innerHTML = "";
  NIVELES.forEach((n) => {
    const b = document.createElement("button");
    b.className = "chip" + (ajustes.nivel === n.id ? " activo" : "");
    b.innerHTML = `${n.emoji} ${n.nombre}<small>${n.ayuda}</small>`;
    b.onclick = () => { ajustes.nivel = n.id; guardarAjustes(); construirPanel(); };
    cont2.appendChild(b);
  });

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
