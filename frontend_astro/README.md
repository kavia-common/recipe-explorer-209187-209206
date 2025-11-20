# Recipe Explorer (Astro)

Modern Astro frontend for browsing, searching, and viewing recipes.

## Theme
Ocean Professional:
- Primary: `#2563EB`
- Secondary/Success: `#F59E0B`
- Error: `#EF4444`
- Background: `#f9fafb`
- Surface: `#ffffff`
- Text: `#111827`

Subtle gradients, rounded corners, and soft shadows are applied in a shared layout.

## Pages
- `/` Home: search bar, responsive grid of recipe cards
- `/recipes/[id]` Recipe detail: title, image, ingredients, steps

## Data
The UI uses a minimal data layer:
- If `PUBLIC_API_BASE` is set, requests are sent to `${PUBLIC_API_BASE}/recipes` and `/recipes/:id`.
- Otherwise, an in-memory mock dataset is used.

Environment variables are read via `import.meta.env`.

## Commands
- `npm install`
- `npm run dev` (dev server)
- `npm run build` (production build)
- `npm run preview` (preview build)

No additional processes are started by code; this repo follows Astro best practices.
