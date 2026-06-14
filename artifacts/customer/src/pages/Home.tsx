import { useState } from 'react';
import { Link } from 'wouter';
import { useListCategories, useListDishes } from '@workspace/api-client-react';
import { formatPrice, cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const { data: categoriesRaw, isLoading: isLoadingCategories } = useListCategories();
  const { data: dishesRaw, isLoading: isLoadingDishes } = useListDishes(
    activeCategory ? { category_id: activeCategory } : {}
  );

  const getFallbackImage = (categoryId?: number | null) => {
    if (!categoryId) return '/placeholder-pizza.png';
    const mod = categoryId % 4;
    if (mod === 0) return '/placeholder-pizza.png';
    if (mod === 1) return '/placeholder-sandwich.png';
    if (mod === 2) return '/placeholder-boisson.png';
    return '/placeholder-dessert.png';
  };

  return (
    <div className="flex flex-col w-full min-h-screen pb-6">
      {/* Hero */}
      <section className="relative w-full flex flex-col items-center justify-center border-b border-border overflow-hidden" style={{minHeight:"280px"}}>
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0" style={{filter:"brightness(0.35)"}}>
          <source src="https://res.cloudinary.com/dyzpjsj3c/video/upload/v1781461371/restaurant/iwmb6clor6tkuznhkjus.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 flex flex-col items-center"></div>
      </section>
      {/* Categories */}
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/5 py-4" style={{background:"rgba(10,10,10,0.85)"}}>
        <div className="flex overflow-x-auto px-4 gap-3 no-scrollbar" style={{scrollbarWidth:"none"}}>
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
      {/* Dishes List */}
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
            <Link key={dish.id} href={`/dish/${dish.id}`} className="group tap-effect block">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-card" style={{boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
                <img
                  src={dish.imageUrl || getFallbackImage(dish.categoryId)}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{background:"linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)"}} />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <div className="flex-1 mr-3">
                    <h3 className="text-white font-bold text-lg leading-tight mb-1" style={{fontFamily:"serif"}}>{dish.name}</h3>
                    <p className="text-white/60 text-xs line-clamp-1">{dish.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-primary font-bold text-base">{formatPrice(dish.price)}</span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:"rgba(201,168,76,0.2)",border:"1px solid rgba(201,168,76,0.5)"}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </div>
                </div>
                {!dish.isAvailable && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <span className="bg-card px-4 py-2 rounded-full text-sm font-medium border border-border">Épuisé</span>
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
            </Link>
          ))
        )}
      </div>
      {/* Footer */}
      <div style={{textAlign:"center",padding:"24px 0 32px",borderTop:"1px solid rgba(255,255,255,0.05)",marginTop:"16px"}}>
        <p style={{fontSize:"11px",color:"rgba(255,255,255,0.25)",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"Inter, sans-serif"}}>
          Developed by <span style={{color:"rgba(201,168,76,0.6)",fontWeight:600}}>Meghraoui Chiheb</span>
        </p>
      </div>
    </div>
  );
}