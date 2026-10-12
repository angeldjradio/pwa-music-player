# Live Pulse Radio

Reproductor PWA profesional para escuchar una emisora en directo desde tu navegador o como app instalada.

## Características
- Diseño moderno y responsivo
- Reproducción directa del stream
- Estado de conexión en vivo
- Controles de reproducción, volumen y silencio
- Instalación como PWA en móvil o escritorio
- Soporte para navegación offline con Service Worker

## Stream configurado
- https://stream.zeno.fm/laig88avevmuv

## Ejecutar localmente

Recomendado usar un servidor local simple:

```bash
python3 -m http.server 8000
```

Luego abre:

```text
http://localhost:8000
```

## Instalar como app
- Abre la página en Chrome/Edge
- Haz clic en el botón de instalación o en el menú del navegador
- Elige “Instalar app”

## Archivos principales
- `index.html`: estructura de la interfaz
- `styles.css`: diseño visual
- `app.js`: lógica del reproductor y PWA
- `manifest.webmanifest`: configuración de instalación
- `sw.js`: caché offline
