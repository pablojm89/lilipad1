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

  // ---------------------------------------------------------------------------
  //  SÍLABAS INVERSAS (1 sílaba)  ·  vocal + consonante
  // ---------------------------------------------------------------------------
  //  NOTA: en español NO existen palabras reales de 1 sílaba puramente inversas
  //  que sean vocabulario de una niña de 6 años (serían "as", "es"... sin sentido
  //  para ella). Por eso, siguiendo tu criterio, NO se incluyen aquí.
  //  Las inversas se trabajan muy bien con 2 sílabas: AR-BOL, O-SO, AL-TO,
  //  IS-LA... → las añadiremos en la fase de 2 sílabas.

  // ---------------------------------------------------------------------------
  //  SÍLABAS TRABADAS / SINFONES (1 sílaba)  ·  grupo consonántico + vocal
  //  (bl, br, cl, cr, dr, fl, fr, gl, gr, pl, pr, tl, tr)
  // ---------------------------------------------------------------------------
  { palabra: "TREN", tipo: "trabada", silabas: 1, categoria: "transporte", pictograma: "tren.png", buscar: "tren",  variantes: ["tren"] },
  { palabra: "FLOR", tipo: "trabada", silabas: 1, categoria: "naturaleza", pictograma: "flor.png", buscar: "flor",  variantes: ["flor"] },
  { palabra: "CRUZ", tipo: "trabada", silabas: 1, categoria: "objetos",    pictograma: "cruz.png", buscar: "cruz",  variantes: ["cruz", "crus"] },
  { palabra: "TRES", tipo: "trabada", silabas: 1, categoria: "numeros",    pictograma: "tres.png", buscar: "tres", arasaac: 2629, variantes: ["tres"] },
  { palabra: "DRON", tipo: "trabada", silabas: 1, categoria: "juguetes",   pictograma: "dron.png", buscar: "dron",  variantes: ["dron", "drone"] },
];

// Tipos de sílaba disponibles (para los botones del panel del adulto)
export const TIPOS = [
  { id: "directa",  nombre: "Directas",  emoji: "🟢" },
  { id: "inversa",  nombre: "Inversas",  emoji: "🔵" },
  { id: "trabada",  nombre: "Trabadas",  emoji: "🟣" },
];
