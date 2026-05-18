import { Helmet } from "react-helmet-async";
import { Camera, Instagram, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const PHOTOS_URL =
  "https://drive.google.com/drive/folders/16166-H-gMNLPH-69vhc-JlDUmUPTWOOJ?usp=sharing";

const FotosWorkshopBuda = () => {
  return (
    <>
      <Helmet>
        <title>Fotos Workshop Buda | Nave Studio</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta
          name="description"
          content="Revisa las fotos del workshop en Buda con Nave Studio."
        />
      </Helmet>

      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-24">
        <div className="max-w-xl w-full text-center space-y-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
            <Camera className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Revisa las fotos del evento
            </h1>
            <p className="text-lg text-muted-foreground">
              No olvides mencionar a{" "}
              <a
                href="https://instagram.com/alan_iceman"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                <Instagram className="h-4 w-4" />
                @alan_iceman
              </a>{" "}
              al compartir.
            </p>
          </div>

          <Button asChild size="lg" className="gap-2">
            <a href={PHOTOS_URL} target="_blank" rel="noopener noreferrer">
              Ver fotos del workshop
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </main>
    </>
  );
};

export default FotosWorkshopBuda;
