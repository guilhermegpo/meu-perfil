/**
 * Movimento: parallax da cena do hero, tilt dos cartões e o equivalente para
 * telas de toque.
 *
 * Regras que valem para tudo aqui:
 *  - só `transform` e variáveis CSS, aplicados em `requestAnimationFrame`;
 *  - o laço para sozinho quando nada mais muda e não roda fora da viewport;
 *  - nenhum ouvinte de ponteiro é registrado em toque, e todo handler
 *    reconsulta `prefers-reduced-motion` no momento em que roda.
 */
import { finePointer, motionAllowed, touchOnly } from './env';

/** Limites do tilt dos cartões, em graus. */
const TILT_X = 4;
const TILT_Y = 6;

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export function initMotion(): void {
  initScene();
  initTilt();
  initTouchLight();
}

/* ------------------------------------------------------------------ hero -- */

function initScene(): void {
  const host = document.querySelector<HTMLElement>('[data-scene-host]');
  const scene = host?.querySelector<HTMLElement>('[data-scene]');
  if (!host || !scene) return;

  let inView = true;
  let raf = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const paint = (): void => {
    raf = 0;
    currentX += (targetX - currentX) * 0.09;
    currentY += (targetY - currentY) * 0.09;
    scene.style.setProperty('--px', currentX.toFixed(3));
    scene.style.setProperty('--py', currentY.toFixed(3));

    const settled = Math.abs(targetX - currentX) < 0.002 && Math.abs(targetY - currentY) < 0.002;
    if (!settled && inView) raf = requestAnimationFrame(paint);
  };

  const schedule = (): void => {
    if (!raf && inView) raf = requestAnimationFrame(paint);
  };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      scene.dataset.inview = String(inView);
      if (inView) schedule();
    }).observe(host);
  }

  if (finePointer.matches) {
    host.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse' || !motionAllowed()) return;
      const rect = host.getBoundingClientRect();
      targetX = clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      targetY = clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1);
      schedule();
    });

    host.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
      schedule();
    });
  }

  // Parallax de rolagem: a cena sobe um pouco mais devagar que a página.
  let scrollRaf = 0;
  const onScroll = (): void => {
    if (scrollRaf || !inView || !motionAllowed()) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      const progress = clamp(window.scrollY / Math.max(host.offsetHeight, 1), 0, 1);
      scene.style.setProperty('--sp', progress.toFixed(3));
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------------------------------------------------------------- cartões -- */

function initTilt(): void {
  if (!finePointer.matches) return;

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    let raf = 0;
    let pending: { rx: number; ry: number; mx: number; my: number } | null = null;

    const apply = (): void => {
      raf = 0;
      if (!pending) return;
      card.style.setProperty('--rx', `${pending.rx.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${pending.ry.toFixed(2)}deg`);
      card.style.setProperty('--mx', `${pending.mx.toFixed(1)}%`);
      card.style.setProperty('--my', `${pending.my.toFixed(1)}%`);
    };

    const queue = (next: typeof pending): void => {
      pending = next;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    card.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') card.dataset.tilting = 'true';
    });

    card.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse' || !motionAllowed()) return;
      // O invólucro externo não gira, então o retângulo não oscila com o tilt.
      const rect = card.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      queue({ rx: (0.5 - y) * 2 * TILT_X, ry: (x - 0.5) * 2 * TILT_Y, mx: x * 100, my: y * 100 });
    });

    card.addEventListener('pointerleave', () => {
      card.dataset.tilting = 'false';
      queue({ rx: 0, ry: 0, mx: 50, my: 30 });
    });
  });
}

/**
 * Toque não tem hover. O cartão que ocupa o centro da tela ganha luz e
 * profundidade, guiado pela rolagem em vez de pelo cursor.
 */
function initTouchLight(): void {
  if (!touchOnly.matches || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        (entry.target as HTMLElement).dataset.lit = String(entry.isIntersecting);
      }
    },
    { rootMargin: '-32% 0px -32% 0px', threshold: 0 },
  );

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => observer.observe(card));
}
