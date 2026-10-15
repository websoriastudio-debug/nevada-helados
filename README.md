# Nevada · web de heladería (demo)

Web estática (HTML + CSS + JavaScript, sin compilación). Usa GSAP 3.12.5 y ScrollTrigger desde cdnjs.

## Ver en local
Desde la carpeta `WEBSORIASTUDIO (PROYECTOS)`:

```bash
py -m http.server 4180
```

Abre `http://localhost:4180/conceptos/nevada-helados/`. Hace falta conexión a internet para fuentes, GSAP y fotos.

## Editar
- **WhatsApp**: en `js/main.js`, `WHATSAPP_NUMBER = ''` → pon el número con código de país, sin «+» ni espacios (ej. `51987654321`). Vacío, WhatsApp pide elegir el contacto.
- **Mensajes de cada botón**: atributo `data-wa` en `index.html`.
- **Sabores**: cada `<article class="flavor">` en `index.html` (nombre, texto, foto, colores `--bg/--ink/--accent`, y `--k` = tamaño del nombre gigante; menos letras → número mayor). Si cambias la cantidad, actualiza también los puntos `.flavors__dots` y `scoopColor`/`previewBg` en `js/main.js`.
- **Datos del local**: sección `#visitanos`.

## Fotos (Unsplash, licencia gratuita)
Se cargan desde `images.unsplash.com` (hotlink, como recomienda Unsplash) con tamaños adaptados.

| Uso | Autor | Enlace |
|---|---|---|
| Fresa & nata | ian dooley | https://unsplash.com/photos/TLD6iCOlyb0 |
| Pistacho & cacao | Rosa Rafael | https://unsplash.com/photos/Nag3E3yzygU |
| Frambuesa & yogur | Orissa Humes | https://unsplash.com/photos/_gN4PnJ3ygg |
| Cookies & crema | Omar Al-Ghosson | https://unsplash.com/photos/Nucr4ReLWUg |
| Vainilla fiesta | Zach Camp | https://unsplash.com/photos/3D0HUHFcRrk |
| De cerca | Oddfellows Ice Cream | https://unsplash.com/photos/skOe_mh7UPk |
| Visítanos | Lama Roscu | https://unsplash.com/photos/Wpg3Qm0zaGk |

Son fotos de referencia: no muestran el producto de un negocio real. Para un cliente, sustituirlas por fotos propias (mismo encuadre vertical y fondo de color liso).

## Limitaciones
- Marca, textos, ingredientes, dirección y horario son de ejemplo.
- WhatsApp solo abre un mensaje redactado; no hay precios, stock, pagos ni pedidos en línea.

