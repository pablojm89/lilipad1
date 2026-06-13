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

  // ===========================================================================
  //  PALABRAS NUEVAS · especialmente importantes para Daniela
  // ===========================================================================

  // FAMILIA / PERSONAS
  { palabra: "MAMÁ",  tipo: "directa", silabas: 2, categoria: "familia",    pictograma: "mama.png",  buscar: "mamá",         variantes: ["mama", "mamá"] },
  { palabra: "PAPÁ",  tipo: "directa", silabas: 2, categoria: "familia",    pictograma: "papa.png",  buscar: "papá",         variantes: ["papa", "papá"] },
  { palabra: "BEBÉ",  tipo: "directa", silabas: 2, categoria: "familia",    pictograma: "bebe.png",  buscar: "bebé",         variantes: ["bebe", "bebé"] },
  { palabra: "NENE",  tipo: "directa", silabas: 2, categoria: "familia",    pictograma: "nene.png",  buscar: "niño pequeño", variantes: ["nene", "nena"] },

  // ANIMALES
  { palabra: "PERRO", tipo: "directa", silabas: 2, categoria: "animales",   pictograma: "perro.png", buscar: "perro",        variantes: ["perro"] },
  { palabra: "POLLO", tipo: "directa", silabas: 2, categoria: "animales",   pictograma: "pollo.png", buscar: "pollo animal", variantes: ["pollo"] },

  // COMIDA
  { palabra: "LECHE", tipo: "directa", silabas: 2, categoria: "comida",     pictograma: "leche.png", buscar: "leche",        variantes: ["leche"] },
  { palabra: "ZUMO",  tipo: "directa", silabas: 2, categoria: "comida",     pictograma: "zumo.png",  buscar: "zumo",         variantes: ["zumo", "jugo"] },
  { palabra: "QUESO", tipo: "directa", silabas: 2, categoria: "comida",     pictograma: "queso.png", buscar: "queso",        variantes: ["queso"] },
  { palabra: "HUEVO", tipo: "directa", silabas: 2, categoria: "comida",     pictograma: "huevo.png", buscar: "huevo",        variantes: ["huevo"] },
  { palabra: "POLO",  tipo: "directa", silabas: 2, categoria: "comida",     pictograma: "polo.png",  buscar: "polo helado",  variantes: ["polo"] },
  { palabra: "AGUA",  tipo: "inversa", silabas: 2, categoria: "comida",     pictograma: "agua.png",  buscar: "agua beber",   variantes: ["agua"] },

  // CUERPO
  { palabra: "DEDO",  tipo: "directa", silabas: 2, categoria: "cuerpo",     pictograma: "dedo.png",  buscar: "dedo",         variantes: ["dedo"] },
  { palabra: "OJO",   tipo: "directa", silabas: 2, categoria: "cuerpo",     pictograma: "ojo.png",   buscar: "ojo",          variantes: ["ojo"] },
  { palabra: "PELO",  tipo: "directa", silabas: 2, categoria: "cuerpo",     pictograma: "pelo.png",  buscar: "pelo",         variantes: ["pelo"] },
  { palabra: "NARIZ", tipo: "inversa", silabas: 2, categoria: "cuerpo",     pictograma: "nariz.png", buscar: "nariz",        variantes: ["nariz"] },
  { palabra: "PUPA",  tipo: "directa", silabas: 2, categoria: "cuerpo",     pictograma: "pupa.png",  buscar: "pupa dolor",   variantes: ["pupa"] },

  // CASA
  { palabra: "SILLA", tipo: "directa", silabas: 2, categoria: "casa",       pictograma: "silla.png", buscar: "silla",        variantes: ["silla"] },
  { palabra: "CUNA",  tipo: "directa", silabas: 2, categoria: "casa",       pictograma: "cuna.png",  buscar: "cuna bebé",    variantes: ["cuna"] },

  // TRANSPORTE
  { palabra: "COCHE", tipo: "directa", silabas: 2, categoria: "transporte", pictograma: "coche.png", buscar: "coche",        variantes: ["coche"] },
  { palabra: "MOTO",  tipo: "directa", silabas: 2, categoria: "transporte", pictograma: "moto.png",  buscar: "moto",         variantes: ["moto"] },

  // ROPA
  { palabra: "ROPA",  tipo: "directa", silabas: 2, categoria: "ropa",       pictograma: "ropa.png",  buscar: "ropa",         variantes: ["ropa"] },
  { palabra: "BOTA",  tipo: "directa", silabas: 2, categoria: "ropa",       pictograma: "bota.png",  buscar: "bota",         variantes: ["bota"] },
  { palabra: "GORRA", tipo: "directa", silabas: 2, categoria: "ropa",       pictograma: "gorra.png", buscar: "gorra",        variantes: ["gorra"] },

  // BÁSICAS / GESTOS
  { palabra: "BESO",  tipo: "directa", silabas: 2, categoria: "basicas",    pictograma: "beso.png",  buscar: "beso",         variantes: ["beso"] },
  { palabra: "HOLA",  tipo: "directa", silabas: 2, categoria: "basicas",    pictograma: "hola.png",  buscar: "hola saludo",  variantes: ["hola"] },

  // JUGUETES
  { palabra: "DADO",  tipo: "directa", silabas: 2, categoria: "juguetes",   pictograma: "dado.png",  buscar: "dado juego",   variantes: ["dado"] },
  { palabra: "YOYO",  tipo: "directa", silabas: 2, categoria: "juguetes",   pictograma: "yoyo.png",  buscar: "yo-yo",        variantes: ["yoyo", "yo-yo"] },

  // OBJETOS
  { palabra: "LUPA",  tipo: "directa", silabas: 2, categoria: "objetos",    pictograma: "lupa.png",  buscar: "lupa",         variantes: ["lupa"] },

  // COCINA
  { palabra: "TAZA",  tipo: "directa", silabas: 2, categoria: "cocina",     pictograma: "taza.png",  buscar: "taza",         variantes: ["taza"] },

  // NÚMEROS
  { palabra: "UNO",   tipo: "directa", silabas: 2, categoria: "numeros",    pictograma: "uno.png",   buscar: "uno",   arasaac: 2627, variantes: ["uno"] },
  { palabra: "CINCO", tipo: "directa", silabas: 2, categoria: "numeros",    pictograma: "cinco.png", buscar: "cinco", arasaac: 2631, variantes: ["cinco"] },
  { palabra: "OCHO",  tipo: "directa", silabas: 2, categoria: "numeros",    pictograma: "ocho.png",  buscar: "ocho",  arasaac: 2634, variantes: ["ocho"] },
  { palabra: "NUEVE", tipo: "directa", silabas: 2, categoria: "numeros",    pictograma: "nueve.png", buscar: "nueve", arasaac: 2635, variantes: ["nueve"] },
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

// ===========================================================================
//  FAMILIAS SILÁBICAS  ·  para el modo "Lectura Silábica"
//
//  Orden pedagógico estándar: primero las consonantes más frecuentes y fáciles
//  (M, P, S, L, T), luego el resto. Dentro de cada familia, las sílabas van
//  de la vocal más abierta (A) a la más cerrada (U).
//
//  Cada sílaba lleva sus variantes de reconocimiento: lo que el reconocedor
//  de voz puede devolver cuando la niña dice esa sílaba sola.
// ===========================================================================
export const FAMILIAS_SILABICAS = [
  { id: "m",  orden: 1,  consonante: "M",    silabas: [
    { texto: "MA", variantes: ["ma", "más", "mamá"] },
    { texto: "ME", variantes: ["me", "mes"] },
    { texto: "MI", variantes: ["mi", "mí", "mis"] },
    { texto: "MO", variantes: ["mo", "moto"] },
    { texto: "MU", variantes: ["mu", "muy"] },
  ]},
  { id: "p",  orden: 2,  consonante: "P",    silabas: [
    { texto: "PA", variantes: ["pa", "pan", "papá"] },
    { texto: "PE", variantes: ["pe", "pez", "pero"] },
    { texto: "PI", variantes: ["pi", "pie", "pino"] },
    { texto: "PO", variantes: ["po", "poco", "polo"] },
    { texto: "PU", variantes: ["pu", "pues", "puma"] },
  ]},
  { id: "s",  orden: 3,  consonante: "S",    silabas: [
    { texto: "SA", variantes: ["sa", "sal", "sabe"] },
    { texto: "SE", variantes: ["se", "sé", "ser"] },
    { texto: "SI", variantes: ["si", "sí", "sin"] },
    { texto: "SO", variantes: ["so", "sol", "son"] },
    { texto: "SU", variantes: ["su", "sus"] },
  ]},
  { id: "l",  orden: 4,  consonante: "L",    silabas: [
    { texto: "LA", variantes: ["la", "las"] },
    { texto: "LE", variantes: ["le", "les"] },
    { texto: "LI", variantes: ["li", "liso"] },
    { texto: "LO", variantes: ["lo", "los"] },
    { texto: "LU", variantes: ["lu", "luz", "luna"] },
  ]},
  { id: "t",  orden: 5,  consonante: "T",    silabas: [
    { texto: "TA", variantes: ["ta", "taza"] },
    { texto: "TE", variantes: ["te", "té"] },
    { texto: "TI", variantes: ["ti", "tigre"] },
    { texto: "TO", variantes: ["to", "topo"] },
    { texto: "TU", variantes: ["tu", "tú"] },
  ]},
  { id: "d",  orden: 6,  consonante: "D",    silabas: [
    { texto: "DA", variantes: ["da", "dado"] },
    { texto: "DE", variantes: ["de"] },
    { texto: "DI", variantes: ["di", "digo"] },
    { texto: "DO", variantes: ["do", "dos"] },
    { texto: "DU", variantes: ["du", "duro"] },
  ]},
  { id: "n",  orden: 7,  consonante: "N",    silabas: [
    { texto: "NA", variantes: ["na", "nariz", "nada"] },
    { texto: "NE", variantes: ["ne", "nene"] },
    { texto: "NI", variantes: ["ni", "niño"] },
    { texto: "NO", variantes: ["no"] },
    { texto: "NU", variantes: ["nu", "nube", "nuez"] },
  ]},
  { id: "f",  orden: 8,  consonante: "F",    silabas: [
    { texto: "FA", variantes: ["fa", "fácil"] },
    { texto: "FE", variantes: ["fe"] },
    { texto: "FI", variantes: ["fi", "fila"] },
    { texto: "FO", variantes: ["fo", "foca"] },
    { texto: "FU", variantes: ["fu", "fui"] },
  ]},
  { id: "b",  orden: 9,  consonante: "B",    silabas: [
    { texto: "BA", variantes: ["ba", "baja"] },
    { texto: "BE", variantes: ["be", "bebé"] },
    { texto: "BI", variantes: ["bi", "bici"] },
    { texto: "BO", variantes: ["bo", "boca"] },
    { texto: "BU", variantes: ["bu", "buen"] },
  ]},
  { id: "r",  orden: 10, consonante: "R",    silabas: [
    { texto: "RA", variantes: ["ra", "rana"] },
    { texto: "RE", variantes: ["re", "rey"] },
    { texto: "RI", variantes: ["ri", "río"] },
    { texto: "RO", variantes: ["ro", "ropa"] },
    { texto: "RU", variantes: ["ru", "rueda"] },
  ]},
  { id: "g",  orden: 11, consonante: "G",    silabas: [
    { texto: "GA", variantes: ["ga", "gato"] },
    { texto: "GUE", variantes: ["gue", "güe"] },
    { texto: "GUI", variantes: ["gui", "güi"] },
    { texto: "GO", variantes: ["go", "gol"] },
    { texto: "GU", variantes: ["gu", "gusano"] },
  ]},
  { id: "c",  orden: 12, consonante: "C/QU", silabas: [
    { texto: "CA", variantes: ["ca", "casa"] },
    { texto: "QUE", variantes: ["que", "ke"] },
    { texto: "QUI", variantes: ["qui", "ki"] },
    { texto: "CO", variantes: ["co", "coche"] },
    { texto: "CU", variantes: ["cu", "cuna"] },
  ]},
  { id: "v",  orden: 13, consonante: "V",    silabas: [
    { texto: "VA", variantes: ["va", "vaca"] },
    { texto: "VE", variantes: ["ve", "ven"] },
    { texto: "VI", variantes: ["vi", "vida"] },
    { texto: "VO", variantes: ["vo", "voy"] },
    { texto: "VU", variantes: ["vu", "vuelo"] },
  ]},
  { id: "j",  orden: 14, consonante: "J",    silabas: [
    { texto: "JA", variantes: ["ja", "jaula"] },
    { texto: "JE", variantes: ["je", "jefe"] },
    { texto: "JI", variantes: ["ji"] },
    { texto: "JO", variantes: ["jo"] },
    { texto: "JU", variantes: ["ju", "jugo"] },
  ]},
  { id: "ch", orden: 15, consonante: "CH",   silabas: [
    { texto: "CHA", variantes: ["cha", "chao"] },
    { texto: "CHE", variantes: ["che"] },
    { texto: "CHI", variantes: ["chi"] },
    { texto: "CHO", variantes: ["cho", "chocolate"] },
    { texto: "CHU", variantes: ["chu"] },
  ]},
  { id: "ll", orden: 16, consonante: "LL/Y", silabas: [
    { texto: "LLA", variantes: ["lla", "llama"] },
    { texto: "LLE", variantes: ["lle", "lleva"] },
    { texto: "LLI", variantes: ["lli"] },
    { texto: "LLO", variantes: ["llo", "llorar"] },
    { texto: "LLU", variantes: ["llu", "lluvia"] },
  ]},
];

// Campos semánticos (categorías). El panel solo muestra los que tienen palabras.
export const CATEGORIAS = [
  { id: "familia",    nombre: "Familia",    emoji: "👨‍👩‍👧" },
  { id: "animales",   nombre: "Animales",   emoji: "🐾" },
  { id: "comida",     nombre: "Comida",     emoji: "🍎" },
  { id: "cuerpo",     nombre: "El cuerpo",  emoji: "✋" },
  { id: "casa",       nombre: "La casa",    emoji: "🏠" },
  { id: "cocina",     nombre: "Cocina",     emoji: "🍽️" },
  { id: "naturaleza", nombre: "Naturaleza", emoji: "🌳" },
  { id: "cuentos",    nombre: "Cuentos",    emoji: "🧙" },
  { id: "objetos",    nombre: "Objetos",    emoji: "🧲" },
  { id: "juguetes",   nombre: "Juguetes",   emoji: "🪁" },
  { id: "transporte", nombre: "Transporte", emoji: "🚗" },
  { id: "ropa",       nombre: "Ropa",       emoji: "👕" },
  { id: "colores",    nombre: "Colores",    emoji: "🎨" },
  { id: "numeros",    nombre: "Números",    emoji: "🔢" },
  { id: "deportes",   nombre: "Deportes",   emoji: "⚽" },
  { id: "basicas",    nombre: "Básicas",    emoji: "👍" },
];
