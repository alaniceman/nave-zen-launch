import { useState } from "react";
import { Mail, User, MessageCircle, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";

const GROUP_TALLERES = "200590438897288377";
const GROUP_RETIROS = "200590499476670420";
const WHATSAPP_URL = "https://chat.whatsapp.com/Ebc4XBFLiP1439q8D0DcNT";

const TalleresRetirosCorreos = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [talleres, setTalleres] = useState(true);
  const [retiros, setRetiros] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({ title: "Email requerido", description: "Por favor ingresa tu email", variant: "destructive" });
      return;
    }
    if (!talleres && !retiros) {
      toast({ title: "Elige al menos una opción", description: "Marca Talleres, Retiros o ambos", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const groups: string[] = [];
      const tags: string[] = ["Talleres-Retiros-Correos"];
      if (talleres) { groups.push(GROUP_TALLERES); tags.push("Anuncios-Talleres"); }
      if (retiros) { groups.push(GROUP_RETIROS); tags.push("Anuncios-Retiros"); }

      const { error } = await supabase.functions.invoke("subscribe-mailerlite", {
        body: { email, whatsapp: "", tags, groups, source: "talleres-retiros-correos" },
      });
      if (error) throw error;

      setDone(true);
      toast({ title: "¡Listo! 🎉", description: "Te avisaremos de los próximos talleres y retiros" });
    } catch {
      toast({ title: "Error al suscribirse", description: "Por favor intenta nuevamente", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex items-center justify-center px-4 py-16">
      <SEOHead
        title="Talleres y Retiros Wim Hof por correo | Nave Studio"
        description="Entérate de los próximos Talleres y Retiros Wim Hof de Nave Studio. Recibe los anuncios en tu correo."
        noindex
      />
      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/15 to-transparent rounded-full -translate-y-16 translate-x-16" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              NO TE LO PIERDAS
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
              Entérate de los próximos <span className="text-primary">Talleres y Retiros Wim Hof</span>
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Déjanos tu correo y te avisamos apenas abramos nuevas fechas.
            </p>

            {done ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-7 h-7 text-primary" />
                </div>
                <p className="text-foreground font-medium">¡Gracias{nombre ? `, ${nombre.split(" ")[0]}` : ""}!</p>
                <p className="text-sm text-muted-foreground">Te llegarán los anuncios a tu correo.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="pl-10 h-12 border-border/50 focus:border-primary"
                    aria-label="Tu nombre"
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Tu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-border/50 focus:border-primary"
                    aria-label="Tu email"
                    required
                  />
                </div>

                <div className="space-y-3 rounded-2xl border border-border/50 p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={talleres}
                      onChange={(e) => setTalleres(e.target.checked)}
                      className="w-5 h-5 rounded accent-primary"
                    />
                    <span className="text-sm text-foreground">Anuncios de Talleres</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={retiros}
                      onChange={(e) => setRetiros(e.target.checked)}
                      className="w-5 h-5 rounded accent-primary"
                    />
                    <span className="text-sm text-foreground">Anuncios de Retiros</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
                >
                  {isSubmitting ? "Enviando..." : "Quiero recibir los anuncios"}
                </Button>
              </form>
            )}

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <MessageCircle className="w-4 h-4" />
              Únete al WhatsApp donde se anuncia esto y más
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalleresRetirosCorreos;
