import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Check, Plus, Star, Trash2, X } from "lucide-react";
import { CATEGORIES, type Category, type Recipe, loadRecipes, sortRecipes, storeRecipes } from "@/lib/recipes";
import { AddRecipe } from "@/components/AddRecipe";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Recipe Box" },
      { name: "description", content: "Your personal collection of meals, drinks and desserts." },
      { property: "og:title", content: "My Recipe Box" },
      { property: "og:description", content: "Your personal collection of meals, drinks and desserts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [category, setCategory] = useState<Category>("meal");
  const [adding, setAdding] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "rating">("date");
  const [asc, setAsc] = useState(false);

  useEffect(() => { setRecipes(loadRecipes()); setLoaded(true); }, []);
  useEffect(() => { if (loaded) storeRecipes(recipes); }, [recipes, loaded]);

  const shown = useMemo(
    () => sortRecipes(recipes.filter((r) => r.category === category), sortBy, asc),
    [recipes, category, sortBy, asc],
  );

  const exitRemove = () => { setRemoveMode(false); setSelected(new Set()); };
  const toggle = (id: string) => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
  };

  if (adding)
    return (
      <AddRecipe
        initialCategory={category}
        onExit={() => setAdding(false)}
        onSave={(r) => { setRecipes((p) => [...p, r]); setCategory(r.category); setAdding(false); }}
      />
    );

  const idx = CATEGORIES.indexOf(category);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <span className="font-display text-2xl text-primary">Recipe Box</span>
          <div className="relative grid grid-cols-3 rounded-full bg-muted p-1">
            <span
              className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-primary shadow-soft transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${idx * 100}%)` }}
            />
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); exitRemove(); }}
                className={`relative z-10 px-4 py-1.5 text-sm font-medium capitalize transition-colors ${c === category ? "text-primary-foreground" : "text-muted-foreground"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {removeMode ? (
              <>
                <span className="text-sm text-muted-foreground">{selected.size} selected</span>
                <button className="btn-ghost" onClick={exitRemove}><X className="size-4" /> Exit</button>
                <button className="btn-danger" disabled={!selected.size} onClick={() => setConfirmDelete(true)}>
                  <Check className="size-4" /> Remove
                </button>
              </>
            ) : (
              <>
                <button className="btn-ghost" onClick={() => setRemoveMode(true)}><Trash2 className="size-4" /> Remove</button>
                <button className="btn-primary" onClick={() => setAdding(true)}><Plus className="size-4" /> Add recipe</button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-5 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <select className="input w-auto py-1.5" value={sortBy} onChange={(e) => setSortBy(e.target.value as "date" | "rating")}>
            <option value="date">Date saved</option>
            <option value="rating">Rating</option>
          </select>
          <button className="btn-ghost" onClick={() => setAsc(!asc)} aria-label="Toggle sort direction">
            {asc ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
            {asc ? "Ascending" : "Descending"}
          </button>
        </div>

        {shown.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">No {category} recipes yet. Add your first one!</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((r) => {
              const sel = selected.has(r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => removeMode && toggle(r.id)}
                  className={`recipe-card ${removeMode ? "cursor-pointer" : "cursor-default"} ${sel ? "ring-2 ring-destructive" : ""}`}
                >
                  {removeMode && (
                    <span className={`absolute right-3 top-3 flex size-5 items-center justify-center rounded-full border-2 ${sel ? "border-destructive bg-destructive text-destructive-foreground" : "border-muted-foreground"}`}>
                      {sel && <Check className="size-3" />}
                    </span>
                  )}
                  <h3 className="font-display text-lg leading-tight">{r.name}</h3>
                  <div className="mt-3 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`size-4 ${n <= r.rating ? "fill-star text-star" : "text-muted-foreground/40"}`} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      <ConfirmDialog
        open={confirmDelete}
        message={`Are you sure you want to delete ${selected.size} recipe${selected.size === 1 ? "" : "s"}?`}
        onNo={() => setConfirmDelete(false)}
        onYes={() => {
          setRecipes((p) => p.filter((r) => !selected.has(r.id)));
          setConfirmDelete(false);
          exitRemove();
        }}
      />
    </div>
  );
}
