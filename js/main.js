/* Nevada · heladería (demo)
   - Enlaces de WhatsApp con mensaje escrito
   - Carta de sabores ligada al scroll (GSAP + ScrollTrigger)
   - «Arma tu helado»: arma el pedido y lo envía por WhatsApp */

// Número del negocio en formato internacional sin «+» ni espacios (ej. 51987654321).
// Vacío: WhatsApp se abre y el visitante elige a quién enviar el mensaje.
const WHATSAPP_NUMBER = '';

const waLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const isDesktop = window.matchMedia('(min-width: 900px)');

/* ---------- WhatsApp ---------- */
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = waLink(a.dataset.wa);
});

/* ---------- Datos de sabores (leídos del HTML) ---------- */
const stage = document.querySelector('.flavors__stage');
const articles = [...document.querySelectorAll('.flavor')];
const flavors = articles.map((el) => {
  const css = getComputedStyle(el);
  return {
    el,
    id: el.id,
    name: el.dataset.name,
    bg: css.getPropertyValue('--bg').trim(),
    ink: css.getPropertyValue('--ink').trim(),
    accent: css.getPropertyValue('--accent').trim(),
  };
});

/* ---------- Decoración: chispas y gotas por sabor ---------- */
function seeded(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function buildDecor() {
  const count = isDesktop.matches ? 16 : 8;
  flavors.forEach((f, i) => {
    const layer = f.el.querySelector('.flavor__decor');
    layer.textContent = '';
    const rand = seeded(97 * (i + 3));
    const palette = [f.ink, f.accent, '#FFFFFF', f.ink];
    for (let n = 0; n < count; n++) {
      const p = document.createElement('span');
      const kind = rand();
      const depth = 0.25 + rand() * 0.9;
      // Evita el centro (donde está la foto): reparte a los lados
      const side = n % 2 === 0 ? 3 + rand() * 27 : 68 + rand() * 22;
      const size = 8 + depth * 14;
      p.className = kind > 0.82 ? 'piece piece--ring' : 'piece';
      const isSprinkle = kind < 0.55;
      p.style.cssText = [
        `--x:${side}%`,
        `--y:${(isDesktop.matches ? 20 : 24) + rand() * (isDesktop.matches ? 40 : 18)}%`,
        `--w:${isSprinkle ? size * 0.55 : size}px`,
        `--h:${isSprinkle ? size * 1.9 : size}px`,
        `--r:${Math.round(rand() * 180)}deg`,
        `--c:${palette[n % palette.length]}`,
        `--d:${depth.toFixed(2)}`,
        `opacity:${(0.55 + depth * 0.45).toFixed(2)}`,
      ].join(';');
      p.dataset.depth = depth.toFixed(2);
      const inner = document.createElement('span');
      inner.className = 'piece__in';
      p.appendChild(inner);
      layer.appendChild(p);
    }
  });
}
buildDecor();

/* ---------- Estado activo (puntos, título, inert) ---------- */
const dots = [...document.querySelectorAll('.flavors__dots a')];
let active = -1;

function setActive(i) {
  if (i === active) return;
  active = i;
  const f = flavors[i];
  flavors.forEach((g, j) => {
    const on = j === i;
    g.el.classList.toggle('is-active', on);
    if (document.documentElement.classList.contains('is-cinematic')) g.el.inert = !on;
  });
  dots.forEach((d, j) => d.setAttribute('aria-current', j === i ? 'true' : 'false'));
  stage.style.setProperty('--title-ink', f.ink);
  stage.style.setProperty('--dot-ring', f.ink);
  document.querySelector('.flavors').classList.toggle('is-past-first', i > 0);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = f.bg;
}

/* ---------- Carta de sabores cinematográfica ---------- */
let flavorTrigger = null;
const STEP = 1.3; // duración de cada cambio + pausa en la timeline

function goTo(i) {
  const idx = Math.max(0, Math.min(flavors.length - 1, i));
  if (!flavorTrigger) {
    document.getElementById(flavors[idx].id).scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const y = flavorTrigger.labelToScroll(`f${idx}`);
  window.scrollTo({ top: y, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
}

function initCinematic() {
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  document.documentElement.classList.add('is-cinematic');

  const parts = flavors.map((f) => ({
    word: f.el.querySelector('.flavor__word'),
    frame: f.el.querySelector('.flavor__frame'),
    img: f.el.querySelector('.flavor__frame img'),
    copy: [...f.el.querySelectorAll('.flavor__copy > *'), f.el.querySelector('.flavor__cta')],
    pieces: [...f.el.querySelectorAll('.piece')],
  }));

  const tl = gsap.timeline({ defaults: { ease: 'none' } });
  tl.addLabel('f0', 0.15);

  for (let i = 1; i < flavors.length; i++) {
    const t = (i - 1) * STEP + 0.3;
    const prev = parts[i - 1];
    const next = parts[i];

    tl.to(stage, { backgroundColor: flavors[i].bg, duration: 0.8, ease: 'power1.inOut' }, t)
      // Sale el sabor anterior
      .to(prev.word, { xPercent: -35, opacity: 0, duration: 0.55, ease: 'power2.in' }, t)
      .to(prev.frame, { yPercent: -6, scale: 0.9, opacity: 0, duration: 0.6, ease: 'power2.in' }, t + 0.1)
      .to(prev.copy, { y: -28, opacity: 0, duration: 0.3, stagger: 0.04 }, t)
      .to(prev.pieces, { y: (k, el) => -260 * el.dataset.depth, opacity: 0, duration: 0.7, ease: 'power1.in' }, t)
      // Entra el nuevo: la bola «sube» desde abajo
      .fromTo(next.frame, { clipPath: 'inset(100% 0% 0% 0%)', opacity: 1 }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'power2.out' }, t + 0.25)
      .fromTo(next.img, { scale: 1.3 }, { scale: 1, duration: 1, ease: 'power2.out' }, t + 0.2)
      .fromTo(next.word, { xPercent: 35, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, t + 0.4)
      .fromTo(next.pieces, { y: (k, el) => 260 * el.dataset.depth, opacity: 0 }, { y: 0, opacity: (k, el) => 0.55 + el.dataset.depth * 0.45, duration: 0.8, ease: 'power2.out' }, t + 0.2)
      .fromTo(next.copy, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' }, t + 0.6)
      .addLabel(`f${i}`, i * STEP + 0.15);
  }
  tl.to({}, { duration: 0.3 }); // pausa final antes de soltar el escenario

  flavorTrigger = ScrollTrigger.create({
    trigger: '.flavors',
    pin: stage,
    start: 'top top',
    end: () => `+=${(flavors.length - 1) * window.innerHeight * 0.9}`,
    scrub: 0.6,
    animation: tl,
    invalidateOnRefresh: true,
    snap: {
      snapTo: 'labels',
      inertia: false,
      duration: { min: 0.25, max: 0.7 },
      delay: 0.08,
      ease: 'power2.inOut',
    },
  });

  // El sabor activo sigue a la animación (que va con retraso suave respecto al scroll)
  tl.eventCallback('onUpdate', () => {
    const i = Math.round((tl.time() - 0.15) / STEP);
    setActive(Math.max(0, Math.min(flavors.length - 1, i)));
  });

  // Sección «De cerca»: la foto se acerca al entrar
  gsap.fromTo('.texture__media img', { scale: 1.18 }, {
    scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.texture', start: 'top bottom', end: 'center center', scrub: true },
  });
  gsap.from('.texture__copy > *', {
    y: 40, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
    scrollTrigger: { trigger: '.texture', start: 'top 65%' },
  });
  gsap.from('.end__big', {
    yPercent: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.end', start: 'top 75%' },
  });

  // Parallax con el cursor (solo ratón)
  if (finePointer.matches) {
    let raf = 0;
    stage.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = stage.getBoundingClientRect();
        stage.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        stage.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
    });
    stage.addEventListener('pointerleave', () => {
      stage.style.setProperty('--px', 0);
      stage.style.setProperty('--py', 0);
    });
  }

  // Deslizar a los lados en pantallas táctiles
  let sx = 0, sy = 0;
  stage.addEventListener('touchstart', (e) => {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) goTo(active + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // Teclado: flechas izquierda/derecha cuando el foco está en la carta
  stage.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(active - 1); }
  });

  // Reconstruir decoración si cambia de móvil a escritorio
  isDesktop.addEventListener('change', () => window.location.reload());
}

dots.forEach((d, i) => d.addEventListener('click', (e) => {
  e.preventDefault();
  goTo(i);
}));

function start() {
  setActive(0);
  if (window.gsap && window.ScrollTrigger && !reduceMotion.matches) {
    initCinematic();
  }
}

/* ---------- Arma tu helado ---------- */
const form = document.getElementById('builder');
const rowsBox = form.querySelector('.scoop-rows');
const preview = document.querySelector('.build__preview');
const treat = preview.querySelector('.treat');
const scoopsBox = treat.querySelector('.treat__scoops');
const summary = form.querySelector('.summary');
const sendBtn = document.getElementById('build-send');
const countLabel = form.querySelector('[data-count-label]');
const MAX = 3;
const defaults = ['sabor-fresa', 'sabor-pistacho', 'sabor-cookies'];

// Color de cada bola dibujada
const scoopColor = {
  'sabor-fresa': '#F4A3B4',
  'sabor-pistacho': '#A9C977',
  'sabor-frambuesa': '#C94A73',
  'sabor-cookies': '#F3EADB',
  'sabor-fiesta': '#FFF1C9',
};
for (let n = 0; n < MAX; n++) {
  const row = document.createElement('fieldset');
  row.className = 'scoop-row';
  const legend = document.createElement('legend');
  legend.textContent = `Bola ${n + 1}`;
  legend.dataset.n = n + 1;
  const choices = document.createElement('div');
  choices.className = 'choices';
  flavors.forEach((f) => {
    const label = document.createElement('label');
    label.className = 'choice';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `bola${n + 1}`;
    input.value = f.id;
    input.checked = f.id === defaults[n];
    const span = document.createElement('span');
    const sw = document.createElement('i');
    sw.className = 'swatch';
    sw.style.setProperty('--c', scoopColor[f.id]);
    span.append(sw, document.createTextNode(f.name));
    label.append(input, span);
    choices.append(label);
  });
  row.append(legend, choices);
  rowsBox.append(row);
}

const previewBg = {
  'sabor-fresa': '#F6A9BC',
  'sabor-pistacho': '#BCD98A',
  'sabor-frambuesa': '#E7A3B9',
  'sabor-cookies': '#9FD8F0',
  'sabor-fiesta': '#FFE24A',
};
const sprinkleColors = ['#EC5C77', '#2535C9', '#FFE24A', '#1FAF5A', '#FF8A3D'];

let lastKey = '';

function readForm() {
  const data = new FormData(form);
  const formato = data.get('formato');
  const bolas = Number(data.get('bolas'));
  const sabores = [];
  for (let n = 1; n <= bolas; n++) sabores.push(data.get(`bola${n}`));
  return {
    formato,
    bolas,
    sabores,
    toppings: data.getAll('topping'),
    nombre: (data.get('nombre') || '').trim(),
  };
}

function nameOf(id) {
  return flavors.find((f) => f.id === id)?.name ?? id;
}

function render() {
  const o = readForm();
  const isPote = o.formato.startsWith('Pote');
  countLabel.textContent = isPote ? 'Sabores' : 'Bolas';
  rowsBox.querySelectorAll('.scoop-row').forEach((row, i) => {
    row.hidden = i >= o.bolas;
    row.querySelector('legend').textContent = `${isPote ? 'Sabor' : 'Bola'} ${i + 1}`;
  });

  // Dibujo: solo se rehace si cambió algo visible
  const key = JSON.stringify([o.formato, o.sabores, o.toppings]);
  if (key !== lastKey) {
    const prevCount = scoopsBox.querySelectorAll('.scoop').length;
    lastKey = key;
    treat.dataset.format = isPote ? 'pote' : o.formato.toLowerCase();
    scoopsBox.textContent = '';
    o.sabores.forEach((id, i) => {
      const s = document.createElement('div');
      s.className = 'scoop';
      s.style.setProperty('--c', scoopColor[id]);
      if (i < prevCount) s.style.animation = 'none';
      scoopsBox.append(s);
    });
    const top = o.sabores[o.sabores.length - 1];
    preview.style.setProperty('--preview-bg', previewBg[top]);

    const extras = document.createElement('div');
    extras.className = 'sprinkles';
    const rand = seeded(7);
    if (o.toppings.includes('Salsa de chocolate')) {
      const sauce = document.createElement('div');
      sauce.className = 'sauce';
      scoopsBox.append(sauce);
    }
    if (o.toppings.includes('Chispas de colores')) {
      for (let n = 0; n < 16; n++) {
        const sp = document.createElement('i');
        sp.className = 'sprinkle';
        sp.style.cssText = `left:${12 + rand() * 72}%;top:${2 + rand() * 26}%;--r:${Math.round(rand() * 180)}deg;--c:${sprinkleColors[n % sprinkleColors.length]};animation-delay:${n * 15}ms`;
        extras.append(sp);
      }
    }
    if (o.toppings.includes('Nueces tostadas')) {
      for (let n = 0; n < 7; n++) {
        const nut = document.createElement('i');
        nut.className = 'nut';
        nut.style.cssText = `left:${16 + rand() * 64}%;top:${4 + rand() * 20}%;--r:${Math.round(rand() * 90)}deg;animation-delay:${n * 25}ms`;
        extras.append(nut);
      }
    }
    scoopsBox.append(extras);
  }

  // Resumen y mensaje
  const unidad = isPote ? (o.bolas === 1 ? 'sabor' : 'sabores') : (o.bolas === 1 ? 'bola' : 'bolas');
  const lista = o.sabores.map(nameOf).join(', ');
  const topping = o.toppings.length ? o.toppings.join(', ') : 'Sin topping';
  summary.textContent = '';
  const strong = document.createElement('strong');
  strong.textContent = `${o.formato} · ${o.bolas} ${unidad}`;
  summary.append(strong, document.createTextNode(`\n${lista}\nTopping: ${topping}`));

  const lines = [
    'Hola Nevada 👋 Quiero pedir:',
    `• Formato: ${o.formato}`,
    `• ${o.bolas} ${unidad}: ${lista}`,
    `• Topping: ${topping}`,
  ];
  if (o.nombre) lines.push(`A nombre de: ${o.nombre}`);
  lines.push('¿Me confirman disponibilidad y precio?');
  sendBtn.href = waLink(lines.join('\n'));
}

form.addEventListener('input', render);
form.addEventListener('submit', (e) => e.preventDefault());
render();

/* ---------- Arranque ---------- */
// Los scripts usan «defer»: GSAP ya está cargado (o falló) cuando llega aquí.
start();
// Recalcular posiciones cuando terminen de cargar fuentes e imágenes
window.addEventListener('load', () => window.ScrollTrigger?.refresh(), { once: true });

