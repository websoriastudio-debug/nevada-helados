# Nevada · Especificación visual y de movimiento

## Idea
«Un sabor, un mundo». Cada sabor ocupa la pantalla entera con su color, su nombre gigante detrás y la foto dentro de un arco con forma de bola de helado. Al bajar, la carta cambia de sabor.

## Sistema visual
| Elemento | Valor |
|---|---|
| Tipografía títulos | Bricolage Grotesque 700–800, ancho 75–85 % (nombres gigantes y titulares) |
| Tipografía texto | DM Sans 400/500/700 |
| Base | Crema `#FFF6EA`, chocolate `#2A1A10`, WhatsApp `#0E7A3C` (verde oscurecido para que el texto blanco cumpla contraste AA) |
| Fresa & nata | fondo `#F6A9BC` · texto `#4A0F22` · acento `#EC5C77` |
| Pistacho & cacao | fondo `#BCD98A` · texto `#1D2F0E` · acento `#7FA344` |
| Frambuesa & yogur | fondo `#7E1F3F` · texto `#FFE6EE` · acento `#B23A62` |
| Cookies & crema | fondo `#F1E6D3` · texto `#2A1A10` · acento `#1FA8DF` |
| Vainilla fiesta | fondo `#2535C9` · texto `#FFE24A` · acento `#3E4FE0` |
| Formas | Arco (cúpula) para las fotos, píldoras para botones y etiquetas, radio 28 px en tarjetas |

Los colores de cada sabor se cambian en el atributo `style` de cada `<article class="flavor">` y en los puntos de `.flavors__dots`.

## Recorrido
1. **Carta de sabores (portada)**: escenario fijo de 100 svh; 5 sabores ≈ 0,9 pantallas de scroll cada uno.
2. **De cerca**: foto de textura que se funde con el fondo amarillo; datos de la base.
3. **Arma tu helado**: helado dibujado en CSS que se actualiza en vivo + formulario → WhatsApp.
4. **Visítanos**: vitrina, dirección y horario (de ejemplo).
5. **Cierre**: «¿Se te antojó?» + botón de WhatsApp + créditos.

## Movimiento
- **Efecto principal (GSAP ScrollTrigger, ligado al scroll con `scrub` y ajuste a cada sabor)**: el fondo se funde al color siguiente; la foto anterior se aleja y la nueva «sube» desde abajo (clip-path); el nombre gigante cruza de derecha a izquierda; las chispas salen hacia arriba y entran desde abajo según su profundidad; el texto entra escalonado.
- **Apoyo**: chispas que siguen al cursor (solo ratón); zoom suave de la foto «De cerca»; botones 200 ms; bolas del armador con «pop» de 450 ms.
- **Navegación**: puntos laterales (abajo de la foto en móvil), flechas ← → con el foco en la carta y deslizar a los lados en pantallas táctiles.
- **Movimiento reducido / sin JavaScript**: cada sabor es una sección normal a pantalla completa; sin fijado, sin parallax.

## Móvil
Foto arriba (≈ 44 svh), puntos debajo, texto y botón ancho abajo. En pantallas bajas se ocultan descripción y etiquetas para que nada se tape. Comprobado a 360, 390, 768 y 1440 px.

