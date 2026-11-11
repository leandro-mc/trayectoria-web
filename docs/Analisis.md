# Análisis técnico — TrayectorIA Web

Documento de apoyo para futuras mejoras. No forma parte de la documentación principal.

## Qué es y cómo está construido

App Next.js 16 (App Router) + React 19 + TypeScript de ~11.400 líneas (sin contar los componentes de shadcn/ui), con 20 páginas agrupadas por rol mediante route groups: `(public)`, `(candidate)`, `(company)`.

## Arquitectura

Organización **por funcionalidad (feature-based)**, la parte más sólida del proyecto: cada módulo en `features/` repite la misma estructura (`api/`, `components/`, `hooks/`, `schemas/`, `types/`). La regla de flujo está clara y se respeta: componente → hook (TanStack Query) → función de API → cliente Axios. Estado del servidor en TanStack Query y estado global mínimo en Zustand.

## Oportunidades principales

1. **Sin pruebas.** No hay tests unitarios, de componentes ni E2E. Prioridad: schemas Zod, hooks de autenticación y un flujo E2E (login → postular) con Playwright.
2. **Uso de Server Components.** 73 archivos usan `'use client'`; la mayoría de las páginas se renderizan en el cliente. Aprovechar RSC para el catálogo público de ofertas mejoraría SEO y tiempo de carga.
3. **Contrato con el backend.** Los tipos de API (`api.types.ts`) están escritos a mano. Generarlos desde el OpenAPI del backend (ya expone Swagger) evita desajustes.
4. **Código residual en la raíz.** `src/app/page.tsx` redirige a `/jobs`, pero conserva debajo el componente de vista previa del sistema de diseño (código inalcanzable), y el README original aún indicaba que la raíz mostraba esa vista previa. Limpiar.

## Prácticas a revisar

- **Almacenamiento de tokens.** El access token va en `sessionStorage` y el refresh token en `localStorage`, ambos expuestos a XSS. Lo recomendable es cookies `HttpOnly` gestionadas por el backend.
- **Protección de rutas con cookie del cliente.** `proxy.ts` decide el acceso leyendo la cookie `trayectoria-auth`, que el propio navegador escribe y por tanto es manipulable. Sirve como mejora de UX, pero la seguridad real debe seguir en el backend (hoy lo está con roles en Spring Security).
- **Ruta atípica** `(public)/other/jobs`, que parece duplicar `/jobs`. Confirmar si es necesaria.
- Falta CI (lint + type-check + build en cada push) y accesibilidad por revisar (foco y etiquetas en diálogos y formularios).
