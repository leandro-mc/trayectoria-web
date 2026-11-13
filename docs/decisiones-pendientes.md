# Decisiones pendientes — TrayectorIA Web

> Documento de trabajo. Resume el análisis por capas y deja **cada decisión abierta** para tomarla en una etapa posterior. Nada de lo que aparece como "pendiente" se ha aplicado.

## Estado de esta etapa

| Tema | Resultado |
|------|-----------|
| Rama de control | `develop` (ya existía; se sincronizó con `main`). La rama por defecto sigue siendo `main`. |
| Credenciales en código e historial | Revisados el árbol y los 48 commits de todas las ramas con gitleaks y un barrido propio. **No hay credenciales.** Hay un dato de red local en `next.config.ts` (`allowedDevOrigins` con una IP privada, ver D-05) y un problema de diseño en el manejo de sesión (ver D-04). |
| Ramas existentes | `develop`, doce ramas `feat/*` y `fix/*` ya fusionadas, y `main` (ver D-10). |

## Resumen por capas

| Capa | Estado actual | Observación principal |
|------|---------------|-----------------------|
| Base de datos | No aplica; los datos viven en el [backend](https://github.com/leandro-mc/trayectoria-backend). | — |
| Datos del cliente | Axios, TanStack Query, hooks por funcionalidad, esquemas Zod | Los tipos de la API están escritos a mano en cada `features/*/types`. |
| Interfaz | Next.js 16 (App Router), React 19, TypeScript estricto, Tailwind y shadcn/ui | 73 de 90 archivos `.tsx` son componentes de cliente; el catálogo público se renderiza casi todo en el navegador. |
| Compilación y despliegue | `dev`, `build`, `start`, `lint` y `type-check` | Sin pruebas, sin Dockerfile, sin integración continua. |

## Decisiones

### D-01 · Pruebas
- **Contexto:** no hay ninguna prueba.
- **Opciones:** (A) Vitest y Testing Library para los esquemas Zod, el almacén de sesión y los hooks de autenticación; (B) añadir un flujo de extremo a extremo con Playwright (registro, inicio de sesión, postulación) contra el backend levantado; (C) ambas.
- **Recomendación:** A primero; B cuando exista el arranque conjunto (D-07).
- **Esfuerzo:** medio. **Decisión:** ☐ pendiente

### D-02 · Estrategia de renderizado
- **Contexto:** el catálogo de ofertas es público y se beneficiaría de SEO y carga inicial más rápida, pero casi todo es componente de cliente.
- **Opciones:** (A) renderizar en el servidor las páginas públicas (`/jobs` y detalle) y dejar en cliente solo las partes interactivas; (B) dejarlo como está.
- **Recomendación:** A para las rutas públicas; el resto no necesita cambiar.
- **Esfuerzo:** medio. **Decisión:** ☐ pendiente

### D-03 · Contrato con el backend
- **Contexto:** los tipos de la API están escritos a mano y pueden desajustarse. El backend ya publica su especificación OpenAPI.
- **Opciones:** (A) generar los tipos desde la especificación (por ejemplo con `openapi-typescript`) en un paso del build; (B) mantenerlos a mano.
- **Recomendación:** A, una vez que el backend decida si exporta la especificación al repositorio.
- **Esfuerzo:** medio. **Decisión:** ☐ pendiente

### D-04 · Sesión y almacenamiento de tokens
- **Contexto:** el access token vive en `sessionStorage`. El refresh token se guarda en `localStorage` (persistencia de Zustand) y además se escribe, junto con el usuario, en la cookie `trayectoria-auth`, creada desde JavaScript (sin `HttpOnly` ni `Secure`, 7 días). El archivo `proxy.ts` usa esa cookie para proteger rutas, pero cualquiera puede escribirla, así que solo sirve como mejora de experiencia: la seguridad real la aplica el backend.
- **Opciones:** (A) cookies `HttpOnly` y `Secure` emitidas por el backend o por rutas de Next.js, sin guardar el refresh token en `localStorage` ni en una cookie legible; (B) mantener el esquema y reducir la exposición (cookie solo con un indicador de sesión, sin el token); (C) dejarlo y documentarlo.
- **Recomendación:** A como objetivo; B como paso intermedio barato y que ya elimina el token de la cookie.
- **Esfuerzo:** B bajo, A medio-alto (requiere cambios en backend). **Decisión:** ☐ pendiente

### D-05 · Higiene y código residual
- **Contexto:** `src/app/page.tsx` redirige a `/jobs` pero conserva debajo el código de una vista previa del sistema de diseño (inalcanzable); existe una ruta `(public)/other/jobs` que parece duplicar `/jobs`; `next.config.ts` tiene en `allowedDevOrigins` una dirección IP privada de la red local del desarrollador; la configuración permite imágenes de `res.cloudinary.com` aunque el backend no usa Cloudinary todavía.
- **Opciones:** (A) limpiar todo (código muerto, ruta duplicada, IP local, dominio de imágenes si no se usa); (B) limpiar solo lo visible.
- **Recomendación:** A, en una rama junto con D-01.
- **Esfuerzo:** bajo. **Decisión:** ☐ pendiente

### D-06 · Contenedor de la interfaz
- **Contexto:** `NEXT_PUBLIC_API_URL` se incrusta al compilar. Next.js se despliega de forma natural en Vercel, sin Docker.
- **Opciones:** (A) Dockerfile multi-etapa con salida `standalone` solo para el arranque local conjunto; (B) no contenerizar y documentar el despliegue en Vercel; (C) ambas.
- **Recomendación:** A si se decide D-07 en la opción B; si no, B.
- **Esfuerzo:** bajo. **Decisión:** ☐ pendiente

### D-07 · Arranque conjunto con el backend (unificar o no)
Esta decisión **no es obligatoria** y es la misma que aparece como D-09 en el repositorio `trayectoria-backend`; se decide una vez para ambos.
- **Opciones:** (A) monorepo con historial de ambos; (B) repos separados con un compose de desarrollo en el backend que construye este frontend desde su URL de Git; (C) cada repo con su propio arranque.
- **Recomendación:** B para el arranque local y mantener los repos separados por los despliegues independientes (Railway para el backend, otra plataforma para el frontend). Ver el criterio completo en el documento del backend.
- **Esfuerzo:** bajo (B). **Decisión:** ☐ pendiente

### D-08 · Integración continua
- **Opciones:** flujo de GitHub Actions con `lint`, `type-check` y `build` en cada `push` y `pull request`, y las pruebas de D-01 cuando existan.
- **Recomendación:** hacerlo en la rama de contenedores y CI.
- **Esfuerzo:** bajo. **Decisión:** ☐ pendiente

### D-09 · Accesibilidad y rendimiento
- **Opciones:** (A) pasada de accesibilidad (etiquetas, foco en diálogos, contraste en tema oscuro, navegación por teclado) y medición con Lighthouse; (B) solo las páginas públicas.
- **Recomendación:** A, después de D-02.
- **Esfuerzo:** medio. **Decisión:** ☐ pendiente

### D-10 · Ramas
- **Contexto:** `feat/ai`, `feat/auth`, `feat/candidate`, `feat/company`, `feat/company-applications`, `feat/job-detail`, `feat/layouts`, `feat/project-setup`, `feat/public-jobs`, `fix/auth-bootstrap`, `fix/curricula-generate` y `fix/polish` no contienen commits que `main` no tenga.
- **Recomendación:** borrarlas y conservar `main` y `develop`.
- **Esfuerzo:** bajo. **Decisión:** ☐ pendiente

### D-11 · Funcionalidades de la fase 2
- **Contexto:** `.env.example` deja comentadas `NEXT_PUBLIC_WS_URL` y `NEXT_PUBLIC_ENABLE_VOICE` (entrevista por voz), que en el backend solo existe como marcador.
- **Opciones:** dejarlas documentadas como hoja de ruta o quitarlas hasta que exista la funcionalidad.
- **Recomendación:** decidir junto con la decisión equivalente del backend (D-06).
- **Esfuerzo:** bajo. **Decisión:** ☐ pendiente

## Ramas de trabajo propuestas

1. `refactor/session-and-cleanup`: D-04, D-05, D-11.
2. `feat/quality-and-rendering`: D-01, D-02, D-03, D-09.
3. `feat/containers-and-ci`: D-06, D-07, D-08, D-10.

## Orden sugerido

D-05 → D-04 → D-01 → D-08 → D-03 → D-02 → D-09 → D-06 → D-10 → D-07 → D-11.
