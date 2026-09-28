import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Pencil, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { TALLERES } from "@/lib/talleres";

type Coupon = {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  is_active: boolean | null;
  valid_until: string | null;
  max_uses: number | null;
  current_uses: number | null;
  applicable_event_ids: string[];
};

const EVENTS = Object.values(TALLERES).map((t) => ({ id: t.eventId, label: t.nombreCorto }));

const empty = {
  code: "",
  discount_type: "percentage",
  discount_value: 10,
  valid_until: "",
  max_uses: "",
  is_active: true,
  applicable_event_ids: [] as string[],
};

export default function TallerCouponsManager() {
  const [rows, setRows] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<typeof empty | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("discount_coupons")
      .select("id, code, discount_type, discount_value, is_active, valid_until, max_uses, current_uses, applicable_event_ids")
      .eq("applies_to_talleres", true)
      .order("created_at", { ascending: false });
    if (error) toast.error("No se pudieron cargar los cupones");
    setRows((data || []) as Coupon[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const startEdit = (c: Coupon) => {
    setEditId(c.id);
    setForm({
      code: c.code,
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      valid_until: c.valid_until ? c.valid_until.slice(0, 10) : "",
      max_uses: c.max_uses ? String(c.max_uses) : "",
      is_active: !!c.is_active,
      applicable_event_ids: c.applicable_event_ids || [],
    });
  };

  const save = async () => {
    if (!form) return;
    const code = form.code.replace(/\s/g, "").toUpperCase();
    const value = Math.floor(Number(form.discount_value));
    if (!code) return toast.error("Escribe un código");
    if (!value || value < 1 || (form.discount_type === "percentage" && value > 100))
      return toast.error("Descuento inválido");
    setSaving(true);
    const payload = {
      code,
      discount_type: form.discount_type,
      discount_value: value,
      is_active: form.is_active,
      applies_to_talleres: true,
      applicable_event_ids: form.applicable_event_ids,
      max_uses: form.max_uses ? Math.floor(Number(form.max_uses)) : null,
      valid_until: form.valid_until ? `${form.valid_until}T23:59:59-03:00` : null,
    };
    const { error } = editId
      ? await supabase.from("discount_coupons").update(payload).eq("id", editId)
      : await supabase.from("discount_coupons").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "Ese código ya existe" : "Error: " + error.message);
      return;
    }
    toast.success(editId ? "Cupón actualizado" : "Cupón creado");
    setForm(null);
    setEditId(null);
    load();
  };

  const toggleActive = async (c: Coupon) => {
    const { error } = await supabase.from("discount_coupons").update({ is_active: !c.is_active }).eq("id", c.id);
    if (error) return toast.error("No se pudo cambiar");
    load();
  };

  const eventLabel = (ids: string[]) =>
    !ids || ids.length === 0 ? "Todos los talleres" : ids.map((id) => EVENTS.find((e) => e.id === id)?.label ?? id).join(", ");

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Cupones de talleres</h2>
          <p className="text-xs text-muted-foreground">No aplican al pack (ya tiene descuento).</p>
        </div>
        {!form && (
          <Button size="sm" onClick={() => { setEditId(null); setForm({ ...empty }); }}>
            <Plus className="h-4 w-4 mr-1" /> Nuevo cupón
          </Button>
        )}
      </div>

      {form && (
        <div className="border rounded-lg p-4 grid gap-4 md:grid-cols-3">
          <div>
            <Label>Código</Label>
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.replace(/\s/g, "").toUpperCase() })} />
          </div>
          <div>
            <Label>Tipo</Label>
            <select
              className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              value={form.discount_type}
              onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
            >
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Monto fijo ($)</option>
            </select>
          </div>
          <div>
            <Label>Descuento</Label>
            <Input type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Vence (opcional)</Label>
            <Input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} />
          </div>
          <div>
            <Label>Máx. usos (opcional)</Label>
            <Input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
            <Label>Activo</Label>
          </div>
          <div className="md:col-span-3">
            <Label>Talleres donde aplica (ninguno marcado = todos)</Label>
            <div className="flex flex-wrap gap-4 mt-2">
              {EVENTS.map((ev) => (
                <label key={ev.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.applicable_event_ids.includes(ev.id)}
                    onCheckedChange={(v) =>
                      setForm({
                        ...form,
                        applicable_event_ids: v
                          ? [...form.applicable_event_ids, ev.id]
                          : form.applicable_event_ids.filter((x) => x !== ev.id),
                      })
                    }
                  />
                  {ev.label}
                </label>
              ))}
            </div>
          </div>
          <div className="md:col-span-3 flex gap-2">
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editId ? "Guardar cambios" : "Crear cupón"}
            </Button>
            <Button variant="ghost" onClick={() => { setForm(null); setEditId(null); }}>
              <X className="h-4 w-4 mr-1" /> Cancelar
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no hay cupones para talleres.</p>
      ) : (
        <div className="divide-y">
          {rows.map((c) => (
            <div key={c.id} className="py-2 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-semibold">{c.code}</span>
                <Badge variant="secondary">
                  {c.discount_type === "percentage" ? `${c.discount_value}%` : `$${c.discount_value.toLocaleString("es-CL")}`}
                </Badge>
                <span className="text-xs text-muted-foreground">{eventLabel(c.applicable_event_ids)}</span>
                <span className="text-xs text-muted-foreground">
                  · {c.current_uses ?? 0}{c.max_uses ? `/${c.max_uses}` : ""} usos
                  {c.valid_until ? ` · vence ${new Date(c.valid_until).toLocaleDateString("es-CL", { timeZone: "America/Santiago" })}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={!!c.is_active} onCheckedChange={() => toggleActive(c)} />
                <Button size="icon" variant="ghost" onClick={() => startEdit(c)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
