import { next, rewrite } from "@vercel/functions";

export const config = {
  matcher: ["/", "/ch"],
};

const REGION_COOKIE = "aodit-region";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

type RegionTarget = "ch" | "global";

function parseCookie(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(";").reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (key) acc[key] = rest.join("=");
    return acc;
  }, {});
}

const SWISS_ALIASES = new Set(["ch", "swiss", "switzerland"]);
const GLOBAL_ALIASES = new Set(["global", "intl", "international"]);

function normalizeRegionParam(value: string | null): RegionTarget | undefined {
  if (!value) return undefined;
  const v = value.trim().toLowerCase();
  if (SWISS_ALIASES.has(v)) return "ch";
  if (GLOBAL_ALIASES.has(v)) return "global";
  return undefined;
}

function resolveTarget(
  country: string,
  cookieRegion: string | undefined,
  explicit: string | null,
): RegionTarget {
  const fromQuery = normalizeRegionParam(explicit);
  if (fromQuery) return fromQuery;
  const fromCookie = normalizeRegionParam(cookieRegion ?? null);
  if (fromCookie) return fromCookie;
  return country === "CH" ? "ch" : "global";
}

export default function middleware(req: Request) {
  const url = new URL(req.url);
  const country = req.headers.get("x-vercel-ip-country") ?? "";
  const cookies = parseCookie(req.headers.get("cookie") ?? "");
  const explicit = url.searchParams.get("region");
  const target = resolveTarget(country, cookies[REGION_COOKIE], explicit);

  const headers = new Headers();
  const secure =
    url.protocol === "https:" ? "; Secure" : "";
  headers.append(
    "set-cookie",
    `${REGION_COOKIE}=${target}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`,
  );

  if (url.pathname === "/" && target === "ch") {
    return rewrite(new URL("/ch", url), { headers });
  }

  if (url.pathname === "/ch" && target === "global") {
    return rewrite(new URL("/", url), { headers });
  }

  return next({ headers });
}
