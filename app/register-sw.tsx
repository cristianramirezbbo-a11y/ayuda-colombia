"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // El registro puede fallar (ej. dev sin HTTPS); la app sigue
      // funcionando en línea sin caché offline.
    });
  }, []);

  return null;
}
