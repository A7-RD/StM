import { NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set(["cdn.sanity.io"]);

export async function GET(request) {
  const raw = request.nextUrl.searchParams.get("url");
  if (!raw?.trim()) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const upstream = await fetch(parsed.toString(), {
    next: { revalidate: 300 },
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Upstream failed" },
      { status: upstream.status === 404 ? 404 : 502 },
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  if (contentType.includes("text/html")) {
    return NextResponse.json({ error: "Unexpected response" }, { status: 502 });
  }

  const buf = await upstream.arrayBuffer();
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/pdf",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
