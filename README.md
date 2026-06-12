# 🗣️ El juego de hablar de Daniela

App/web para que Daniela (6 años) practique la **pronunciación de sílabas y
palabras**. En pantalla aparece un **pictograma** + la palabra en **MAYÚSCULAS**;
ella la dice y, si lo hace bien, avanza con una celebración. Pensada para usarse
en **móvil Android, iPhone y tablets**.

> Fase actual: **palabras de 1 sílaba** (directas y trabadas). Las inversas y las
> de 2 y 3 sílabas llegarán en próximas iteraciones.

---

## ✨ Cómo es el juego

- **Para la niña**: solo ve un dibujo grande, la palabra, y un botón de micro 🎤.
  Toca el micro, dice la palabra y, si acierta, ¡fiesta! 🎉
- **Para el adulto** (tú): un botón ⚙️ arriba a la derecha abre los ajustes:
  - **Tipo de sílaba**: Directas / Trabadas (Inversas, próximamente).
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
- Funciona **muy bien en Chrome (Android)**.
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
