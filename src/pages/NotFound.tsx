import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-space font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-2">Página no encontrada</p>
        <p className="text-sm text-muted-foreground mb-8">
          La página que buscas no existe o fue movida.
        </p>
        <Link
          to="/"
          className="inline-block bg-secondary hover:bg-primary text-white font-inter font-medium px-8 py-3 rounded-[10px] transition-all duration-200 hover:scale-105"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
