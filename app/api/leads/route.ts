import { NextRequest, NextResponse } from "next/server";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/JMaJ9JEyXCFHosYt2ap7Ju";

const SHEETS_WEBHOOK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

interface LeadBody {
  id?: string;
  name?: string;
  phone?: string;
  partial?: boolean;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
}

async function sendToSheet(body: LeadBody) {
  if (!SHEETS_WEBHOOK_URL) {
    console.warn(
      "GOOGLE_SHEETS_WEBHOOK_URL is not set — skipping spreadsheet sync.",
    );
    return;
  }

  try {
    await fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: body.id,
        name: body.name?.trim() || "",
        email: "",
        phone: body.phone?.trim() || "",
        utm_source: body.utm_source || "",
        utm_campaign: body.utm_campaign || "",
        utm_medium: body.utm_medium || "",
        utm_content: body.utm_content || "",
        utm_term: body.utm_term || "",
        fbclid: body.fbclid || "",
      }),
    });
  } catch (err) {
    console.error("Failed to sync lead to spreadsheet:", err);
  }
}

export async function POST(req: NextRequest) {
  const body: LeadBody = await req.json();
  const { id, name, phone, partial } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (partial) {
    if (!name?.trim() && !phone?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    await sendToSheet(body);
    return NextResponse.json({ ok: true });
  }

  if (!name?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  await sendToSheet(body);

  return NextResponse.json({ redirectUrl: WHATSAPP_GROUP_URL });
}
