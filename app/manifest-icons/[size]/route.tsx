import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";

const VALID_SIZES = new Set(["192", "512"]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size: sizeParam } = await params;

  if (!VALID_SIZES.has(sizeParam)) {
    return NextResponse.json({ error: "Tamaño no soportado" }, { status: 404 });
  }

  const size = Number(sizeParam);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
        }}
      >
        <svg
          width={size * 0.72}
          height={size * 0.72}
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle cx="50" cy="50" r="46" stroke="#1e293b" strokeWidth="4" />
          <path
            d="M4 58 L26 58 L34 40 L42 74 L50 30 L58 66 L64 50 L96 50"
            stroke="#f97316"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
