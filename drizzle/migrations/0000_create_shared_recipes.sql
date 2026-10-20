CREATE TABLE public.recipes (
  id text PRIMARY KEY,
  category text NOT NULL CHECK (category IN ('meal', 'drinks', 'dessert')),
  name text NOT NULL,
  rating integer NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  portions text NOT NULL DEFAULT '',
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  saved_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.recipes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recipes TO authenticated;
GRANT ALL ON public.recipes TO service_role;

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read recipes" ON public.recipes
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can add recipes" ON public.recipes
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update recipes" ON public.recipes
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete recipes" ON public.recipes
  FOR DELETE TO anon, authenticated USING (true);

INSERT INTO public.recipes (id, category, name, rating, portions, ingredients, steps, saved_at) VALUES
  ('default-meal-1', 'meal', 'Grandma''s Lasagna', 5, '6',
   '[{"name":"Lasagna sheets","measurement":"g","amount":"250"},{"name":"Minced beef","measurement":"g","amount":"500"},{"name":"Crushed tomatoes","measurement":"g","amount":"400"},{"name":"Grated cheese","measurement":"g","amount":"200"}]'::jsonb,
   '["Brown the minced beef in a pan.","Add crushed tomatoes and simmer for 20 minutes.","Layer sheets, sauce and cheese in a baking dish.","Bake at 200\u00b0C for 30 minutes."]'::jsonb,
   '2026-10-01T12:00:00.000Z'),
  ('default-meal-2', 'meal', 'Chicken Stir Fry', 4, '4',
   '[{"name":"Chicken breast","measurement":"g","amount":"400"},{"name":"Bell peppers","measurement":"pcs","amount":"2"},{"name":"Soy sauce","measurement":"tbsp","amount":"3"},{"name":"Rice","measurement":"dl","amount":"3"}]'::jsonb,
   '["Cook the rice according to the package.","Fry the chicken in a hot wok until golden.","Add peppers and soy sauce, stir fry 5 minutes.","Serve over the rice."]'::jsonb,
   '2026-10-03T12:00:00.000Z'),
  ('default-meal-3', 'meal', 'Tomato Soup', 3, '4',
   '[{"name":"Canned tomatoes","measurement":"g","amount":"800"},{"name":"Onion","measurement":"pcs","amount":"1"},{"name":"Vegetable stock","measurement":"dl","amount":"5"},{"name":"Cream","measurement":"dl","amount":"2"}]'::jsonb,
   '["Soften the onion in a pot.","Add tomatoes and stock, simmer 15 minutes.","Blend until smooth and stir in the cream."]'::jsonb,
   '2026-10-05T12:00:00.000Z'),
  ('default-drinks-1', 'drinks', 'Classic Lemonade', 4, '4',
   '[{"name":"Lemons","measurement":"pcs","amount":"4"},{"name":"Sugar","measurement":"dl","amount":"1"},{"name":"Water","measurement":"l","amount":"1"}]'::jsonb,
   '["Squeeze the lemons.","Dissolve the sugar in warm water.","Combine juice and sugar water, chill and serve over ice."]'::jsonb,
   '2026-10-02T12:00:00.000Z'),
  ('default-drinks-2', 'drinks', 'Berry Smoothie', 5, '2',
   '[{"name":"Frozen berries","measurement":"g","amount":"300"},{"name":"Banana","measurement":"pcs","amount":"1"},{"name":"Yogurt","measurement":"dl","amount":"2"},{"name":"Milk","measurement":"dl","amount":"1"}]'::jsonb,
   '["Add everything to a blender.","Blend until smooth.","Pour into glasses and serve cold."]'::jsonb,
   '2026-10-04T12:00:00.000Z'),
  ('default-drinks-3', 'drinks', 'Hot Chocolate', 4, '2',
   '[{"name":"Milk","measurement":"dl","amount":"5"},{"name":"Cocoa powder","measurement":"tbsp","amount":"2"},{"name":"Sugar","measurement":"tbsp","amount":"2"},{"name":"Whipped cream","measurement":"dl","amount":"1"}]'::jsonb,
   '["Warm the milk in a saucepan.","Whisk in cocoa and sugar until dissolved.","Top with whipped cream."]'::jsonb,
   '2026-10-06T12:00:00.000Z'),
  ('default-dessert-1', 'dessert', 'Chocolate Brownies', 5, '12',
   '[{"name":"Dark chocolate","measurement":"g","amount":"200"},{"name":"Butter","measurement":"g","amount":"150"},{"name":"Sugar","measurement":"dl","amount":"2"},{"name":"Eggs","measurement":"pcs","amount":"3"},{"name":"Flour","measurement":"dl","amount":"1.5"}]'::jsonb,
   '["Melt chocolate and butter together.","Whisk in sugar and eggs, then fold in flour.","Bake at 175\u00b0C for 25 minutes."]'::jsonb,
   '2026-10-07T12:00:00.000Z'),
  ('default-dessert-2', 'dessert', 'Pancakes', 4, '8',
   '[{"name":"Flour","measurement":"dl","amount":"3"},{"name":"Milk","measurement":"dl","amount":"6"},{"name":"Eggs","measurement":"pcs","amount":"2"},{"name":"Butter","measurement":"tbsp","amount":"2"}]'::jsonb,
   '["Whisk flour, milk and eggs into a smooth batter.","Fry thin pancakes in butter over medium heat.","Serve with jam or sugar."]'::jsonb,
   '2026-10-08T12:00:00.000Z'),
  ('default-dessert-3', 'dessert', 'Apple Pie', 4, '8',
   '[{"name":"Apples","measurement":"pcs","amount":"5"},{"name":"Pie crust","measurement":"pcs","amount":"2"},{"name":"Sugar","measurement":"dl","amount":"1"},{"name":"Cinnamon","measurement":"tsp","amount":"1"}]'::jsonb,
   '["Slice the apples and toss with sugar and cinnamon.","Line a dish with crust, add apples, cover with the second crust.","Bake at 200\u00b0C for 40 minutes."]'::jsonb,
   '2026-10-09T12:00:00.000Z');

ALTER PUBLICATION supabase_realtime ADD TABLE public.recipes;