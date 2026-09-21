/**
 * Contador dos números da faixa de métricas: sobe de 0 até o valor quando o
 * bloco entra na tela, uma vez só. O HTML já traz o valor final, então sem
 * JavaScript ou com movimento reduzido nada muda.
 */
import { reducedMotion } from './env';

const DURATION = 1100;
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export function initCount(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-count]');
  if (targets.length === 0 || reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const format = (n: number): string => Math.round(n).toLocaleString('pt-BR');

  targets.forEach((el) => {
    el.textContent = format(0);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);

        const end = Number(el.dataset.count);
        const start = performance.now();
        const tick = (now: number): void => {
          const t = Math.min((now - start) / DURATION, 1);
          el.textContent = format(end * easeOutCubic(t));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.6 },
  );

  targets.forEach((el) => observer.observe(el));
}
