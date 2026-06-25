import React, { useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useGetDish, getGetDishQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        alt?: string;
        ar?: boolean | '';
        'ar-modes'?: string;
        'ar-placement'?: string;
        'ar-scale'?: string;
        'camera-controls'?: boolean | '';
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'min-field-of-view'?: string;
        'max-field-of-view'?: string;
        'camera-orbit'?: string;
        'field-of-view'?: string;
        'interpolation-decay'?: string;
        'auto-rotate'?: boolean | '';
        'auto-rotate-delay'?: string;
        'rotation-per-second'?: string;
        'interaction-prompt'?: string;
        'interaction-prompt-style'?: string;
        'shadow-intensity'?: string;
        'shadow-softness'?: string;
        'environment-image'?: string;
        exposure?: string;
        'tone-mapping'?: string;
        scale?: string;
        'xr-environment'?: boolean | '';
        style?: React.CSSProperties;
        slot?: string;
        onArStatus?: (e: any) => void;
        onArTracking?: (e: any) => void;
      }, HTMLElement>;
    }
  }
}

export default function ARViewer() {
  const params = useParams();
  const id = Number(params.id);
  const [arStatus, setArStatus] = useState<string>('not-presenting');
  const [arTracking, setArTracking] = useState<string>('tracking');

  const { data: dish, isLoading } = useGetDish(id, {
    query: { enabled: !!id, queryKey: getGetDishQueryKey(id) }
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[100]">
        <Skeleton className="w-32 h-32 rounded-full mb-8" />
        <div className="text-primary font-serif animate-pulse">Chargement de la 3D...</div>
      </div>
    );
  }

  if (!dish || !dish.modelGlbUrl) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-6 text-center z-[100]">
        <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mb-6">
          <span className="text-2xl">ًںچ½ï¸ڈ</span>
        </div>
        <h2 className="text-2xl font-serif text-foreground mb-3">Modele indisponible</h2>
        <p className="text-muted-foreground mb-8">Ce plat n'a pas encore de vue 3D.</p>
        <Link href={dish ? `/dish/${dish.id}` : "/"} className="bg-card text-foreground px-6 py-3 rounded-full border border-border tap-effect">
          Retour
        </Link>
      </div>
    );
  }

  let modelSrc = dish.modelGlbUrl as string;
  try {
    if (!/^https?:\/\//i.test(modelSrc)) {
      const base = (import.meta.env.VITE_MODELS_BASE_URL as string) || "";
      if (base) modelSrc = `${base.replace(/\/$/, "")}/${modelSrc.replace(/^\//, "")}`;
    }
  } catch (e) {
    // ignore if env not available
  }

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* Header over AR */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start pointer-events-none">
        <Link href={`/dish/${dish.id}`} className="bg-background/40 backdrop-blur-md p-3 rounded-full border border-white/10 text-white pointer-events-auto tap-effect">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="bg-background/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white font-serif shadow-lg pointer-events-auto max-w-[60%] text-right truncate">
          {dish.name}
        </div>
      </div>

      {/* AR Viewer */}
      <div className="flex-1 relative w-full h-full">
        <model-viewer
          src={modelSrc}
          ios-src=""
          alt={`Modele 3D de ${dish.name}`}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-placement="floor"
          ar-scale="auto"
          xr-environment
          camera-controls
          min-camera-orbit="auto auto 0.4m"
          max-camera-orbit="auto auto 1.8m"
          min-field-of-view="8deg"
          max-field-of-view="45deg"
          camera-orbit="0deg 70deg 0.8m"
          field-of-view="25deg"
          interpolation-decay="300"
          auto-rotate
          auto-rotate-delay="0"
          rotation-per-second="15deg"
          interaction-prompt="when-focused"
          interaction-prompt-style="basic"
          shadow-intensity="1.3"
          shadow-softness="1.2"
          environment-image="legacy"
          exposure="0.95"
          tone-mapping="neutral"
          scale="1 1 1"
          onArStatus={(e: any) => setArStatus(e.detail?.status || 'not-presenting')}
          onArTracking={(e: any) => setArTracking(e.detail?.status || 'tracking')}
          style={{ width: '100%', height: '100%', backgroundColor: '#0F0F0F' }}
        >
          <button
            slot="ar-button"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 rounded-full font-bold text-lg shadow-xl tap-effect whitespace-nowrap z-50"
          >
            Placer sur ma table
          </button>

          {arStatus === 'session-started' && arTracking !== 'tracking' && (
            <div
              style={{
                position: 'absolute',
                bottom: '120px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)',
                padding: '10px 20px',
                borderRadius: '50px',
                color: '#fff',
                fontSize: '13px',
                whiteSpace: 'nowrap',
              }}
            >
              Deplacez votre telephone pour detecter la table
            </div>
          )}

          {arStatus === 'session-started' && arTracking === 'tracking' && (
            <div
              style={{
                position: 'absolute',
                bottom: '120px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.6)',
                padding: '8px 18px',
                borderRadius: '50px',
                color: '#C9A84C',
                fontSize: '12px',
                whiteSpace: 'nowrap',
              }}
            >
              Pincez pour zoomer آ· Faites le tour pour voir tous les angles
            </div>
          )}
        </model-viewer>
      </div>
    </div>
  );
}