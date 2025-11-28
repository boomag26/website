// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LANGS = ["pt", "en", "es", "ch", "th"] as const;
const DEFAULT_LANG = "en";

type SupportedLang = (typeof SUPPORTED_LANGS)[number];

function mapBrowserLangToAppLang(browserLang: string): SupportedLang {
  const base = browserLang.slice(0, 2).toLowerCase();

  // Mapeia idiomas do navegador -> seus códigos
  if (base === "pt") return "pt";
  if (base === "en") return "en";
  if (base === "es") return "es";
  if (base === "zh") return "ch"; // zh-CN, zh-TW -> "ch" no seu sistema
  if (base === "th") return "th";

  return DEFAULT_LANG;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Se já tiver /pt, /en, etc no começo, não faz nada
  const firstSegment = pathname.split("/")[1];
  if (SUPPORTED_LANGS.includes(firstSegment as SupportedLang)) {
    return NextResponse.next();
  }

  // Só redireciona para a home / → /{lang}
  if (pathname === "/" || pathname === "") {
    const acceptLanguage =
      request.headers.get("accept-language") || "en";

    // Pega o primeiro idioma da lista: ex: "pt-BR,pt;q=0.9,en-US;q=0.8"
    const rawLang = acceptLanguage.split(",")[0]; // "pt-BR"
    const appLang = mapBrowserLangToAppLang(rawLang);

    const url = request.nextUrl.clone();
    url.pathname = `/${appLang}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Evita rodar em assets estáticos
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
