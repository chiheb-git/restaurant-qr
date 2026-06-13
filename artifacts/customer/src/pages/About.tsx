import { MapPin, Phone, Clock, Instagram } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col w-full min-h-screen pb-6">
      <div className="relative w-full h-64 bg-card border-b border-border">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-4xl font-serif text-white mb-2">Le Palais d'Orient</h1>
          <p className="text-primary font-medium tracking-widest uppercase text-sm">Restaurant Gastronomique</p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <p className="text-muted-foreground leading-relaxed text-lg font-serif italic text-center px-4">
          "Une expérience culinaire immersive où la tradition algérienne rencontre l'élégance moderne."
        </p>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-border text-primary shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Adresse</h3>
              <p className="text-muted-foreground text-sm">
                12 Rue de la Liberté<br />
                16000 Alger, Algérie
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-border text-primary shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Horaires d'ouverture</h3>
              <div className="text-muted-foreground text-sm grid grid-cols-2 gap-x-4 gap-y-1 w-full max-w-[250px]">
                <span>Lun - Jeu</span>
                <span>12:00 - 23:00</span>
                <span>Ven - Sam</span>
                <span>12:00 - 00:00</span>
                <span>Dimanche</span>
                <span>Fermé</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-border text-primary shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Contact</h3>
              <p className="text-muted-foreground text-sm">
                +213 (0) 555 12 34 56<br />
                contact@palaisdorient.dz
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center border border-border text-primary shrink-0">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Réseaux Sociaux</h3>
              <p className="text-primary text-sm font-medium cursor-pointer tap-effect">
                @palaisdorient_dz
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
