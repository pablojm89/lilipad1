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
  { palabra: "CUNA",  tipo: "directa", silabas: 2, categoria: "casa",       pictograma: "cuna.png",  buscar: "cuna", arasaac: 5980, variantes: ["cuna"] },

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

  // ===========================================================================
  //  COLORES  ·  pictograma = mancha/cuadro del color (ids fijos de ARASAAC)
  // ===========================================================================
  { palabra: "ROJO",     tipo: "directa", silabas: 2, categoria: "colores", pictograma: "rojo.png",     buscar: "rojo",     arasaac: 2808, variantes: ["rojo", "roja"] },
  { palabra: "AZUL",     tipo: "inversa", silabas: 2, categoria: "colores", pictograma: "azul.png",     buscar: "azul",     arasaac: 4869, variantes: ["azul"] },
  { palabra: "VERDE",    tipo: "inversa", silabas: 2, categoria: "colores", pictograma: "verde.png",    buscar: "verde",    arasaac: 4887, variantes: ["verde"] },
  { palabra: "AMARILLO", tipo: "directa", silabas: 4, categoria: "colores", pictograma: "amarillo.png", buscar: "amarillo", arasaac: 2648, variantes: ["amarillo", "amarilla"] },
  { palabra: "NARANJA",  tipo: "directa", silabas: 3, categoria: "colores", pictograma: "naranja.png",  buscar: "naranja",  arasaac: 2888, variantes: ["naranja"] },
  { palabra: "ROSA",     tipo: "directa", silabas: 2, categoria: "colores", pictograma: "rosa.png",     buscar: "rosa",     arasaac: 3151, variantes: ["rosa"] },
  { palabra: "MORADO",   tipo: "directa", silabas: 3, categoria: "colores", pictograma: "morado.png",   buscar: "morado",   arasaac: 2907, variantes: ["morado", "morada", "violeta"] },
  { palabra: "MARRÓN",   tipo: "directa", silabas: 2, categoria: "colores", pictograma: "marron.png",   buscar: "marrón",   arasaac: 2923, variantes: ["marron", "marrón"] },
  { palabra: "NEGRO",    tipo: "trabada", silabas: 2, categoria: "colores", pictograma: "negro.png",    buscar: "negro",    arasaac: 2886, variantes: ["negro", "negra"] },
  { palabra: "BLANCO",   tipo: "trabada", silabas: 2, categoria: "colores", pictograma: "blanco.png",   buscar: "blanco",   arasaac: 8043, variantes: ["blanco", "blanca"] },

  // ===========================================================================
  //  VERBOS  ·  acciones (pictograma de la acción)
  // ===========================================================================
  { palabra: "COMER",    tipo: "directa", silabas: 2, categoria: "verbos", pictograma: "comer.png",    buscar: "comer",    arasaac: 6456,  variantes: ["comer"] },
  { palabra: "BEBER",    tipo: "directa", silabas: 2, categoria: "verbos", pictograma: "beber.png",    buscar: "beber",    arasaac: 6061,  variantes: ["beber"] },
  { palabra: "CORRER",   tipo: "directa", silabas: 2, categoria: "verbos", pictograma: "correr.png",   buscar: "correr",   arasaac: 6465,  variantes: ["correr"] },
  { palabra: "SALTAR",   tipo: "inversa", silabas: 2, categoria: "verbos", pictograma: "saltar.png",   buscar: "saltar",   arasaac: 39052, variantes: ["saltar"] },
  { palabra: "JUGAR",    tipo: "directa", silabas: 2, categoria: "verbos", pictograma: "jugar.png",    buscar: "jugar",    arasaac: 23392, variantes: ["jugar"] },
  { palabra: "DORMIR",   tipo: "trabada", silabas: 2, categoria: "verbos", pictograma: "dormir.png",   buscar: "dormir",   arasaac: 6479,  variantes: ["dormir"] },
  { palabra: "LLORAR",   tipo: "trabada", silabas: 2, categoria: "verbos", pictograma: "llorar.png",   buscar: "llorar",   arasaac: 7147,  variantes: ["llorar"] },
  { palabra: "REÍR",     tipo: "directa", silabas: 2, categoria: "verbos", pictograma: "reir.png",     buscar: "reír",     arasaac: 13354, variantes: ["reir", "reír", "sonreir"] },
  { palabra: "CANTAR",   tipo: "directa", silabas: 2, categoria: "verbos", pictograma: "cantar.png",   buscar: "cantar",   arasaac: 6960,  variantes: ["cantar"] },
  { palabra: "BAILAR",   tipo: "directa", silabas: 2, categoria: "verbos", pictograma: "bailar.png",   buscar: "bailar",   arasaac: 6052,  variantes: ["bailar"] },
  { palabra: "PINTAR",   tipo: "directa", silabas: 2, categoria: "verbos", pictograma: "pintar.png",   buscar: "pintar",   arasaac: 2348,  variantes: ["pintar"] },
  { palabra: "LAVAR",    tipo: "directa", silabas: 2, categoria: "verbos", pictograma: "lavar.png",    buscar: "lavar",    arasaac: 34826, variantes: ["lavar"] },
  { palabra: "ANDAR",    tipo: "inversa", silabas: 2, categoria: "verbos", pictograma: "andar.png",    buscar: "andar",    arasaac: 6044,  variantes: ["andar", "caminar"] },
  { palabra: "SUBIR",    tipo: "directa", silabas: 2, categoria: "verbos", pictograma: "subir.png",    buscar: "subir",    arasaac: 24725, variantes: ["subir"] },
  { palabra: "MIRAR",    tipo: "directa", silabas: 2, categoria: "verbos", pictograma: "mirar.png",    buscar: "mirar",    arasaac: 6564,  variantes: ["mirar", "ver"] },
  { palabra: "ABRIR",    tipo: "trabada", silabas: 2, categoria: "verbos", pictograma: "abrir.png",    buscar: "abrir",    arasaac: 24825, variantes: ["abrir"] },
  { palabra: "TRABAJAR", tipo: "trabada", silabas: 3, categoria: "verbos", pictograma: "trabajar.png", buscar: "trabajar", arasaac: 6624,  variantes: ["trabajar"] },

  // ===========================================================================
  //  MÁS VOCABULARIO  ·  sustantivos comunes
  // ===========================================================================
  { palabra: "MANZANA",  tipo: "directa", silabas: 3, categoria: "comida",    pictograma: "manzana.png",  buscar: "manzana",  arasaac: 2462,  variantes: ["manzana"] },
  { palabra: "PLÁTANO",  tipo: "trabada", silabas: 3, categoria: "comida",    pictograma: "platano.png",  buscar: "plátano",  arasaac: 2530,  variantes: ["platano", "plátano"] },
  { palabra: "GALLETA",  tipo: "directa", silabas: 3, categoria: "comida",    pictograma: "galleta.png",  buscar: "galleta",  arasaac: 8312,  variantes: ["galleta"] },
  { palabra: "TOMATE",   tipo: "directa", silabas: 3, categoria: "comida",    pictograma: "tomate.png",   buscar: "tomate",   arasaac: 2594,  variantes: ["tomate"] },
  { palabra: "ZAPATO",   tipo: "directa", silabas: 3, categoria: "ropa",      pictograma: "zapato.png",   buscar: "zapato",   arasaac: 32923, variantes: ["zapato"] },
  { palabra: "LEÓN",     tipo: "directa", silabas: 2, categoria: "animales",  pictograma: "leon.png",     buscar: "león",     arasaac: 25187, variantes: ["leon", "león"] },
  { palabra: "RATÓN",    tipo: "directa", silabas: 2, categoria: "animales",  pictograma: "raton.png",    buscar: "ratón",    arasaac: 2546,  variantes: ["raton", "ratón"] },
  { palabra: "CONEJO",   tipo: "directa", silabas: 3, categoria: "animales",  pictograma: "conejo.png",   buscar: "conejo",   arasaac: 2351,  variantes: ["conejo"] },
  { palabra: "CERDO",    tipo: "trabada", silabas: 2, categoria: "animales",  pictograma: "cerdo.png",    buscar: "cerdo",    arasaac: 24972, variantes: ["cerdo"] },
  { palabra: "CABALLO",  tipo: "directa", silabas: 3, categoria: "animales",  pictograma: "caballo.png",  buscar: "caballo",  arasaac: 2294,  variantes: ["caballo"] },
  { palabra: "ELEFANTE", tipo: "directa", silabas: 4, categoria: "animales",  pictograma: "elefante.png", buscar: "elefante", arasaac: 2372,  variantes: ["elefante"] },
  { palabra: "PELOTA",   tipo: "directa", silabas: 3, categoria: "juguetes",  pictograma: "pelota.png",   buscar: "pelota",   arasaac: 3241,  variantes: ["pelota"] },

  // ===========================================================================
  //  CUARTOS DE LA CASA  ·  habitaciones
  // ===========================================================================
  { palabra: "COCINA",     tipo: "directa", silabas: 3, categoria: "habitaciones", pictograma: "cocina.png",     buscar: "cocina",     arasaac: 10752, variantes: ["cocina"] },
  { palabra: "SALÓN",      tipo: "directa", silabas: 2, categoria: "habitaciones", pictograma: "salon.png",      buscar: "salón",      arasaac: 6211,  variantes: ["salon", "salón"] },
  { palabra: "BAÑO",       tipo: "directa", silabas: 2, categoria: "habitaciones", pictograma: "bano.png",       buscar: "cuarto de baño", arasaac: 6929, variantes: ["baño", "bano"] },
  { palabra: "DORMITORIO", tipo: "trabada", silabas: 4, categoria: "habitaciones", pictograma: "dormitorio.png", buscar: "dormitorio", arasaac: 5988,  variantes: ["dormitorio", "habitacion"] },
  { palabra: "JARDÍN",     tipo: "inversa", silabas: 2, categoria: "habitaciones", pictograma: "jardin.png",     buscar: "jardín",     arasaac: 2434,  variantes: ["jardin", "jardín"] },
  { palabra: "GARAJE",     tipo: "directa", silabas: 3, categoria: "habitaciones", pictograma: "garaje.png",     buscar: "garaje",     arasaac: 6003,  variantes: ["garaje"] },

  // ===========================================================================
  //  EL BAÑO  ·  objetos del cuarto de baño
  // ===========================================================================
  { palabra: "DUCHA",   tipo: "directa", silabas: 2, categoria: "bano", pictograma: "ducha.png",   buscar: "ducha",   arasaac: 32426, variantes: ["ducha"] },
  { palabra: "VÁTER",   tipo: "directa", silabas: 2, categoria: "bano", pictograma: "vater.png",   buscar: "váter",   arasaac: 2430,  variantes: ["vater", "váter", "water", "inodoro"] },
  { palabra: "LAVABO",  tipo: "directa", silabas: 3, categoria: "bano", pictograma: "lavabo.png",  buscar: "lavabo",  arasaac: 2441,  variantes: ["lavabo"] },
  { palabra: "BAÑERA",  tipo: "directa", silabas: 3, categoria: "bano", pictograma: "banera.png",  buscar: "bañera",  arasaac: 2272,  variantes: ["bañera", "banera"] },
  { palabra: "ESPEJO",  tipo: "inversa", silabas: 3, categoria: "bano", pictograma: "espejo.png",  buscar: "espejo",  arasaac: 8573,  variantes: ["espejo"] },
  { palabra: "TOALLA",  tipo: "directa", silabas: 3, categoria: "bano", pictograma: "toalla.png",  buscar: "toalla",  arasaac: 2593,  variantes: ["toalla"] },
  { palabra: "JABÓN",   tipo: "directa", silabas: 2, categoria: "bano", pictograma: "jabon.png",   buscar: "jabón",   arasaac: 8094,  variantes: ["jabon", "jabón"] },
  { palabra: "CEPILLO", tipo: "directa", silabas: 3, categoria: "bano", pictograma: "cepillo.png", buscar: "cepillo de dientes", arasaac: 2694, variantes: ["cepillo"] },

  // ===========================================================================
  //  COCINA  ·  objetos
  // ===========================================================================
  { palabra: "NEVERA",  tipo: "directa", silabas: 3, categoria: "cocina", pictograma: "nevera.png",  buscar: "nevera",  arasaac: 3272, variantes: ["nevera", "frigorifico"] },
  { palabra: "HORNO",   tipo: "inversa", silabas: 2, categoria: "cocina", pictograma: "horno.png",   buscar: "horno",   arasaac: 2426, variantes: ["horno"] },
  { palabra: "SARTÉN",  tipo: "inversa", silabas: 2, categoria: "cocina", pictograma: "sarten.png",  buscar: "sartén",  arasaac: 2558, variantes: ["sarten", "sartén"] },
  { palabra: "CUCHARA", tipo: "directa", silabas: 3, categoria: "cocina", pictograma: "cuchara.png", buscar: "cuchara", arasaac: 2362, variantes: ["cuchara"] },
  { palabra: "TENEDOR", tipo: "directa", silabas: 3, categoria: "cocina", pictograma: "tenedor.png", buscar: "tenedor", arasaac: 2588, variantes: ["tenedor"] },
  { palabra: "VASO",    tipo: "directa", silabas: 2, categoria: "cocina", pictograma: "vaso.png",    buscar: "vaso",    arasaac: 2610, variantes: ["vaso"] },

  // ===========================================================================
  //  LA CASA  ·  objetos del salón y la casa
  // ===========================================================================
  { palabra: "SOFÁ",     tipo: "directa", silabas: 2, categoria: "casa", pictograma: "sofa.png",     buscar: "sofá",     arasaac: 25479, variantes: ["sofa", "sofá"] },
  { palabra: "TELE",     tipo: "directa", silabas: 2, categoria: "casa", pictograma: "tele.png",     buscar: "televisión", arasaac: 25498, variantes: ["tele", "television", "televisor"] },
  { palabra: "LÁMPARA",  tipo: "directa", silabas: 3, categoria: "casa", pictograma: "lampara.png",  buscar: "lámpara",  arasaac: 4936,  variantes: ["lampara", "lámpara"] },
  { palabra: "PUERTA",   tipo: "directa", silabas: 2, categoria: "casa", pictograma: "puerta.png",   buscar: "puerta",   arasaac: 3244,  variantes: ["puerta"] },
  { palabra: "VENTANA",  tipo: "directa", silabas: 3, categoria: "casa", pictograma: "ventana.png",  buscar: "ventana",  arasaac: 2611,  variantes: ["ventana"] },
  { palabra: "RELOJ",    tipo: "directa", silabas: 2, categoria: "casa", pictograma: "reloj.png",    buscar: "reloj",    arasaac: 2549,  variantes: ["reloj"] },
  { palabra: "ARMARIO",  tipo: "inversa", silabas: 3, categoria: "casa", pictograma: "armario.png",  buscar: "armario",  arasaac: 2258,  variantes: ["armario", "ropero"] },
  { palabra: "ESCALERA", tipo: "inversa", silabas: 4, categoria: "casa", pictograma: "escalera.png", buscar: "escalera", arasaac: 2379,  variantes: ["escalera"] },
  { palabra: "LLAVE",    tipo: "directa", silabas: 2, categoria: "casa", pictograma: "llave.png",    buscar: "llave",    arasaac: 8153,  variantes: ["llave"] },

  // ===========================================================================
  //  LUGARES  ·  sitios fuera de casa
  // ===========================================================================
  { palabra: "PARQUE",   tipo: "inversa", silabas: 2, categoria: "lugares", pictograma: "parque.png",   buscar: "parque",   arasaac: 2859,  variantes: ["parque"] },
  { palabra: "COLEGIO",  tipo: "directa", silabas: 3, categoria: "lugares", pictograma: "colegio.png",  buscar: "colegio",  arasaac: 32446, variantes: ["colegio", "cole", "escuela"] },
  { palabra: "GRANJA",   tipo: "trabada", silabas: 2, categoria: "lugares", pictograma: "granja.png",   buscar: "granja",   arasaac: 32482, variantes: ["granja"] },
  { palabra: "PISCINA",  tipo: "directa", silabas: 3, categoria: "lugares", pictograma: "piscina.png",  buscar: "piscina",  arasaac: 30516, variantes: ["piscina"] },
  { palabra: "MONTAÑA",  tipo: "directa", silabas: 3, categoria: "lugares", pictograma: "montana.png",  buscar: "montaña",  arasaac: 2909,  variantes: ["montaña", "montana"] },
  { palabra: "ZOO",      tipo: "directa", silabas: 1, categoria: "lugares", pictograma: "zoo.png",      buscar: "zoo",      arasaac: 4773,  variantes: ["zoo", "zoologico"] },
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
  { id: "habitaciones", nombre: "Cuartos",  emoji: "🚪" },
  { id: "cocina",     nombre: "Cocina",     emoji: "🍽️" },
  { id: "bano",       nombre: "El baño",    emoji: "🚿" },
  { id: "naturaleza", nombre: "Naturaleza", emoji: "🌳" },
  { id: "lugares",    nombre: "Lugares",    emoji: "🏞️" },
  { id: "cuentos",    nombre: "Cuentos",    emoji: "🧙" },
  { id: "objetos",    nombre: "Objetos",    emoji: "🧲" },
  { id: "juguetes",   nombre: "Juguetes",   emoji: "🪁" },
  { id: "transporte", nombre: "Transporte", emoji: "🚗" },
  { id: "ropa",       nombre: "Ropa",       emoji: "👕" },
  { id: "verbos",     nombre: "Acciones",   emoji: "🏃" },
  { id: "colores",    nombre: "Colores",    emoji: "🎨" },
  { id: "numeros",    nombre: "Números",    emoji: "🔢" },
  { id: "deportes",   nombre: "Deportes",   emoji: "⚽" },
  { id: "basicas",    nombre: "Básicas",    emoji: "👍" },
];
