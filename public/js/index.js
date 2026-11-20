// ============================================================
// INDEX.JS - LANDING PAGE
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  if (window.AOS) {
    document.documentElement.classList.add("aos-habilitado");
    AOS.init({ offset: 80, duration: 700, easing: 'ease-out-cubic', once: false });
  }
  inicializarCarruselSoluciones();
  inicializarMenuMovil();
  inicializarToastCerrar();
  inicializarHeaderScroll();
  inicializarContadores();
  inicializarHeroSlider();       // Slider de fondo del hero
});

// ============================================================
// CARRUSEL DE SERVICIOS: FLECHAS Y ARRASTRE CON MOUSE
// ============================================================
function inicializarCarruselSoluciones() {
  var lista = document.getElementById('listaSoluciones');
  var anterior = document.querySelector('[data-servicios-anterior]');
  var siguiente = document.querySelector('[data-servicios-siguiente]');
  if (!lista || !anterior || !siguiente) return;

  function actualizarControles() {
    var maximo = lista.scrollWidth - lista.clientWidth;
    anterior.disabled = lista.scrollLeft <= 2;
    siguiente.disabled = lista.scrollLeft >= maximo - 2;
  }

  function desplazar(direccion) {
    var elemento = lista.querySelector('.soluciones-elemento');
    if (!elemento) return;
    var separacion = parseFloat(window.getComputedStyle(lista).columnGap) || 0;
    var paso = elemento.getBoundingClientRect().width + separacion;
    lista.scrollBy({ left: paso * direccion, behavior: 'smooth' });
  }

  anterior.addEventListener('click', function() { desplazar(-1); });
  siguiente.addEventListener('click', function() { desplazar(1); });
  lista.addEventListener('scroll', actualizarControles, { passive: true });
  window.addEventListener('resize', actualizarControles);

  var arrastrando = false;
  var inicioX = 0;
  var desplazamientoInicial = 0;

  lista.addEventListener('pointerdown', function(evento) {
    if (evento.pointerType !== 'mouse' || evento.button !== 0 || evento.target.closest('a, button')) return;
    arrastrando = true;
    inicioX = evento.clientX;
    desplazamientoInicial = lista.scrollLeft;
    lista.classList.add('arrastrando');
    lista.setPointerCapture(evento.pointerId);
  });

  lista.addEventListener('pointermove', function(evento) {
    if (!arrastrando) return;
    lista.scrollLeft = desplazamientoInicial - (evento.clientX - inicioX);
  });

  function terminarArrastre() {
    arrastrando = false;
    lista.classList.remove('arrastrando');
  }

  lista.addEventListener('pointerup', terminarArrastre);
  lista.addEventListener('pointercancel', terminarArrastre);
  lista.addEventListener('lostpointercapture', terminarArrastre);
  actualizarControles();
}

// ============================================================
// MENÚ MÓVIL (HAMBURGUESA + OVERLAY)
// ============================================================
function inicializarMenuMovil() {
  var btnToggle = document.getElementById('ico_menu');
  var iconoToggle = btnToggle ? btnToggle.querySelector('i') : null;
  var overlay = document.getElementById('menuOverlay');
  var menu = document.getElementById('menu');

  if (!btnToggle || !overlay || !menu) return;

  function abrirMenu() {
    document.body.classList.add('menu-abierto');
    btnToggle.setAttribute('aria-expanded', 'true');
    if (iconoToggle) {
      iconoToggle.classList.remove('bi-list');
      iconoToggle.classList.add('bi-x-lg');
    }
  }

  function cerrarMenu() {
    document.body.classList.remove('menu-abierto');
    btnToggle.setAttribute('aria-expanded', 'false');
    if (iconoToggle) {
      iconoToggle.classList.remove('bi-x-lg');
      iconoToggle.classList.add('bi-list');
    }
  }

  btnToggle.addEventListener('click', function() {
    document.body.classList.contains('menu-abierto') ? cerrarMenu() : abrirMenu();
  });

  overlay.addEventListener('click', cerrarMenu);

  menu.querySelectorAll('a, .btn-header').forEach(function(opcion) {
    opcion.addEventListener('click', cerrarMenu);
  });

  window.addEventListener('resize', function() {
    if (window.innerWidth > 991.98 && document.body.classList.contains('menu-abierto')) {
      cerrarMenu();
    }
  });
}

// ============================================================
// TOASTS / ALERTAS PERSONALIZADAS
// ============================================================
var toastTimeoutId = null;

function mostrarToast(tipo, titulo, mensaje) {
  var toast = document.getElementById('notificacionCertificado');
  var icono = document.getElementById('notificacionIcono');
  var elTitulo = document.getElementById('notificacionTitulo');
  var elMensaje = document.getElementById('notificacionMensaje');

  if (!toast || !icono || !elTitulo || !elMensaje) return;

  elTitulo.textContent = titulo;
  elMensaje.textContent = mensaje;

  var iconosPorTipo = {
    exito: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    info: 'bi-info-circle-fill',
    advertencia: 'bi-exclamation-triangle-fill'
  };

  toast.classList.remove('toast-exito', 'toast-error', 'toast-info', 'toast-advertencia');
  icono.classList.remove('bi-check-circle-fill', 'bi-x-circle-fill', 'bi-info-circle-fill', 'bi-exclamation-triangle-fill');

  toast.classList.add('toast-' + tipo);
  icono.classList.add(iconosPorTipo[tipo] || 'bi-info-circle-fill');

  toast.classList.add('is-visible');

  if (toastTimeoutId) clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(function() {
    toast.classList.remove('is-visible');
  }, 4000);
}

function inicializarToastCerrar() {
  var btnCerrar = document.getElementById('notificacionCerrar');
  var toast = document.getElementById('notificacionCertificado');
  if (!btnCerrar || !toast) return;

  btnCerrar.addEventListener('click', function() {
    toast.classList.remove('is-visible');
    if (toastTimeoutId) clearTimeout(toastTimeoutId);
  });
}

// ============================================================
// HEADER — EFECTO GLASS AL HACER SCROLL
// ============================================================
function inicializarHeaderScroll() {
  var header = document.querySelector('.header');
  if (!header) return;

  function actualizarHeader() {
    if (window.scrollY > 30) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', actualizarHeader, { passive: true });
  actualizarHeader(); // Aplicar estado correcto al cargar
}

// ============================================================
// SLIDER DE FONDO DEL HERO
// ============================================================
function inicializarHeroSlider() {
  var slides = document.querySelectorAll('.hero-slider__slide');
  if (slides.length < 2) return;

  // Respetar prefers-reduced-motion: dejar solo la primera imagen
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    slides.forEach(function(s, i) {
      s.classList.toggle('is-active', i === 0);
    });
    return;
  }

  var indiceActual = 0;
  var intervalo = 6000; // 6 segundos por imagen
  var timerId = null;

  function mostrarSlide(nuevoIndice) {
    slides[indiceActual].classList.remove('is-active');
    slides[nuevoIndice].classList.add('is-active');
    indiceActual = nuevoIndice;
  }

  function siguiente() {
    var siguienteIndice = (indiceActual + 1) % slides.length;
    mostrarSlide(siguienteIndice);
  }

  function iniciar() {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(siguiente, intervalo);
  }

  function detener() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // Pausar cuando la pestaña no está visible (ahorro de recursos)
  document.addEventListener('visibilitychange', function() {
    document.hidden ? detener() : iniciar();
  });

  // Iniciar
  iniciar();
}

// ============================================================
// CONTADOR ANIMADO — SE DISPARA AL ENTRAR EN VIEWPORT
// ============================================================
function inicializarContadores() {
  var contadores = document.querySelectorAll('[data-contador]');
  if (!contadores.length) return;

  // Respetar prefers-reduced-motion: mostrar valor final sin animar
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    contadores.forEach(function(el) {
      var meta = parseInt(el.dataset.contador, 10) || 0;
      var sufijo = el.dataset.sufijo || '';
      el.textContent = meta + sufijo;
    });
    return;
  }

  // Fallback si no hay IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    contadores.forEach(function(el) {
      var meta = parseInt(el.dataset.contador, 10) || 0;
      var sufijo = el.dataset.sufijo || '';
      el.textContent = meta + sufijo;
    });
    return;
  }

  function animarContador(el) {
    var meta = parseInt(el.dataset.contador, 10) || 0;
    var sufijo = el.dataset.sufijo || '';
    var duracion = 1200;
    var inicio = performance.now();

    function paso(ahora) {
      var progreso = Math.min((ahora - inicio) / duracion, 1);
      var valor = Math.floor(progreso * meta);
      el.textContent = valor + sufijo;
      if (progreso < 1) {
        requestAnimationFrame(paso);
      } else {
        el.textContent = meta + sufijo; // Asegurar valor final exacto
      }
    }

    requestAnimationFrame(paso);
  }

  var observerContadores = new IntersectionObserver(function(entradas) {
    entradas.forEach(function(entrada) {
      if (entrada.isIntersecting) {
        animarContador(entrada.target);
        observerContadores.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.4 });

  contadores.forEach(function(el) {
    observerContadores.observe(el);
  });
}