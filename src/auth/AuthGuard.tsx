import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Envuelve las rutas privadas: sin sesion, redirige a /login en vez de mostrar la pagina
export function AuthGuard() {
  const { estaAutenticado } = useAuth();
  return estaAutenticado ? <Outlet /> : <Navigate to="/login" replace />;
}
