import type { ShopProduct } from "@/components/tienda/ProductCard";
import iceSonrisa from "@/assets/studio-ice-sonrisa.webp.asset.json";
import iceSereno from "@/assets/studio-ice-sereno.webp.asset.json";
import respira from "@/assets/studio-respira-circulo.webp.asset.json";
import yogaPerro from "@/assets/studio-yoga-perro.webp.asset.json";
import meditacion from "@/assets/studio-meditacion-grupo.webp.asset.json";

/** Fin de la campaña: 7 oct 2026 23:59:59 hora de Chile. El servidor valida lo mismo. */
export const CYBER_ENDS_AT = Date.parse("2026-12-31T23:59:59-03:00");

export const CYBER_IMAGES = {
  iceSonrisa: iceSonrisa.url,
  iceSereno: iceSereno.url,
  respira: respira.url,
  yoga: yogaPerro.url,
  meditacion: meditacion.url,
};

export const CYBER_ROUTES = {
  home: "/cyber-nave-studio",
  packs: "/cyber-nave-studio-paquetes",
  memberships: "/cyber-nave-studio-membresias",
};

export const WHATSAPP_URL =
  "https://wa.me/56946120426?text=" + encodeURIComponent("Hola Nave Studio, tengo una consulta sobre el Cyber");

export const formatCLP = (n: number) => `$${Math.round(n).toLocaleString("es-CL")}`;

export type CyberPack = {
  id: string;
  sku: string;
  title: string;
  subtitle: string;
  price: number;
  regular: number;
  discountLabel: string;
  own: number;
  invites: number;
  image: string;
};

export const CYBER_PACKS: CyberPack[] = [
  {
    id: "c7be0000-0000-4000-8000-000000000001",
    sku: "bautizo",
    title: "Bautizo de hielo",
    subtitle: "1 sesión para dar el primer paso",
    price: 15000,
    regular: 30000,
    discountLabel: "50% OFF",
    own: 1,
    invites: 0,
    image: CYBER_IMAGES.iceSonrisa,
  },
  {
    id: "c7be0000-0000-4000-8000-000000000002",
    sku: "pack-3",
    title: "3 sesiones + una invitación",
    subtitle: "Vuelve al hielo y comparte la experiencia",
    price: 36000,
    regular: 90000,
    discountLabel: "60% OFF",
    own: 3,
    invites: 1,
    image: CYBER_IMAGES.respira,
  },
  {
    id: "c7be0000-0000-4000-8000-000000000003",
    sku: "pack-6",
    title: "6 sesiones + dos invitaciones",
    subtitle: "Continuidad para tu práctica, y dos invitaciones de regalo",
    price: 60000,
    regular: 180000,
    discountLabel: "66,7% OFF",
    own: 6,
    invites: 2,
    image: CYBER_IMAGES.iceSereno,
  },
];

export type PlanKey = "orbita" | "universo" | "yoga-continuo" | "yoga-libre";
export type DurationKey = 3 | 7 | 14;

export const CYBER_PLANS: { key: PlanKey; name: string; monthly: number; desc: string; image: string }[] = [
  { key: "orbita", name: "Órbita", monthly: 79000, desc: "2 veces por semana · todas las experiencias", image: CYBER_IMAGES.respira },
  { key: "universo", name: "Universo", monthly: 95000, desc: "Acceso ilimitado · todas las experiencias", image: CYBER_IMAGES.iceSonrisa },
  { key: "yoga-continuo", name: "Yoga Continuo", monthly: 69000, desc: "Solo yoga · 2 clases por semana", image: CYBER_IMAGES.yoga },
  { key: "yoga-libre", name: "Yoga Libre", monthly: 85000, desc: "Yoga ilimitado", image: CYBER_IMAGES.meditacion },
];

export const CYBER_DURATIONS: {
  key: DurationKey;
  label: string;
  paid: number;
  free: number;
  discount: number;
  headline: string;
}[] = [
  { key: 3, label: "3 meses", paid: 3, free: 0, discount: 15, headline: "Pagas 3 meses con 15% de descuento" },
  { key: 7, label: "7 meses: pagas 6", paid: 6, free: 1, discount: 20, headline: "Pagas 6 meses con 20% de descuento y además te regalamos otro. Disfrutas 7" },
  { key: 14, label: "14 meses: pagas 12", paid: 12, free: 2, discount: 25, headline: "Pagas 12 meses con 25% de descuento y disfrutas 14" },
];

const MEMBERSHIP_IDS: Record<PlanKey, Record<DurationKey, string>> = {
  orbita: { 3: "c7be0000-0000-4000-8000-000000000011", 7: "c7be0000-0000-4000-8000-000000000021", 14: "c7be0000-0000-4000-8000-000000000031" },
  universo: { 3: "c7be0000-0000-4000-8000-000000000012", 7: "c7be0000-0000-4000-8000-000000000022", 14: "c7be0000-0000-4000-8000-000000000032" },
  "yoga-continuo": { 3: "c7be0000-0000-4000-8000-000000000013", 7: "c7be0000-0000-4000-8000-000000000023", 14: "c7be0000-0000-4000-8000-000000000033" },
  "yoga-libre": { 3: "c7be0000-0000-4000-8000-000000000014", 7: "c7be0000-0000-4000-8000-000000000024", 14: "c7be0000-0000-4000-8000-000000000034" },
};

export function membershipOffer(plan: (typeof CYBER_PLANS)[number], dur: (typeof CYBER_DURATIONS)[number]) {
  const regularPaid = plan.monthly * dur.paid;
  const total = Math.round(regularPaid * (1 - dur.discount / 100));
  return {
    id: MEMBERSHIP_IDS[plan.key][dur.key],
    total,
    regularPaid,
    installment: Math.round(total / 3),
    perMonth: Math.round(total / dur.key),
    name: `Cyber · ${plan.name} ${dur.key} meses${dur.free ? ` (pagas ${dur.paid})` : ""}`,
  };
}

/** Objeto compatible con el carrito existente de la tienda. Precio real se resuelve en servidor. */
export function toCartProduct(id: string, name: string, price: number, image: string, short: string): ShopProduct {
  return {
    id,
    name,
    short_description: short,
    description: null,
    price,
    image_url: image,
    image_urls: [image],
    is_active: true,
    sort_order: 0,
  };
}

export const BOXMAGIC_NEW = {
  orbita: "https://boxmagic.cl/market/plan_subscription/Kp0Mnb7D8x",
  universo: "https://boxmagic.cl/market/plan_subscription/Vx0JnbA0vB",
};
