# Nevada · Heladería (marca de demostración)

Ficha de decisiones del proyecto. Nevada es una **marca ficticia** creada para mostrar el concepto; no existe un negocio real detrás.

## Decisiones tomadas

| Decisión | Respuesta |
|---|---|
| Nicho | Heladería |
| Tipo de proyecto | Marca de demostración (nombre, sabores, textos, dirección y horario son de ejemplo) |
| Dirección elegida | Ruta A · «Un sabor, un mundo» |
| Acción principal | Botón que abre WhatsApp con el pedido escrito |
| Imágenes | Fotos gratuitas de Unsplash, de alta resolución, servidas desde su CDN |

## Objetivo

Que el visitante se antoje de un sabor y pulse **Pedir por WhatsApp**. Cada sabor, el armador de helado y el cierre llevan a WhatsApp con un mensaje ya redactado.

## Alcance construido

1. Portada / carta de sabores: 5 escenas a pantalla completa ligadas al scroll.
2. «De cerca»: detalle de textura con foto que se funde con el fondo.
3. «Arma tu helado»: formato, nº de bolas, sabor por bola, toppings y nombre → mensaje de WhatsApp.
4. «Visítanos»: local, horario y forma de pedir (datos de ejemplo).
5. Cierre con CTA y créditos de fotos.

## Pendiente para un negocio real

- Número de WhatsApp: editar `WHATSAPP_NUMBER` en `js/main.js`. Vacío = WhatsApp abre el selector de contacto.
- Nombre, logo, sabores reales, textos, dirección y horario.
- Fotos propias de cada sabor con fondo de color liso (mismo ángulo y luz) para sustituir las de Unsplash.
- WhatsApp solo envía un mensaje: no hay disponibilidad, precios, cobro ni catálogo conectado.

