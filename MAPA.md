# 🗺️ MAPA del proyecto — dónde tocar para cada cambio

Guía rápida para saber **qué archivo y qué sección** hay que cambiar según lo que
quieras hacer. Pensada para no perder tiempo (ni tokens) buscando.

> Regla de oro: **los datos van en `js/datos.js`**, **la lógica en `js/app.js`**,
> **el aspecto en `css/estilos.css`**. La estructura de la pantalla en `index.html`.

---

## 📁 Los archivos, de un vistazo

| Archivo | Qué contiene | Tamaño |
|---------|--------------|--------|
| `js/datos.js` | **Las palabras** y las **familias silábicas** (MA, ME…). Categorías, tipos. | mediano |
| `js/app.js` | **Toda la lógica del juego**: rondas, progreso, currículo, panel de ajustes. | grande |
| `js/reconocimiento.js` | **Voz**: reconocer lo que dice + niveles de tolerancia + hablar en voz alta. | pequeño |
| `css/estilos.css` | **Diseño**: colores, tamaños, animaciones (globo, micro, tarjeta). | grande |
| `index.html` | **Esqueleto** de la pantalla y del panel de ajustes. | pequeño |
| `scripts/descargar_pictogramas.mjs` | Baja los dibujos de ARASAAC (lee `datos.js`). | pequeño |
| `sw.js` / `manifest.json` | Que funcione como app instalable y sin internet. | mínimo |

---

## 🎯 "Quiero hacer X" → toca esto

### ➕ Añadir / quitar una PALABRA
- **Archivo:** `js/datos.js` → array `PALABRAS`
- Copia una línea, cambia `palabra`, `tipo`, `silabas`, `categoria`, `pictograma`, `buscar`.
- Si el dibujo de ARASAAC no es el bueno, añade `arasaac: NÚMERO` con el id correcto.
- Después: ejecutar `node scripts/descargar_pictogramas.mjs` para bajar el dibujo.

### 🖼️ Cambiar un DIBUJO que no gusta
- Opción A: pon el `arasaac: id` correcto en `js/datos.js` y re-descarga con `--forzar`.
- Opción B: reemplaza el PNG a mano en `img/pictogramas/` (mismo nombre).
- Dibujos hechos a mano (GOL, SÍ, NO): llevan `local: true` y el script NO los toca.

### 🔡 Añadir / cambiar SÍLABAS (modo Lectura Silábica)
- **Archivo:** `js/datos.js` → array `FAMILIAS_SILABICAS`
- Cada familia (M, P, S…) tiene sus 5 sílabas con sus `variantes` de voz.

### 🗂️ Añadir una CATEGORÍA nueva (campo semántico)
- **Archivo:** `js/datos.js` → array `CATEGORIAS` (añade `{ id, nombre, emoji }`).
- Luego pon palabras con esa `categoria`. El panel solo muestra las que tienen palabras.

### 🎨 Cambiar COLORES, tamaños o animaciones
- **Archivo:** `css/estilos.css`
- Los colores están arriba del todo en `:root` (variables `--blue`, `--green`…).
- Animaciones: busca `@keyframes` (globo = `volar`, micro = `latido`, tarjeta = `saltar`).

### 🎤 Cambiar cómo se RECONOCE la voz (tolerancia, niveles)
- **Archivo:** `js/reconocimiento.js`
- Niveles: array `NIVELES`. Cómo decide si acierta: función `coincideUna`.

### 🗣️ Cambiar cómo HABLA la app (velocidad, tono)
- **Archivo:** `js/reconocimiento.js` → función `decirEnVozAlta` (`rate`, `pitch`).

### 🧠 Cambiar la LÓGICA de avance / progreso
- **Lectura Global** (palabras): `js/app.js` → `construirSecuencia` y `marcarAcierto/Fallo`.
- **Lectura Silábica** (currículo automático): `js/app.js` → sección
  "CURRÍCULO SILÁBICO" (`familiaActiva`, `silabasIntroducidas`, `construirSecuenciaSilabica`).
- Umbrales (cuándo se da por dominada): constantes `DOM_*` arriba de cada bloque.

### ⚙️ Cambiar el PANEL de ajustes (papá)
- **Estructura visual:** `index.html` → `<aside id="panel">`.
- **Contenido (los botones):** `js/app.js` → función `construirPanel`.
- **Modos de juego disponibles:** `js/app.js` → array `MODOS`.

### 🎈 Cambiar la RECOMPENSA (globo, celebración)
- **Archivo:** `js/app.js` → `lanzarGlobo`, `explotarGlobo`, `celebrar`.
- Cada cuántos aciertos sale: constante `META_RECOMPENSA`.

---

## 🧩 Cómo encajan las piezas (flujo del juego)

```
prepararMazo()          → arma la lista de palabras/sílabas de la ronda
   └─ palabrasFiltradas()   (según el modo elegido en el panel)
   └─ construirSecuencia()  (mezcla fáciles + difíciles · práctica inteligente)
mostrarPalabra()        → pinta la tarjeta (dibujo + palabra, o sílaba sola)
   └─ escucharUnaVez()      (motor de voz continuo)
        ├─ acierta → acertar()    → celebra, marca progreso, siguiente()
        └─ falla   → reintentar() → dice el modelo y vuelve a escuchar
```

---

## 💡 Sobre los tokens (por qué a veces "cuesta")

La app es **pequeña** (~2.000 líneas). No hace falta partirla en más archivos todavía:
hacerlo ahora añadiría complejidad y riesgo de romper algo sin ganar gran cosa.

Lo que **sí** ahorra tiempo y tokens es **este MAPA**: dice exactamente qué trozo
mirar, en vez de releer todo. Cuando pidas un cambio, basta con decir el "Quiero
hacer X" y se va directo al archivo correcto.

**Cuándo merecería la pena partir `app.js` en varios archivos:** cuando pase de
~1.200–1.500 líneas o cuando un bloque (p. ej. el currículo silábico) crezca mucho
y se toque a menudo por separado. Hoy todavía no.
