// Muestra cada elemento cuando entra en pantalla.
const elementosEntrada = document.querySelectorAll(".reveal");
const observadorEntrada = new IntersectionObserver((entradas, observador) => {
  entradas
    .filter((entrada) => entrada.isIntersecting)
    .forEach((entrada) => {
      entrada.target.classList.add("is-visible");
      observador.unobserve(entrada.target);
    });
}, { threshold: 0.12 });

elementosEntrada.forEach((elemento) => observadorEntrada.observe(elemento));