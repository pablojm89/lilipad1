// ============================================================================
//  DATOS DE PALABRAS  ·  Juego de pronunciación para Daniela
// ============================================================================
//
//  Cada palabra tiene:
//    - palabra      : texto que se muestra en MAYÚSCULAS
//    - tipo         : "directa" | "inversa" | "trabada"
//    - silabas      : número de sílabas (de momento, 1)
//    - categoria    : campo semántico (para los modos por categoría, más adelante)
//    - pictograma   : nombre del archivo en  img/pictogramas/
//    - buscar       : término que el script usa para pedir el pictograma a ARASAAC
//    - arasaac      : (opcional) id concreto de ARASAAC, si queremos forzar uno
//    - variantes    : formas que el reconocedor de voz aceptará como correctas
//                     (útil para sinónimos o como la niña suele decir la palabra)
//
//  Para AÑADIR una palabra nueva: copia un bloque, cámbialo y vuelve a ejecutar
//  el script de descarga (ver README). Para CAMBIAR un pictograma que no te
//  gusta: simplemente reemplaza el PNG dentro de img/pictogramas/.
// ============================================================================

export const PALABRAS = [
  // ---------------------------------------------------------------------------
  //  SÍLABAS DIRECTAS (1 sílaba)  ·  empiezan por consonante + vocal
  // ---------------------------------------------------------------------------
  { palabra: "SOL",  tipo: "directa", silabas: 1, categoria: "naturaleza", pictograma: "sol.png",  buscar: "sol",  variantes: ["sol"] },
  { palabra: "PAN",  tipo: "directa", silabas: 1, categoria: "comida",     pictograma: "pan.png",  buscar: "pan",  variantes: ["pan"] },
  { palabra: "PEZ",  tipo: "directa", silabas: 1, categoria: "animales",   pictograma: "pez.png",  buscar: "pez",  variantes: ["pez", "pes"] },
  { palabra: "PIE",  tipo: "directa", silabas: 1, categoria: "cuerpo",     pictograma: "pie.png",  buscar: "pie",  variantes: ["pie"] },
  { palabra: "MAR",  tipo: "directa", silabas: 1, categoria: "naturaleza", pictograma: "mar.png",  buscar: "mar",  variantes: ["mar"] },
  { palabra: "SAL",  tipo: "directa", silabas: 1, categoria: "comida",     pictograma: "sal.png",  buscar: "sal",  variantes: ["sal"] },
  { palabra: "LUZ",  tipo: "directa", silabas: 1, categoria: "casa",       pictograma: "luz.png",  buscar: "luz",  variantes: ["luz", "lus"] },
  { palabra: "MIEL", tipo: "directa", silabas: 1, categoria: "comida",     pictograma: "miel.png", buscar: "miel", variantes: ["miel"] },
  // GOL usa una imagen COMPUESTA propia (portería + pelota) para que no se
  // confunda con "pelota" o "fútbol". Por eso lleva  local: true  y el script
  // de descarga NO la toca.
  { palabra: "GOL",  tipo: "directa", silabas: 1, categoria: "deportes",   pictograma: "gol.png",  local: true,        variantes: ["gol"] },
  { palabra: "REY",  tipo: "directa", silabas: 1, categoria: "cuentos",    pictograma: "rey.png",  buscar: "rey",      variantes: ["rey"] },
  { palabra: "BOL",  tipo: "directa", silabas: 1, categoria: "cocina",     pictograma: "bol.png",  buscar: "bol",      variantes: ["bol", "cuenco"] },
  { palabra: "TÉ",   tipo: "directa", silabas: 1, categoria: "comida",     pictograma: "te.png",   buscar: "infusión", arasaac: 2429, variantes: ["te", "té"] },
  { palabra: "NUEZ", tipo: "directa", silabas: 1, categoria: "comida",     pictograma: "nuez.png", buscar: "nuez",     variantes: ["nuez", "nues"] },
  { palabra: "DOS",  tipo: "directa", silabas: 1, categoria: "numeros",    pictograma: "dos.png",  buscar: "dos",  arasaac: 2628, variantes: ["dos"] },
  { palabra: "SEIS", tipo: "directa", silabas: 1, categoria: "numeros",    pictograma: "seis.png", buscar: "seis", variantes: ["seis"] },
  // SÍ y NO usan imágenes COMPUESTAS propias: cabeza con la dirección del gesto
  // (asentir / negar) + el check verde / la cruz roja.  local:true → el script no las toca.
  { palabra: "SÍ",   tipo: "directa", silabas: 1, categoria: "basicas",    pictograma: "si.png",   local: true, variantes: ["si", "sí"] },
  { palabra: "NO",   tipo: "directa", silabas: 1, categoria: "basicas",    pictograma: "no.png",   local: true, variantes: ["no"] },

  // ---------------------------------------------------------------------------
  //  SÍLABAS INVERSAS (1 sílaba)  ·  vocal + consonante
  // ---------------------------------------------------------------------------
  //  NOTA: en español NO existen palabras reales de 1 sílaba puramente inversas
  //  que sean vocabulario de una niña de 6 años (serían "as", "es"... sin sentido
  //  para ella). Por eso, siguiendo tu criterio, NO se incluyen aquí.
  //  Las inversas se trabajan muy bien con 2 sílabas (ÁR-BOL, IS-LA, AR-PA...)
  //  → ya están incluidas más abajo, en la sección de 2 sílabas.

  // ---------------------------------------------------------------------------
  //  SÍLABAS TRABADAS / SINFONES (1 sílaba)  ·  grupo consonántico + vocal
  //  (bl, br, cl, cr, dr, fl, fr, gl, gr, pl, pr, tl, tr)
  // ---------------------------------------------------------------------------
  { palabra: "TREN", tipo: "trabada", silabas: 1, categoria: "transporte", pictograma: "tren.png", buscar: "tren",  variantes: ["tren"] },
  { palabra: "FLOR", tipo: "trabada", silabas: 1, categoria: "naturaleza", pictograma: "flor.png", buscar: "flor",  variantes: ["flor"] },
  { palabra: "CRUZ", tipo: "trabada", silabas: 1, categoria: "objetos",    pictograma: "cruz.png", buscar: "cruz",  variantes: ["cruz", "crus"] },
  { palabra: "TRES", tipo: "trabada", silabas: 1, categoria: "numeros",    pictograma: "tres.png", buscar: "tres", arasaac: 2629, variantes: ["tres"] },
  { palabra: "DRON", tipo: "trabada", silabas: 1, categoria: "juguetes",   pictograma: "dron.png", buscar: "dron",  variantes: ["dron", "drone"] },
  { palabra: "FLAN", tipo: "trabada", silabas: 1, categoria: "comida",     pictograma: "flan.png", buscar: "flan",  variantes: ["flan"] },
  { palabra: "CLIP", tipo: "trabada", silabas: 1, categoria: "objetos",    pictograma: "clip.png", buscar: "clip",  variantes: ["clip"] },
  { palabra: "GRIS", tipo: "trabada", silabas: 1, categoria: "colores",    pictograma: "gris.png", buscar: "gris",  variantes: ["gris"] },

  // ===========================================================================
  //  PALABRAS DE 2 SÍLABAS
  // ===========================================================================

  // ---------------------------------------------------------------------------
  //  DIRECTAS (2 sílabas)  ·  todas las sílabas son consonante + vocal (CV-CV)
  // ---------------------------------------------------------------------------
  { palabra: "GATO", tipo: "directa", silabas: 2, categoria: "animales",   pictograma: "gato.png", buscar: "gato",  variantes: ["gato"] },
  { palabra: "PATO", tipo: "directa", silabas: 2, categoria: "animales",   pictograma: "pato.png", buscar: "pato",  variantes: ["pato"] },
  { palabra: "MONO", tipo: "directa", silabas: 2, categoria: "animales",   pictograma: "mono.png", buscar: "mono",  variantes: ["mono"] },
  { palabra: "VACA", tipo: "directa", silabas: 2, categoria: "animales",   pictograma: "vaca.png", buscar: "vaca",  variantes: ["vaca", "baca"] },
  { palabra: "FOCA", tipo: "directa", silabas: 2, categoria: "animales",   pictograma: "foca.png", buscar: "foca",  variantes: ["foca"] },
  { palabra: "RANA", tipo: "directa", silabas: 2, categoria: "animales",   pictograma: "rana.png", buscar: "rana",  variantes: ["rana"] },
  { palabra: "CASA", tipo: "directa", silabas: 2, categoria: "casa",       pictograma: "casa.png", buscar: "casa",  variantes: ["casa"] },
  { palabra: "MESA", tipo: "directa", silabas: 2, categoria: "casa",       pictograma: "mesa.png", buscar: "mesa",  variantes: ["mesa"] },
  { palabra: "CAMA", tipo: "directa", silabas: 2, categoria: "casa",       pictograma: "cama.png", buscar: "cama",  variantes: ["cama"] },
  { palabra: "SOPA", tipo: "directa", silabas: 2, categoria: "comida",     pictograma: "sopa.png", buscar: "sopa",  variantes: ["sopa"] },
  { palabra: "PERA", tipo: "directa", silabas: 2, categoria: "comida",     pictograma: "pera.png", buscar: "pera",  variantes: ["pera"] },
  { palabra: "PIÑA", tipo: "directa", silabas: 2, categoria: "comida",     pictograma: "pina.png", buscar: "piña",  variantes: ["piña", "pina"] },
  { palabra: "MANO", tipo: "directa", silabas: 2, categoria: "cuerpo",     pictograma: "mano.png", buscar: "mano",  variantes: ["mano"] },
  { palabra: "BOCA", tipo: "directa", silabas: 2, categoria: "cuerpo",     pictograma: "boca.png", buscar: "boca",  variantes: ["boca"] },
  { palabra: "LUNA", tipo: "directa", silabas: 2, categoria: "naturaleza", pictograma: "luna.png", buscar: "luna",  variantes: ["luna"] },
  { palabra: "NUBE", tipo: "directa", silabas: 2, categoria: "naturaleza", pictograma: "nube.png", buscar: "nube",  variantes: ["nube"] },

  // ---------------------------------------------------------------------------
  //  INVERSAS / MIXTAS (2 sílabas)  ·  contienen una sílaba inversa o cerrada
  //  (ar-, is-, an-, án-, as-, ...)  ← aquí SÍ hay vocabulario infantil real
  // ---------------------------------------------------------------------------
  { palabra: "ÁRBOL", tipo: "inversa", silabas: 2, categoria: "naturaleza", pictograma: "arbol.png", buscar: "árbol", variantes: ["arbol", "árbol"] },
  { palabra: "ISLA",  tipo: "inversa", silabas: 2, categoria: "naturaleza", pictograma: "isla.png",  buscar: "isla",  variantes: ["isla"] },
  { palabra: "ARPA",  tipo: "inversa", silabas: 2, categoria: "objetos",    pictograma: "arpa.png",  buscar: "arpa",  variantes: ["arpa"] },
  { palabra: "ARCO",  tipo: "inversa", silabas: 2, categoria: "objetos",    pictograma: "arco.png",  buscar: "arco", arasaac: 5386, variantes: ["arco"] },
  { palabra: "IMÁN",  tipo: "inversa", silabas: 2, categoria: "objetos",    pictograma: "iman.png",  buscar: "imán",  variantes: ["iman", "imán"] },
  { palabra: "ANCLA", tipo: "inversa", silabas: 2, categoria: "objetos",    pictograma: "ancla.png", buscar: "ancla", variantes: ["ancla"] },
  { palabra: "ÁNGEL", tipo: "inversa", silabas: 2, categoria: "cuentos",    pictograma: "angel.png", buscar: "ángel", variantes: ["angel", "ángel"] },
  { palabra: "ASNO",  tipo: "inversa", silabas: 2, categoria: "animales",   pictograma: "asno.png",  buscar: "asno",  variantes: ["asno", "burro"] },

  // ---------------------------------------------------------------------------
  //  TRABADAS / SINFONES (2 sílabas)  ·  contienen un grupo consonántico CCV
  // ---------------------------------------------------------------------------
  { palabra: "PLATO",  tipo: "trabada", silabas: 2, categoria: "cocina",    pictograma: "plato.png",  buscar: "plato",  variantes: ["plato"] },
  { palabra: "GLOBO",  tipo: "trabada", silabas: 2, categoria: "juguetes",  pictograma: "globo.png",  buscar: "globo",  variantes: ["globo"] },
  { palabra: "PLUMA",  tipo: "trabada", silabas: 2, categoria: "objetos",   pictograma: "pluma.png",  buscar: "pluma",  variantes: ["pluma"] },
  { palabra: "LIBRO",  tipo: "trabada", silabas: 2, categoria: "objetos",   pictograma: "libro.png",  buscar: "libro",  variantes: ["libro"] },
  { palabra: "FRESA",  tipo: "trabada", silabas: 2, categoria: "comida",    pictograma: "fresa.png",  buscar: "fresa",  variantes: ["fresa"] },
  { palabra: "FRUTA",  tipo: "trabada", silabas: 2, categoria: "comida",    pictograma: "fruta.png",  buscar: "fruta",  variantes: ["fruta"] },
  { palabra: "TIGRE",  tipo: "trabada", silabas: 2, categoria: "animales",  pictograma: "tigre.png",  buscar: "tigre",  variantes: ["tigre"] },
  { palabra: "CABRA",  tipo: "trabada", silabas: 2, categoria: "animales",  pictograma: "cabra.png",  buscar: "cabra",  variantes: ["cabra"] },
  { palabra: "CEBRA",  tipo: "trabada", silabas: 2, categoria: "animales",  pictograma: "cebra.png",  buscar: "cebra",  variantes: ["cebra"] },
  { palabra: "BRUJA",  tipo: "trabada", silabas: 2, categoria: "cuentos",   pictograma: "bruja.png",  buscar: "bruja",  variantes: ["bruja"] },
  { palabra: "DRAGÓN", tipo: "trabada", silabas: 2, categoria: "cuentos",   pictograma: "dragon.png", buscar: "dragón", variantes: ["dragon", "dragón"] },
  { palabra: "PLAYA",  tipo: "trabada", silabas: 2, categoria: "naturaleza",pictograma: "playa.png",  buscar: "playa",  variantes: ["playa"] },
  { palabra: "FLECHA", tipo: "trabada", silabas: 2, categoria: "objetos",   pictograma: "flecha.png", buscar: "flecha", variantes: ["flecha"] },
  { palabra: "GRIFO",  tipo: "trabada", silabas: 2, categoria: "casa",      pictograma: "grifo.png",  buscar: "grifo",  variantes: ["grifo"] },
];

// Tipos de sílaba disponibles (para los botones del panel del adulto)
export const TIPOS = [
  { id: "directa",  nombre: "Directas",  emoji: "🟢" },
  { id: "inversa",  nombre: "Inversas",  emoji: "🔵" },
  { id: "trabada",  nombre: "Trabadas",  emoji: "🟣" },
];

// Números de sílabas disponibles
export const SILABAS = [
  { id: 1, nombre: "1 sílaba" },
  { id: 2, nombre: "2 sílabas" },
];

// Campos semánticos (categorías). El panel solo muestra los que tienen palabras.
export const CATEGORIAS = [
  { id: "animales",   nombre: "Animales",   emoji: "🐾" },
  { id: "comida",     nombre: "Comida",     emoji: "🍎" },
  { id: "cuerpo",     nombre: "El cuerpo",  emoji: "✋" },
  { id: "casa",       nombre: "La casa",    emoji: "🏠" },
  { id: "cocina",     nombre: "Cocina",     emoji: "🍽️" },
  { id: "naturaleza", nombre: "Naturaleza", emoji: "🌳" },
  { id: "cuentos",    nombre: "Cuentos",    emoji: "🧙" },
  { id: "objetos",    nombre: "Objetos",    emoji: "🧲" },
  { id: "juguetes",   nombre: "Juguetes",   emoji: "🪁" },
  { id: "colores",    nombre: "Colores",    emoji: "🎨" },
  { id: "numeros",    nombre: "Números",    emoji: "🔢" },
  { id: "deportes",   nombre: "Deportes",   emoji: "⚽" },
  { id: "basicas",    nombre: "Sí y No",    emoji: "👍" },
];
