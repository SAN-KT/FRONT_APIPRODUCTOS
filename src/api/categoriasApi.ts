import { clienteHttp } from "./clienteHttp";
import type { Categoria } from "../tipos";

export async function obtenerCategorias(): Promise<Categoria[]> {
  const respuesta = await clienteHttp.get<Categoria[]>("/Category");
  return respuesta.data;
}
