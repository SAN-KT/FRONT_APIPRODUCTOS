import { Navigate, Route, Routes } from "react-router-dom";
import { AuthGuard } from "../auth/AuthGuard";
import { Layout } from "../componentes/Layout";
import { PaginaLogin } from "../paginas/PaginaLogin";
import { PaginaProductos } from "../paginas/PaginaProductos";
import { PaginaFormularioProducto } from "../paginas/PaginaFormularioProducto";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />

      {/* Todo lo que cuelga de AuthGuard exige sesion iniciada; Layout pone el header comun */}
      <Route element={<AuthGuard />}>
        <Route element={<Layout />}>
          <Route path="/productos" element={<PaginaProductos />} />
          <Route path="/productos/nuevo" element={<PaginaFormularioProducto />} />
          <Route path="/productos/:id/editar" element={<PaginaFormularioProducto />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/productos" replace />} />
    </Routes>
  );
}
