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
  fonemas: ["S"],                  // sonidos activos (en modo "fonema")
  nivel: 1,
  diversion: false,                // modo "diversión máxima" (globo + micro siempre activo)
  imagen: "siempre",               // "siempre" | "lectura" | "entreno"
  inteligente: true,               // práctica inteligente (mezcla fáciles + 1 que cuesta)
  sonidoModelo: true,              // en modo "Por sonidos", la app dice el sonido (ssss) de modelo
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

// ---- Progreso por palabra (qué domina y qué le cuesta a Daniela) -----------
// Se guarda en el navegador. Alimenta la "práctica inteligente" y el "entreno".
function cargarProgreso() {
  try { return JSON.parse(localStorage.getItem("progreso") || "{}"); }
  catch { return {}; }
}
let progreso = cargarProgreso();
let fallosEstaPalabra = 0;        // fallos en la presentación actual
let guardarProgresoPdte = null;
function guardarProgreso() {
  clearTimeout(guardarProgresoPdte);
  guardarProgresoPdte = setTimeout(
    () => localStorage.setItem("progreso", JSON.stringify(progreso)), 400);
}

const DOM_MAX = 4;            // nivel de dominio máximo
const UMBRAL_FACIL = 2;      // dom >= 2 → la sabe bien (es "fácil")
const UMBRAL_DOMINADA = 3;   // dom >= 3 → dominada (en "entreno" se oculta el dibujo)

function regProg(palabra) {
  if (!progreso[palabra]) progreso[palabra] = { ok: 0, ko: 0, dom: 0 };
  return progreso[palabra];
}
function nivelDom(p) { return (progreso[p.palabra] && progreso[p.palabra].dom) || 0; }

function marcarAcierto(p) {
  const r = regProg(p.palabra);
  r.ok++;
  if (fallosEstaPalabra === 0) r.dom = Math.min(DOM_MAX, r.dom + 1); // acierto limpio
  guardarProgreso();
}
function marcarFallo(p) {
  const r = regProg(p.palabra);
  r.ko++;
  r.dom = Math.max(0, r.dom - 1);
  fallosEstaPalabra++;
  guardarProgreso();
}

// ---- Fonemas (sonidos) -----------------------------------------------------
// Deriva el sonido inicial de la palabra (con las reglas del español).
function fonemaInicial(palabra) {
  const w = palabra.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const c = w[0], n = w[1];
  if ("aeiou".includes(c)) return null;     // empieza por vocal → sin fonema consonántico
  if (c === "h") return null;               // h muda
  if (c === "c") {
    if (n === "h") return "CH";
    if (n === "e" || n === "i") return "Z"; // ce, ci → /θ/
    return "K";                             // ca, co, cu, cl, cr
  }
  if (c === "q") return "K";
  if (c === "g") return (n === "e" || n === "i") ? "J" : "G";
  if (c === "v") return "B";                // suena /b/
  if (c === "z") return "Z";
  if (c === "y") return "Y";
  return c.toUpperCase();                    // p, m, s, l, t, f, b, d, n, r, j, ñ...
}
function fonemaDe(p) { return p.fonema || fonemaInicial(p.palabra); }

// Cómo suena cada fonema (pista para el adulto y la niña)
const FONEMAS_INFO = {
  S: { nombre: "S", pista: "sssss, como una serpiente" },
  P: { nombre: "P", pista: "p-p-p, explota con los labios" },
  M: { nombre: "M", pista: "mmmm, rico rico" },
  L: { nombre: "L", pista: "lll, lengua arriba" },
  T: { nombre: "T", pista: "t-t-t" },
  F: { nombre: "F", pista: "fffff, soplando" },
  B: { nombre: "B", pista: "b-b-b, con los labios" },
  G: { nombre: "G", pista: "g-g-g, en la garganta" },
  K: { nombre: "K (c/qu)", pista: "k-k-k (ca, co, cu)" },
  D: { nombre: "D", pista: "d-d-d, lengua en los dientes" },
  N: { nombre: "N", pista: "nnnn" },
  R: { nombre: "R", pista: "rrrr, como un motor" },
  Z: { nombre: "Z/C", pista: "zzz (za, ce, ci)" },
  J: { nombre: "J/G", pista: "jjj, en la garganta" },
  CH: { nombre: "CH", pista: "ch-ch, como el tren" },
  Y: { nombre: "Y/LL", pista: "y, como llave" },
};
// Orden preferido en el panel
const ORDEN_FONEMAS = ["S", "P", "M", "L", "T", "F", "B", "G", "K", "D", "N", "R", "Z", "J", "CH", "Y"];

// Cómo lo pronuncia la app como MODELO (alargado para las continuas; repetido
// para las explosivas). Es una aproximación para el lector de voz.
const FONEMA_SONIDO = {
  S: "ssssss", F: "ffffff", M: "mmmmm", N: "nnnnn", L: "lllll", R: "rrrrrr",
  P: "p p p", T: "t t t", K: "k k k", B: "b b b", D: "d d d", G: "g g g",
  Z: "zzzzz", J: "jjjjj", CH: "ch ch ch", Y: "yyyy",
};
function sonidoDe(p) {
  const f = fonemaDe(p);
  return FONEMA_SONIDO[f] || (f ? f.toLowerCase() : "");
}

// Fonemas que de verdad tienen palabras (al menos 2) en todo el juego
function fonemasDisponibles() {
  const cuenta = {};
  PALABRAS.forEach((p) => { const f = fonemaDe(p); if (f) cuenta[f] = (cuenta[f] || 0) + 1; });
  return ORDEN_FONEMAS.filter((f) => (cuenta[f] || 0) >= 2);
}

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
  if (ajustes.modo === "fonema") {
    return PALABRAS.filter((p) => ajustes.fonemas.includes(fonemaDe(p)));
  }
  // modo "silabas": por nº de sílabas + tipo de sílaba
  return PALABRAS.filter(
    (p) => ajustes.silabas.includes(p.silabas) && ajustes.tipos.includes(p.tipo)
  );
}

// PRÁCTICA INTELIGENTE: ordena la ronda mezclando ~3 que domina + 1 que cuesta,
// para que sea poco frustrante pero practique igualmente las difíciles.
function construirSecuencia(lista) {
  if (!ajustes.inteligente) return barajar(lista);
  const faciles = barajar(lista.filter((p) => nivelDom(p) >= UMBRAL_FACIL));
  const dificiles = barajar(lista.filter((p) => nivelDom(p) < UMBRAL_FACIL));
  // Si todas son fáciles o todas difíciles (p. ej. al empezar), barajar normal
  if (faciles.length === 0 || dificiles.length === 0) return barajar(lista);
  const sec = [];
  let fi = 0, di = 0;
  while (fi < faciles.length || di < dificiles.length) {
    for (let k = 0; k < 3 && fi < faciles.length; k++) sec.push(faciles[fi++]);
    if (di < dificiles.length) sec.push(dificiles[di++]);
  }
  return sec;
}

function prepararMazo() {
  mazo = construirSecuencia(palabrasFiltradas());
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
  fallosEstaPalabra = 0;   // empieza limpia esta presentación
  elPicto.src = `img/pictogramas/${p.pictograma}`;
  elPicto.alt = p.palabra;
  elPalabra.textContent = p.palabra;

  // ¿Mostramos el dibujo o solo la palabra (lectura)?
  let conDibujo = true;
  if (ajustes.imagen === "lectura") conDibujo = false;
  else if (ajustes.imagen === "entreno") conDibujo = nivelDom(p) < UMBRAL_DOMINADA;
  elPicto.style.display = conDibujo ? "" : "none";
  elTarjeta.classList.toggle("solo-texto", !conDibujo);

  elEstado.textContent = ajustes.diversion
    ? "¡Di la palabra y explota el globo! 🎈"
    : reconocedor.soportado
      ? "Toca el micro y di la palabra"
      : "Toca ✓ cuando lo diga bien";
  elTarjeta.classList.remove("acierto", "reventando");
  actualizarEstrellas();
  actualizarBotonSonido();

  // Sonido modelo desactivado hasta tener audios grabados (el sintetizador no produce fonemas puros).
  const reanudar = () => { if (puedeEscuchar()) escucharUnaVez(); };
  reanudar();
}

function actualizarEstrellas() {
  elEstrellas.textContent =
    "⭐".repeat(aciertos) + "·".repeat(Math.max(0, mazo.length - aciertos));
}

// Botón de la pantalla de juego para activar/desactivar el sonido modelo.
// Solo aparece en el modo "Por sonidos".
const elBotonSonido = $("#boton-sonido");
function actualizarBotonSonido() {
  // Oculto temporalmente: el sintetizador de voz dice "ese ese ese" en lugar del fonema puro.
  // Se reactivará cuando se añadan audios grabados por el adulto.
  elBotonSonido.hidden = true;
}

// ============================================================================
//  ¡ACIERTO!  ·  celebración y avance
// ============================================================================
function acertar() {
  reconocedor.parar();           // detiene la captación actual (el motor sigue "encendido")
  elMic.classList.remove("pista", "escuchando");
  const p = palabraActual();
  if (p) marcarAcierto(p);       // registra el progreso de esta palabra
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
    // Ronda terminada: rehace la secuencia (vuelve a aplicar la práctica
    // inteligente con el progreso ya actualizado). Juego sin fin, sin pantallas
    // de "fin" que puedan frustrar.
    mazo = construirSecuencia(palabrasFiltradas());
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
  marcarFallo(p);   // registra que esta palabra le ha costado
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
  { id: "fonema",    nombre: "Por sonidos", emoji: "👄" },
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
  $("#seccion-fonemas").style.display = ajustes.modo === "fonema" ? "" : "none";

  // --- SONIDOS (FONEMAS) --- solo los que tienen palabras suficientes
  const cf = $("#opciones-fonema");
  cf.innerHTML = "";
  fonemasDisponibles().forEach((f) => {
    const info = FONEMAS_INFO[f] || { nombre: f, pista: "" };
    cf.appendChild(chip({
      activo: ajustes.fonemas.includes(f),
      html: `🔊 ${info.nombre}<small>${info.pista}</small>`,
      onclick: () => { ajustes.fonemas = alternar(ajustes.fonemas, f); guardarAjustes(); construirPanel(); prepararMazo(); },
    }));
  });

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

  // --- APRENDIZAJE: con dibujo / lectura / entreno ---
  const ci = $("#opciones-imagen");
  ci.innerHTML = "";
  [
    { id: "siempre", nombre: "Con dibujo", emoji: "🖼️", ayuda: "dibujo + palabra" },
    { id: "entreno", nombre: "Entreno",    emoji: "🎓", ayuda: "quita el dibujo al dominarla" },
    { id: "lectura", nombre: "Solo leer",  emoji: "🔤", ayuda: "solo la palabra" },
  ].forEach((o) => ci.appendChild(chip({
    activo: ajustes.imagen === o.id,
    html: `${o.emoji} ${o.nombre}<small>${o.ayuda}</small>`,
    onclick: () => { ajustes.imagen = o.id; guardarAjustes(); construirPanel(); mostrarPalabra(); },
  })));

  // --- APRENDIZAJE: práctica inteligente (interruptor) ---
  const cintel = $("#opciones-inteligente");
  cintel.innerHTML = "";
  cintel.appendChild(chip({
    activo: !!ajustes.inteligente,
    html: ajustes.inteligente
      ? "🧠 Práctica inteligente: SÍ<small>mezcla varias fáciles + 1 que cuesta</small>"
      : "🧠 Práctica inteligente: NO<small>orden al azar</small>",
    onclick: () => { ajustes.inteligente = !ajustes.inteligente; guardarAjustes(); construirPanel(); prepararMazo(); },
  }));

  // --- APRENDIZAJE: qué le cuesta + reiniciar progreso ---
  const cuestan = Object.entries(progreso)
    .filter(([, r]) => r.ko > 0 && r.dom < UMBRAL_FACIL)
    .sort((a, b) => (b[1].ko - b[1].dom) - (a[1].ko - a[1].dom))
    .slice(0, 8)
    .map(([w]) => w);
  $("#palabras-cuestan").textContent = cuestan.length
    ? "Le cuestan más: " + cuestan.join(", ")
    : "Aún no hay datos de dificultad (juega un poco y aparecerán aquí).";

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

  // Botón en pantalla: activar/desactivar el sonido modelo (modo "Por sonidos")
  elBotonSonido.addEventListener("click", () => {
    ajustes.sonidoModelo = !ajustes.sonidoModelo;
    guardarAjustes();
    actualizarBotonSonido();
    if (ajustes.sonidoModelo && palabraActual()) decirEnVozAlta(sonidoDe(palabraActual()), { rate: 0.6 });
  });

  $("#boton-ajustes").addEventListener("click", abrirPanel);
  $("#cerrar-panel").addEventListener("click", cerrarPanel);

  // Reiniciar el progreso (borra qué domina / qué le cuesta)
  $("#boton-reset-progreso").addEventListener("click", () => {
    progreso = {};
    localStorage.removeItem("progreso");
    construirPanel();
    prepararMazo();
  });

  prepararMazo();
  aplicarModoDiversion();   // respeta el ajuste de diversión guardado
}

document.addEventListener("DOMContentLoaded", iniciar);
