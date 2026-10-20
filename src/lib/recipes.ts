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

const KEY = "recipes.v1";

export function loadRecipes(): Recipe[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
export function storeRecipes(r: Recipe[]) {
  localStorage.setItem(KEY, JSON.stringify(r));
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
