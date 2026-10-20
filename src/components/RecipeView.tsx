import { Pencil, Star, X } from "lucide-react";
import type { Recipe } from "@/lib/recipes";

export function RecipeView({
  recipe,
  onRate,
  onEdit,
  onClose,
}: {
  recipe: Recipe;
  onRate: (n: number) => void;
  onEdit: () => void;
  onClose: () => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button className="btn-ghost" onClick={onClose}>
            <X className="size-4" /> Back
          </button>
          <h1 className="font-display text-xl capitalize">{recipe.category}</h1>
          <button className="btn-primary" onClick={onEdit}>
            <Pencil className="size-4" /> Change recipe
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <div className="space-y-3">
          <h2 className="font-display text-3xl leading-tight">{recipe.name}</h2>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`Rate ${n} stars`}
                onClick={() => onRate(n === recipe.rating ? 0 : n)}
              >
                <Star className={`size-7 ${n <= recipe.rating ? "fill-star text-star" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          {recipe.portions && (
            <p className="text-sm text-muted-foreground">Portions: {recipe.portions}</p>
          )}
        </div>

        <section className="space-y-2">
          <h3 className="font-display text-lg">Ingredients</h3>
          {recipe.ingredients.length === 0 ? (
            <p className="text-sm text-muted-foreground">No ingredients listed.</p>
          ) : (
            <ul className="space-y-1.5 rounded-xl border bg-card p-4">
              {recipe.ingredients.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-4 text-sm">
                  <span>{i.name}</span>
                  <span className="text-muted-foreground">
                    {i.amount} {i.measurement}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-2">
          <h3 className="font-display text-lg">Steps</h3>
          {recipe.steps.length === 0 ? (
            <p className="text-sm text-muted-foreground">No steps listed.</p>
          ) : (
            <ol className="space-y-3">
              {recipe.steps.map((s, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                    {idx + 1}
                  </span>
                  <p className="text-sm leading-relaxed">{s}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  );
}
