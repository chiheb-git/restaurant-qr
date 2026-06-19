import { Link, useParams } from "wouter";
import { ArrowLeft, Box, ShoppingCart, Check } from "lucide-react";
import { useGetDish, getGetDishQueryKey } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function DishDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const { data: dish, isLoading } = useGetDish(id, {
    query: { enabled: !!id, queryKey: getGetDishQueryKey(id) }
  });

  const getFallbackImage = (categoryId?: number | null) => {
    if (!categoryId) return "/placeholder-pizza.png";
    const mod = categoryId % 4;
    if (mod === 0) return "/placeholder-pizza.png";
    if (mod === 1) return "/placeholder-sandwich.png";
    if (mod === 2) return "/placeholder-boisson.png";
    return "/placeholder-dessert.png";
  };

  const handleAddToCart = () => {
    if (!dish) return;
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      imageUrl: dish.imageUrl || getFallbackImage(dish.categoryId),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Skeleton className="w-full h-[300px] rounded-none" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-serif mb-2">Plat introuvable</h2>
        <Link href="/" className="text-primary mt-4 py-2 px-4 rounded border border-primary tap-effect">
          Retour au menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative pb-40">
      <div className="relative w-full h-[350px] bg-card">
        <img
          src={dish.imageUrl || getFallbackImage(dish.categoryId)}
          alt={dish.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <Link href="/" className="absolute top-6 left-4 bg-background/40 backdrop-blur-md p-3 rounded-full border border-white/10 tap-effect text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="px-6 -mt-12 relative z-10">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h1 className="text-3xl font-serif font-bold text-foreground leading-tight flex-1">
            {dish.name}
          </h1>
        </div>

        <div className="inline-block bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full font-semibold text-lg mb-6">
          {formatPrice(dish.price)}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-3">Description</h3>
            <p className="text-foreground/90 leading-relaxed text-base">
              {dish.description || "Une dأ©licieuse spأ©cialitأ© prأ©parأ©e avec soin et des ingrأ©dients de premiأ¨re qualitأ©, sأ©lectionnأ©e par notre chef."}
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pointer-events-none z-40">
        <div className="max-w-md mx-auto pointer-events-auto space-y-3">
          <button
            onClick={handleAddToCart}
            disabled={added}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base text-black shadow-lg tap-effect transition-all"
            style={{ background: added ? "#4ADE80" : "linear-gradient(135deg, #C9A84C, #E2B95A)" }}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" /> Ajouté au panier
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Ajouter au panier
              </>
            )}
          </button>

          {dish.modelGlbUrl ? (
            <Link
              href={`/ar/${dish.id}`}
              className="w-full flex items-center justify-center gap-3 bg-card border border-border text-foreground py-3.5 rounded-xl font-semibold text-sm tap-effect"
            >
              <Box className="w-4 h-4" />
              Voir en 3D / AR
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}