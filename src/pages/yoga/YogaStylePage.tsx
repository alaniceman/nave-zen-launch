import { useParams, Navigate } from "react-router-dom";
import { getYogaStyle } from "@/data/yogaStyles";
import { YogaStyleTemplate } from "@/components/yoga/YogaStyleTemplate";

/** Ruta dinámica /yoga/:slug — todas las landings por estilo usan el mismo template */
export default function YogaStylePage() {
  const { slug } = useParams<{ slug: string }>();
  const style = getYogaStyle(slug);

  if (!style) return <Navigate to="/yoga-las-condes" replace />;

  return <YogaStyleTemplate style={style} />;
}
