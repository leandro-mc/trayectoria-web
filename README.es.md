# TrayectorIA — Web

> Read in English: [README.md](README.md)

Frontend de **TrayectorIA**, una plataforma de networking laboral con IA. Los candidatos exploran el catálogo de ofertas, gestionan su perfil, generan CVs adaptados con IA y practican entrevistas simuladas; las empresas publican ofertas y revisan postulaciones. Backend: [trayectoria-backend](https://github.com/leandro-mc/trayectoria-backend).

## Funciones

- **Catálogo público de ofertas** con búsqueda, y registro de candidatos y empresas
- **Área del candidato:** dashboard, perfil, postulaciones y ofertas guardadas
- **Herramientas de IA:** generación de CV y entrevistas simuladas
- **Área de empresa:** dashboard, perfil, crear/editar ofertas y revisar postulaciones
- Protección de rutas por rol, tema claro/oscuro

## Tecnologías

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 y shadcn/ui (Radix)
- TanStack Query para estado del servidor, Zustand para estado del cliente
- React Hook Form + Zod para formularios y validación
- Axios con interceptores, Framer Motion

## Cómo ejecutarlo

Requisitos: Node.js 20+ y el [backend](https://github.com/leandro-mc/trayectoria-backend) corriendo.

```bash
git clone https://github.com/leandro-mc/trayectoria-web.git
cd trayectoria-web
cp .env.example .env     # NEXT_PUBLIC_API_URL=http://localhost:8080/api
npm install
npm run dev              # http://localhost:3000
```

Otros scripts: `npm run build`, `npm run lint`, `npm run type-check`.

## Estructura

```
src/
├── app/         # Rutas por rol: (public), (candidate), (company), ai, jobs
├── features/    # Módulos de dominio: auth, candidate, company, jobs, applications, ai...
│                #   cada uno con api/, components/, hooks/, schemas/, types/
├── components/  # shadcn/ui y componentes compartidos
├── lib/         # Cliente Axios, almacenamiento de tokens, utilidades
└── stores/      # Zustand (auth, ui)
```

Flujo de datos: componente → hook personalizado (TanStack Query) → función de API → cliente Axios → backend.
