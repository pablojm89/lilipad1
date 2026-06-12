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
  diversion: false,                // modo "diversión máxima" (globo + micro siempre activo)
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

// ---- Motor de escucha CONTINUO ---------------------------------------------
// Una vez encendido, sigue escuchando solo (aunque falle) sin tener que volver
// a pulsar el micro. En "diversión máxima" se enciende automáticamente.
let escuchando = false;       // ¿el motor de escucha está encendido?
let intentosVacios = 0;       // silencios seguidos (para no escuchar eternamente)

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
  elEstado.textContent = ajustes.diversion
    ? "¡Di la palabra y explota el globo! 🎈"
    : reconocedor.soportado
      ? "Toca el micro y di la palabra"
      : "Toca ✓ cuando lo diga bien";
  elTarjeta.classList.remove("acierto", "reventando");
  actualizarEstrellas();
  // Si el micro estaba escuchando, sigue escuchando la palabra nueva (sin re-pulsar)
  if (puedeEscuchar()) escucharUnaVez();
}

function actualizarEstrellas() {
  elEstrellas.textContent =
    "⭐".repeat(aciertos) + "·".repeat(Math.max(0, mazo.length - aciertos));
}

// ============================================================================
//  ¡ACIERTO!  ·  celebración y avance
// ============================================================================
function acertar() {
  reconocedor.parar();           // detiene la captación actual (el motor sigue "encendido")
  elMic.classList.remove("pista", "escuchando");
  aciertos++;
  contadorRecompensa++;
  actualizarEstrellas();
  celebrar();
  decirEnVozAlta("¡Muy bien!");

  // MODO DIVERSIÓN: el propio globo (la tarjeta) explota y aparece otro
  if (ajustes.diversion) {
    elTarjeta.classList.add("reventando");
    setTimeout(siguiente, 1200);
    return;
  }

  elTarjeta.classList.add("acierto");
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

// ============================================================================
//  MOTOR DE ESCUCHA CONTINUO
//  Una vez encendido, escucha una y otra vez SOLO (aunque falle) sin que ella
//  tenga que volver a pulsar. Si acierta, avanza; si falla, le da el modelo de
//  voz y vuelve a escuchar. Se apaga al volver a pulsar el micro.
// ============================================================================

// ¿Puede (re)escuchar ahora? Sí si el motor está encendido y el panel cerrado.
function puedeEscuchar() {
  return escuchando && !panel.classList.contains("abierto");
}

// Pulsar el micro: enciende o apaga el motor (interruptor)
function alPulsarMic() {
  if (escuchando) { pararMotorEscucha(); return; }
  if (!reconocedor.soportado) {
    elEstado.textContent = "Este navegador no oye. Usa Chrome o el botón ✓";
    return;
  }
  escuchando = true;
  intentosVacios = 0;
  escucharUnaVez();
}

function pararMotorEscucha() {
  escuchando = false;
  reconocedor.parar();
  elMic.classList.remove("escuchando");
  if (!ajustes.diversion) elEstado.textContent = "Toca el micro y di la palabra";
}

// Una captación de voz. Al terminar, decide si sigue escuchando.
function escucharUnaVez() {
  if (!puedeEscuchar()) return;
  const p = palabraActual();
  if (!p) return;
  elMic.classList.remove("pista");
  elMic.classList.add("escuchando");
  if (!ajustes.diversion) elEstado.textContent = "Te escucho… 👂";

  reconocedor.escuchar({
    onResultado: (alternativas) => {
      intentosVacios = 0;
      if (evaluar(alternativas, p, ajustes.nivel)) acertar();   // acertar gestiona el avance
      else reintentar(p);                                       // da el modelo y reescucha
    },
    onError: (motivo) => {
      if (motivo === "aborted") return;            // lo paramos a propósito: no hacer nada
      if (motivo === "not-allowed" || motivo === "service-not-allowed") {
        pararMotorEscucha();
        elEstado.textContent = "Da permiso al micrófono 🎤";
        return;
      }
      // no-speech (silencio) u otros fallos: reintenta solo, con un tope para no
      // escuchar eternamente. Al agotarlo, deja el micro listo para un toque.
      intentosVacios++;
      const limite = ajustes.diversion ? 12 : 4;   // en diversión aguanta más
      if (puedeEscuchar() && intentosVacios <= limite) {
        setTimeout(escucharUnaVez, 250);
      } else {
        escuchando = false;
        elMic.classList.remove("escuchando");
        elEstado.textContent = "Toca el micro para seguir 🎤";
      }
    },
    onFin: () => { elMic.classList.remove("escuchando"); },
  });
}

// Cuando falla: la app pronuncia el modelo despacio y, al terminar, vuelve a
// escuchar SOLA (la pista honesta es el propio micro escuchando de nuevo).
function reintentar(p) {
  elMic.classList.remove("escuchando");
  if (!ajustes.diversion) elEstado.textContent = "Casi… escucha 👂";
  elTarjeta.classList.add("anima-pista");
  setTimeout(() => elTarjeta.classList.remove("anima-pista"), 700);
  decirEnVozAlta(`Escucha. ${p.palabra}.`, {
    rate: 0.7,
    alFinal: () => { if (puedeEscuchar()) escucharUnaVez(); },
  });
}

// ============================================================================
//  MODO DIVERSIÓN MÁXIMA
//  La palabra/pictograma flota como un globo y el micro está siempre activo.
// ============================================================================
function aplicarModoDiversion() {
  document.body.classList.toggle("modo-diversion", !!ajustes.diversion);
  if (ajustes.diversion) {
    if (!escuchando && reconocedor.soportado) { escuchando = true; intentosVacios = 0; }
    elEstado.textContent = "¡Di la palabra y explota el globo! 🎈";
    if (puedeEscuchar()) escucharUnaVez();
  } else {
    pararMotorEscucha();
  }
}

// ============================================================================
//  PANEL DEL ADULTO
// ============================================================================
const panel = $("#panel");
function abrirPanel()  {
  panel.classList.add("abierto");
  reconocedor.parar();            // pausa la escucha mientras el adulto configura
  construirPanel();
}
function cerrarPanel() {
  panel.classList.remove("abierto");
  if (puedeEscuchar()) escucharUnaVez();  // reanuda si el motor seguía encendido
}

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
  // --- DIVERSIÓN MÁXIMA (interruptor) ---
  const cdiv = $("#opciones-diversion");
  cdiv.innerHTML = "";
  cdiv.appendChild(chip({
    activo: !!ajustes.diversion,
    html: ajustes.diversion
      ? "🎈 Activado <small>el globo flota y el micro está siempre encendido</small>"
      : "🎈 Activar <small>el globo flota y el micro escucha solo</small>",
    onclick: () => {
      ajustes.diversion = !ajustes.diversion;
      guardarAjustes();
      construirPanel();
      aplicarModoDiversion();
      mostrarPalabra(); // refresca el texto de ayuda de la pantalla
    },
  }));

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
  elMic.addEventListener("click", alPulsarMic);
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
  aplicarModoDiversion();   // respeta el ajuste de diversión guardado
}

document.addEventListener("DOMContentLoaded", iniciar);
