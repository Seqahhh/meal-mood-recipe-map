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

export const DEFAULT_RECIPES: Recipe[] = [
  {
    id: "default-meal-1",
    category: "meal",
    name: "Grandma's Lasagna",
    rating: 5,
    portions: "6",
    ingredients: [
      { name: "Lasagna sheets", measurement: "g", amount: "250" },
      { name: "Minced beef", measurement: "g", amount: "500" },
      { name: "Crushed tomatoes", measurement: "g", amount: "400" },
      { name: "Grated cheese", measurement: "g", amount: "200" },
    ],
    steps: [
      "Brown the minced beef in a pan.",
      "Add crushed tomatoes and simmer for 20 minutes.",
      "Layer sheets, sauce and cheese in a baking dish.",
      "Bake at 200°C for 30 minutes.",
    ],
    savedAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "default-meal-2",
    category: "meal",
    name: "Chicken Stir Fry",
    rating: 4,
    portions: "4",
    ingredients: [
      { name: "Chicken breast", measurement: "g", amount: "400" },
      { name: "Bell peppers", measurement: "pcs", amount: "2" },
      { name: "Soy sauce", measurement: "tbsp", amount: "3" },
      { name: "Rice", measurement: "dl", amount: "3" },
    ],
    steps: [
      "Cook the rice according to the package.",
      "Fry the chicken in a hot wok until golden.",
      "Add peppers and soy sauce, stir fry 5 minutes.",
      "Serve over the rice.",
    ],
    savedAt: "2026-10-03T12:00:00.000Z",
  },
  {
    id: "default-meal-3",
    category: "meal",
    name: "Tomato Soup",
    rating: 3,
    portions: "4",
    ingredients: [
      { name: "Canned tomatoes", measurement: "g", amount: "800" },
      { name: "Onion", measurement: "pcs", amount: "1" },
      { name: "Vegetable stock", measurement: "dl", amount: "5" },
      { name: "Cream", measurement: "dl", amount: "2" },
    ],
    steps: [
      "Soften the onion in a pot.",
      "Add tomatoes and stock, simmer 15 minutes.",
      "Blend until smooth and stir in the cream.",
    ],
    savedAt: "2026-10-05T12:00:00.000Z",
  },
  {
    id: "default-drinks-1",
    category: "drinks",
    name: "Classic Lemonade",
    rating: 4,
    portions: "4",
    ingredients: [
      { name: "Lemons", measurement: "pcs", amount: "4" },
      { name: "Sugar", measurement: "dl", amount: "1" },
      { name: "Water", measurement: "l", amount: "1" },
    ],
    steps: [
      "Squeeze the lemons.",
      "Dissolve the sugar in warm water.",
      "Combine juice and sugar water, chill and serve over ice.",
    ],
    savedAt: "2026-10-02T12:00:00.000Z",
  },
  {
    id: "default-drinks-2",
    category: "drinks",
    name: "Berry Smoothie",
    rating: 5,
    portions: "2",
    ingredients: [
      { name: "Frozen berries", measurement: "g", amount: "300" },
      { name: "Banana", measurement: "pcs", amount: "1" },
      { name: "Yogurt", measurement: "dl", amount: "2" },
      { name: "Milk", measurement: "dl", amount: "1" },
    ],
    steps: [
      "Add everything to a blender.",
      "Blend until smooth.",
      "Pour into glasses and serve cold.",
    ],
    savedAt: "2026-10-04T12:00:00.000Z",
  },
  {
    id: "default-drinks-3",
    category: "drinks",
    name: "Hot Chocolate",
    rating: 4,
    portions: "2",
    ingredients: [
      { name: "Milk", measurement: "dl", amount: "5" },
      { name: "Cocoa powder", measurement: "tbsp", amount: "2" },
      { name: "Sugar", measurement: "tbsp", amount: "2" },
      { name: "Whipped cream", measurement: "dl", amount: "1" },
    ],
    steps: [
      "Warm the milk in a saucepan.",
      "Whisk in cocoa and sugar until dissolved.",
      "Top with whipped cream.",
    ],
    savedAt: "2026-10-06T12:00:00.000Z",
  },
  {
    id: "default-dessert-1",
    category: "dessert",
    name: "Chocolate Brownies",
    rating: 5,
    portions: "12",
    ingredients: [
      { name: "Dark chocolate", measurement: "g", amount: "200" },
      { name: "Butter", measurement: "g", amount: "150" },
      { name: "Sugar", measurement: "dl", amount: "2" },
      { name: "Eggs", measurement: "pcs", amount: "3" },
      { name: "Flour", measurement: "dl", amount: "1.5" },
    ],
    steps: [
      "Melt chocolate and butter together.",
      "Whisk in sugar and eggs, then fold in flour.",
      "Bake at 175°C for 25 minutes.",
    ],
    savedAt: "2026-10-07T12:00:00.000Z",
  },
  {
    id: "default-dessert-2",
    category: "dessert",
    name: "Pancakes",
    rating: 4,
    portions: "8",
    ingredients: [
      { name: "Flour", measurement: "dl", amount: "3" },
      { name: "Milk", measurement: "dl", amount: "6" },
      { name: "Eggs", measurement: "pcs", amount: "2" },
      { name: "Butter", measurement: "tbsp", amount: "2" },
    ],
    steps: [
      "Whisk flour, milk and eggs into a smooth batter.",
      "Fry thin pancakes in butter over medium heat.",
      "Serve with jam or sugar.",
    ],
    savedAt: "2026-10-08T12:00:00.000Z",
  },
  {
    id: "default-dessert-3",
    category: "dessert",
    name: "Apple Pie",
    rating: 4,
    portions: "8",
    ingredients: [
      { name: "Apples", measurement: "pcs", amount: "5" },
      { name: "Pie crust", measurement: "pcs", amount: "2" },
      { name: "Sugar", measurement: "dl", amount: "1" },
      { name: "Cinnamon", measurement: "tsp", amount: "1" },
    ],
    steps: [
      "Slice the apples and toss with sugar and cinnamon.",
      "Line a dish with crust, add apples, cover with the second crust.",
      "Bake at 200°C for 40 minutes.",
    ],
    savedAt: "2026-10-09T12:00:00.000Z",
  },
];

export function loadRecipes(): Recipe[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) {
      storeRecipes(DEFAULT_RECIPES);
      return [...DEFAULT_RECIPES];
    }
    return JSON.parse(raw);
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
