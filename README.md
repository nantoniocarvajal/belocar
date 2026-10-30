# Distribuidora Belocar

Sitio web y panel de administración de **Distribuidora Belocar**, liquidadora mayorista chilena de
vinos y otros productos vendidos por caja completa. El sitio muestra el catálogo, arma una
"cotización" con los productos y cantidades elegidas, la guarda para seguimiento interno y la envía
por WhatsApp para que Distribuidora Belocar confirme precio, transporte y forma de pago
(transferencia). No hay pagos en línea ni precios/stock visibles en el sitio público.

## Estado de este proyecto

Este es un monorepo nuevo, reconstruido desde cero (el intento anterior en `belocar-site/` queda
solo como referencia histórica, sin usarse). Primera etapa entregada: sitio público navegable +
backend real con base de datos + esqueleto de panel de administración.

## Estructura

```
belocar/
├── frontend/          React + TypeScript + Vite + Tailwind (sitio público + panel admin)
├── backend/            Spring Boot + MySQL + Flyway (API REST)
├── docker-compose.yml  Levanta MySQL + backend + frontend juntos
└── .env.example        Variables para docker-compose
```

## Requisitos

- Node.js 20+ y npm (para el frontend)
- Docker Desktop (recomendado, para levantar MySQL + backend sin instalar nada más)
- Alternativa sin Docker: Java 21+, Maven (o un IDE con Maven integrado) y un MySQL propio

## Cómo levantar todo (con Docker, recomendado)

Copia el archivo de variables de entorno de la raíz:
```
cp .env.example .env
```
Ajusta `JWT_SECRET` por un valor propio (cualquier texto largo y único sirve para desarrollo).

Hay dos formas de levantarlo, según lo que estés haciendo:

**Opción A — desarrollando activamente el frontend (recomendada mientras se programa):**
```
docker compose up -d mysql backend
```
Esto levanta MySQL + backend (API en `http://localhost:8080`). La primera vez que arranca, Flyway
crea el esquema, carga el catálogo real de productos (ver "Datos del catálogo" más abajo) y crea el
usuario administrador por defecto (ver "Panel de administración" más abajo). Después, el frontend
se corre aparte para tener recarga en caliente:
```
cd frontend
cp .env.example .env
npm install
npm run dev
```
El sitio queda en `http://localhost:5173`.

**Opción B — levantar todo de una vez, incluido el frontend (sin recarga en caliente, más parecido
a cómo correría en producción):**
```
docker compose up -d
```
Esto además construye el frontend (React compilado y servido por nginx) y lo deja también en
`http://localhost:5173`. Si cambias código del frontend con esta opción, hay que reconstruir la
imagen: `docker compose up -d --build frontend`.

## Cómo levantar el backend sin Docker

```
cd backend
cp .env.example .env   # o exporta las mismas variables en tu shell/IDE
```
Necesitas un MySQL propio corriendo (crea una base `belocar` con un usuario con permisos) y correr
la aplicación Spring Boot desde tu IDE (o con Maven si lo tienes instalado: `mvn spring-boot:run`).
Flyway aplica las migraciones automáticamente al iniciar.

## Panel de administración

- URL: `http://localhost:5173/admin/login`
- Usuario y contraseña por defecto: los valores de `ADMIN_DEFAULT_USERNAME` / `ADMIN_DEFAULT_PASSWORD`
  (por defecto `admin` / `changeme123`). Se crean **solo la primera vez** que arranca el backend, si
  la tabla de administradores está vacía.
- **Cambia esta contraseña apenas tengas acceso.** No uses las credenciales por defecto en un
  entorno accesible desde internet.
- El login está protegido contra fuerza bruta: tras 5 intentos fallidos desde la misma IP se
  bloquea por 15 minutos (aunque el siguiente intento use la contraseña correcta).
- Funcionalidad disponible: crear, editar, publicar/ocultar, destacar, reordenar y eliminar
  productos; subir imágenes (principal y adicionales); crear, editar y eliminar categorías
  (bloqueado si la categoría tiene productos asignados); editar la configuración del sitio
  (número de WhatsApp, datos de contacto, textos de despacho/retiro); y ver el listado y detalle de
  las cotizaciones que los clientes van enviando desde el sitio.

## Variables de entorno

Cada carpeta tiene su propio `.env.example`:

- **Raíz** (`/.env.example`): variables para `docker-compose.yml` (credenciales de MySQL, secreto
  JWT, número de WhatsApp inicial, credenciales del admin por defecto).
- **`backend/.env.example`**: las mismas variables, pensadas para correr el backend directo (sin
  Docker) desde tu IDE o con Maven.
- **`frontend/.env.example`**: `VITE_API_BASE_URL`, la URL del backend que consume el sitio.

El número de WhatsApp **no está escrito en el código**: se guarda en la base de datos
(`site_config`) y se administra desde el panel de administración (`/admin/configuracion`).

## Monitoreo

El backend expone `GET /actuator/health` (sin autenticación) para que un balanceador de carga o
un servicio de monitoreo pueda saber si sigue vivo. No expone más detalles (no hay información
sensible en la respuesta).

## Datos del catálogo

Las categorías (Tintos, Blancos, Rosados, Frutales) y los 22 productos que trae el proyecto son el
**inventario real** de Distribuidora Belocar (marca, nombre, varietal, formato y unidades por caja).
11 de los 22 productos (líneas Kolinas y Aves del Sur: Gran Reserva, Low Calories y Fruit Splash)
tienen foto real de botella y notas de cata oficiales, extraídas de presentaciones de marca en PDF
que aportó el usuario (`frontend/public/products/real/`). El resto sigue con placeholder ilustrado
por categoría y descripción genérica, pendiente de fotografía real. Los textos de despacho/retiro y
los datos de contacto siguen siendo provisorios y se editan desde el panel de administración.

## Tests

- **Backend** (JUnit 5 + Mockito + H2, sin depender de MySQL): tests unitarios de la lógica de
  negocio (`SlugGenerator`, `CategoryService`, `ProductService`, `QuoteService`, `LoginAttemptService`)
  y un test de integración de seguridad (login, límite de intentos, rutas públicas vs. protegidas,
  JWT, health check). Se corren con Maven:
  ```
  cd backend
  mvn test
  ```
  Si no tienes Maven instalado, puedes correrlos con Docker:
  ```
  docker run --rm -v "$(pwd)/backend:/app" -w /app maven:3.9.9-eclipse-temurin-21 mvn test
  ```
- **Frontend** (Vitest + Testing Library): tests del generador de mensajes de WhatsApp (la lógica
  más crítica del sitio, ya que es lo que recibe el cliente por WhatsApp) y del estado global del
  carrito de cotización.
  ```
  cd frontend
  npm run test
  ```

## Identidad visual

Colores y tipografía tomados del isotipo real de Distribuidora Belocar (ámbar/naranja + carbón
oscuro, tipografía Archivo + Inter) — definidos como tokens en `frontend/src/index.css`
(`brand-*`, `ink-*`, `sand-*`). El logo (`components/layout/Logo.tsx`) usa el isotipo y wordmark
**reales** de la marca (recortados con fondo transparente a partir del render 3D original en
`frontend/public/brand/`), no una recreación; el favicon (`frontend/public/favicon.png`) usa el
mismo ícono. Las fotos de producto son reales para 11 de los 22 productos (líneas Kolinas y Aves
del Sur); el resto sigue con placeholders ilustrados (SVG) hasta contar con fotografía real.

## Pendientes conocidos de esta primera etapa

- Ampliar cobertura de tests (controladores admin, componentes de UI, formularios).
- Reemplazar los placeholders ilustrados de producto por fotografía real cuando esté disponible.
- Confirmar zonas de despacho, reglas de despacho gratuito y dirección de retiro definitivas.
- Conectar almacenamiento de imágenes a un proveedor externo (Cloudinary/S3) cuando se necesite en
  producción; por ahora las imágenes de admin se guardan en disco local (`backend/uploads`).
- Rotar `JWT_SECRET` y la contraseña de admin por defecto antes de exponer el sitio en internet.

## Stack técnico

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router.
- **Backend**: Spring Boot 3, Spring Security (JWT), Spring Data JPA, MySQL, Flyway.
- **Infraestructura**: Docker + Docker Compose para desarrollo local.
