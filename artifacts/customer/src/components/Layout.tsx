import { Link, useLocation } from "wouter";
import { Home, Menu, Box, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/", icon: Menu, label: "Menu" }, // both point to home per requirements
    { href: "/ar/1", icon: Box, label: "AR" }, // generic AR link for nav, ideally should be hidden if no dish selected, but per req we have 4 icons
    { href: "/about", icon: Info, label: "Info" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground pb-20 page-transition">
      <main className="flex-1 w-full max-w-md mx-auto relative">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 glass-nav z-50">
        <div className="flex items-center justify-around h-16 max-w-md mx-auto px-4">
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
        <div style={{textAlign:"center",paddingBottom:"4px"}}>
          <p style={{fontSize:"9px",color:"rgba(255,255,255,0.2)",letterSpacing:"0.18em",textTransform:"uppercase",fontFamily:"Inter, sans-serif",margin:0}}>
            Developed by <span style={{color:"rgba(201,168,76,0.55)",fontWeight:700}}>Meghraoui Chiheb</span>
          </p>
        </div>
      </nav>
    </div>
  );
}
