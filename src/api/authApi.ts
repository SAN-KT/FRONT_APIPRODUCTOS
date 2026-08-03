import { clienteHttp } from "./clienteHttp";
import type { LoginRequest, TokenResponse } from "../tipos";

export async function iniciarSesion(datos: LoginRequest): Promise<TokenResponse> {
  const respuesta = await clienteHttp.post<TokenResponse>("/Auth/login", datos);
  return respuesta.data;
}
