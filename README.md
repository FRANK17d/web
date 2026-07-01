# TOKE+ Web

Aplicacion web de TOKE+ construida con Next.js 16. Incluye landing publica, paginas institucionales y panel administrativo privado para operar usuarios, pedidos, verificaciones, servicios, pagos, soporte, auditorias y configuracion del marketplace.

## Estado Del Proyecto

- Framework: Next.js `16.2.7` con App Router.
- React: `19.2.4`.
- Estilos: Tailwind CSS `3.4.17`.
- Backend de datos: InsForge `https://439t8drp.us-east.insforge.app`.
- Produccion: `https://tokeplus.app` y `https://tokeweb.vercel.app`.
- Estado actual verificado: `npm run lint` OK y `npm run build` OK.

## Stack

- Next.js App Router.
- React Server Components y server actions.
- TypeScript.
- Tailwind CSS 3.4.
- InsForge SDK para Auth y Database.
- Lucide React para iconografia.
- Sonner para feedback.
- Zod y React Hook Form para formularios.
- Recharts para reportes.

## Superficies Del Producto

### Web Publica

- Landing comercial.
- Paginas `Nosotros`, `Servicios`, `Ayuda`, `Privacidad` y `Terminos`.
- SEO, metadata, sitemap y robots.
- Textos, branding y enlaces configurables desde `app_settings`.

### Panel Administrativo

Ruta base: `/gestion-x7k2m9`.

Secciones actuales:

- Dashboard con KPIs operativos.
- Usuarios y detalle de usuario.
- Verificaciones de tecnicos.
- Reservas/pedidos y detalle.
- Disputas/moderacion.
- Mensajes y conversaciones.
- Resenas.
- Servicios y categorias con paginacion.
- Creditos y paquetes.
- TokePro y planes.
- Suscriptores.
- Transacciones.
- Distritos.
- Configuracion del sitio.
- Auditorias administrativas.

## Estructura Relevante

```text
app/
  (marketing)/             Landing y paginas publicas
  gestion-x7k2m9/          Auth admin y panel privado
components/
  admin/                   Layout, sidebar y componentes del panel
  ui/                      DataTable, Pagination y UI compartida
lib/
  admin-auth/              Sesion y proteccion admin
  admin-data/              Queries y server actions
  insforge/                Cliente InsForge
```

## Configuracion Local

1. Instalar dependencias:

```bash
npm install
```

2. Crear `.env.local` con variables equivalentes a produccion. No commitear secretos.

Variables tipicas:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
INSFORGE_URL=https://439t8drp.us-east.insforge.app
INSFORGE_ANON_KEY=<anon-key>
INSFORGE_API_KEY=<admin-api-key>
ADMIN_ROUTE_SECRET=gestion-x7k2m9
```

3. Ejecutar desarrollo:

```bash
npm run dev
```

## Comandos De Calidad

```bash
npm run lint
npm run build
```

## Seguridad

- El panel usa cookies de sesion admin y validacion de rol.
- Las server actions llaman InsForge desde servidor.
- Las acciones sensibles registran eventos en `admin_audit_log`.
- No exponer `INSFORGE_API_KEY` ni credenciales admin al cliente.
- Mantener Tailwind en version 3.4.x.

## Datos Y Operacion

- `lib/admin-data/queries.ts`: lecturas paginadas, dashboard, usuarios, servicios, reservas, transacciones y auditorias.
- `lib/admin-data/actions.ts`: aprobaciones, rechazos, toggles, configuracion, paquetes, planes y auditoria.
- `components/ui/data-table.tsx`: tabla reusable con vista responsive para mobile.
- `components/ui/pagination.tsx`: paginacion reusable.

## Pruebas Verificadas

- `npm run lint`: sin errores.
- `npm run build`: compilacion y rutas Next OK.
- Produccion responde `200` en `https://tokeplus.app/`.
- Produccion responde `200` en `https://tokeweb.vercel.app/`.

## Despliegue

El despliegue se realiza en Vercel. Los aliases activos son:

- `https://tokeplus.app`
- `https://www.tokeplus.app`
- `https://tokeweb.vercel.app`

Antes de desplegar, ejecutar `npm run lint` y `npm run build`.

## Documentacion Publica

La documentacion integral del proyecto se publica junto con la web:

- PDF: `/docs/toke-plus-documentacion.pdf`
- HTML: `/docs/toke-plus-documentacion.html`
