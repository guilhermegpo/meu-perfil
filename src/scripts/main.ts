import { initMotion } from './motion';
import { initNav } from './nav';
import { initReveal } from './reveal';

initNav();
initReveal();
initMotion();

// O ano do rodapé é o do visitante; o HTML traz o do build como valor inicial.
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = String(new Date().getFullYear());
});
