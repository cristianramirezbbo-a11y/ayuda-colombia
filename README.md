# Sismos Colombia

PWA gratuita con información sísmica de Colombia (datos oficiales del SGC),
un mapa comunitario de ayuda (reportes + centros de acopio) y una guía de
qué hacer antes/durante/después de un sismo. Funciona sin conexión para el
contenido de seguridad (guía, emergencia).

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # y completa DATABASE_URL (ver abajo)
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Ver `.env.example` para la lista completa. Resumen:

| Variable | Requerida | Para qué |
|---|---|---|
| `DATABASE_URL` | Sí | Postgres — guarda los reportes y acopios. Sin ella, `/reportes` y `/acopios` no funcionan (el resto de la app sí). |
| `NVIDIA_API_KEY` | No | Moderación de contenido público y explicación de riesgo en lenguaje simple. Sin ella, esas dos cosas simplemente no se activan. |

## Desplegar en Vercel (gratis)

1. **Sube el repo a GitHub** (o GitLab/Bitbucket).
2. **Importa el proyecto en [vercel.com/new](https://vercel.com/new)** — Next.js se detecta automáticamente, no requiere configuración.
3. **Antes de la primera visita real, crea la base de datos:** en el dashboard del proyecto → **Storage** → **Create Database** → **Postgres** (Neon, capa gratis). Vercel agrega `DATABASE_URL` automáticamente a las variables de entorno del proyecto — usa la connection string **pooled** (host con `-pooler`), es la que sirve para serverless.
4. **(Opcional) Agrega `NVIDIA_API_KEY`** en Project Settings → Environment Variables, si quieres moderación de contenido y explicación de riesgo en lenguaje simple. Se obtiene gratis en [build.nvidia.com](https://build.nvidia.com).
5. **Redeploy** el proyecto para que tome las variables nuevas (Vercel > Deployments > ⋯ > Redeploy).

Todo el stack usado es gratuito en capas de uso normal para una app comunitaria: Vercel (hosting), Neon (Postgres), NVIDIA NIM (IA), OpenStreetMap (mapas), SGC (datos sísmicos).

### Por qué no usamos SQLite en producción

El desarrollo usa/usó SQLite localmente en algún punto, pero Vercel ejecuta
cada request en una función serverless efímera — un archivo local no
persiste entre invocaciones. Por eso los reportes y acopios viven en
Postgres (Neon), que sí es una base remota persistente y tiene capa gratis
suficiente para este uso.

## Estructura

- `app/` — rutas (App Router de Next.js 16).
- `lib/sgc.ts` — adaptador de datos del Servicio Geológico Colombiano.
- `lib/riesgo.ts` — índice de riesgo estimado (heurística propia, no oficial).
- `lib/ai.ts` — integración opcional con NVIDIA NIM (moderación + explicaciones).
- `lib/reportes.ts`, `lib/acopios.ts` — lógica del mapa comunitario (Postgres).
- `public/sw.js` — service worker para uso offline de guía/emergencia.

## Límites conocidos

- La moderación de contenido con IA es una capa extra, no una garantía: si
  la IA no responde, el contenido se publica igual (para no dejar la app
  inservible sin la API key). No hay panel de moderación humana todavía.
- El Mapa de ayuda y los Acopios no están verificados por ninguna
  autoridad — la app lo dice explícitamente en la interfaz.
- Esta app no reemplaza a los organismos oficiales (SGC, UNGRD, Cruz Roja,
  Fiscalía, línea 123).
