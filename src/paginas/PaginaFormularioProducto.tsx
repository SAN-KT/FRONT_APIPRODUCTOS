import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Center, Group, NumberInput, Paper, Select, Stack, Text, TextInput, Title } from "@mantine/core";
import { crearProducto, actualizarProducto, obtenerProductoPorId } from "../api/productosApi";
import { obtenerCategorias } from "../api/categoriasApi";
import type { Categoria } from "../tipos";

const esquemaProducto = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100, "Maximo 100 caracteres"),
  categoriaId: z.coerce.number({ message: "Elegi una categoria" }).min(1, "Elegi una categoria"),
  precioUnitario: z.coerce.number().min(0, "El precio no puede ser negativo"),
  unidadesEnStock: z.coerce.number().int("Tiene que ser un numero entero").min(0, "El stock no puede ser negativo"),
});

// Zod "coerce" convierte texto -> numero: el tipo ANTES de validar (input) es distinto
// al de DESPUES de validar (output). react-hook-form necesita los dos por separado.
type FormularioProductoInput = z.input<typeof esquemaProducto>;
type FormularioProductoOutput = z.output<typeof esquemaProducto>;

export function PaginaFormularioProducto() {
  const { id } = useParams();
  const esEdicion = id !== undefined;
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormularioProductoInput, unknown, FormularioProductoOutput>({
    resolver: zodResolver(esquemaProducto),
  });

  useEffect(() => {
    obtenerCategorias().then(setCategorias);
  }, []);

  // En modo edicion, precarga el formulario con los datos actuales del producto
  useEffect(() => {
    if (!esEdicion) return;
    obtenerProductoPorId(Number(id)).then((producto) => {
      reset({
        nombre: producto.nombre,
        categoriaId: producto.categoriaId,
        precioUnitario: producto.precioUnitario,
        unidadesEnStock: producto.unidadesEnStock,
      });
    });
  }, [esEdicion, id, reset]);

  async function alEnviar(datos: FormularioProductoOutput) {
    setErrorGuardar(null);
    try {
      if (esEdicion) {
        await actualizarProducto(Number(id), datos);
      } else {
        await crearProducto(datos);
      }
      navigate("/productos");
    } catch {
      setErrorGuardar("No se pudo guardar el producto. Revisa los datos e intenta de nuevo.");
    }
  }

  const opcionesCategoria = categorias.map((c) => ({ value: String(c.categoriaId), label: c.nombre }));

  return (
    <Center>
      <Paper component="form" onSubmit={handleSubmit(alEnviar)} noValidate withBorder shadow="md" radius="md" p="xl" w={420}>
        <Title order={2}>{esEdicion ? "Editar producto" : "Nuevo producto"}</Title>
        <Text c="dimmed" size="sm" mb="md">
          {esEdicion ? "Modifica los datos y guarda los cambios." : "Completa los datos del nuevo producto."}
        </Text>

        <Stack gap="sm">
          <TextInput id="nombre" label="Nombre" error={errors.nombre?.message} {...register("nombre")} />

          {/* Select y NumberInput no son inputs nativos: no emiten un "change event",
              por eso necesitan Controller en vez de spread directo con register() */}
          <Controller
            name="categoriaId"
            control={control}
            render={({ field }) => (
              <Select
                id="categoriaId"
                label="Categoria"
                placeholder="Elegi una categoria"
                data={opcionesCategoria}
                value={field.value ? String(field.value) : null}
                onChange={(valor) => field.onChange(valor ? Number(valor) : undefined)}
                error={errors.categoriaId?.message}
              />
            )}
          />

          <Controller
            name="precioUnitario"
            control={control}
            render={({ field }) => (
              <NumberInput
                id="precioUnitario"
                label="Precio unitario"
                min={0}
                decimalScale={2}
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.precioUnitario?.message}
              />
            )}
          />

          <Controller
            name="unidadesEnStock"
            control={control}
            render={({ field }) => (
              <NumberInput
                id="unidadesEnStock"
                label="Unidades en stock"
                min={0}
                value={field.value ?? ""}
                onChange={field.onChange}
                error={errors.unidadesEnStock?.message}
              />
            )}
          />

          {errorGuardar && (
            <Alert color="red" variant="light">
              {errorGuardar}
            </Alert>
          )}

          <Group grow mt="sm">
            <Button variant="default" type="button" onClick={() => navigate("/productos")}>
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Guardar
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Center>
  );
}
