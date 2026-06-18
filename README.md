# 🗣️ El juego de hablar de Daniela

App/web para que Daniela (6 años) practique la **pronunciación de sílabas y
palabras**. En pantalla aparece un **pictograma** + la palabra en **MAYÚSCULAS**;
ella la dice y, si lo hace bien, avanza con una celebración. Pensada para usarse
en **móvil Android, iPhone y tablets**.

> Estado actual: **~171 palabras** en **20 categorías** + **4 modos de juego**
> (Lectura Global, Por campos, Por sonidos y **Lectura Silábica** con currículo
> automático). Diseño "premium" con voz de calidad. Ver `MAPA.md` para saber qué
> archivo tocar en cada cambio.

---

## ✨ Cómo es el juego

- **Para la niña**: solo ve un dibujo grande, la palabra, y un botón de micro 🎤.
  Toca el micro, dice la palabra y, si acierta, ¡fiesta! 🎉
- **Para el adulto** (tú): un botón ⚙️ arriba a la derecha abre los ajustes:
  - **Modo de juego**:
    - *Lectura Global*: palabra + pictograma (reconoce la palabra entera).
    - *Por campos*: eliges una o varias categorías (familia, animales, comida,
      cuartos, el baño, lugares, acciones/verbos, colores…).
    - *Por sonidos (fonemas)*: muchas palabras con el mismo sonido inicial.
    - *Lectura Silábica*: sílabas sueltas (MA ME MI MO MU…) sin pictograma, con
      **currículo automático** que avanza solo (domina una familia antes de pasar
      a la siguiente) y opción MAYÚSCULAS / minúsculas.
  - **Por sílabas** (dentro de Lectura Global): nº de sílabas (1 / 2) y tipo
    (Directas / Inversas / Trabadas). Los botones sin palabras se desactivan.
  - **Aprendizaje**:
    - *Con dibujo* / *Solo leer* (sin dibujo) / *Entreno* (le quita el dibujo
      cuando ya domina la palabra, para que la lea sola; si falla, vuelve).
    - *Práctica inteligente*: las rondas mezclan **varias que domina + 1 que le
      cuesta**. La app aprende sola qué le cuesta (lo ves en "Le cuestan más…")
      y muestra un **resumen de progreso** (palabras y sílabas dominadas).
  - **Velocidad de la voz** (Normal / Lenta / Muy lenta) y **frecuencia del
    premio** (globo cada 3 / 5 / 10 aciertos).
  - **✨ Diversión máxima**: el pictograma + palabra flotan como un **globo** que se
    mueve despacio; cuando ella dice la palabra, el globo **explota** 💥 y aparece
    otro. En este modo el **micro está siempre encendido** (no hay que pulsarlo).
  - **Nivel de exigencia de la voz** (para no frustrarla):
    - 🗣️ *Solo hablar* — vale con que diga algo.
    - 🙂 *Fácil* — se parece bastante.
    - 😀 *Medio* — se parece mucho.
    - 🤩 *Difícil* — lo dice bien.
- Botones de apoyo siempre visibles abajo: **🔊 Oír** (la app pronuncia la
  palabra de modelo), **✓ ¡Bien!** (tú validas a mano) y **⏭️ Otra** (saltar).
- Toca el dibujo para **oír** la palabra.

## 🎤 Sobre el reconocimiento de voz

- Usa la **Web Speech API** del navegador.
- **Escucha continua**: una vez tocado el micro, sigue escuchando solo (aunque
  falle) sin tener que volver a pulsarlo. Si falla, la app dice la palabra de
  modelo y vuelve a escuchar. Se apaga tocando el micro otra vez.
- Funciona **muy bien en Chrome (Android)**.
- La **primera vez** hay que tocar el micro una vez para dar permiso; después,
  en "Diversión máxima", se enciende solo al entrar.
- En **iPhone/Safari** el soporte es limitado; si el dispositivo no reconoce voz,
  la app lo detecta y tú usas el botón verde **✓ ¡Bien!** para que avance.

---

## 📁 Estructura

```
Juego Pronunciacion Daniela/
├── index.html              · pantalla principal
├── manifest.json           · para instalar como app (PWA)
├── sw.js                   · funciona sin internet una vez abierta
├── css/estilos.css         · diseño (grande, alegre, alto contraste)
├── js/
│   ├── datos.js            · LISTA DE PALABRAS  ← aquí se añaden palabras
│   ├── reconocimiento.js   · voz + niveles de dificultad
│   └── app.js              · lógica del juego
├── img/
│   ├── pictogramas/        · imágenes descargadas de ARASAAC
│   └── icono-*.png         · iconos de la app
└── scripts/
    └── descargar_pictogramas.mjs  · descarga los pictogramas de ARASAAC
```

## ➕ Añadir palabras nuevas

1. Abre `js/datos.js` y copia un bloque de palabra, cambiando `palabra`, `tipo`,
   `categoria`, `pictograma` y `buscar`.
2. Ejecuta la descarga de pictogramas:
   ```bash
   node scripts/descargar_pictogramas.mjs
   ```
   (Solo descarga los que faltan. Usa `--forzar` para rebajar todos de nuevo.)
3. Si un pictograma no te gusta, **reemplaza el PNG** en `img/pictogramas/` por
   otro con el mismo nombre.

## ▶️ Probar en el ordenador

El reconocimiento de voz necesita servirse por http (no abrir el archivo suelto):

```bash
cd "Juego Pronunciacion Daniela"
python3 -m http.server 8000
# abre  http://localhost:8000  en Chrome
```

## 📲 Usar en el móvil

1. Súbelo a GitHub (con GitHub Desktop).
2. Actívale **GitHub Pages** (Settings → Pages → rama `main`, carpeta `/root`).
3. Abre la URL que te da GitHub Pages en el móvil → menú del navegador →
   **"Añadir a pantalla de inicio"**. Ya la tienes como app.

---

## 🖼️ Créditos de los pictogramas

Los pictogramas son propiedad del **Gobierno de Aragón** y han sido creados por
**Sergio Palao** para **ARASAAC** (<https://arasaac.org>), que los distribuye
bajo licencia **Creative Commons BY-NC-SA**.
