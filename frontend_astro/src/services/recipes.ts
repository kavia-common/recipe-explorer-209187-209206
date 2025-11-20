/// PUBLIC_INTERFACE
export interface RecipeSummary {
  /** Unique identifier */
  id: string;
  /** Title of the recipe */
  title: string;
  /** Optional image URL */
  image?: string;
  /** Total duration in minutes */
  duration: number;
  /** Number of servings */
  servings: number;
  /** Optional tags for filtering */
  tags?: string[];
}

/// PUBLIC_INTERFACE
export interface RecipeDetail extends RecipeSummary {
  /** List of ingredients */
  ingredients: string[];
  /** Step-by-step instructions */
  steps: string[];
}

/** In-memory mock data used when PUBLIC_API_BASE is not set. */
const MOCK_RECIPES: RecipeDetail[] = [
  {
    id: 'lemon-garlic-salmon',
    title: 'Lemon Garlic Salmon',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
    duration: 25,
    servings: 2,
    tags: ['seafood', 'quick', 'protein'],
    ingredients: [
      '2 salmon fillets',
      '2 cloves garlic, minced',
      '1 lemon (zest and juice)',
      '1 tbsp olive oil',
      'Salt & pepper',
      'Fresh dill (optional)',
    ],
    steps: [
      'Pat salmon dry, season with salt and pepper.',
      'Heat oil in a pan over medium heat.',
      'Add salmon skin-side down, cook 4–5 minutes.',
      'Flip, add garlic and lemon zest; cook 2–3 minutes.',
      'Finish with lemon juice and dill; serve warm.',
    ],
  },
  {
    id: 'creamy-mushroom-pasta',
    title: 'Creamy Mushroom Pasta',
    image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?q=80&w=1200&auto=format&fit=crop',
    duration: 30,
    servings: 4,
    tags: ['vegetarian', 'comfort'],
    ingredients: [
      '300g pasta',
      '300g mushrooms, sliced',
      '2 cloves garlic, minced',
      '1 cup cream',
      '2 tbsp butter',
      'Parmesan, salt & pepper',
    ],
    steps: [
      'Boil pasta until al dente; reserve 1/2 cup pasta water.',
      'Sauté mushrooms in butter, season well.',
      'Add garlic, cook 1 min; pour in cream.',
      'Toss with pasta; use pasta water to loosen.',
      'Finish with Parmesan and pepper.',
    ],
  },
  {
    id: 'vegan-buddha-bowl',
    title: 'Vegan Buddha Bowl',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop',
    duration: 20,
    servings: 2,
    tags: ['vegan', 'bowl', 'healthy'],
    ingredients: [
      '1 cup cooked quinoa',
      '1 cup roasted chickpeas',
      '1 avocado, sliced',
      'Mixed greens',
      'Tahini dressing',
      'Pickled onions',
    ],
    steps: [
      'Arrange quinoa and greens in bowls.',
      'Top with chickpeas, avocado, and onions.',
      'Drizzle with tahini dressing and serve.',
    ],
  },
];

const API_BASE = import.meta.env.PUBLIC_API_BASE;

/** Safely performs a GET to the backend when PUBLIC_API_BASE is available. */
async function safeGet<T>(path: string): Promise<T | null> {
  if (!API_BASE) return null;
  try {
    const url = `${API_BASE.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export async function listRecipes(opts?: { q?: string }): Promise<RecipeSummary[]> {
  /**
   * Lists recipes from the API if PUBLIC_API_BASE is set; otherwise returns mock data.
   * The optional q parameter filters by title and tags (case-insensitive) in the mock.
   */
  const q = (opts?.q ?? '').trim().toLowerCase();
  // Try API first if configured
  const apiData = await safeGet<RecipeSummary[]>(`recipes${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  if (apiData && Array.isArray(apiData)) {
    return apiData;
  }
  // Fallback to mock
  let items: RecipeSummary[] = MOCK_RECIPES;
  if (q) {
    items = items.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  }
  return items.map(({ ingredients: _ingredients, steps: _steps, ...summary }) => summary);
}

// PUBLIC_INTERFACE
export async function getRecipeById(id: string): Promise<RecipeDetail | null> {
  /**
   * Retrieves a single recipe by id from API (if configured) or from mock data.
   */
  const apiData = await safeGet<RecipeDetail>(`recipes/${encodeURIComponent(id)}`);
  if (apiData) return apiData;
  return MOCK_RECIPES.find((r) => r.id === id) ?? null;
}
