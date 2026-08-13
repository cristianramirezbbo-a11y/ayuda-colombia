/**
 * Integración opcional con la API gratuita de NVIDIA NIM (build.nvidia.com),
 * compatible con el formato de OpenAI. Todo lo que depende de esto debe
 * degradar con gracia si no hay NVIDIA_API_KEY configurada: la app tiene
 * que seguir funcionando sin IA, solo sin ese extra.
 *
 * Cómo obtener la key (gratis): crear cuenta en https://build.nvidia.com,
 * generar una API key, y ponerla como NVIDIA_API_KEY en .env.local / en las
 * variables de entorno de Vercel.
 */

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = process.env.NVIDIA_MODEL || "meta/llama-3.1-8b-instruct";
const TIMEOUT_MS = 8000;

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

async function chatCompletion(messages: ChatMessage[]): Promise<string | null> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.2,
        max_tokens: 250,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    const texto = data?.choices?.[0]?.message?.content;
    return typeof texto === "string" ? texto.trim() : null;
  } catch {
    return null;
  }
}

function extraerJson(texto: string): unknown {
  const match = texto.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : texto);
}

export interface ResultadoModeracion {
  permitido: boolean;
  razon?: string;
}

/**
 * Modera texto público (reportes, acopios) con IA. Si la IA no está
 * configurada o falla, permite el contenido (fail-open): esto no es un
 * filtro de seguridad crítico, es una capa extra — bloquear todo cuando la
 * IA no responde dejaría la app inservible para quien de verdad necesita
 * ayuda.
 */
export async function moderarTexto(texto: string): Promise<ResultadoModeracion> {
  const respuesta = await chatCompletion([
    {
      role: "system",
      content:
        "Eres un moderador de contenido para una app colombiana de ayuda en emergencias " +
        "(sismos). La gente publica reportes de ayuda necesaria, ayuda disponible, puntos de " +
        "acopio y personas desaparecidas. Bloquea SOLO: spam/publicidad, acoso o insultos, " +
        "contenido sexual, discurso de odio, o intentos claros de estafa. NO bloquees mensajes " +
        "solo porque estén mal escritos, sean informales, o suenen desesperados — eso es " +
        "normal en una emergencia real. Ante la duda, permite. Responde SOLO con JSON: " +
        '{"permitido": true|false, "razon": "breve explicación en español si es false"}',
    },
    { role: "user", content: `Texto a evaluar:\n"""${texto.slice(0, 1000)}"""` },
  ]);

  if (!respuesta) return { permitido: true };

  try {
    const parsed = extraerJson(respuesta) as { permitido?: boolean; razon?: string };
    if (typeof parsed.permitido !== "boolean") return { permitido: true };
    return { permitido: parsed.permitido, razon: parsed.razon };
  } catch {
    return { permitido: true };
  }
}

/**
 * Genera una explicación en lenguaje simple del riesgo de un sismo, a
 * partir del índice matemático ya calculado (la IA no calcula el número,
 * solo lo traduce a texto — así el score sigue siendo auditable). Devuelve
 * null si la IA no está disponible; la UI debe mostrar solo el índice
 * matemático en ese caso.
 */
export async function explicarRiesgo(datos: {
  mag: number;
  depth: number;
  place: string;
  scoreRiesgo: number;
  nivelRiesgo: string;
}): Promise<string | null> {
  return chatCompletion([
    {
      role: "system",
      content:
        "Eres un asistente que explica sismos en Colombia en lenguaje simple y honesto, " +
        "para gente sin formación técnica. Nunca digas que un sismo se puede predecir. " +
        "No inventes datos que no te dieron. Responde en máximo 2 frases cortas en español, " +
        "sin tecnicismos, explicando qué tan preocupante es este sismo y una recomendación " +
        "concreta y breve.",
    },
    {
      role: "user",
      content:
        `Sismo de magnitud ${datos.mag} en ${datos.place}, profundidad ${datos.depth} km. ` +
        `Índice de riesgo estimado: ${datos.scoreRiesgo}/100 (${datos.nivelRiesgo}).`,
    },
  ]);
}
