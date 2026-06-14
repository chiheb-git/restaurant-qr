import { useState } from "react";
import { Link } from "wouter";
import { useListCategories, useListDishes } from "@workspace/api-client-react";
import { formatPrice, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data: categoriesRaw, isLoading: isLoadingCategories } = useListCategories();
  
  const { data: dishesRaw, isLoading: isLoadingDishes } = useListDishes(
    activeCategory ? { category_id: activeCategory } : {}
  );

  const getFallbackImage = (categoryId?: number | null) => {
    if (!categoryId) return "/placeholder-pizza.png";
    const mod = categoryId % 4;
    if (mod === 0) return "/placeholder-pizza.png";
    if (mod === 1) return "/placeholder-sandwich.png";
    if (mod === 2) return "/placeholder-boisson.png";
    return "/placeholder-dessert.png";
  };

  return (
    <div className="flex flex-col w-full min-h-screen pb-6">
      {/* Hero */}
      <section className="relative w-full flex flex-col items-center justify-center border-b border-border overflow-hidden" style={{minHeight:"280px"}}>
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" style={{filter:"brightness(0.35)"}}>
          <source src="https://res.cloudinary.com/dyzpjsj3c/video/upload/v1781461371/restaurant/iwmb6clor6tkuznhkjus.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 flex flex-col items-center">
        </div>
      </section>

      {/* Categories */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border py-3">
        <div className="flex overflow-x-auto hide-scrollbar px-4 gap-2 no-scrollbar">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all tap-effect",
              activeCategory === null 
                ? "bg-primary text-primary-foreground" 
                : "bg-card text-foreground border border-border"
            )}
          >
            Tous
          </button>
          
          {isLoadingCategories ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full flex-shrink-0" />
            ))
          ) : (
            (Array.isArray(categoriesRaw) ? categoriesRaw : categoriesRaw?.data ?? []).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all tap-effect",
                  activeCategory === cat.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card text-foreground border border-border"
                )}
              >
                {cat.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* dishesRaw List */}
      <div className="flex flex-col gap-6 px-4 py-6">
        {isLoadingDishes ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="w-full aspect-[16/9] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            </div>
          ))
        ) : (Array.isArray(dishesRaw) ? dishesRaw : dishesRaw?.data ?? []).length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Aucun plat trouvé dans cette catégorie.
          </div>
        ) : (
          (Array.isArray(dishesRaw) ? dishesRaw : dishesRaw?.data ?? []).map((dish) => (
            <Link key={dish.id} href={`/dish/${dish.id}`} className="flex flex-col group tap-effect">
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-card relative">
                <img 
                  src={dish.imageUrl || getFallbackImage(dish.categoryId)} 
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {!dish.isAvailable && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <span className="bg-card px-4 py-2 rounded-full text-sm font-medium border border-border">
                      أ‰puisأ©
                    </span>
                  </div>
                )}
                {dish.modelGlbUrl && dish.isAvailable && (
                  <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-border flex items-center gap-1.5 text-primary">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    3D AR
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-serif text-[18px] font-semibold text-foreground mb-1 leading-snug">
                    {dish.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {dish.description || "Une dأ©licieuse spأ©cialitأ© prأ©parأ©e avec soin."}
                  </p>
                </div>
                <div className="font-semibold text-primary text-right whitespace-nowrap">
                  {formatPrice(dish.price)}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}







