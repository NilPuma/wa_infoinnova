// ============================================================
// INDEX.JS - LANDING PAGE (base de trabajo)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
  inicializarScrollReveal();
  inicializarMenuMovil();
  inicializarToastCerrar();
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