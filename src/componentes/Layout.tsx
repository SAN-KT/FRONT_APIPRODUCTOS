import { AppShell, Button, Container, Group, Text } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Barra superior comun a todas las paginas autenticadas, para no repetirla en cada una
export function Layout() {
  const { cerrarSesion } = useAuth();

  return (
    <AppShell header={{ height: 56 }} padding="lg">
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Text fw={700}>Asisya</Text>
          <Button variant="default" size="sm" onClick={cerrarSesion}>
            Cerrar sesion
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
