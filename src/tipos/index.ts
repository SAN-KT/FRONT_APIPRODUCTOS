// #region Autenticacion
export interface LoginRequest {
  usuario: string;
  contrasena: string;
}

export interface TokenResponse {
  token: string;
  expira: string;
}
// #endregion

// #region Categoria
export interface Categoria {
  categoriaId: number;
  nombre: string;
  descripcion: string | null;
  urlFoto: string | null;
}
// #endregion

// #region Producto
export interface Producto {
  productoId: number;
  nombre: string;
  categoriaId: number;
  nombreCategoria: string;
  urlFotoCategoria: string | null;
  precioUnitario: number;
  unidadesEnStock: number;
  descontinuado: boolean;
}

// Lo que se manda al crear o editar un producto (mismo shape que CrearProductoDto en la Api)
export interface ProductoFormulario {
  nombre: string;
  categoriaId: number;
  precioUnitario: number;
  unidadesEnStock: number;
}
// #endregion

// #region Listados paginados
export interface ResultadoPaginado<T> {
  items: T[];
  totalRegistros: number;
  pagina: number;
  tamanioPagina: number;
  totalPaginas: number;
}
// #endregion
