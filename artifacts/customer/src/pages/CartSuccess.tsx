import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";

export default function CartSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <CheckCircle2 className="w-20 h-20 text-primary mb-6" />
      <h1 className="text-2xl font-serif font-bold mb-2">Commande envoyée !</h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-xs">
        Votre commande a été transmise avec succès. Nous vous contacterons rapidement.
      </p>
      <Link href="/" className="px-6 py-3 rounded-full font-semibold text-black" style={{ background: "linear-gradient(135deg, #C9A84C, #E2B95A)" }}>
        Retour au menu
      </Link>
    </div>
  );
}