import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UserPlus } from "lucide-react";

export default function ManualTallerInscripcion({ onAdded }: { onAdded?: () => void }) {
  const { toast } = useToast();
  const [taller, setTaller] = useState("fundamentos");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("0");
  const [quantity, setQuantity] = useState("1");
  const [sendEmail, setSendEmail] = useState(true);
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      toast({ title: "Faltan datos", description: "Nombre y email son obligatorios.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { data, error } = await supabase.functions.invoke("admin-add-taller-inscripcion", {
      body: {
        taller,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        phone: phone.trim(),
        amount: Math.max(0, Math.round(Number(amount.replace(/\D/g, "")) || 0)),
        quantity: Math.max(1, Math.round(Number(quantity) || 1)),
        sendEmail,
      },
    });
    setSaving(false);
    if (error || !data?.ok) {
      let msg = data?.error;
      try { msg = msg || (await (error as any)?.context?.json())?.error; } catch { /* noop */ }
      toast({ title: "No se pudo inscribir", description: msg || "Intenta de nuevo.", variant: "destructive" });
      return;
    }
    toast({
      title: "Persona inscrita",
      description: sendEmail ? (data.emailSent ? "Se envió el correo de confirmación." : "Inscrita, pero el correo falló.") : "Inscrita sin correo.",
    });
    setNombre(""); setApellido(""); setEmail(""); setPhone(""); setAmount("0"); setQuantity("1");
    onAdded?.();
  };

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold flex items-center gap-2"><UserPlus className="h-5 w-5" /> Inscribir manualmente</h2>
        <p className="text-sm text-muted-foreground">Descuenta el cupo y envía el mismo correo de confirmación que reciben quienes compran.</p>
      </div>
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-4">
        <div>
          <Label>Taller</Label>
          <Select value={taller} onValueChange={setTaller}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="fundamentos">Fundamentales · 3 oct</SelectItem>
              <SelectItem value="avanzado">Avanzado · 4 oct</SelectItem>
              <SelectItem value="pack">Pack (ambos)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Nombre *</Label><Input value={nombre} onChange={(e) => setNombre(e.target.value)} /></div>
        <div><Label>Apellido</Label><Input value={apellido} onChange={(e) => setApellido(e.target.value)} /></div>
        <div><Label>Email *</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div><Label>Teléfono</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        <div><Label>Monto cobrado (CLP)</Label><Input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        <div><Label>Personas</Label><Input type="number" min={1} max={20} value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div>
        <div className="flex items-end gap-2 pb-2">
          <Checkbox id="send-mail" checked={sendEmail} onCheckedChange={(v) => setSendEmail(v === true)} />
          <Label htmlFor="send-mail">Enviar correo</Label>
        </div>
        <div className="md:col-span-4">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Inscribir
          </Button>
        </div>
      </form>
    </Card>
  );
}
