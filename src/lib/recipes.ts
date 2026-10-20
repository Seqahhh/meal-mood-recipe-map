import { supabase } from "@/integrations/supabase/client";

export type Category = "meal" | "drinks" | "dessert";
export const CATEGORIES: Category[] = ["meal", "drinks", "dessert"];

export type Ingredient = { name: string; measurement: string; amount: string };
export type Recipe = {
  id: string;
  category: Category;
  name: string;
  rating: number;
  portions: string;
  ingredients: Ingredient[];
  steps: string[];
  savedAt: string;
};

type Row = {
  id: string;
  category: string;
  name: string;
  rating: number;
  portions: string;
  ingredients: unknown;
  steps: unknown;
  saved_at: string;
};

const toIngredients = (v: unknown): Ingredient[] =>
  Array.isArray(v)
    ? v.map((i) => {
        const o = (i ?? {}) as Record<string, unknown>;
        return {
          name: String(o["name"] ?? ""),
          measurement: String(o["measurement"] ?? ""),
          amount: String(o["amount"] ?? ""),
        };
      })
    : [];

const toSteps = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((s) => String(s)) : [];

const fromRow = (r: Row): Recipe => ({
  id: r.id,
  category: (CATEGORIES as string[]).includes(r.category)
    ? (r.category as Category)
    : "meal",
  name: r.name,
  rating: r.rating,
  portions: r.portions,
  ingredients: toIngredients(r.ingredients),
  steps: toSteps(r.steps),
  savedAt: r.saved_at,
});

const toRow = (r: Recipe) => ({
  id: r.id,
  category: r.category,
  name: r.name,
  rating: r.rating,
  portions: r.portions,
  ingredients: r.ingredients,
  steps: r.steps,
  saved_at: r.savedAt,
});

export async function fetchRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("saved_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as Row[]).map(fromRow);
}

export async function upsertRecipe(r: Recipe) {
  const { error } = await supabase.from("recipes").upsert(toRow(r));
  if (error) throw error;
}

export async function saveRating(id: string, rating: number) {
  const { error } = await supabase.from("recipes").update({ rating }).eq("id", id);
  if (error) throw error;
}

export async function removeRecipes(ids: string[]) {
  if (!ids.length) return;
  const { error } = await supabase.from("recipes").delete().in("id", ids);
  if (error) throw error;
}

/** Live updates: runs the callback whenever any device changes the recipe box. */
export function onRecipesChanged(cb: () => void) {
  const channel = supabase
    .channel("recipes-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "recipes" },
      cb,
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

// Recipes used to live in this browser only. On the first load, hand anything
// that was saved there over to the shared recipe box, then remember that it ran.
const LEGACY_KEY = "recipes.v1";
const MIGRATED_KEY = "recipes.migrated.v1";

export async function migrateLocalRecipes() {
  let local: Recipe[] = [];
  try {
    if (localStorage.getItem(MIGRATED_KEY)) return;
    const raw = localStorage.getItem(LEGACY_KEY);
    local = raw ? (JSON.parse(raw) as Recipe[]) : [];
  } catch {
    return;
  }
  if (!Array.isArray(local) || local.length === 0) {
    try {
      localStorage.setItem(MIGRATED_KEY, "1");
    } catch {
      /* ignore */
    }
    return;
  }
  try {
    const { error } = await supabase.from("recipes").upsert(local.map(toRow));
    if (error) return;
    localStorage.setItem(MIGRATED_KEY, "1");
  } catch {
    /* try again on the next load */
  }
}

export const isIngredientFilled = (i: Ingredient) =>
  !!(i.name.trim() && i.measurement.trim() && i.amount.trim());
export const isIngredientEmpty = (i: Ingredient) =>
  !i.name.trim() && !i.measurement.trim() && !i.amount.trim();

export function sortRecipes(list: Recipe[], by: "date" | "rating", asc: boolean) {
  const s = [...list].sort((a, b) =>
    by === "date" ? a.savedAt.localeCompare(b.savedAt) : a.rating - b.rating,
  );
  return asc ? s : s.reverse();
}
