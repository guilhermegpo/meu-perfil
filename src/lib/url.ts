/**
 * O site é publicado em um subcaminho (`/meu-perfil`), então todo asset
 * precisa do prefixo do base path. `import.meta.env.BASE_URL` pode vir com ou
 * sem barra final dependendo da configuração — juntar as duas pontas na mão
 * produz `/meu-perfilfavicon.svg` ou `//favicon.svg`. Esta função normaliza.
 */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  return `${base}/${clean}`;
}
