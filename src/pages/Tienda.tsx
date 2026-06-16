import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { ProductCard, ShopProduct } from "@/components/tienda/ProductCard";
import { ProductDetailModal } from "@/components/tienda/ProductDetailModal";
import { BuyFormModal } from "@/components/tienda/BuyFormModal";
import { Loader2, ShoppingBag } from "lucide-react";

const Tienda = () => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailProduct, setDetailProduct] = useState<ShopProduct | null>(null);
  const [buyProduct, setBuyProduct] = useState<ShopProduct | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("shop_products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (!error && data) setProducts(data as ShopProduct[]);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      <Helmet>
        <title>Tienda Nave Studio | Productos de bienestar en Las Condes</title>
        <meta name="description" content="Tienda Nave Studio: ropa, accesorios y productos de bienestar para tu práctica de Ice Bath, Wim Hof y Yoga. Compra desde tu celular y retira en Las Condes." />
        <meta name="keywords" content="tienda nave studio, productos ice bath, ropa yoga las condes, accesorios wim hof, tienda bienestar santiago" />
        <link rel="canonical" href="https://studiolanave.com/tienda" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nave Studio" />
        <meta property="og:title" content="Tienda Nave Studio | Productos de bienestar" />
        <meta property="og:description" content="Lo que tenemos hoy en vitrina: ropa, accesorios y productos para tu práctica. Compra desde tu celular y retira en Nave Studio, Las Condes." />
        <meta property="og:url" content="https://studiolanave.com/tienda" />
        <meta property="og:image" content="https://studiolanave.com/og-image.png" />
        <meta property="og:locale" content="es_CL" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tienda Nave Studio | Productos de bienestar" />
        <meta name="twitter:description" content="Ropa, accesorios y productos para Ice Bath, Wim Hof y Yoga. Compra online y retira en Las Condes." />
        <meta name="twitter:image" content="https://studiolanave.com/og-image.png" />

        {/* Structured data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Tienda Nave Studio",
          "description": "Tienda de productos de bienestar de Nave Studio: ropa, accesorios y artículos para Ice Bath, Wim Hof y Yoga.",
          "url": "https://studiolanave.com/tienda",
          "image": "https://studiolanave.com/og-image.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Antares 259",
            "addressLocality": "Las Condes",
            "addressRegion": "Región Metropolitana",
            "addressCountry": "CL"
          },
          "telephone": "+56946120426"
        })}</script>
      </Helmet>

      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <header className="text-center mb-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-space-grotesk text-4xl md:text-5xl font-bold text-primary mb-3">Tienda Nave Studio</h1>
            <p className="font-inter text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              Lo que tenemos hoy en vitrina. Compra desde tu celular y retira en Nave Studio.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">
              Aún no hay productos disponibles. Vuelve pronto.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onDetails={() => setDetailProduct(p)}
                  onBuy={() => setBuyProduct(p)}
                />
              ))}
            </div>
          )}
        </div>

        <ProductDetailModal
          product={detailProduct}
          open={!!detailProduct}
          onOpenChange={(o) => !o && setDetailProduct(null)}
          onBuy={(p) => {
            setDetailProduct(null);
            setBuyProduct(p);
          }}
        />

        <BuyFormModal
          product={buyProduct}
          open={!!buyProduct}
          onOpenChange={(o) => !o && setBuyProduct(null)}
        />
      </main>

      <Footer />
    </>
  );
};

export default Tienda;
