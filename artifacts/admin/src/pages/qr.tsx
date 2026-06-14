import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetQrCode, 
  getGetQrCodeQueryKey,
  useGenerateQrCode
} from "@workspace/api-client-react";
import { toast } from "sonner";
import { Download, Printer, RefreshCw, QrCode as QrIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function QrPage() {
  const queryClient = useQueryClient();
  const { data: qrCode, isLoading } = useGetQrCode();
  const generateQrCode = useGenerateQrCode();
  
  const [isPrinting, setIsPrinting] = useState(false);

  const handleGenerate = () => {
    generateQrCode.mutate(
      {},
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetQrCodeQueryKey() });
          toast.success("QR Code rأ©gأ©nأ©rأ© avec succأ¨s");
        },
        onError: () => {
          toast.error("Erreur lors de la gأ©nأ©ration du QR Code");
        }
      }
    );
  };

  const handleDownload = () => {
    if (!qrCode?.pngBase64) return;
    
    const link = document.createElement('a');
    const base64 = qrCode.pngBase64.startsWith("data:") ? qrCode.pngBase64 : `data:image/png;base64,${qrCode.pngBase64}`;
    link.href = base64;
    link.download = `menu-qr-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  return (
    <div className="py-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Code</h1>
        <p className="text-muted-foreground mt-1">Gأ©rez le QR code pour vos tables.</p>
      </div>

      <Card className="overflow-hidden border-2">
        <CardHeader className="text-center pb-2 bg-muted/30 border-b">
          <CardTitle className="text-2xl">Menu Digital</CardTitle>
          <CardDescription className="text-base mt-2 max-w-md mx-auto">
            Ce QR code est identique pour toutes les tables. Il pointe vers l'URL fixe du menu.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 print:py-0">
          {isLoading ? (
            <Skeleton className="w-[400px] h-[400px] rounded-xl" />
          ) : qrCode?.pngBase64 ? (
            <div className="relative group p-4 bg-white rounded-2xl shadow-sm border">
              <img 
                src={qrCode.pngBase64.startsWith("data:") ? qrCode.pngBase64 : `data:image/png;base64,${qrCode.pngBase64}`} 
                alt="QR Code du Menu" 
                className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]"
                width={400}
                height={400}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] border-2 border-dashed rounded-2xl text-muted-foreground bg-muted/10">
              <QrIcon className="h-24 w-24 opacity-20 mb-4" />
              <p>Aucun QR code disponible</p>
            </div>
          )}
          
          {!isLoading && qrCode?.targetUrl && (
            <div className="mt-8 text-center print:hidden">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Lien de destination</p>
              <a 
                href={qrCode.targetUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-primary hover:underline font-mono bg-muted px-4 py-2 rounded-md break-all text-sm inline-block max-w-full"
              >
                {qrCode.targetUrl}
              </a>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 py-6 bg-muted/30 border-t print:hidden">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleGenerate}
            disabled={generateQrCode.isPending}
            className="w-full sm:w-auto"
          >
            {generateQrCode.isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-5 w-5" />
            )}
            Rأ©gأ©nأ©rer le QR
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={handleDownload}
            disabled={!qrCode?.pngBase64 || isLoading}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-5 w-5" />
            Tأ©lأ©charger PNG
          </Button>
          <Button 
            size="lg" 
            onClick={handlePrint}
            disabled={!qrCode?.pngBase64 || isLoading || isPrinting}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Printer className="mr-2 h-5 w-5" />
            Imprimer
          </Button>
        </CardFooter>
      </Card>
      
      {/* CSS for printing just the QR code */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          .border-2 {
            border: none !important;
          }
          img {
            visibility: visible;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 500px !important;
            height: 500px !important;
          }
        }
      `}} />
    </div>
  );
}



