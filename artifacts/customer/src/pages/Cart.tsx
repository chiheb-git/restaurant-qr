import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, X, Loader2 } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const apiUrl = (import.meta as any).env.VITE_API_URL || "https://restaurant-qr-45iy.onrender.com";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Prénom requis";
    if (!form.lastName.trim()) e.lastName = "Nom requis";
    if (!form.phone.trim()) e.phone = "Téléphone requis";
    else if (!/^[0-9+\s-]{8,15}$/.test(form.phone.trim())) e.phone = "Numéro invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        }),
      });
      if (!res.ok) throw new Error("failed");
      clearCart();
      setShowForm(false);
      navigate("/cart/success");
    } catch {
      setErrors({ submit: "Erreur lors de l'envoi. Réessayez." });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-serif text-foreground mb-2">Votre panier est vide</h2>
        <p className="text-muted-foreground text-sm mb-6">Ajoutez des plats depuis le menu pour commencer.</p>
        <Link href="/" className="px-6 py-3 rounded-full font-semibold text-black" style={{ background: "linear-gradient(135deg, #C9A84C, #E2B95A)" }}>
          Voir le menu
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/" className="w-9 h-9 rounded-full flex items-center justify-center bg-card border border-border">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-serif font-bold">Votre Panier</h1>
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{item.name}</h3>
              <p className="text-primary text-sm font-bold">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center tap-effect"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center tap-effect"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-red-400 tap-effect ml-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="w-full py-4 rounded-2xl font-bold text-black text-base"
        style={{ background: "linear-gradient(135deg, #C9A84C, #E2B95A)" }}
      >
        Valider la commande
      </button>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }} onClick={() => !submitting && setShowForm(false)}>
          <div
            className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 border-t sm:border border-border max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-serif font-bold">Vos informations</h2>
              <button onClick={() => !submitting && setShowForm(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-background">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Prénom *</label>
                <input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="Votre prénom"
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Nom *</label>
                <input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="Votre nom"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Téléphone *</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary"
                  placeholder="0X XX XX XX XX"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Description (optionnel)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:border-primary resize-none"
                  placeholder="Allergies, demandes spéciales..."
                  rows={3}
                />
              </div>

              {errors.submit && <p className="text-red-400 text-sm text-center">{errors.submit}</p>}

              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="w-full py-4 rounded-2xl font-bold text-black text-base flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E2B95A)" }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...
                  </>
                ) : (
                  "Confirmer la commande"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}