import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

interface SessionPackage {
  id: string;
  name: string;
  description: string;
  sessions_quantity: number;
  price_clp: number;
  validity_days: number;
  applicable_service_ids: string[];
  is_active: boolean;
}

interface Service {
  id: string;
  name: string;
}

export default function AdminSessionPackages() {
  const [packages, setPackages] = useState<SessionPackage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<SessionPackage | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sessions_quantity: 1,
    price_clp: 0,
    validity_days: 90,
    applicable_service_ids: [] as string[],
    is_active: true,
  });

  useEffect(() => {
    loadPackages();
    loadServices();
  }, []);

  const loadPackages = async () => {
    const { data, error } = await supabase
      .from("session_packages")
      .select("*")
      .order("sessions_quantity");

    if (error) {
      toast.error("Error al cargar paquetes");
      return;
    }
    setPackages(data || []);
  };

  const loadServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("id, name")
      .eq("is_active", true);

    if (error) {
      toast.error("Error al cargar servicios");
      return;
    }
    setServices(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPackage) {
      const { error } = await supabase
        .from("session_packages")
        .update(formData)
        .eq("id", editingPackage.id);

      if (error) {
        toast.error("Error al actualizar paquete");
        return;
      }
      toast.success("Paquete actualizado");
    } else {
      const { error } = await supabase
        .from("session_packages")
        .insert([formData]);

      if (error) {
        toast.error("Error al crear paquete");
        return;
      }
      toast.success("Paquete creado");
    }

    setIsDialogOpen(false);
    resetForm();
    loadPackages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este paquete?")) return;

    const { error } = await supabase
      .from("session_packages")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error al eliminar paquete");
      return;
    }
    toast.success("Paquete eliminado");
    loadPackages();
  };

  const handleEdit = (pkg: SessionPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      sessions_quantity: pkg.sessions_quantity,
      price_clp: pkg.price_clp,
      validity_days: pkg.validity_days,
      applicable_service_ids: pkg.applicable_service_ids,
      is_active: pkg.is_active,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      name: "",
      description: "",
      sessions_quantity: 1,
      price_clp: 0,
      validity_days: 90,
      applicable_service_ids: [],
      is_active: true,
    });
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      applicable_service_ids: prev.applicable_service_ids.includes(serviceId)
        ? prev.applicable_service_ids.filter(id => id !== serviceId)
        : [...prev.applicable_service_ids, serviceId],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paquetes de Sesiones</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Paquete
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? "Editar Paquete" : "Nuevo Paquete"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sessions_quantity">Cantidad de Sesiones *</Label>
                  <Input
                    id="sessions_quantity"
                    type="number"
                    min="1"
                    value={formData.sessions_quantity}
                    onChange={(e) => setFormData({ ...formData, sessions_quantity: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price_clp">Precio (CLP) *</Label>
                  <Input
                    id="price_clp"
                    type="number"
                    min="0"
                    value={formData.price_clp}
                    onChange={(e) => setFormData({ ...formData, price_clp: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="validity_days">Validez (días) *</Label>
                  <Input
                    id="validity_days"
                    type="number"
                    min="1"
                    value={formData.validity_days}
                    onChange={(e) => setFormData({ ...formData, validity_days: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Servicios Aplicables *</Label>
                <div className="space-y-2 border rounded-lg p-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={formData.applicable_service_ids.includes(service.id)}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                      <label htmlFor={service.id} className="text-sm cursor-pointer">
                        {service.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Activo</Label>
              </div>

              <Button type="submit" className="w-full">
                {editingPackage ? "Actualizar" : "Crear"} Paquete
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
                <div className="mt-3 space-y-1 text-sm">
                  <p><strong>Sesiones:</strong> {pkg.sessions_quantity}</p>
                  <p><strong>Precio:</strong> ${pkg.price_clp.toLocaleString("es-CL")} CLP</p>
                  <p><strong>Validez:</strong> {pkg.validity_days} días</p>
                  <p><strong>Estado:</strong> {pkg.is_active ? "Activo" : "Inactivo"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(pkg.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}