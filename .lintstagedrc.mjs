export default {
  // Type check TypeScript files
  '**/*.{ts,tsx}': () => ['pnpm run typecheck'],

  // Lint & Prettify TS and JS files
  '**/*.{js,jsx,ts,tsx}': () => ['pnpm run lint', 'pnpm run format'],

  // Prettify only Markdown and JSON files
  '**/*.{md,mdx,json}': () => ['pnpm run format'],
};
