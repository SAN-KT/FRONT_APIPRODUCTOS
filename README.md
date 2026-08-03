# Front API Productos

SPA en React + TypeScript para gestionar productos y categorías, consumiendo la Api de Asisya (`API_PRODUCTOS`). Incluye login con JWT, listado con filtros y paginación, y formularios de creación/edición con validaciones.

## Stack

- React 19 + TypeScript
- Vite
- React Router (enrutamiento modular)
- Axios (con interceptor de autenticación)
- React Hook Form + Zod (formularios y validaciones)
- Mantine (componentes de interfaz)
- Docker + Nginx (despliegue en contenedor)

## Requisitos previos

- Node.js 20 o superior
- La Api de backend corriendo (por defecto en `http://localhost:5080`), con al menos una categoría y un producto cargados — ver la sección "Carga inicial de datos" en el README del backend (`API_PRODUCTOS`). Sin eso, el listado aparece vacío.

## Instalación y ejecución

```bash
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Conectar con otra URL de backend

Por defecto, la aplicación apunta a `http://localhost:5080`. Para usar otra URL, crear un archivo `.env` en la raíz con:

```
VITE_API_URL=http://localhost:5080
```

### Compilar para producción

```bash
npm run build
```

Genera los archivos estáticos en `dist/`.

## Ejecución con Docker

Alternativa a `npm run dev`, para levantar la aplicación ya compilada, servida con Nginx.

```bash
docker build -t front-apiproductos .
docker run -d -p 8081:80 -e VITE_API_URL=http://localhost:5080 front-apiproductos
```

La aplicación queda disponible en `http://localhost:8081`.

`VITE_API_URL` se puede cambiar en cada `docker run` sin necesidad de reconstruir la imagen: un script se ejecuta al arrancar el contenedor y genera `env-config.js` con la URL indicada (ver la sección "Notas de diseño").

## Credenciales de prueba

```
Usuario: admin
Contrasena: Admin123!
```

## Funcionalidades

| Funcionalidad | Detalle |
|---|---|
| Login | Autenticación contra `POST /Auth/login`, token guardado en `localStorage` |
| Interceptor HTTP | Agrega el token a cada request automáticamente; ante un 401, limpia la sesión y redirige a `/login` |
| AuthGuard | Protege las rutas de productos: sin sesión activa, redirige a `/login` |
| Listado de productos | Paginación, búsqueda por nombre, filtro por categoría |
| Formularios | Crear y editar productos, con validación de campos (nombre, categoría, precio, stock) |
| Modo oscuro | Tema oscuro por defecto (Mantine) |

## Estructura del proyecto

```
src/
  api/          Cliente HTTP (interceptor) y llamadas a la Api (auth, productos, categorias)
  auth/         Contexto de autenticación y AuthGuard
  componentes/  Componentes compartidos (ej: Layout con la barra superior)
  paginas/      Login, listado de productos, formulario de producto
  rutas/        Definición centralizada de rutas (AppRoutes)
  tipos/        Tipos de TypeScript, equivalentes a los DTOs de la Api
public/
  env-config.js Config de la Api leida por la app (ver "Notas de diseño")
Dockerfile               Build de dos etapas: compila con Node, sirve con Nginx
nginx.conf                Configuracion de Nginx (fallback de rutas para React Router)
docker-entrypoint.d/       Script que genera env-config.js al arrancar el contenedor
```

## Notas de diseño

- Los inputs de texto (`TextInput`, `PasswordInput`) se conectan a React Hook Form mediante `register()`, ya que envuelven un input nativo.
- `Select` y `NumberInput` de Mantine no emiten un evento de cambio nativo, por lo que se conectan mediante `Controller` de React Hook Form.
- Los tamaños de fuente y el peso de texto están ajustados en el tema de Mantine (`src/main.tsx`) y en `src/index.css`, por legibilidad.
- **Configuración de la Api en tiempo de arranque del contenedor**: Vite resuelve las variables `VITE_*` en el momento de compilar, no cuando la aplicación corre en el navegador. Para poder cambiar la URL de la Api sin recompilar la imagen Docker, `index.html` carga `public/env-config.js` antes que el bundle de la aplicación. En desarrollo, ese archivo trae un valor por defecto. En Docker, un script (`docker-entrypoint.d/30-generar-env-config.sh`) lo sobreescribe al arrancar el contenedor, usando la variable de entorno `VITE_API_URL`. `src/config.ts` lee primero ese valor de runtime, y si no existe, cae al de Vite o al default.
