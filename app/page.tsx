"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight, Menu, Play, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const slides = [
  { image: "/interiors/reception.jpg", label: "Естественная эстетика", alt: "Зона ожидания клиники" },
  { image: "/interiors/office.jpg", label: "Тёплая атмосфера", alt: "Кабинет клиники" },
  { image: "/interiors/dental-room.jpg", label: "Точная работа", alt: "Стоматологический кабинет" },
];

const services = ["Ортопедия", "Хирургия и имплантация", "Терапия", "Профессиональная гигиена", "Ортодонтия", "Детская стоматология", "Рентген-диагностика", "Зуботехническая лаборатория"];

export default function Home() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 5200); return () => window.clearInterval(timer); }, []);
  const slide = slides[active];
  return <main className="min-h-screen overflow-hidden bg-[#0b0c0c] text-[#f8f5f0]">
    <section className="hero-shell">
      <nav className="mx-auto flex h-24 max-w-[1400px] items-center justify-between border-b border-white/15 px-6 lg:px-10" aria-label="Главное меню">
        <a href="#top" className="flex items-center gap-3 text-[13px] font-extrabold tracking-[.16em]"><span className="grid h-11 w-11 place-items-center rounded-full border border-[#d9b49c] text-[#d9b49c]">◇</span><span>АРХИТЕКТУРА<br/>УЛЫБКИ</span></a>
        <div className="hidden items-center gap-2 md:flex">{["Услуги", "О клинике", "Врачи", "Контакты"].map((item, index) => <a key={item} href={["#services", "#clinic", "#doctors", "#contacts"][index]} className="rounded-full px-5 py-3 text-[15px] text-white/80 transition hover:bg-white/10 hover:text-white">{item}</a>)}</div>
        <div className="hidden md:block"><Button asChild variant="light" size="nav"><a href="tel:+79232323230">Позвонить <ArrowRight className="ml-5 h-4 w-4"/></a></Button></div>
        <button className="grid h-11 w-11 place-items-center rounded-full border border-white/20 md:hidden" onClick={() => setMenuOpen(true)} aria-label="Открыть меню"><Menu className="h-5 w-5"/></button>
      </nav>
      <AnimatePresence>{menuOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#0b0c0c] p-6 md:hidden"><div className="flex justify-end"><button onClick={() => setMenuOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-white/20"><X/></button></div><div className="mt-20 grid gap-5 text-4xl font-medium">{["Услуги", "О клинике", "Врачи", "Контакты"].map((item, index) => <a key={item} onClick={() => setMenuOpen(false)} href={["#services", "#clinic", "#doctors", "#contacts"][index]}>{item}</a>)}</div></motion.div>}</AnimatePresence>

      <div id="top" className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="flex flex-col justify-center">
          <p className="mb-6 text-xs font-extrabold tracking-[.16em] text-[#d9b49c]">ДОМ ФУНКЦИОНАЛЬНОЙ СТОМАТОЛОГИИ</p>
          <h1 className="max-w-[760px] font-serif text-[clamp(3.8rem,7vw,7.1rem)] leading-[.88] tracking-[-.07em]">Здоровая улыбка,<br/><em className="font-normal text-[#d9b49c]">в которой</em><br/>вы уверены</h1>
          <p className="mt-8 max-w-xl text-[17px] leading-7 text-white/72">Объединяем диагностику, лечение и восстановление улыбки в одной команде, чтобы каждый этап был понятным, бережным и комфортным.</p>
          <div className="mt-9 flex flex-wrap items-center gap-6"><Button asChild className="gold-shine relative overflow-hidden"><a href="tel:+79232323230">Записаться на консультацию <ArrowRight className="ml-6 h-5 w-5"/></a></Button><a href="#clinic" className="group flex items-center gap-3 text-[15px] font-medium"><span className="grid h-11 w-11 place-items-center rounded-full border border-white/30 transition group-hover:border-[#d9b49c] group-hover:text-[#d9b49c]"><Play className="h-4 w-4 fill-current"/></span>Узнать о клинике</a></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .12, duration: .75 }} className="relative min-h-[420px] overflow-hidden rounded-[4px] shadow-2xl shadow-black/50 lg:min-h-[590px]">
          <AnimatePresence mode="wait"><motion.img key={slide.image} src={slide.image} alt={slide.alt} initial={{ opacity: 0, scale: 1.07 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .98 }} transition={{ duration: 1.05, ease: "easeInOut" }} className="absolute inset-0 h-full w-full object-cover"/></AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/60 to-transparent"/><p className="absolute bottom-7 right-7 max-w-[180px] border-l border-white/80 pl-4 font-serif text-3xl leading-none">{slide.label}</p>
          <div className="absolute bottom-7 left-7 flex gap-2">{slides.map((item, index) => <button key={item.image} onClick={() => setActive(index)} aria-label={`Показать слайд ${index + 1}`} className={`h-1.5 rounded-full transition-all ${active === index ? "w-10 bg-[#e3bb9d]" : "w-4 bg-white/50"}`}/>)}</div>
        </motion.div>
      </div>
    </section>

    <section className="mx-auto -mt-3 grid max-w-[1400px] overflow-hidden rounded-2xl border border-white/15 bg-[#1a1c1c] md:grid-cols-3"><Feature title="Точная диагностика" text="Понятный план лечения до начала процедур"/><Feature title="Комплексный подход" text="Все этапы лечения - в одной клинике"/><Feature title="Безопасность лечения" text="Стерилизация и контроль качества"/></section>
    <section id="services" className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10"><p className="text-xs font-bold tracking-[.15em] text-[#d9b49c]">НАПРАВЛЕНИЯ</p><div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><h2 className="max-w-3xl font-serif text-5xl tracking-[-.06em] md:text-7xl">Стоматология<br/><em className="font-normal text-[#d9b49c]">в полном объёме</em></h2><p className="max-w-sm text-white/60">Все ключевые направления современной стоматологии - в едином пространстве.</p></div><div className="mt-14 grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">{services.map((service, index) => <div key={service} className="group min-h-44 border-b border-r border-white/15 p-6 transition hover:bg-white/[.045]"><span className="text-xs text-[#d9b49c]">0{index + 1}</span><h3 className="mt-12 font-serif text-2xl">{service}</h3><ChevronRight className="mt-4 h-5 w-5 text-white/40 transition group-hover:translate-x-1 group-hover:text-[#d9b49c]"/></div>)}</div></section>
    <section id="clinic" className="bg-[#151716] py-28"><div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-2 lg:px-10"><img className="min-h-[390px] h-full w-full object-cover" src="/interiors/office.jpg" alt="Интерьер клиники"/><div className="flex flex-col justify-center"><p className="text-xs font-bold tracking-[.15em] text-[#d9b49c]">О КЛИНИКЕ</p><h2 className="mt-5 font-serif text-5xl tracking-[-.06em] md:text-7xl">Комфорт,<br/><em className="font-normal text-[#d9b49c]">созданный для вас</em></h2><p className="mt-8 max-w-xl text-[17px] leading-8 text-white/65">Функциональная стоматология объединяет хирургию, ортопедию, терапию, ортодонтию, гигиену, детскую стоматологию и диагностику.</p></div></div></section>
    <section id="doctors" className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10"><p className="text-xs font-bold tracking-[.15em] text-[#d9b49c]">КОМАНДА</p><h2 className="mt-5 font-serif text-5xl tracking-[-.06em] md:text-7xl">Врачи, которым<br/><em className="font-normal text-[#d9b49c]">можно доверять</em></h2><div className="mt-12 grid gap-4 md:grid-cols-2"><Doctor initials="АВ" specialty="Врач-стоматолог ортопед" name="Шишкин Алексей Викторович"/><Doctor initials="СА" specialty="Врач-стоматолог хирург" name="Ракутов Сергей Андреевич"/></div></section>
    <section id="contacts" className="mx-auto mb-16 max-w-[1400px] px-6 lg:px-10"><div className="grid gap-10 rounded-3xl bg-gradient-to-br from-[#3b2920] to-[#171616] p-8 md:grid-cols-[1.1fr_.9fr] md:p-16"><div><p className="text-xs font-bold tracking-[.15em] text-[#e6c3a7]">СДЕЛАЙТЕ ПЕРВЫЙ ШАГ</p><h2 className="mt-5 font-serif text-5xl tracking-[-.06em] md:text-7xl">Запишитесь<br/>на консультацию</h2><Button asChild className="gold-shine relative mt-9 overflow-hidden"><a href="tel:+79232323230">+7 923 232-32-30 <ArrowRight className="ml-7 h-5 w-5"/></a></Button></div><div className="flex flex-col justify-end gap-7 text-white/70"><p><span className="block text-xs font-bold tracking-[.15em] text-[#e6c3a7]">АДРЕС</span>ЖК Прованс, ул. Железнодорожная, 18<br/>Новосибирск, 2 этаж</p><p><span className="block text-xs font-bold tracking-[.15em] text-[#e6c3a7]">РЕЖИМ РАБОТЫ</span>Ежедневно, 09:00 - 20:00</p></div></div></section>
  </main>;
}

function Feature({ title, text }: { title: string; text: string }) { return <div className="flex gap-5 border-b border-white/15 p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"><Sparkles className="mt-1 h-6 w-6 shrink-0 text-[#e3bb9d]"/><div><h3 className="text-lg font-semibold">{title}</h3><p className="mt-1 text-sm text-white/60">{text}</p></div></div>; }
function Doctor({ initials, specialty, name }: { initials: string; specialty: string; name: string }) { return <article className="overflow-hidden bg-[#171918]"><div className="grid aspect-[16/9] place-items-center bg-[radial-gradient(circle_at_50%_40%,#98725f_0%,#4c3830_31%,#1e1d1c_72%)] font-serif text-7xl tracking-[-.15em] text-[#f0d9c5]">{initials}</div><div className="p-7"><p className="text-xs font-bold uppercase tracking-[.13em] text-[#d9b49c]">{specialty}</p><h3 className="mt-3 font-serif text-3xl">{name}</h3></div></article>; }
