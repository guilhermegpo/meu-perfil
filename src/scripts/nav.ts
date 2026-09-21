/**
 * Navegação: estado "rolado" do cabeçalho, indicador da seção atual e menu
 * móvel. Sem listener de scroll — tudo por IntersectionObserver.
 */
export function initNav(): void {
  initToc();

  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  initProgress(header);
  initScrolledState(header);
  initScrollSpy(header);
  initMenu(header);
}

/** Um sentinela no topo da página avisa quando o usuário saiu do início. */
function initScrolledState(header: HTMLElement): void {
  const sentinel = document.querySelector<HTMLElement>('[data-header-sentinel]');
  if (!sentinel || !('IntersectionObserver' in window)) return;

  new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  }).observe(sentinel);
}

function initScrollSpy(header: HTMLElement): void {
  const links = Array.from(header.querySelectorAll<HTMLAnchorElement>('a[data-nav-link]'));
  const sections = links
    .map((link) => document.getElementById(link.dataset.navLink ?? ''))
    .filter((el): el is HTMLElement => el !== null);

  if (sections.length === 0 || !('IntersectionObserver' in window)) return;

  const setCurrent = (id: string): void => {
    for (const link of links) {
      if (link.dataset.navLink === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  // Faixa fina no meio da tela: a seção que a cruza é a atual.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      }
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
}

function initMenu(header: HTMLElement): void {
  const button = header.querySelector<HTMLButtonElement>('[data-menu-button]');
  const panel = header.querySelector<HTMLElement>('[data-menu]');
  if (!button || !panel) return;

  const desktop = window.matchMedia('(min-width: 62rem)');

  const setOpen = (open: boolean, { restoreFocus = false } = {}): void => {
    header.toggleAttribute('data-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (!open && restoreFocus) button.focus();
  };

  button.addEventListener('click', () => setOpen(!header.hasAttribute('data-open')));

  panel.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.hasAttribute('data-open')) {
      setOpen(false, { restoreFocus: true });
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (header.hasAttribute('data-open') && !header.contains(event.target as Node)) setOpen(false);
  });

  desktop.addEventListener('change', () => setOpen(false));
}

/** Barra fina sob o header com o progresso de leitura. Só transform, um quadro por rolagem. */
function initProgress(header: HTMLElement): void {
  let raf = 0;

  const update = (): void => {
    raf = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : '0');
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!raf) raf = requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

/** Sumário dos cases: marca a seção que cruza a faixa central da tela. */
function initToc(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-toc-link]'));
  if (links.length === 0 || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of links) {
          if (link.dataset.tocLink === entry.target.id) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        }
      }
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
  );

  links.forEach((link) => {
    const section = document.getElementById(link.dataset.tocLink ?? '');
    if (section) observer.observe(section);
  });
}
