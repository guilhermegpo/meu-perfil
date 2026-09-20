/**
 * Revela blocos conforme entram na viewport. Passagem única: depois de
 * visível, o elemento sai do observador e nunca mais é animado.
 */
import { reducedMotion } from './env';

export function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');

  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const delay = Number(el.dataset.revealDelay ?? 0);
        window.setTimeout(() => el.classList.add('is-visible'), delay);
        observer.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  );

  targets.forEach((el) => observer.observe(el));
}
