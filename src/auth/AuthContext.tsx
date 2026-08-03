import { createContext, useContext, useState, type ReactNode } from "react";
import { iniciarSesion as iniciarSesionApi } from "../api/authApi";
import { CLAVE_TOKEN_STORAGE } from "../api/clienteHttp";

interface AuthContextValor {
  estaAutenticado: boolean;
  iniciarSesion: (usuario: string, contrasena: string) => Promise<void>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextValor | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Al cargar la app, si ya habia un token guardado de una sesion anterior, arranca autenticado
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(CLAVE_TOKEN_STORAGE));

  async function iniciarSesion(usuario: string, contrasena: string) {
    const resultado = await iniciarSesionApi({ usuario, contrasena });
    localStorage.setItem(CLAVE_TOKEN_STORAGE, resultado.token);
    setToken(resultado.token);
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_TOKEN_STORAGE);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ estaAutenticado: token !== null, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return contexto;
}
