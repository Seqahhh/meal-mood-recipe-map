import { useState } from "react";
import { Star, X, Save } from "lucide-react";
import {
  CATEGORIES,
  type Category,
  type Ingredient,
  type Recipe,
  isIngredientEmpty,
  isIngredientFilled,
} from "@/lib/recipes";
import { ConfirmDialog } from "./ConfirmDialog";

const emptyIng = (): Ingredient => ({ name: "", measurement: "", amount: "" });

export function AddRecipe({
  initialCategory,
  onSave,
  onExit,
}: {
  initialCategory: Category;
  onSave: (r: Recipe) => void;
  onExit: () => void;
}) {
  const [category, setCategory] = useState<Category>(initialCategory);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [portions, setPortions] = useState("");
  const [ings, setIngs] = useState<Ingredient[]>([emptyIng()]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [confirmExit, setConfirmExit] = useState(false);
  const [error, setError] = useState("");

  const updateIng = (idx: number, field: keyof Ingredient, v: string) => {
    const next = ings.map((i, n) => (n === idx ? { ...i, [field]: v } : i));
    if (next.every(isIngredientFilled)) next.push(emptyIng());
    setIngs(next);
  };
  const updateStep = (idx: number, v: string) => {
    const next = steps.map((s, n) => (n === idx ? v : s));
    if (next.every((s) => s.trim())) next.push("");
    setSteps(next);
  };

  const anyFilled =
    name.trim() || rating > 0 || portions.trim() ||
    ings.some((i) => !isIngredientEmpty(i)) || steps.some((s) => s.trim());

  const save = () => {
    if (!name.trim()) return setError("Please give the recipe a name.");
    onSave({
      id: crypto.randomUUID(),
      category,
      name: name.trim(),
      rating,
      portions: portions.trim(),
      ingredients: ings.filter((i) => !isIngredientEmpty(i)),
      steps: steps.filter((s) => s.trim()),
      savedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button className="btn-ghost" onClick={() => (anyFilled ? setConfirmExit(true) : onExit())}>
            <X className="size-4" /> Exit
          </button>
          <h1 className="font-display text-xl">New recipe</h1>
          <button className="btn-primary" onClick={save}>
            <Save className="size-4" /> Save
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <label className="field">
          <span>Category</span>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Name</span>
          <input className="input" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Grandma's lasagna" />
        </label>
        <div className="field">
          <span>Rating</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" aria-label={`${n} stars`} onClick={() => setRating(n === rating ? 0 : n)}>
                <Star className={`size-7 ${n <= rating ? "fill-star text-star" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
        </div>
        <label className="field">
          <span>Intended portions</span>
          <input className="input" type="number" min={1} value={portions} onChange={(e) => setPortions(e.target.value)} placeholder="4" />
        </label>

        <section className="space-y-2">
          <h2 className="font-display text-lg">Ingredients</h2>
          <div className="space-y-2 rounded-xl border bg-card p-3">
            {ings.map((i, idx) => (
              <div key={idx} className="grid grid-cols-[2fr_1fr_1fr] gap-2">
                <input className="input" placeholder="Ingredient" value={i.name} onChange={(e) => updateIng(idx, "name", e.target.value)} />
                <input className="input" placeholder="Unit (g, dl…)" value={i.measurement} onChange={(e) => updateIng(idx, "measurement", e.target.value)} />
                <input className="input" placeholder="Amount" value={i.amount} onChange={(e) => updateIng(idx, "amount", e.target.value)} />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg">Steps</h2>
          {steps.map((s, idx) => (
            <div key={idx} className="flex gap-3">
              <span className="mt-2 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">{idx + 1}</span>
              <textarea className="input min-h-16" placeholder="Describe this step" value={s} onChange={(e) => updateStep(idx, e.target.value)} />
            </div>
          ))}
        </section>
      </main>

      <ConfirmDialog
        open={confirmExit}
        message="Are you sure you don't want to save this recipe?"
        onYes={onExit}
        onNo={() => setConfirmExit(false)}
      />
    </div>
  );
}
