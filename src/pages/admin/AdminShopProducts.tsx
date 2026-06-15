import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, X, ArrowUp, ArrowDown, Upload, GripVertical } from "lucide-react";

const BUCKET = "shop-products";

type Product = {
  id: string;
  name: string;
  short_description: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  image_urls: string[] | null;
  is_active: boolean;
  sort_order: number;
};

const empty: Omit<Product, "id"> = {
  name: "",
  short_description: "",
  description: "",
  price: 0,
  image_url: "",
  image_urls: [],
  is_active: true,
  sort_order: 0,
};

const AdminShopProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [newImage, setNewImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !editing) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
        if (error) throw error;
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setEditing({ ...editing, image_urls: [...(editing.image_urls || []), ...uploaded] });
    } catch (err: any) {
      toast({ title: "Error al subir imagen", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("shop_products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error al cargar productos", description: error.message, variant: "destructive" });
    } else {
      setProducts((data || []) as Product[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (p: Partial<Product>) => {
    // Normalize: if no image_urls but legacy image_url exists, seed from it
    const imgs = (p.image_urls && p.image_urls.length > 0)
      ? p.image_urls
      : (p.image_url ? [p.image_url] : []);
    setEditing({ ...p, image_urls: imgs });
    setNewImage("");
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name || editing.price == null || editing.price < 0) {
      toast({ title: "Nombre y precio son obligatorios", variant: "destructive" });
      return;
    }
    setSaving(true);
    const images = (editing.image_urls || []).filter(Boolean);
    const payload = {
      name: editing.name,
      short_description: editing.short_description || null,
      description: editing.description || null,
      price: Math.round(Number(editing.price)),
      image_urls: images,
      image_url: images[0] || null, // keep legacy field synced with first image
      is_active: editing.is_active ?? true,
      sort_order: editing.sort_order ?? 0,
    };
    const { error } = editing.id
      ? await supabase.from("shop_products").update(payload).eq("id", editing.id)
      : await supabase.from("shop_products").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Producto guardado" });
      setEditing(null);
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    const { error } = await supabase.from("shop_products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error al eliminar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Producto eliminado" });
      load();
    }
  };

  const toggleActive = async (p: Product) => {
    const { error } = await supabase
      .from("shop_products")
      .update({ is_active: !p.is_active })
      .eq("id", p.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      load();
    }
  };

  const addImage = () => {
    const url = newImage.trim();
    if (!url || !editing) return;
    setEditing({ ...editing, image_urls: [...(editing.image_urls || []), url] });
    setNewImage("");
  };

  const removeImage = (i: number) => {
    if (!editing) return;
    const arr = [...(editing.image_urls || [])];
    arr.splice(i, 1);
    setEditing({ ...editing, image_urls: arr });
  };

  const moveImage = (i: number, dir: -1 | 1) => {
    if (!editing) return;
    const arr = [...(editing.image_urls || [])];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setEditing({ ...editing, image_urls: arr });
  };

  const getCover = (p: Product) => (p.image_urls && p.image_urls[0]) || p.image_url || null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tienda · Productos</h1>
          <p className="text-sm text-muted-foreground">Gestiona los productos que se venden por QR en el local.</p>
        </div>
        <Button onClick={() => openEdit({ ...empty })}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo producto
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => {
            const cover = getCover(p);
            const count = (p.image_urls?.length || (p.image_url ? 1 : 0));
            return (
              <div key={p.id} className="border rounded-xl bg-card overflow-hidden flex flex-col">
                <div className="aspect-square bg-muted relative">
                  {cover ? (
                    <img src={cover} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
                  )}
                  {count > 1 && (
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                      {count} fotos
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold">{p.name}</h3>
                    <Switch checked={p.is_active} onCheckedChange={() => toggleActive(p)} />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.short_description}</p>
                  <p className="font-bold text-primary text-lg">${p.price.toLocaleString("es-CL")}</p>
                  <p className="text-xs text-muted-foreground">Orden: {p.sort_order}</p>
                  <div className="flex gap-2 mt-auto">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <Label>Nombre</Label>
                <Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label>Descripción corta (mostrada en la card)</Label>
                <Textarea rows={2} value={editing.short_description || ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} />
              </div>
              <div>
                <Label>Descripción completa (en el modal)</Label>
                <Textarea rows={5} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Precio (CLP)</Label>
                  <Input type="number" min={0} value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Orden (menor = primero)</Label>
                  <Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Imágenes (cuadradas) — la primera es la portada</Label>
                <div>
                  <input
                    id="shop-image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => { handleUpload(e.target.files); e.target.value = ""; }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={uploading}
                    onClick={() => document.getElementById("shop-image-upload")?.click()}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    {uploading ? "Subiendo..." : "Subir imágenes"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newImage}
                    placeholder="O pega una URL https://..."
                    onChange={(e) => setNewImage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
                  />
                  <Button type="button" variant="outline" onClick={addImage}>Agregar URL</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Puedes subir varias fotos y reordenarlas. La primera es la portada.
                </p>


                {(editing.image_urls || []).length > 0 && (
                  <div className="space-y-2">
                    {(editing.image_urls || []).map((url, i) => (
                      <div key={i} className="flex items-center gap-2 border rounded-lg p-2">
                        <div className="w-14 h-14 rounded-md bg-muted overflow-hidden flex-shrink-0">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate">{url}</p>
                          {i === 0 && <span className="text-[10px] text-primary font-semibold">PORTADA</span>}
                        </div>
                        <div className="flex flex-col">
                          <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="p-0.5 disabled:opacity-30">
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => moveImage(i, 1)} disabled={i === (editing.image_urls!.length - 1)} className="p-0.5 disabled:opacity-30">
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => removeImage(i)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                <Label>Activo (visible en la tienda)</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShopProducts;
