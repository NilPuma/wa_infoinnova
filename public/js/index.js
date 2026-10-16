// ============================================================
// INDEX.JS - LANDING PAGE
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  inicializarStaggerReveal();    // PRIMERO: aplica --retraso antes de observar
  inicializarScrollReveal();     // DESPUÉS: observa los .reveal
  inicializarMenuMovil();
  inicializarToastCerrar();
  inicializarHeaderScroll();
  inicializarContadores();
  inicializarHeroSlider();       // Slider de fondo del hero
});

// ============================================================
// EFECTO DE REVELADO AL HACER SCROLL
// ============================================================
function inicializarScrollReveal() {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function(el) { el.classList.add('is-visible'); });
    return;
  }

  revealEls.forEach(function(el) { el.classList.add('reveal-ready'); });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealEls.forEach(function(el) { observer.observe(el); });
}

// ============================================================
// REVEAL ESCALONADO — DELAY POR CARD
// ============================================================
function inicializarStaggerReveal() {
  var cards = document.querySelectorAll('.soluciones-grid .reveal, .videos-grid .reveal');
  if (!cards.length) return;

  cards.forEach(function(el, i) {
    el.style.setProperty('--retraso', ((i % 5) * 90) + 'ms');
  });
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
  var toast = document.getElementById('toastCertificado');
  var icono = document.getElementById('toastIcono');
  var elTitulo = document.getElementById('toastTitulo');
  var elMensaje = document.getElementById('toastMensaje');

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
  var btnCerrar = document.getElementById('toastCerrar');
  var toast = document.getElementById('toastCertificado');
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