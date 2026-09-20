/**
 * Detecção de capacidades, feita uma vez e compartilhada pelos módulos.
 *
 * Nada aqui liga movimento por conta própria: o CSS já desliga animações com
 * `prefers-reduced-motion`, e estes helpers só decidem se vale registrar
 * ouvintes de ponteiro e laços de animação.
 */
export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Mouse ou trackpad de verdade: só neles o tilt por cursor faz sentido. */
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

/** Toque puro: sem hover, o efeito passa a ser guiado pela rolagem. */
export const touchOnly = window.matchMedia('(hover: none)');

/** Dispositivo modesto ou usuário com economia de dados. */
export const isLite = (): boolean => {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return (
    nav.connection?.saveData === true ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) ||
    (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2)
  );
};

export const motionAllowed = (): boolean =>
  !reducedMotion.matches && document.documentElement.dataset.perf !== 'lite';
