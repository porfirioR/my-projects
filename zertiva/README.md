# landing-page — Zertiva

Landing page estática (HTML + Tailwind vía CDN, sin build).

Archivos:

- `index.html` — la página.
- `styles.css` — CSS propio (variables de marca, animación de la ruta SVG, FAQ).
- `main.js` — JS propio (año del footer, menú móvil).
- `404.html` — página de error, `noindex`.
- `robots.txt`, `sitemap.xml` — SEO técnico.
- `favicon.svg` — favicon vectorial generado con el wordmark.
- `site.webmanifest` — PWA / iconos.

Todos los datos ya son los reales de Zertiva: colores, wordmark, WhatsApp (+595 981 421 777, con mensaje predefinido), correo (ana.lesme@zertiva.com.py), dirección e Instagram.

## Assets que faltan generar (binarios, no se pueden crear desde código acá)

El `<head>` y el manifest ya los referencian; hay que subir los archivos a la raíz:

- `og-image.jpg` — 1200×630 px, para la previsualización al compartir el link (Open Graph + Twitter Card). Sin esto el link se comparte sin imagen.
- `favicon.ico` — 32×32 (fallback para navegadores viejos). El `favicon.svg` ya está.
- `apple-touch-icon.png` — 180×180.
- `android-chrome-192x192.png` y `android-chrome-512x512.png` — para el manifest.
- `logo.png` — logo cuadrado sobre fondo transparente, referenciado en el JSON-LD (`Organization.logo`).

Un generador tipo <https://realfavicongenerator.net> produce todo el set a partir de un PNG de origen.

## Redirecciones (configurar en el hosting, no en el código)

El `canonical` apunta a `https://www.zertiva.com.py/`. En Cloudflare Pages / Netlify hay que forzar:

- `http://` → `https://`
- `zertiva.com.py` (sin www) → `www.zertiva.com.py`

Si no, Google puede indexar versiones duplicadas.

## Deploy — importante si este repo tiene más proyectos

Este repo (`my-projects`) parece un monorepo con varias carpetas. **GitHub Pages solo sirve un sitio por repositorio** (la raíz o `/docs`), así que no podés apuntar tu dominio solo a la carpeta `landing-page` usando GitHub Pages directamente sin que interfiera con tus otros proyectos.

Opciones recomendadas:

1. **Cloudflare Pages o Netlify** (recomendado): conectás el repo, y en la configuración de build seteás el **"directorio raíz" / "base directory"** como `landing-page`. Sin build command (es HTML estático). Cada push a `main` despliega solo. Después apuntás tu dominio `.com.py` ahí (registros DNS que te van a indicar en el panel).
2. **Repo separado solo para la landing**: creás `zertiva-landing` aparte y usás GitHub Pages normal con `CNAME`.

## Después de publicar

1. Alta y verificación del sitio en **Google Search Console**, enviar `sitemap.xml`.
2. Crear/reclamar **Google Business Profile** con el mismo nombre, teléfono y dirección que aparecen acá (consistencia NAP).
3. Vincular **Google Analytics (GA4)** si querés medir tráfico.
4. Poner el link del sitio en la bio de Instagram y en el perfil de WhatsApp Business.
