# landing-page — Zertiva

Landing page estática (HTML + Tailwind vía CDN, sin build).

Estructura:

```text
zertiva/
├── index.html            página principal
├── 404.html               página de error, noindex
├── css/
│   └── styles.css         variables de marca, animación de la ruta SVG, FAQ
├── js/
│   └── main.js             año del footer, menú móvil
├── assets/
│   └── images/             og-image.jpg, logo.png (faltan subir, ver abajo)
├── favicon.ico             (falta subir — ver abajo)
├── favicon.svg             favicon vectorial, ya generado con el wordmark
├── site.webmanifest        PWA / iconos
├── robots.txt
├── sitemap.xml
└── README.md
```

`favicon.ico` va sí o sí en la raíz (los navegadores lo piden ahí por convención, aunque no haya `<link>`); el resto de los iconos (`apple-touch-icon.png`, `android-chrome-*.png`) también se dejaron en la raíz junto al manifest por la misma razón. Las imágenes de contenido (`og-image.jpg`, `logo.png`) van en `assets/images/`.

Todos los datos ya son los reales de Zertiva: colores, wordmark, WhatsApp (+595 981 421 777, con mensaje predefinido), correo (ana.lesme@zertiva.com.py), dirección e Instagram.

## Assets que faltan generar (binarios, no se pueden crear desde código acá)

El `<head>` y el manifest ya los referencian; solo hay que subir los archivos a la carpeta indicada:

- ~~`assets/images/og-image.jpg`~~ — listo: `assets/images/image-1.jpg` (1200×630, 127KB, foto del puerto), usada en Open Graph + Twitter Card + JSON-LD.
- `assets/images/logo.png` — logo cuadrado sobre fondo transparente, referenciado en el JSON-LD (`Organization.logo`).
- `favicon.ico` (raíz) — 32×32 (fallback para navegadores viejos). El `favicon.svg` ya está.
- `apple-touch-icon.png` (raíz) — 180×180.
- `android-chrome-192x192.png` y `android-chrome-512x512.png` (raíz) — para el manifest.

Un generador tipo <https://realfavicongenerator.net> produce todo el set a partir de un PNG de origen.

## Redirecciones (configurar en el hosting, no en el código)

El `canonical` apunta a `https://www.zertiva.com.py/`. En Cloudflare Pages / Netlify hay que forzar:

- `http://` → `https://`
- `zertiva.com.py` (sin www) → `www.zertiva.com.py`

Si no, Google puede indexar versiones duplicadas.

## Deploy de prueba en GitHub Pages (monorepo)

Este repo (`my-projects`) tiene varias carpetas (`password-generator`, `registro-unico-contribuyente`, `zertiva`). GitHub Pages nativo (branch + carpeta `/` o `/docs`) sirve **todo el repo**, así que no alcanza para publicar solo esta carpeta.

Para probar sin tocar los demás proyectos se agregó un workflow de GitHub Actions: [`.github/workflows/deploy-zertiva-pages.yml`](../.github/workflows/deploy-zertiva-pages.yml) (vive en la raíz del monorepo, los workflows siempre van ahí). Qué hace:

- Se dispara solo con cambios bajo `zertiva/**` (o manualmente desde la pestaña Actions).
- Empaqueta **únicamente** la carpeta `zertiva/` como artifact de Pages — el resto del repo nunca se incluye ni se toca.
- Publica ese artifact con `actions/deploy-pages`.

Pasos manuales (una sola vez, en GitHub, no vía código):

1. **Settings → Pages** del repo → en "Build and deployment" → **Source: GitHub Actions** (no "Deploy from a branch").
2. Hacer push a `main` con cambios en `zertiva/` (o correr el workflow manualmente desde Actions → "Deploy Zertiva (GitHub Pages)" → Run workflow).
3. La URL de prueba queda en `https://porfirior.github.io/my-projects/` (Pages de proyecto, no de usuario). Todos los links del sitio ya son relativos, así que funcionan bajo ese subpath.

Limitaciones de esta URL de prueba (no pasa nada, es solo para probar):

- El `canonical`, Open Graph, Twitter Card y JSON-LD siguen apuntando a `https://www.zertiva.com.py/` (el dominio real) — no se van a corregir automáticamente para la URL de `github.io`.
- `robots.txt` / `sitemap.xml` no tienen efecto real en un subpath de `github.io` (los buscadores solo miran `robots.txt` en la raíz del dominio).

Para producción real (dominio propio `.com.py`), lo recomendado sigue siendo:

1. **Cloudflare Pages o Netlify**: conectás el repo, y en la configuración de build seteás el **"directorio raíz" / "base directory"** como `zertiva`. Sin build command (es HTML estático). Cada push a `main` despliega solo esa carpeta. Después apuntás tu dominio `.com.py` ahí.
2. **Repo separado solo para la landing**: creás `zertiva-landing` aparte y usás GitHub Pages normal con `CNAME`.

## Después de publicar

1. Alta y verificación del sitio en **Google Search Console**, enviar `sitemap.xml`.
2. Crear/reclamar **Google Business Profile** con el mismo nombre, teléfono y dirección que aparecen acá (consistencia NAP).
3. Vincular **Google Analytics (GA4)** si querés medir tráfico.
4. Poner el link del sitio en la bio de Instagram y en el perfil de WhatsApp Business.
