'use strict';
// ============================================================
// 1. MODO CLARO / OSCURO
// ============================================================

const raiz = document.documentElement;
const botonTema = document.getElementById('cambiarTema');
const claveTema = 'tema-forangel';

const logo = document.getElementById('logoMarca');
const logoSimple = document.getElementById('logoSimple');
const footerLogo = document.getElementById('footer__logo');
const footerInstagram = document.getElementById('footer__instagram');
const favicon = document.getElementById('favicon');

function actualizarBotonTema() {
    const oscuro = raiz.dataset.theme === 'dark';

    const nombreAccion = oscuro
        ? 'Cambiar a modo claro'
        : 'Cambiar a modo oscuro';

    botonTema.setAttribute('aria-label', nombreAccion);
    botonTema.title = nombreAccion;

    logo.src = oscuro
        ? 'Images/Logo/Logo modo claro.png'
        : 'Images/Logo/Logo modo oscuro.png';

    logoSimple.src = oscuro
        ? 'Images/Logo/Logo simple blanco sin relleno.png'
        : 'Images/Logo/Logo simple oscuro sin relleno.png';

    footerLogo.src = oscuro
        ? 'Images/Logo/Logo modo claro.png'
        : 'Images/Logo/Logo modo oscuro.png';

    footerInstagram.src = oscuro
        ? 'Images/Logo/Instagram Logo.png'
        : 'Images/Logo/Instagram Logo oscuro.png';

    favicon.href = oscuro
        ? 'Images/Logo/Icono oscuro.ico'
        : 'Images/Logo/Icono claro.ico';

    document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute(
            'content',
            oscuro ? '#0B1F3B' : '#EAF2FF'
        );
}

botonTema.addEventListener('click', () => {
    const nuevoTema = raiz.dataset.theme === 'dark'
        ? 'light'
        : 'dark';

    raiz.dataset.theme = nuevoTema;

    try {
        localStorage.setItem(claveTema, nuevoTema);
    } catch (error) {
        // El cambio de tema sigue funcionando sin almacenamiento.
    }

    actualizarBotonTema();
});

actualizarBotonTema();


// ============================================================
// 2. HEADER ADAPTABLE AL SCROLL
// ============================================================

const header = document.querySelector('header');

function actualizarHeaderScroll() {
    const compacto = header.classList.contains('scrolled');

    if (!compacto && window.scrollY >= 130) {
        header.classList.add('scrolled');
    } else if (compacto && window.scrollY <= 70) {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', actualizarHeaderScroll, {
    passive: true
});

actualizarHeaderScroll();

// Si el logo pequeño no se carga, se mantiene el logo completo.
logoSimple.addEventListener('error', () => {
    header.classList.add('logo-simple-error');
});

if (logoSimple.complete && logoSimple.naturalWidth === 0) {
    header.classList.add('logo-simple-error');
}


// ============================================================
// 3. MENÚ LATERAL / HAMBURGUESA
// ============================================================

const botonMenu = document.getElementById('abrirMenu');
const botonCerrar = document.getElementById('cerrarMenu');
const menu = document.getElementById('menuPrincipal');
const fondoMenu = document.getElementById('fondoMenu');
const limiteMovil = window.matchMedia('(max-width: 980px)');

function menuEstaAbierto() {
    return document.body.classList.contains('menu-abierto');
}

function abrirMenu() {
    if (!limiteMovil.matches || menuEstaAbierto()) {
        return;
    }

    fondoMenu.hidden = false;
    document.body.classList.add('menu-abierto');

    botonMenu.setAttribute('aria-expanded', 'true');
    botonMenu.setAttribute('aria-label', 'Cerrar menú');

    botonCerrar.focus();
}

function cerrarMenu({ devolverFoco = true } = {}) {
    if (!menuEstaAbierto()) {
        return;
    }

    document.body.classList.remove('menu-abierto');
    fondoMenu.hidden = true;

    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.setAttribute('aria-label', 'Abrir menú');

    if (devolverFoco) {
        botonMenu.focus();
    }
}

botonMenu.addEventListener('click', () => {
    if (menuEstaAbierto()) {
        cerrarMenu();
    } else {
        abrirMenu();
    }
});

botonCerrar.addEventListener('click', () => {
    cerrarMenu();
});

fondoMenu.addEventListener('click', () => {
    cerrarMenu();
});

menu.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
        cerrarMenu({ devolverFoco: false });
    });
});

document.addEventListener('keydown', (evento) => {
    if (!menuEstaAbierto()) {
        return;
    }

    if (evento.key === 'Escape') {
        cerrarMenu();
        return;
    }

    if (evento.key !== 'Tab') {
        return;
    }

    const elementos = [
        ...menu.querySelectorAll('a, button')
    ].filter((elemento) => !elemento.disabled);

    const primero = elementos[0];
    const ultimo = elementos.at(-1);

    if (!primero || !ultimo) {
        return;
    }

    if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
    }
});

limiteMovil.addEventListener('change', () => {
    cerrarMenu({ devolverFoco: false });
});


// ============================================================
// 4. DETALLES DEL SITIO
// ============================================================

document.getElementById('anioActual').textContent =
    new Date().getFullYear();

const logoFallback = document.getElementById('logoFallback');

logo.addEventListener('error', () => {
    logo.hidden = true;
    logoFallback.hidden = false;
});


// ============================================================
// 5. NAVEGACIÓN ENTRE SECCIONES
// ============================================================

const enlacesSeccion = [
    ...menu.querySelectorAll('a[href^="#"]')
];

const seccionesNavegables = enlacesSeccion
    .map((enlace) => {
        const destino = enlace.getAttribute('href');
        return destino ? document.querySelector(destino) : null;
    })
    .filter(Boolean);

function marcarSeccionActual() {
    const limite = window.scrollY + Math.max(
        150,
        window.innerHeight * 0.35
    );

    let actual = seccionesNavegables[0];

    for (const seccion of seccionesNavegables) {
        if (seccion.offsetTop <= limite) {
            actual = seccion;
        }
    }

    if (!actual) {
        return;
    }

    for (const enlace of enlacesSeccion) {
        const activo = enlace.getAttribute('href') === `#${actual.id}`;

        enlace.classList.toggle('activo', activo);

        if (activo) {
            enlace.setAttribute('aria-current', 'location');
        } else {
            enlace.removeAttribute('aria-current');
        }
    }
}

window.addEventListener('scroll', marcarSeccionActual, {
    passive: true
});

window.addEventListener('resize', marcarSeccionActual, {
    passive: true
});

marcarSeccionActual();


// ============================================================
// 6. EJEMPLOS DE SOLUCIONES
// ============================================================

// Para agregar otro ejemplo, añadí otro objeto a este arreglo con sus capturas.
// Las capturas están en Images/Ejemplos/ y se muestran en el orden indicado.
const ejemplosProyectos = [
    {
        nombre: 'Recursos INADI',
        tipo: 'PORTAL DE RECURSOS EDUCATIVOS',
        titulo: 'Recursos INADI — Portal de recursos educativos',

        portada: 'Images/Ejemplos/Recursos de Inadi/Portada - Recursos.png',

        descripcion: 'Una plataforma para acceder, buscar y administrar recursos educativos mediante una interfaz sencilla, con acceso de usuarios y herramientas de gestión.',
        imagenes: [
            { archivo: 'Images/Ejemplos/Recursos de Inadi/Pantalla de acceso.png', descripcion: 'Pantalla de acceso' },
            { archivo: 'Images/Ejemplos/Recursos de Inadi/Vista del administrador.png', descripcion: 'Vista del administrador' },
            { archivo: 'Images/Ejemplos/Recursos de Inadi/Gestionar estudiantes.png', descripcion: 'Gestión estudiantil' },
            { archivo: 'Images/Ejemplos/Recursos de Inadi/Agregar recurso.png', descripcion: 'Formulario para agregar un recurso' },
            { archivo: 'Images/Ejemplos/Recursos de Inadi/Vista del estudiante.png', descripcion: 'Vista del estudiante' }
        ]
    },
    {
        nombre: 'INSOFT',
        tipo: 'SISTEMA DE GESTIÓN ACADÉMICA',

        portada: 'Images/Ejemplos/INSOFT/Portada - INSOFT.png',

        titulo: 'INSOFT — Sistema de gestión académica',
        descripcion: 'Plataforma integral de gestión educativa que permite comercializar cursos, administrar matrículas y pagos, gestionar aulas virtuales y centralizar la administración académica e institucional. (Proyecto Universitario de ejemplo).',
        imagenes: [
            { archivo: 'Images/Ejemplos/INSOFT/Sitio de inicio.png', descripcion: 'Portal principal del estudiante' },
            { archivo: 'Images/Ejemplos/INSOFT/Inicio de sesion.png', descripcion: 'Inicio de sesión' },
            { archivo: 'Images/Ejemplos/INSOFT/Verificación de correo.png', descripcion: 'Verificación de correo electrónico' },
            { archivo: 'Images/Ejemplos/INSOFT/Cursos matriculados.png', descripcion: 'Cursos en los que está matriculado el estudiante' },
            { archivo: 'Images/Ejemplos/INSOFT/Calendario estudiantil.png', descripcion: 'Calendario académico y actividades' }
        ]
    },
    {
        nombre: 'Gestión de restaurante',
        tipo: 'SISTEMA DE GESTIÓN COMERCIAL',
        titulo: 'Restaurante — Sistema de gestión comercial',

        portada: 'Images/Ejemplos/Sistema de gestión de restaurante/Portada - Sist. Rest..png',

        descripcion: 'Una aplicación de gestión con pantallas para organizar mesas, gestionar reservas, registrar productos y realizar la facturación. (Proyecto Universitario de ejemplo para un restaurante).',
        imagenes: [
            { archivo: 'Images/Ejemplos/Sistema de gestión de restaurante/Acceso.png', descripcion: 'Acceso al sistema' },
            { archivo: 'Images/Ejemplos/Sistema de gestión de restaurante/Mesas.png', descripcion: 'Administración de mesas' },
            { archivo: 'Images/Ejemplos/Sistema de gestión de restaurante/Reservas.png', descripcion: 'Gestión de reservas' },
            { archivo: 'Images/Ejemplos/Sistema de gestión de restaurante/Registro Prod..png', descripcion: 'Registro de productos' },
            { archivo: 'Images/Ejemplos/Sistema de gestión de restaurante/Facturación.png', descripcion: 'Comprobante de facturación' }
        ]
    }
];

const carruselEjemplos = document.getElementById('carruselEjemplos');

if (carruselEjemplos && ejemplosProyectos.length > 0) {
    const tarjetas = {
        anterior: carruselEjemplos.querySelector('[data-pos="anterior"]'),
        central: carruselEjemplos.querySelector('[data-pos="central"]'),
        siguiente: carruselEjemplos.querySelector('[data-pos="siguiente"]')
    };
    const indicadores = document.getElementById('ejemplosIndicadores');
    const titulo = document.getElementById('ejemploTitulo');
    const descripcion = document.getElementById('ejemploDescripcion');
    const tipo = document.getElementById('ejemploTipo');
    const pieCaptura = document.getElementById('ejemploCaptura');
    const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
    const TIEMPO_CAPTURA = 4200; // milisegundos entre capturas del ejemplo seleccionado

    // Cada ejemplo recuerda dónde iba su reproducción al volver a seleccionarlo.
    const ultimaCaptura = ejemplosProyectos.map(() => 0);
    let seleccionado = ejemplosProyectos.length > 1 ? 1 : 0;
    let intervaloCapturas = null;
    let estaVisible = true;
    let cambioEnCurso = 0;

    const visorAmpliado = document.getElementById('visorAmpliado');
    const imagenAmpliada = document.getElementById('imagenAmpliada');
    const cerrarVisor = document.getElementById('cerrarVisor');

    let temporizadorClick = null;

    function posicionCircular(indice) {
        return (indice + ejemplosProyectos.length) % ejemplosProyectos.length;
    }

    function imagenActual(indice) {
        return ejemplosProyectos[indice].imagenes[ultimaCaptura[indice]];
    }

    function dibujarTarjeta(tarjeta, indice, rol) {
        if (ejemplosProyectos.length === 1 && rol !== 'central') {
            tarjeta.hidden = true;
            return;
        }
        // Si solo hay dos, no se repite la misma miniatura a ambos lados.
        if (ejemplosProyectos.length === 2 && rol === 'siguiente') {
            tarjeta.hidden = true;
            return;
        }
        tarjeta.hidden = false;
        const proyecto = ejemplosProyectos[indice];
        // Fuera de selección se muestra siempre la portada, no la captura actual.
        const captura = rol === 'central'
            ? imagenActual(indice)
            : {
                archivo: proyecto.portada,
                descripcion: `Portada de ${proyecto.nombre}`
            };
        tarjeta.dataset.indice = String(indice);
        tarjeta.querySelector('.ejemplo-tarjeta__pie').textContent = proyecto.nombre;
        tarjeta.setAttribute('aria-label', rol === 'central'
            ? `Siguiente imagen de ${proyecto.nombre}`
            : `Seleccionar ${proyecto.nombre}`);
        tarjeta.setAttribute('aria-current', rol === 'central' ? 'true' : 'false');
        const imagenes = tarjeta.querySelectorAll('.ejemplo-tarjeta__imagen');
        // Se descartan las capas anteriores cuando cambia el proyecto seleccionado.
        imagenes[0].src = captura.archivo;
        imagenes[0].alt = `${proyecto.nombre}: ${captura.descripcion}`;
        imagenes[0].classList.add('es-visible');
        imagenes[1].removeAttribute('src');
        imagenes[1].alt = '';
        imagenes[1].classList.remove('es-visible');
        tarjeta.dataset.capaVisible = '0';
    }

    function actualizarTextoCaptura() {
        const proyecto = ejemplosProyectos[seleccionado];
        const captura = imagenActual(seleccionado);
        pieCaptura.textContent = `${captura.descripcion} · Captura ${ultimaCaptura[seleccionado] + 1} de ${proyecto.imagenes.length}`;
    }

    function actualizarIndicadores() {
        [...indicadores.children].forEach((boton, indice) => {
            const activo = indice === seleccionado;
            boton.classList.toggle('esta-activo', activo);
            if (activo) {
                boton.setAttribute('aria-current', 'true');
            } else {
                boton.removeAttribute('aria-current');
            }
        });
    }

    function dibujarCarrusel() {
        cambioEnCurso++;
        dibujarTarjeta(tarjetas.anterior, posicionCircular(seleccionado - 1), 'anterior');
        dibujarTarjeta(tarjetas.central, seleccionado, 'central');
        dibujarTarjeta(tarjetas.siguiente, posicionCircular(seleccionado + 1), 'siguiente');

        const proyecto = ejemplosProyectos[seleccionado];
        tipo.textContent = proyecto.tipo;
        titulo.textContent = proyecto.titulo;
        titulo.setAttribute('aria-label', proyecto.titulo);
        descripcion.textContent = proyecto.descripcion;
        actualizarTextoCaptura();
        actualizarIndicadores();
    }

    function detenerReproduccion() {
        if (intervaloCapturas !== null) {
            window.clearInterval(intervaloCapturas);
            intervaloCapturas = null;
        }
    }

    function iniciarReproduccion() {
        detenerReproduccion();
        if (estaVisible && !document.hidden
                && !visorAmpliado.open
                && !movimientoReducido.matches
                && ejemplosProyectos[seleccionado].imagenes.length > 1) {
            intervaloCapturas = window.setInterval(avanzarCaptura, TIEMPO_CAPTURA);
        }
    }

    function avanzarCaptura() {
        const proyecto = ejemplosProyectos[seleccionado];
        if (proyecto.imagenes.length < 2) return;
        ultimaCaptura[seleccionado] = (ultimaCaptura[seleccionado] + 1) % proyecto.imagenes.length;
        const nueva = imagenActual(seleccionado);
        const tarjeta = tarjetas.central;
        const imagenes = tarjeta.querySelectorAll('.ejemplo-tarjeta__imagen');
        const capaActual = Number(tarjeta.dataset.capaVisible || 0);
        const otraCapa = 1 - capaActual;
        const imagenSiguiente = imagenes[otraCapa];
        const identificador = ++cambioEnCurso;

        imagenSiguiente.src = nueva.archivo;
        imagenSiguiente.alt = `${proyecto.nombre}: ${nueva.descripcion}`;
        actualizarTextoCaptura();
        const revelar = () => {
            if (identificador !== cambioEnCurso) return;
            imagenSiguiente.classList.add('es-visible');
            imagenes[capaActual].classList.remove('es-visible');
            tarjeta.dataset.capaVisible = String(otraCapa);
        };
        if (imagenSiguiente.complete && imagenSiguiente.naturalWidth > 0) {
            window.requestAnimationFrame(revelar);
        } else {
            imagenSiguiente.addEventListener('load', revelar, { once: true });
        }
    }

    function seleccionarProyecto(indice) {
        seleccionado = posicionCircular(indice);
        dibujarCarrusel();
        iniciarReproduccion();
    }

    ejemplosProyectos.forEach((proyecto, indice) => {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'ejemplos-carrusel__punto';
        boton.setAttribute('aria-label', `Seleccionar ${proyecto.nombre}`);
        boton.addEventListener('click', () => seleccionarProyecto(indice));
        indicadores.appendChild(boton);
    });

    document.getElementById('ejemplosAnterior').addEventListener('click', () => seleccionarProyecto(seleccionado - 1));
    document.getElementById('ejemplosSiguiente').addEventListener('click', () => seleccionarProyecto(seleccionado + 1));

    tarjetas.anterior.addEventListener('click', () => seleccionarProyecto(seleccionado - 1));
    tarjetas.siguiente.addEventListener('click', () => seleccionarProyecto(seleccionado + 1));
    // Un clic: avanzar a la siguiente imagen
    tarjetas.central.addEventListener('click', () => {
        clearTimeout(temporizadorClick);

        temporizadorClick = setTimeout(() => {
            avanzarCaptura();
            iniciarReproduccion();
        }, 260);
    });

    // Doble clic: ampliar la imagen
    tarjetas.central.addEventListener('dblclick', (evento) => {
        evento.preventDefault();
        clearTimeout(temporizadorClick);

        const captura = imagenActual(seleccionado);

        imagenAmpliada.src = captura.archivo;
        imagenAmpliada.alt = captura.descripcion;

        detenerReproduccion();
        visorAmpliado.showModal();
    });

    // Cerrar desde el botón
    cerrarVisor.addEventListener('click', () => {
        visorAmpliado.close();
    });

    // Cerrar al hacer clic fuera de la imagen
    visorAmpliado.addEventListener('click', (evento) => {
        if (evento.target === visorAmpliado) {
            visorAmpliado.close();
        }
    });

    // Reanudar carrusel al cerrar
    visorAmpliado.addEventListener('close', iniciarReproduccion);

    carruselEjemplos.addEventListener('keydown', (evento) => {
        if (evento.key === 'ArrowLeft' || evento.key === 'ArrowRight') {
            evento.preventDefault();
            seleccionarProyecto(seleccionado + (evento.key === 'ArrowRight' ? 1 : -1));
        }
    });

    document.addEventListener('visibilitychange', iniciarReproduccion);
    movimientoReducido.addEventListener('change', iniciarReproduccion);

    if ('IntersectionObserver' in window) {
        const observadorCarrusel = new IntersectionObserver(([entrada]) => {
            estaVisible = entrada.isIntersecting;
            iniciarReproduccion();
        }, { threshold: 0.15 });
        observadorCarrusel.observe(carruselEjemplos);
    }

    dibujarCarrusel();
    iniciarReproduccion();
}


// ============================================================
// 7. PREGUNTAS FRECUENTES
// ============================================================

const preguntas = [
    ...document.querySelectorAll('.faq__lista details')
];

for (const pregunta of preguntas) {
    pregunta.addEventListener('toggle', () => {
        if (!pregunta.open) {
            return;
        }

        for (const otra of preguntas) {
            if (otra !== pregunta) {
                otra.open = false;
            }
        }
    });
}


// ============================================================
// 8. FORMULARIO DE CONSULTA / EMAILJS
// ============================================================

// Estas son claves públicas/identificadores de EmailJS.
// Nunca coloques aquí contraseñas ni claves SMTP privadas.
const EMAILJS_PUBLIC_KEY = 'ZcSNwp3syPthQAsdS';
const EMAILJS_SERVICE_ID = 'service_j5zrphm';
const EMAILJS_TEMPLATE_ID = 'template_mhpwtvc';

const formConsulta = document.getElementById('formConsulta');
const consultaEstado = document.getElementById('consultaEstado');
const botonEnviar = document.getElementById('btnEnviar');
const textoBotonEnviar = document.getElementById('textoBtnEnviar');

// Un solo listener submit: no se prepara un borrador aparte.
if (formConsulta && consultaEstado && botonEnviar) {
    formConsulta.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        if (!formConsulta.reportValidity() || botonEnviar.disabled) {
            return;
        }

        if (typeof window.emailjs === 'undefined') {
            consultaEstado.textContent =
                'No se pudo cargar el servicio de correo. Revisá tu conexión e intentá nuevamente.';
            return;
        }

        botonEnviar.disabled = true;
        formConsulta.setAttribute('aria-busy', 'true');
        textoBotonEnviar.textContent = 'Enviando...';
        consultaEstado.textContent = 'Enviando tu consulta...';

        try {
            emailjs.init({
                publicKey: EMAILJS_PUBLIC_KEY
            });

            await emailjs.sendForm(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                formConsulta
            );

            consultaEstado.hidden = true;

            formConsulta.reset();
            mensajeExito();
            ocultarFormulario();
        } catch (error) {
            console.error('Error al enviar la consulta:', error);

            consultaEstado.textContent =
                'No pudimos enviar tu consulta. Revisá tu conexión e intentá nuevamente.';
        } finally {
            botonEnviar.disabled = false;
            formConsulta.removeAttribute('aria-busy');
            textoBotonEnviar.textContent = 'Enviar consulta';
        }
    });
}

function mensajeExito() {
    const mensaje = document.querySelector('.mensaje-exito');
    if (!mensaje) return;
    mensaje.hidden = false;
    mensaje.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function ocultarFormulario() {
    const formulario = document.querySelector('#formConsulta');
    const titulo = document.querySelector(".contacto__tarjeta-top");
    if (!formulario) return;
    formulario.hidden = true;
    titulo.hidden = true;
}

// ============================================================
// 9. APARICIÓN ENMASCARADA DE LOS TÍTULOS (UNA SOLA VEZ)
// ============================================================
// Conserva los spans originales: sus colores de acento siguen siendo los del tema.
// La animación empieza cuando el título entra en pantalla y nunca desaparece.
(function animarTitulosUnaVez() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const titulos = [...document.querySelectorAll('main h1, main h2, main h3')];
    const observador = 'IntersectionObserver' in window
        ? new IntersectionObserver((entradas) => {
            for (const entrada of entradas) {
                if (!entrada.isIntersecting) continue;
                entrada.target.classList.add('fx-curtain-visible');
                observador.unobserve(entrada.target);
            }
        }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' })
        : null;

    for (const titulo of titulos) {
        const textoCompleto = titulo.textContent.replace(/\s+/g, ' ').trim();
        if (!textoCompleto) continue;

        const nodos = [];
        const walker = document.createTreeWalker(titulo, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            if (walker.currentNode.textContent.trim()) nodos.push(walker.currentNode);
        }
        let indiceLetra = 0;
        for (const nodo of nodos) {
            const fragmento = document.createDocumentFragment();
            // Mantener los espacios originales permite que los títulos se ajusten a cada pantalla.
            for (const parte of nodo.textContent.split(/(\s+)/)) {
                if (!parte) continue;
                if (/^\s+$/.test(parte)) {
                    fragmento.appendChild(document.createTextNode(parte));
                    continue;
                }
                const palabra = document.createElement('em');
                palabra.className = 'fx-curtain-palabra';
                palabra.setAttribute('aria-hidden', 'true');
                for (const letra of [...parte]) {
                    const caracter = document.createElement('b');
                    caracter.className = 'fx-curtain-letra';
                    caracter.style.setProperty('--i', String(indiceLetra++));
                    caracter.textContent = letra;
                    palabra.appendChild(caracter);
                }
                fragmento.appendChild(palabra);
            }
            nodo.replaceWith(fragmento);
        }
        titulo.setAttribute('aria-label', textoCompleto);
        titulo.classList.add('fx-curtain-pendiente');
        if (observador) observador.observe(titulo);
        else titulo.classList.add('fx-curtain-visible');
    }
})();
