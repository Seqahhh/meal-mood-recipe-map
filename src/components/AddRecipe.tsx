import { useRef, useState } from "react";
import { GripVertical, Star, X, Save, Trash2 } from "lucide-react";
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

function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function AddRecipe({
  initialCategory,
  initial,
  onSave,
  onExit,
}: {
  initialCategory: Category;
  initial?: Recipe;
  onSave: (r: Recipe) => void;
  onExit: () => void;
}) {
  const [category, setCategory] = useState<Category>(initial?.category ?? initialCategory);
  const [name, setName] = useState(initial?.name ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [portions, setPortions] = useState(initial?.portions ?? "");
  const [ings, setIngs] = useState<Ingredient[]>(
    initial?.ingredients.length ? [...initial.ingredients, emptyIng()] : [emptyIng()],
  );
  const [steps, setSteps] = useState<string[]>(
    initial?.steps.length ? [...initial.steps, ""] : [""],
  );
  const [confirmExit, setConfirmExit] = useState(false);
  const [error, setError] = useState("");
  const dragIng = useRef<number | null>(null);
  const dragStep = useRef<number | null>(null);

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
  const removeIng = (idx: number) =>
    setIngs((p) => (p.length === 1 ? [emptyIng()] : p.filter((_, n) => n !== idx)));
  const removeStep = (idx: number) =>
    setSteps((p) => (p.length === 1 ? [""] : p.filter((_, n) => n !== idx)));

  const dropIng = (to: number) => {
    if (dragIng.current !== null && dragIng.current !== to)
      setIngs((p) => move(p, dragIng.current!, to));
    dragIng.current = null;
  };
  const dropStep = (to: number) => {
    if (dragStep.current !== null && dragStep.current !== to)
      setSteps((p) => move(p, dragStep.current!, to));
    dragStep.current = null;
  };

  const anyFilled =
    name.trim() || rating > 0 || portions.trim() ||
    ings.some((i) => !isIngredientEmpty(i)) || steps.some((s) => s.trim());

  const edited =
    !!initial &&
    (category !== initial.category ||
      name.trim() !== initial.name ||
      rating !== initial.rating ||
      portions.trim() !== initial.portions ||
      JSON.stringify(ings.filter((i) => !isIngredientEmpty(i))) !==
        JSON.stringify(initial.ingredients) ||
      JSON.stringify(steps.filter((s) => s.trim())) !== JSON.stringify(initial.steps));

  const tryExit = () => {
    if (initial ? edited : anyFilled) setConfirmExit(true);
    else onExit();
  };

  const save = () => {
    if (!name.trim()) return setError("Please give the recipe a name.");
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      category,
      name: name.trim(),
      rating,
      portions: portions.trim(),
      ingredients: ings.filter((i) => !isIngredientEmpty(i)),
      steps: steps.filter((s) => s.trim()),
      savedAt: initial?.savedAt ?? new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <button className="btn-ghost" onClick={tryExit}>
            <X className="size-4" /> Exit
          </button>
          <h1 className="font-display text-xl">{initial ? "Edit recipe" : "New recipe"}</h1>
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
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
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
              <div
                key={idx}
                className="flex items-center gap-2"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dropIng(idx)}
              >
                <span
                  draggable
                  onDragStart={() => (dragIng.current = idx)}
                  className="cursor-grab text-muted-foreground active:cursor-grabbing"
                  aria-label="Drag to reorder"
                >
                  <GripVertical className="size-4" />
                </span>
                <div className="grid flex-1 grid-cols-[2fr_1fr_1fr] gap-2">
                  <input className="input" placeholder="Ingredient" value={i.name} onChange={(e) => updateIng(idx, "name", e.target.value)} />
                  <input className="input" placeholder="Unit (g, dl…)" value={i.measurement} onChange={(e) => updateIng(idx, "measurement", e.target.value)} />
                  <input className="input" placeholder="Amount" value={i.amount} onChange={(e) => updateIng(idx, "amount", e.target.value)} />
                </div>
                <button
                  type="button"
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  onClick={() => removeIng(idx)}
                  aria-label="Remove ingredient"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg">Steps</h2>
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dropStep(idx)}
            >
              <span
                draggable
                onDragStart={() => (dragStep.current = idx)}
                className="cursor-grab text-muted-foreground active:cursor-grabbing"
                aria-label="Drag to reorder"
              >
                <GripVertical className="size-4" />
              </span>
              <span className="mt-2 flex size-7 shrink-0 items-center justify-center self-start rounded-full bg-primary text-sm text-primary-foreground">{idx + 1}</span>
              <textarea className="input min-h-16" placeholder="Describe this step" value={s} onChange={(e) => updateStep(idx, e.target.value)} />
              <button
                type="button"
                className="text-muted-foreground transition-colors hover:text-destructive"
                onClick={() => removeStep(idx)}
                aria-label="Remove step"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </section>
      </main>

      <ConfirmDialog
        open={confirmExit}
        message={
          initial
            ? "Are you sure you don't want to save this edit?"
            : "Are you sure you don't want to save this recipe?"
        }
        onYes={onExit}
        onNo={() => setConfirmExit(false)}
      />
    </div>
  );
}
