import { Link, useLocation } from "wouter";
import { Menu, Box, Info, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { totalItems } = useCart();
  const navItems = [
    { href: "/", icon: Menu, label: "Menu" },
    { href: "/ar", icon: Box, label: "AR" },
    { href: "/about", icon: Info, label: "Info" },
  ];
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground pb-20">
      <main className="flex-1 w-full relative">
        {children}
      </main>

      {totalItems > 0 && location !== "/cart" && (
        <Link
          href="/cart"
          className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl tap-effect"
          style={{
            background: "linear-gradient(135deg, #C9A84C, #E2B95A)",
            boxShadow: "0 8px 24px rgba(201,168,76,0.4)",
          }}
        >
          <ShoppingCart className="w-5 h-5 text-black" />
          <span className="text-black font-bold text-sm">{totalItems}</span>
        </Link>
      )}

      <nav className="fixed bottom-0 left-0 right-0 glass-nav z-50">
        <div className="flex items-center justify-around h-16 px-8">
          {navItems.map((item, i) => {
            const isActive = location === item.href || (item.label === "Menu" && location === "/");
            return (
              <Link key={i} href={item.href} className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 tap-effect",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}