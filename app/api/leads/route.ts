import { NextRequest, NextResponse } from "next/server";

// TODO: replace with real WhatsApp group link
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/XXXXXXXXXXXXX";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, whatsapp } = body;

  if (!name || !whatsapp) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // TODO: persist lead (database, webhook, spreadsheet, etc.)
  console.log("New lead:", { name, whatsapp, createdAt: new Date().toISOString() });

  return NextResponse.json({ redirectUrl: WHATSAPP_GROUP_URL });
}
