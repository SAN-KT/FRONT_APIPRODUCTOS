import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Pagination,
  Select,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { obtenerProductos, eliminarProducto } from "../api/productosApi";
import { obtenerCategorias } from "../api/categoriasApi";
import type { Categoria, Producto, ResultadoPaginado } from "../tipos";

const TAMANIO_PAGINA = 10;

export function PaginaProductos() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [resultado, setResultado] = useState<ResultadoPaginado<Producto> | null>(null);
  const [pagina, setPagina] = useState(1);
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  // #region Carga de datos
  useEffect(() => {
    obtenerCategorias().then(setCategorias);
  }, []);

  useEffect(() => {
    setCargando(true);
    obtenerProductos({
      pagina,
      tamanioPagina: TAMANIO_PAGINA,
      categoriaId: categoriaId ? Number(categoriaId) : undefined,
      busqueda: busqueda || undefined,
    })
      .then(setResultado)
      .finally(() => setCargando(false));
  }, [pagina, categoriaId, busqueda]);
  // #endregion

  async function alEliminar(id: number) {
    if (!confirm("¿Borrar este producto?")) return;
    await eliminarProducto(id);
    setResultado((actual) =>
      actual ? { ...actual, items: actual.items.filter((p) => p.productoId !== id) } : actual
    );
  }

  const opcionesCategoria = categorias.map((c) => ({ value: String(c.categoriaId), label: c.nombre }));

  return (
    <div>
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Productos</Title>
          <Text c="dimmed" size="sm">
            {resultado ? `${resultado.totalRegistros} productos en total` : "Cargando catalogo..."}
          </Text>
        </div>
        <Button component={Link} to="/productos/nuevo">
          + Nuevo producto
        </Button>
      </Group>

      <Group mb="md">
        <TextInput
          placeholder="Buscar por nombre..."
          w={280}
          value={busqueda}
          onChange={(e) => {
            setPagina(1);
            setBusqueda(e.currentTarget.value);
          }}
        />
        <Select
          placeholder="Todas las categorias"
          data={opcionesCategoria}
          value={categoriaId}
          onChange={(valor) => {
            setPagina(1);
            setCategoriaId(valor);
          }}
          clearable
          w={220}
        />
      </Group>

      {cargando && (
        <Center py="xl">
          <Loader />
        </Center>
      )}

      {!cargando && resultado && (
        <>
          {/* layout="fixed" + anchos explicitos: asi "Nombre" ocupa el espacio sobrante
              y las demas columnas no quedan con aire de mas alrededor del contenido */}
          <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
            <Table.ScrollContainer minWidth={600}>
              <Table verticalSpacing="sm" layout="fixed">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Nombre</Table.Th>
                    <Table.Th w={170}>Categoria</Table.Th>
                    <Table.Th w={110}>Precio</Table.Th>
                    <Table.Th w={90}>Stock</Table.Th>
                    <Table.Th w={170} />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {resultado.items.map((p) => (
                    <Table.Tr key={p.productoId}>
                      <Table.Td>{p.nombre}</Table.Td>
                      <Table.Td>
                        <Badge variant="light">{p.nombreCategoria}</Badge>
                      </Table.Td>
                      <Table.Td>${p.precioUnitario.toFixed(2)}</Table.Td>
                      <Table.Td>{p.unidadesEnStock}</Table.Td>
                      <Table.Td>
                        <Group gap="xs" wrap="nowrap">
                          <Button component={Link} to={`/productos/${p.productoId}/editar`} variant="subtle" size="xs">
                            Editar
                          </Button>
                          <Button color="red" variant="subtle" size="xs" onClick={() => alEliminar(p.productoId)}>
                            Borrar
                          </Button>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  {resultado.items.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={5}>
                        <Text ta="center" c="dimmed" py="xl">
                          No se encontraron productos con esos filtros.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Paper>

          <Center mt="lg">
            <Pagination total={resultado.totalPaginas || 1} value={pagina} onChange={setPagina} />
          </Center>
        </>
      )}
    </div>
  );
}
