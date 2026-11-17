'use strict';

// ============ MODO CLARO / OSCURO ============
const raiz = document.documentElement;
const botonTema = document.getElementById('cambiarTema');
const claveTema = 'tema-forangel';

function actualizarBotonTema() {
  const oscuro = raiz.dataset.theme === 'dark';
  botonTema.setAttribute('aria-label', oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  botonTema.title = oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', oscuro ? '#0B1F3B' : '#EAF2FF');
}

botonTema.addEventListener('click', () => {
  const nuevoTema = raiz.dataset.theme === 'dark' ? 'light' : 'dark';
  raiz.dataset.theme = nuevoTema;
  try { localStorage.setItem(claveTema, nuevoTema); } catch (_) {}
  actualizarBotonTema();
});
actualizarBotonTema();

// ============ HAMBURGUESA / MENÚ LATERAL ============
const botonMenu = document.getElementById('abrirMenu');
const botonCerrar = document.getElementById('cerrarMenu');
const menu = document.getElementById('menuPrincipal');
const fondoMenu = document.getElementById('fondoMenu');
const limiteMovil = window.matchMedia('(max-width: 980px)');

function menuEstaAbierto() {
  return document.body.classList.contains('menu-abierto');
}

function abrirMenu() {
  if (!limiteMovil.matches || menuEstaAbierto()) return;
  fondoMenu.hidden = false;
  document.body.classList.add('menu-abierto');
  botonMenu.setAttribute('aria-expanded', 'true');
  botonMenu.setAttribute('aria-label', 'Cerrar menú');
  botonCerrar.focus();
}

function cerrarMenu({ devolverFoco = true } = {}) {
  if (!menuEstaAbierto()) return;
  document.body.classList.remove('menu-abierto');
  fondoMenu.hidden = true;
  botonMenu.setAttribute('aria-expanded', 'false');
  botonMenu.setAttribute('aria-label', 'Abrir menú');
  if (devolverFoco) botonMenu.focus();
}

botonMenu.addEventListener('click', () => {
  if (menuEstaAbierto()) cerrarMenu();
  else abrirMenu();
});
botonCerrar.addEventListener('click', () => cerrarMenu());
fondoMenu.addEventListener('click', () => cerrarMenu());

menu.querySelectorAll('a').forEach(enlace => {
  enlace.addEventListener('click', () => cerrarMenu({ devolverFoco: false }));
});

document.addEventListener('keydown', (evento) => {
  if (!menuEstaAbierto()) return;
  if (evento.key === 'Escape') { cerrarMenu(); return; }

  // Mantener el foco dentro del menú mientras está abierto.
  if (evento.key !== 'Tab') return;
  const elementos = [...menu.querySelectorAll('a, button')].filter(el => !el.disabled);
  const primero = elementos[0];
  const ultimo = elementos.at(-1);
  if (evento.shiftKey && document.activeElement === primero) {
    evento.preventDefault(); ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault(); primero.focus();
  }
});

limiteMovil.addEventListener('change', () => cerrarMenu({ devolverFoco: false }));

// ============ DETALLES DEL SITIO ============
document.getElementById('anioActual').textContent = new Date().getFullYear();

// Si todavía no copiaste el logo original, mostrar FORANGEL como texto.
const logo = document.getElementById('logoMarca');
const logoFallback = document.getElementById('logoFallback');
logo.addEventListener('error', () => {
  logo.hidden = true;
  logoFallback.hidden = false;
});
