import { beforeEach, describe, expect, it, vi } from "vitest";

const upsert = vi.fn();
const from = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: (...args: unknown[]) => from(...args) },
}));

const legacyRecipe = {
  id: "local-1",
  category: "meal",
  name: "Old browser recipe",
  rating: 3,
  portions: "2",
  ingredients: [],
  steps: [],
  savedAt: "2026-10-01T12:00:00.000Z",
};

async function migrate() {
  const mod = await import("@/lib/recipes");
  await mod.migrateLocalRecipes();
}

describe("moving browser-only recipes into the shared box", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    upsert.mockReset().mockResolvedValue({ error: null });
    from.mockReset().mockReturnValue({ upsert });
  });

  it("hands recipes that were saved in this browser over to the shared box once", async () => {
    localStorage.setItem("recipes.v1", JSON.stringify([legacyRecipe]));

    await migrate();

    expect(from).toHaveBeenCalledWith("recipes");
    expect(upsert).toHaveBeenCalledTimes(1);
    expect(upsert.mock.calls[0][0]).toEqual([
      expect.objectContaining({ id: "local-1", name: "Old browser recipe" }),
    ]);
    expect(localStorage.getItem("recipes.migrated.v1")).toBe("1");
  });

  it("never uploads again once the move has already run", async () => {
    localStorage.setItem("recipes.migrated.v1", "1");
    localStorage.setItem("recipes.v1", JSON.stringify([legacyRecipe]));

    await migrate();

    expect(upsert).not.toHaveBeenCalled();
  });

  it("leaves the move un-done so it can retry when the upload fails", async () => {
    localStorage.setItem("recipes.v1", JSON.stringify([legacyRecipe]));
    upsert.mockResolvedValue({ error: new Error("offline") });

    await migrate();

    expect(localStorage.getItem("recipes.migrated.v1")).toBeNull();
  });
});
