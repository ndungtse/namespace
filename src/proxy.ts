import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RESERVED_SUBDOMAINS = ["www", "api", "admin", "app", "mail", "ftp"];

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const rootDomain = process.env.ROOT_DOMAIN || "localhost";
  
  if (!host.includes(rootDomain)) {
    return NextResponse.next();
  }

  const parts = host.split(".");
  let subdomain = "";

  if (rootDomain === "localhost") {
    const localhostParts = host.split(":");
    const hostname = localhostParts[0];
    const hostParts = hostname.split(".");
    
    if (hostParts.length > 1 && hostParts[0] !== "localhost") {
      subdomain = hostParts[0];
    }
  } else {
    const domainParts = rootDomain.split(".");
    const hostParts = host.split(".");
    
    if (hostParts.length > domainParts.length) {
      subdomain = hostParts[0];
    }
  }

  if (!subdomain || RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/profile/${subdomain}`;
  
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

