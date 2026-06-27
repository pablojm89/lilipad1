// ============================================================================
//  RECONOCIMIENTO DE VOZ  ·  con niveles de dificultad (tolerancia)
// ============================================================================
//
//  Usa la Web Speech API del navegador (SpeechRecognition).
//  - Funciona muy bien en CHROME para Android.
//  - En iPhone (Safari) el soporte es más limitado: si no está disponible,
//    la app sigue funcionando con el botón verde "¡Bien!" que pulsa el adulto.
//
//  La idea clave: NO frustrar a la niña. Hay 4 niveles de exigencia.
// ============================================================================

// --- Normaliza texto: minúsculas, sin acentos, solo letras ------------------
export function normaliza(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // quita acentos
    .replace(/[^a-zñ]/g, "");                          // solo letras
}

// --- Distancia de Levenshtein (cuántos cambios separan dos palabras) --------
export function distancia(a, b) {
  a = a || ""; b = b || "";
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const fila = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = fila[0];
    fila[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = fila[j];
      fila[j] = Math.min(
        fila[j] + 1,        // borrar
        fila[j - 1] + 1,    // insertar
        prev + (a[i - 1] === b[j - 1] ? 0 : 1) // sustituir
      );
      prev = tmp;
    }
  }
  return fila[n];
}

// ============================================================================
//  NIVELES DE DIFICULTAD
//    0 · Solo hablar : vale con que diga ALGO (máxima confianza para ella)
//    1 · Fácil       : se parece bastante (tolera bastantes diferencias)
//    2 · Medio       : se parece mucho (1 diferencia como máximo)
//    3 · Difícil     : tiene que decirlo bien (exacto)
// ============================================================================
export const NIVELES = [
  { id: 0, nombre: "Solo hablar", emoji: "🗣️", ayuda: "Vale con que diga algo" },
  { id: 1, nombre: "Fácil",       emoji: "🙂", ayuda: "Se parece bastante" },
  { id: 2, nombre: "Medio",       emoji: "😀", ayuda: "Se parece mucho" },
  { id: 3, nombre: "Difícil",     emoji: "🤩", ayuda: "Lo dice bien" },
];

// --- ¿Una cosa dicha coincide con la palabra objetivo, según el nivel? ------
function coincideUna(dichoNorm, objetivoNorm, nivel) {
  if (!dichoNorm) return false;
  const d = distancia(dichoNorm, objetivoNorm);
  // Tolerancia proporcional a la longitud de la palabra
  const largo = objetivoNorm.length;
  switch (nivel) {
    case 0: return true;                                   // dijo algo
    case 1: return d <= Math.max(2, Math.ceil(largo / 2)); // bastante parecido
    case 2: return d <= 1;                                 // muy parecido
    case 3: return d === 0;                                // exacto
    default: return d <= 1;
  }
}

// ----------------------------------------------------------------------------
//  Evalúa TODO lo que el reconocedor entendió (varias alternativas, y cada una
//  puede tener varias palabras) contra la palabra objetivo y sus variantes.
//  Devuelve true si alguna combinación coincide según el nivel.
// ----------------------------------------------------------------------------
export function evaluar(alternativas, palabra, nivel) {
  const objetivos = [palabra.palabra, ...(palabra.variantes || [])].map(normaliza).filter(Boolean);
  const esSilaba = !!palabra.esSilaba;

  for (const alt of alternativas) {
    const palabrasDichas = normaliza(alt).length
      ? alt.toLowerCase().split(/\s+/).map(normaliza).filter(Boolean)
      : [];
    // nivel 0: con que haya entendido cualquier sonido, vale
    if (nivel === 0 && palabrasDichas.length > 0) return true;
    for (const dicho of palabrasDichas) {
      for (const obj of objetivos) {
        if (esSilaba) {
          if (coincideSilaba(dicho, obj)) return true;
        } else if (coincideUna(dicho, obj, nivel)) return true;
      }
    }
  }
  return false;
}

// Las SÍLABAS son muy difíciles de reconocer sueltas (el motor las encaja en
// palabras). Por eso somos muy tolerantes: vale si lo que oye empieza por la
// sílaba, la contiene, o se parece mucho.
function coincideSilaba(dicho, obj) {
  if (!dicho || !obj) return false;
  if (dicho === obj) return true;
  if (dicho.startsWith(obj)) return true;   // "mamá" / "mano" → vale "MA"
  if (obj.startsWith(dicho)) return true;   // dijo solo "m" o "ma"
  if (dicho.includes(obj)) return true;     // "cama" contiene "ma"
  return distancia(dicho, obj) <= 1;        // muy parecido (1 cambio)
}

// ============================================================================
//  CLASE Reconocedor  ·  envoltorio sencillo sobre SpeechRecognition
// ============================================================================
export class Reconocedor {
  constructor() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.soportado = !!SR;
    this.escuchando = false;
    if (this.soportado) {
      this.rec = new SR();
      this.rec.lang = "es-ES";
      this.rec.interimResults = true;  // resultados EN VIVO → reacciona sin esperar al silencio
      this.rec.maxAlternatives = 8;    // pedimos varias interpretaciones (más opciones)
      this.rec.continuous = false;
    }
  }

  // Escucha una vez. Llama a onResultado(alternativas[]) o onError(motivo).
  escuchar({ onResultado, onError, onFin, onVoz } = {}) {
    if (!this.soportado) { onError && onError("no-soportado"); return; }
    if (this.escuchando) return;

    this.rec.onresult = (e) => {
      // Con resultados en vivo, esto se dispara varias veces (parciales y final).
      // Avisamos de cada uno indicando si es el resultado final o uno parcial.
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const alternativas = [];
        for (let j = 0; j < res.length; j++) alternativas.push(res[j].transcript);
        onResultado && onResultado(alternativas, res.isFinal);
      }
    };
    // Avisa en cuanto empieza a hablar (para cancelar el contador de silencio)
    this.rec.onspeechstart = () => { onVoz && onVoz(); };
    this.rec.onerror = (e) => { onError && onError(e.error); };
    this.rec.onend = () => { this.escuchando = false; onFin && onFin(); };

    try {
      this.escuchando = true;
      this.rec.start();
    } catch (err) {
      this.escuchando = false;
      onError && onError("inicio");
    }
  }

  parar() {
    if (this.soportado && this.escuchando) {
      try { this.rec.stop(); } catch {}
    }
  }
}

// ============================================================================
//  VOZ DE MODELO  ·  la app pronuncia la palabra para que la niña la oiga
// ============================================================================

// Elegimos UNA buena voz en español y la reutilizamos. Las voces se cargan de
// forma asíncrona en algunos navegadores, por eso escuchamos onvoiceschanged.
let vozES = null;
function elegirMejorVoz() {
  if (!("speechSynthesis" in window)) return;
  const voces = window.speechSynthesis.getVoices();
  if (!voces.length) return;
  const es = voces.filter((v) => /^es/i.test(v.lang));
  // Preferimos español de España y, dentro de eso, voces de mayor calidad.
  vozES =
    es.find((v) => /es[-_]ES/i.test(v.lang) &&
      /google|natural|premium|enhanced|neural|mónica|monica|helena|lucia|sabina/i.test(v.name)) ||
    es.find((v) => /es[-_]ES/i.test(v.lang)) ||
    es[0] || null;
}
if ("speechSynthesis" in window) {
  elegirMejorVoz();
  window.speechSynthesis.onvoiceschanged = elegirMejorVoz;
}

export function decirEnVozAlta(texto, { rate = 0.8, pitch = 1.1, alFinal } = {}) {
  if (!("speechSynthesis" in window)) { alFinal && alFinal(); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "es-ES";
  if (vozES) u.voice = vozES;   // mejor voz disponible (si la hay)
  u.rate = rate;   // un poco más lento, para que se entienda bien
  u.pitch = pitch;
  if (alFinal) u.onend = alFinal;
  window.speechSynthesis.speak(u);
}
