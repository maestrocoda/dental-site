import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Appointment = { name?: string; phone?: string; consent?: boolean };

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().replace(/[<>]/g, "").slice(0, max) : "";

export async function POST(request: Request) {
  let body: Appointment;
  try {
    body = (await request.json()) as Appointment;
  } catch {
    return NextResponse.json({ message: "Некорректные данные формы." }, { status: 400 });
  }

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 40);
  if (!name || !phone || !body.consent) {
    return NextResponse.json({ message: "Заполните имя, телефон и подтвердите согласие." }, { status: 400 });
  }

  const createdAt = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Novosibirsk" }).format(new Date());
  const message = `Новая заявка с сайта «Архитектура улыбки»\n\nИмя: ${name}\nТелефон: ${phone}\nВремя: ${createdAt}`;
  const deliveries: Promise<Response>[] = [];

  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    deliveries.push(fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: message }),
    }));
  }

  if (process.env.RESEND_API_KEY && process.env.APPOINTMENT_EMAIL && process.env.RESEND_FROM_EMAIL) {
    deliveries.push(fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [process.env.APPOINTMENT_EMAIL], subject: "Новая заявка с сайта", text: message }),
    }));
  }

  if (!deliveries.length) {
    return NextResponse.json({ message: "Форма ещё не подключена. Позвоните нам, пожалуйста." }, { status: 503 });
  }

  const results = await Promise.allSettled(deliveries);
  const delivered = results.some((result) => result.status === "fulfilled" && result.value.ok);
  if (!delivered) {
    return NextResponse.json({ message: "Сервис временно недоступен. Позвоните нам, пожалуйста." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
