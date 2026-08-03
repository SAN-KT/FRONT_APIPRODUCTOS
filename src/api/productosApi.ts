import { clienteHttp } from "./clienteHttp";
import type { Producto, ProductoFormulario, ResultadoPaginado } from "../tipos";

export interface FiltrosProductos {
  pagina: number;
  tamanioPagina: number;
  categoriaId?: number;
  busqueda?: string;
}

export async function obtenerProductos(filtros: FiltrosProductos): Promise<ResultadoPaginado<Producto>> {
  const respuesta = await clienteHttp.get<ResultadoPaginado<Producto>>("/Products", {
    params: filtros,
  });
  return respuesta.data;
}

export async function obtenerProductoPorId(id: number): Promise<Producto> {
  const respuesta = await clienteHttp.get<Producto>(`/Products/${id}`);
  return respuesta.data;
}

export async function crearProducto(datos: ProductoFormulario): Promise<Producto> {
  const respuesta = await clienteHttp.post<Producto>("/Product", datos);
  return respuesta.data;
}

export async function actualizarProducto(id: number, datos: ProductoFormulario): Promise<Producto> {
  const respuesta = await clienteHttp.put<Producto>(`/Products/${id}`, datos);
  return respuesta.data;
}

export async function eliminarProducto(id: number): Promise<void> {
  await clienteHttp.delete(`/Products/${id}`);
}
