import { db, categoriesTable, dishesTable } from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(dishesTable);
  await db.delete(categoriesTable);

  // Insert categories
  const [pizza, sandwich, boisson, dessert] = await db
    .insert(categoriesTable)
    .values([
      { name: "Pizza", icon: "🍕", sortOrder: 1 },
      { name: "Sandwich", icon: "🥪", sortOrder: 2 },
      { name: "Boisson", icon: "🥤", sortOrder: 3 },
      { name: "Dessert", icon: "🍰", sortOrder: 4 },
    ])
    .returning();

  console.log("Categories inserted:", [pizza, sandwich, boisson, dessert].map(c => c.name));

  // Insert dishes
  await db.insert(dishesTable).values([
    // Pizza
    {
      categoryId: pizza.id,
      name: "Pizza Orientale",
      description: "Base tomate, mozzarella, merguez, poivrons et olives noires. Un voyage culinaire au cœur de la Méditerranée.",
      price: "1800",
      imageUrl: null,
      modelGlbUrl: null,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      categoryId: pizza.id,
      name: "Pizza Margarita Royale",
      description: "Base crème, mozzarella bufflonne, tomates cerise et basilic frais. La simplicité à son sommet.",
      price: "1600",
      imageUrl: null,
      modelGlbUrl: null,
      isAvailable: true,
      sortOrder: 2,
    },
    {
      categoryId: pizza.id,
      name: "Pizza 4 Fromages",
      description: "Mozzarella, gorgonzola, chèvre et parmesan sur base crème. Un délice fondant pour les amateurs de fromage.",
      price: "2000",
      imageUrl: null,
      modelGlbUrl: null,
      isAvailable: true,
      sortOrder: 3,
    },
    // Sandwich
    {
      categoryId: sandwich.id,
      name: "Sandwich Kebab Maison",
      description: "Viande d'agneau marinée, légumes grillés, sauce harissa et fromage fondu dans un pain artisanal.",
      price: "900",
      imageUrl: null,
      modelGlbUrl: null,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      categoryId: sandwich.id,
      name: "Club Poulet Grillé",
      description: "Filet de poulet grillé, roquette, tomates séchées, avocat et mayonnaise au citron.",
      price: "850",
      imageUrl: null,
      modelGlbUrl: null,
      isAvailable: true,
      sortOrder: 2,
    },
    {
      categoryId: sandwich.id,
      name: "Panini Végétarien",
      description: "Légumes du soleil grillés, pesto basilic, mozzarella et roquette. Saveurs méditerranéennes authentiques.",
      price: "750",
      imageUrl: null,
      modelGlbUrl: null,
      isAvailable: true,
      sortOrder: 3,
    },
    // Boisson
    {
      categoryId: boisson.id,
      name: "Jus d'Orange Frais",
      description: "Oranges pressées à la minute, sans sucre ajouté. Fraîcheur et vitamines garanties.",
      price: "400",
      imageUrl: null,
      modelGlbUrl: null,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      categoryId: boisson.id,
      name: "Thé à la Menthe",
      description: "Thé vert de qualité supérieure, menthe fraîche et sucre cristal. La tradition algérienne dans chaque gorgée.",
      price: "250",
      imageUrl: null,
      modelGlbUrl: null,
      isAvailable: true,
      sortOrder: 2,
    },
    {
      categoryId: boisson.id,
      name: "Limonade Artisanale",
      description: "Citron frais, eau gazeuse, menthe et sucre de canne. Rafraîchissante et énergisante.",
      price: "350",
      imageUrl: null,
      modelGlbUrl: null,
      isAvailable: true,
      sortOrder: 3,
    },
    // Dessert
    {
      categoryId: dessert.id,
      name: "Baklava Maison",
      description: "Feuilletée de pâte filo, miel d'acacia, pistaches et amandes concassées. Recette familiale transmise de génération en génération.",
      price: "600",
      imageUrl: null,
      modelGlbUrl: null,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      categoryId: dessert.id,
      name: "Crème Caramel",
      description: "Crème onctueuse à la vanille de Bourbon, caramel maison et amandes effilées toastées.",
      price: "500",
      imageUrl: null,
      modelGlbUrl: null,
      isAvailable: true,
      sortOrder: 2,
    },
    {
      categoryId: dessert.id,
      name: "Fondant au Chocolat",
      description: "Cœur coulant au chocolat noir 70%, glace vanille et coulis de framboises. Le dessert signature de la maison.",
      price: "700",
      imageUrl: null,
      modelGlbUrl: null,
      isAvailable: true,
      sortOrder: 3,
    },
  ]);

  console.log("Dishes inserted: 12 dishes across 4 categories");
  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
