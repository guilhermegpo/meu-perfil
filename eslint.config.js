import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'legacy/', 'src/data/evidence.generated.json'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    // Scripts do site rodam no navegador.
    files: ['src/scripts/**/*.ts'],
    languageOptions: { globals: globals.browser },
    rules: { 'no-console': 'error' },
  },
  {
    // Scripts de manutenção e testes rodam em Node e podem escrever no terminal.
    files: ['scripts/**/*.mjs', 'tests/**/*.mjs', 'eslint.config.js', 'astro.config.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/**/*.{ts,astro}'],
    rules: { 'no-console': 'error' },
  },
];
