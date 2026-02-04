import { NextResponse } from "next/server";

const handler = async (request, { params }) => {
  const { slug } = params;
  const { method } = request;

  const targetUrl = `https://api.englishpoint.com.tr/api/${slug.join("/")}`;

  // Sadece ihtiyacımız olan header'ları geçirelim
  const headers = new Headers();
  const auth = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");

  if (auth) headers.set("Authorization", auth);
  if (contentType) headers.set("Content-Type", contentType);

  let body = null;
  if (!["GET", "HEAD"].includes(method)) {
    try {
      body = await request.text();
    } catch (e) {
      console.error("Body okuma hatası:", e);
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    // Response boş mu kontrol et
    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: "Backend'den geçersiz JSON döndü", raw: text };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Bağlantı Hatası (Laravel'e ulaşılamadı)",
        error: error.message,
      },
      { status: 502 },
    );
  }
};

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
};
