import { NextResponse } from "next/server";
import { sendDailyNotifications } from "@/lib/notificationService";
import "@/lib/cron";

export async function GET() {
  try {
    const result = await sendDailyNotifications();
    return NextResponse.json(result);
  } catch (_) {
    return NextResponse.json({ error: "Internal error sending emails" }, { status: 500 });
  }
}
