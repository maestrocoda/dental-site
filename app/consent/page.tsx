import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Согласие на обработку персональных данных", robots: { index: false, follow: true } };

export default function ConsentPage() {
  return <main className="min-h-screen bg-[#f5f0e9] text-[#181716]"><div className="mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-16">
    <Link href="/" className="text-sm font-semibold text-[#80604d] transition hover:text-black">← На главную</Link>
    <p className="mt-14 text-xs font-bold tracking-[.15em] text-[#80604d]">ЮРИДИЧЕСКАЯ ИНФОРМАЦИЯ</p>
    <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[.93] tracking-[-.06em] md:text-7xl">Согласие на обработку персональных данных</h1>
    <div className="mt-12 max-w-3xl space-y-5 text-[16px] leading-8 text-black/70">
      <p>Устанавливая отметку в форме записи, пользователь подтверждает, что добровольно предоставляет оператору сайта свои имя и номер телефона.</p>
      <p>Данные обрабатываются исключительно для связи по заявке и согласования консультации. Согласие действует до достижения этой цели либо до его отзыва пользователем.</p>
      <p>Согласие можно отозвать, направив обращение на email оператора. Точные сведения об операторе и контакты для отзыва должны быть внесены клиникой в <Link className="text-[#80604d] underline underline-offset-4" href="/privacy">Политику обработки персональных данных</Link> до запуска реальной формы.</p>
      <p className="rounded-2xl border border-[#80604d]/20 bg-white/50 p-6 text-sm leading-6">Важно: данное согласие не заменяет медицинские документы и информированные добровольные согласия, которые оформляются непосредственно в клинике.</p>
    </div>
  </div></main>;
}
