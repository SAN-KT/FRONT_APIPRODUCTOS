import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Center, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useAuth } from "../auth/AuthContext";

const esquemaLogin = z.object({
  usuario: z.string().min(1, "El usuario es obligatorio"),
  contrasena: z.string().min(1, "La contrasena es obligatoria"),
});

type FormularioLogin = z.infer<typeof esquemaLogin>;

export function PaginaLogin() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const [errorLogin, setErrorLogin] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormularioLogin>({ resolver: zodResolver(esquemaLogin) });

  async function alEnviar(datos: FormularioLogin) {
    setErrorLogin(null);
    try {
      await iniciarSesion(datos.usuario, datos.contrasena);
      navigate("/productos");
    } catch {
      setErrorLogin("Usuario o contrasena incorrectos.");
    }
  }

  return (
    <Center mih="100vh">
      <Paper component="form" onSubmit={handleSubmit(alEnviar)} noValidate withBorder shadow="md" radius="md" p="xl" w={380}>
        <Title order={2}>Asisya</Title>
        <Text c="dimmed" size="sm" mb="md">
          Ingresa para gestionar el catalogo de productos.
        </Text>

        <Stack gap="sm">
          <TextInput
            id="usuario"
            label="Usuario"
            autoComplete="username"
            error={errors.usuario?.message}
            {...register("usuario")}
          />
          <PasswordInput
            id="contrasena"
            label="Contrasena"
            autoComplete="current-password"
            error={errors.contrasena?.message}
            {...register("contrasena")}
          />

          {errorLogin && (
            <Alert color="red" variant="light">
              {errorLogin}
            </Alert>
          )}

          <Button type="submit" loading={isSubmitting} fullWidth mt="sm">
            Ingresar
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
}
