"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  ChevronRight,
  ClipboardCheck,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

const services = [
  [
    "Ортопедия",
    "Восстанавливаем утраченные или повреждённые зубы, возвращая комфорт при жевании и естественную эстетику улыбки.",
  ],
  [
    "Хирургия и имплантация",
    "Разбираем даже сложные ситуации последовательно: от диагностики и планирования до восстановления функции зубного ряда.",
  ],
  [
    "Терапия",
    "Лечим кариес и его осложнения бережно, с фокусом на сохранение собственного зуба.",
  ],
  [
    "Профессиональная гигиена",
    "Помогаем поддерживать здоровье полости рта и объясняем, какой домашний уход подходит именно вам.",
  ],
  [
    "Ортодонтия",
    "Планируем коррекцию прикуса так, чтобы результат был не только эстетичным, но и функциональным.",
  ],
  [
    "Детская стоматология",
    "Выстраиваем спокойное знакомство с врачом и формируем привычку заботиться о зубах без страха.",
  ],
  [
    "Рентген-диагностика",
    "Используем данные исследования, чтобы принимать обоснованные решения и видеть полную клиническую картину.",
  ],
  [
    "Зуботехническая лаборатория",
    "Точность изготовления конструкций помогает добиться удобства, надёжности и естественного вида результата.",
  ],
];

const serviceImages = [
  {
    image: "/interiors/dental-room.jpg",
    alt: "Кабинет для точного восстановления улыбки",
  },
  {
    image: "/interiors/dental-room.jpg",
    alt: "Современный хирургический кабинет",
  },
  {
    image: "/interiors/office.jpg",
    alt: "Светлый кабинет для бережного лечения",
  },
  {
    image: "/interiors/office.jpg",
    alt: "Чистое и спокойное пространство клиники",
  },
  {
    image: "/interiors/dental-room.jpg",
    alt: "Кабинет для комплексной ортодонтической помощи",
  },
  { image: "/interiors/reception.jpg", alt: "Мягкая атмосфера зоны ожидания" },
  {
    image: "/interiors/dental-room.jpg",
    alt: "Технологичное пространство для диагностики",
  },
  { image: "/interiors/office.jpg", alt: "Точная работа и продуманная среда" },
];

const faqs = [
  [
    "С чего начинается первый приём?",
    "Сначала врач выслушает вас, проведёт осмотр и объяснит, какие данные нужны для точного решения. После этого вы получите понятный план следующих шагов.",
  ],
  [
    "Можно прийти с готовыми снимками?",
    "Да. Возьмите с собой результаты предыдущих исследований и лечения — это поможет врачу быстрее разобраться в ситуации.",
  ],
  [
    "Если мне нужны разные специалисты?",
    "В сложных случаях лечение можно выстроить как единый маршрут: специалисты согласуют этапы между собой, а вы понимаете, что и зачем происходит.",
  ],
  [
    "Как подготовиться к консультации?",
    "Достаточно выбрать удобное время. Перед визитом можно записать вопросы и жалобы, которые хотите обсудить с врачом.",
  ],
];

export default function Home() {
  const [activeService, setActiveService] = useState(0);
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  async function submitAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) return;
    setIsSubmitting(true);
    setFormError("");
    setFormSent(false);
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") || ""),
          phone: String(formData.get("phone") || ""),
          consent: true,
        }),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(data.message || "Не удалось отправить заявку.");
      form.reset();
      setConsent(false);
      setFormSent(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Не удалось отправить заявку.");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
      <main className="min-h-screen bg-[#0b0c0c] text-[#f8f5f0]">
      <section className="hero-shell relative isolate overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/interiors/reception.jpg"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center]"
          aria-label="Интерьер клиники Архитектура улыбки"
        >
          <source src="/videos/hero-reception.webm" type="video/webm" />
          <source src="/videos/hero-reception.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,6,6,.98)_0%,rgba(5,6,6,.92)_32%,rgba(5,6,6,.61)_55%,rgba(5,6,6,.3)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-[#0b0c0c] to-transparent" />
        <nav
          className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-6 lg:px-10 lg:py-6"
          aria-label="Главное меню"
        >
          <a
            href="#top"
            className="group flex items-center gap-3 rounded-2xl py-2 pr-3 text-[13px] font-extrabold tracking-[.16em] transition hover:bg-white/[.06]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full border border-[#d9b49c]/75 bg-black/20 text-[#d9b49c] transition duration-300 group-hover:border-[#efd0b8] group-hover:bg-[#d9b49c]/10">
              ◇
            </span>
            <span>
              АРХИТЕКТУРА
              <br />
              УЛЫБКИ
            </span>
          </a>
          <div className="hidden items-center rounded-[1.15rem] border border-white/10 bg-[#111313]/55 p-1.5 shadow-[0_16px_45px_rgba(0,0,0,.18)] backdrop-blur-xl md:flex">
            {["Услуги", "О клинике", "Врачи", "Контакты"].map((item, index) => (
              <a
                key={item}
                href={["#services", "#clinic", "#doctors", "#contacts"][index]}
                className="group relative flex min-h-12 items-center rounded-xl px-5 text-[15px] font-medium text-white/70 transition duration-300 hover:bg-white/[.1] hover:text-white focus-visible:bg-white/[.1] focus-visible:outline-none"
              >
                <span className="mr-2 text-[9px] font-bold tracking-[.12em] text-[#d9b49c]/0 transition duration-300 group-hover:text-[#d9b49c]">0{index + 1}</span>
                {item}
              </a>
            ))}
          </div>
          <div className="hidden md:block">
            <Button asChild variant="gold" size="nav" className="gold-shine relative h-[52px] overflow-hidden px-7 shadow-[0_10px_30px_rgba(217,180,156,.18)]">
              <a href="tel:+79232323230">
                Записаться <ArrowRight className="ml-5 h-4 w-4" />
              </a>
            </Button>
          </div>
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Открыть меню"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="fixed inset-0 z-50 overflow-hidden bg-[#0b0c0c] md:hidden"
            >
              <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-[#76513e]/30 blur-3xl" />
              <div className="relative flex h-full flex-col px-6 pb-7 pt-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <a href="#top" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-[11px] font-extrabold tracking-[.15em]">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-[#d9b49c] text-lg text-[#d9b49c]">◇</span>
                  <span>АРХИТЕКТУРА<br />УЛЫБКИ</span>
                </a>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:border-[#d9b49c] hover:text-[#d9b49c]"
                  aria-label="Закрыть меню"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-10" aria-label="Мобильная навигация">
                {["Услуги", "О клинике", "Врачи", "Контакты"].map(
                  (item, index) => (
                    <motion.a
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + index * 0.07, duration: 0.35 }}
                      onClick={() => setMenuOpen(false)}
                      href={
                        ["#services", "#clinic", "#doctors", "#contacts"][index]
                      }
                      className="group flex items-center justify-between border-b border-white/10 py-5"
                    >
                      <span className="flex items-start gap-4"><span className="pt-1 text-[10px] font-bold tracking-[.16em] text-[#d9b49c]">0{index + 1}</span><span className="font-serif text-[2.45rem] leading-none tracking-[-.05em] text-white">{item}</span></span>
                      <ArrowRight className="h-5 w-5 text-white/35 transition duration-300 group-hover:translate-x-1 group-hover:text-[#d9b49c]" />
                    </motion.a>
                  ),
                )}
              </nav>
              <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.045] p-5 backdrop-blur-sm">
                <p className="text-[10px] font-bold tracking-[.16em] text-[#d9b49c]">СВЯЗАТЬСЯ С КЛИНИКОЙ</p>
                <a href="tel:+79232323230" className="mt-3 block font-serif text-2xl text-white">+7 923 232-32-30</a>
                <Button asChild className="gold-shine relative mt-5 w-full overflow-hidden"><a href="#contacts" onClick={() => setMenuOpen(false)}>Записаться на консультацию <ArrowRight className="ml-4 h-4 w-4" /></a></Button>
              </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div id="top" className="relative z-10 mx-auto flex min-h-[calc(100svh-6rem)] max-w-[1400px] items-center px-6 py-20 lg:px-10 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-[760px]"
          >
            <p className="mb-6 text-xs font-extrabold tracking-[.16em] text-[#d9b49c]">
              ДОМ ФУНКЦИОНАЛЬНОЙ СТОМАТОЛОГИИ
            </p>
            <h1 className="max-w-[760px] font-serif text-[clamp(3.8rem,7vw,7.1rem)] leading-[.88] tracking-[-.07em]">
              Здоровая улыбка,
              <br />
              <em className="font-normal text-[#d9b49c]">в которой</em>
              <br />
              вы уверены
            </h1>
            <p className="mt-8 max-w-xl text-[17px] leading-7 text-white/78">
              Начинаем с диагностики и честного разговора о вашей ситуации.
              Затем собираем понятный план: что можно сделать сейчас, какие
              этапы потребуются и к какому результату мы идём.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Button asChild className="gold-shine relative overflow-hidden">
                <a href="tel:+79232323230">
                  Записаться на консультацию{" "}
                  <ArrowRight className="ml-6 h-5 w-5" />
                </a>
              </Button>
            </div>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="absolute bottom-9 right-6 hidden max-w-[230px] border-l border-white/60 pl-5 font-serif text-3xl leading-none text-white/95 lg:right-10 lg:block">
            Интерьер, в котором спокойно
          </motion.p>
        </div>
      </section>
      <Reveal className="relative z-10 mx-auto -mt-3 max-w-[1400px] px-6 lg:px-10">
        <section className="overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(110deg,#191b1b,rgba(28,23,21,.94))] md:flex">
          <Feature
            number="01"
            title="Точная диагностика"
            text="Понятный план до начала лечения"
          />
          <Feature
            number="02"
            title="Комплексный подход"
            text="Все специалисты — в одной клинике"
          />
          <Feature
            number="03"
            title="Безопасность"
            text="Контроль качества на каждом этапе"
          />
        </section>
      </Reveal>
      <section
        id="services"
        className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10"
      >
        <Reveal>
          <p className="text-xs font-bold tracking-[.15em] text-[#d9b49c]">
            НАПРАВЛЕНИЯ
          </p>
          <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2 className="max-w-3xl font-serif text-5xl tracking-[-.06em] md:text-7xl">
              Стоматология
              <br />
              <em className="font-normal text-[#d9b49c]">в полном объёме</em>
            </h2>
            <p className="max-w-sm text-white/60">
              От профилактики до восстановления улыбки: выбираем нужный маршрут
              и объясняем каждое решение простым языком.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="image-frame relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#171918]"
              >
                <img
                  src={serviceImages[activeService].image}
                  alt={serviceImages[activeService].alt}
                  className="h-full w-full object-cover photo-breathe"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <p className="absolute bottom-6 left-6 right-6 font-serif text-3xl leading-tight text-white">
                  {services[activeService][0]}
                </p>
              </motion.div>
            </AnimatePresence>
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/50">
              Выберите направление. Для каждого случая врач формирует план,
              который учитывает здоровье, эстетику и комфорт лечения.
            </p>
          </div>
          <div className="divide-y divide-white/15 border-y border-white/15">
            {services.map(([title, text], index) => (
              <motion.button
                type="button"
                key={title}
                whileHover={{ x: 7 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                onMouseEnter={() => setActiveService(index)}
                onFocus={() => setActiveService(index)}
                onClick={() => setActiveService(index)}
                className="group block w-full text-left"
                aria-pressed={activeService === index}
              >
                <div className="flex items-start gap-5 py-6 md:gap-8 md:py-7">
                  <span className="pt-1 text-xs text-[#d9b49c]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3
                        className={`font-serif text-2xl leading-tight transition md:text-3xl ${activeService === index ? "text-[#f0d9c5]" : "text-white/80 group-hover:text-white"}`}
                      >
                        {title}
                      </h3>
                      <ChevronRight
                        className={`h-5 w-5 shrink-0 transition ${activeService === index ? "translate-x-1 text-[#d9b49c]" : "text-white/30 group-hover:translate-x-1 group-hover:text-[#d9b49c]"}`}
                      />
                    </div>
                    <AnimatePresence initial={false}>
                      {activeService === index && (
                        <motion.p
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            marginTop: 10,
                          }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.3 }}
                          className="max-w-xl overflow-hidden text-sm leading-6 text-white/55"
                        >
                          {text}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1400px] px-6 pb-28 lg:px-10">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-[1.45fr_.75fr]">
            <div className="relative min-h-[430px] overflow-hidden rounded-2xl">
              <img
                src="/interiors/reception.jpg"
                alt="Зона ожидания Архитектуры улыбки"
                className="h-full w-full object-cover photo-breathe"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-7">
                <p className="text-xs font-bold tracking-[.15em] text-[#e6c3a7]">
                  ВИЗУАЛИЗАЦИЯ ПРОСТРАНСТВА
                </p>
                <p className="mt-2 font-serif text-3xl">
                  Мягкий свет. Натуральные материалы. Тишина.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/15 bg-white/[.035] p-7">
                <ShieldCheck className="h-7 w-7 text-[#e3bb9d]" />
                <h3 className="mt-10 font-serif text-3xl">
                  Спокойствие начинается с деталей
                </h3>
                <p className="mt-4 text-white/60">
                  Маршрут пациента, оборудование и пространство продуманы для
                  комфортного визита.
                </p>
              </div>
              <img
                src="/interiors/dental-room.jpg"
                alt="Стоматологический кабинет"
                className="min-h-56 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </Reveal>
      </section>
    <ClinicStory />
    <section id="clinic" className="bg-[#151716] py-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-2 lg:px-10">
          <Reveal>
            <img
              className="min-h-[390px] h-full w-full rounded-2xl object-cover"
              src="/interiors/office.jpg"
              alt="Интерьер клиники"
            />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-center">
            <p className="text-xs font-bold tracking-[.15em] text-[#d9b49c]">
              О КЛИНИКЕ
            </p>
            <h2 className="mt-5 font-serif text-5xl tracking-[-.06em] md:text-7xl">
              Комфорт,
              <br />
              <em className="font-normal text-[#d9b49c]">созданный для вас</em>
            </h2>
            <p className="mt-8 max-w-xl text-[17px] leading-8 text-white/65">
              Дом функциональной стоматологии — место, где диагностика, лечение
              и восстановление улыбки собраны в одном маршруте. Мы объясняем
              варианты, помогаем принять взвешенное решение и сопровождаем на
              каждом этапе.
            </p>
            <a
              className="mt-8 inline-flex items-center gap-3 self-start border-b border-[#d9b49c] pb-2 text-sm font-semibold transition hover:text-[#e3bb9d]"
              href="tel:+79232323230"
            >
              Позвонить в клинику <ArrowRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>
      </section>
      <section className="bg-[#101111] py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-xs font-bold tracking-[.15em] text-[#d9b49c]">
              ПОНЯТНЫЙ МАРШРУТ
            </p>
            <h2 className="mt-5 font-serif text-5xl tracking-[-.06em] md:text-7xl">
              От первого визита
              <br />
              <em className="font-normal text-[#d9b49c]">до результата</em>
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            <Journey
              icon={<CalendarCheck />}
              num="01"
              title="Знакомство"
              text="Выбираем удобное время и отвечаем на первичные вопросы."
            />
            <Journey
              icon={<ClipboardCheck />}
              num="02"
              title="Диагностика и план"
              text="Разбираемся в ситуации и согласовываем понятный маршрут лечения."
            />
            <Journey
              icon={<Stethoscope />}
              num="03"
              title="Лечение"
              text="Команда специалистов сопровождает вас на каждом этапе."
            />
          </div>
        </div>
      </section>
      <section
        id="doctors"
        className="mx-auto max-w-[1400px] px-6 py-28 lg:px-10"
      >
        <Reveal>
          <p className="text-xs font-bold tracking-[.15em] text-[#d9b49c]">
            КОМАНДА
          </p>
          <h2 className="mt-5 font-serif text-5xl tracking-[-.06em] md:text-7xl">
            Врачи, которым
            <br />
            <em className="font-normal text-[#d9b49c]">можно доверять</em>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Reveal>
            <Doctor
              initials="АВ"
              specialty="Врач-стоматолог ортопед"
              name="Шишкин Алексей Викторович"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <Doctor
              initials="СА"
              specialty="Врач-стоматолог хирург"
              name="Ракутов Сергей Андреевич"
            />
          </Reveal>
        </div>
      </section>
      <section className="bg-[#151716] py-28">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-10">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="text-xs font-bold tracking-[.15em] text-[#d9b49c]">
                ПЕРЕД ВИЗИТОМ
              </p>
              <h2 className="mt-5 font-serif text-5xl tracking-[-.06em] md:text-6xl">
                Всё, что важно
                <br />
                <em className="font-normal text-[#d9b49c]">знать заранее</em>
              </h2>
              <p className="mt-7 max-w-sm text-[16px] leading-7 text-white/60">
                Мы ценим спокойствие пациента — поэтому заранее рассказываем,
                как устроен первый шаг.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="border-y border-white/15">
              {faqs.map(([question, answer], index) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => setOpenFaq(index)}
                  className="group block w-full border-b border-white/15 py-6 text-left last:border-b-0"
                >
                  <div className="flex items-center justify-between gap-6">
                    <span
                      className={`font-serif text-2xl leading-tight transition md:text-3xl ${openFaq === index ? "text-[#f0d9c5]" : "text-white/75 group-hover:text-white"}`}
                    >
                      {question}
                    </span>
                    <ChevronRight
                      className={`h-5 w-5 shrink-0 transition ${openFaq === index ? "rotate-90 text-[#d9b49c]" : "text-white/35"}`}
                    />
                  </div>
                  <AnimatePresence initial={false}>
                    {openFaq === index && (
                      <motion.p
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 14 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.28 }}
                        className="max-w-2xl overflow-hidden text-[15px] leading-7 text-white/60"
                      >
                        {answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>{" "}
      <section
        id="contacts"
        className="mx-auto mb-16 max-w-[1400px] px-6 lg:px-10"
      >
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(125deg,#2f211c,#171616_62%)]">
            <div className="grid lg:grid-cols-[1fr_.95fr]">
              <div className="relative min-h-[420px] overflow-hidden bg-[#181a19]">
                <iframe
                  title="Карта: Архитектура улыбки"
                  src="https://www.google.com/maps?q=%D0%96%D0%B5%D0%BB%D0%B5%D0%B7%D0%BD%D0%BE%D0%B4%D0%BE%D1%80%D0%BE%D0%B6%D0%BD%D0%B0%D1%8F%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%2018,%20%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B8%D1%80%D1%81%D0%BA&output=embed"
                  className="absolute inset-0 h-full w-full border-0 opacity-80 grayscale"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-[#111212]/90 p-5 backdrop-blur">
                  <p className="flex items-center gap-2 text-xs font-bold tracking-[.14em] text-[#e6c3a7]">
                    <MapPin className="h-4 w-4" /> КАК НАС НАЙТИ
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/75">
                    ЖК Прованс, ул. Железнодорожная, 18
                    <br />
                    Новосибирск, 2 этаж
                  </p>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.google.com/maps/dir/?api=1&destination=%D0%96%D0%B5%D0%BB%D0%B5%D0%B7%D0%BD%D0%BE%D0%B4%D0%BE%D1%80%D0%BE%D0%B6%D0%BD%D0%B0%D1%8F%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%2018,%20%D0%9D%D0%BE%D0%B2%D0%BE%D1%81%D0%B8%D0%B1%D0%B8%D1%80%D1%81%D0%BA"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#f0d9c5] transition hover:text-white"
                  >
                    Построить маршрут <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <p className="text-xs font-bold tracking-[.15em] text-[#e6c3a7]">
                  ПЕРВЫЙ ШАГ К УЛЫБКЕ
                </p>
                <h2 className="mt-4 font-serif text-4xl tracking-[-.05em] md:text-5xl">
                  Запишитесь
                  <br />
                  <em className="font-normal text-[#e6c3a7]">
                    на консультацию
                  </em>
                </h2>
                <p className="mt-5 text-sm leading-6 text-white/60">
                  Оставьте контакты — администратор подберёт удобное время для
                  визита.
                </p>
                <form onSubmit={submitAppointment} className="mt-7 grid gap-3">
                  <label className="sr-only" htmlFor="appointment-name">
                    Ваше имя
                  </label>
                  <input
                    id="appointment-name"
                    required
                    name="name"
                    placeholder="Ваше имя"
                    className="h-12 w-full rounded-xl border border-white/15 bg-white/[.06] px-4 text-sm text-white outline-none placeholder:text-white/40 transition focus:border-[#e3bb9d]"
                  />
                  <label className="sr-only" htmlFor="appointment-phone">
                    Телефон
                  </label>
                  <input
                    id="appointment-phone"
                    required
                    name="phone"
                    type="tel"
                    placeholder="Телефон для связи"
                    className="h-12 w-full rounded-xl border border-white/15 bg-white/[.06] px-4 text-sm text-white outline-none placeholder:text-white/40 transition focus:border-[#e3bb9d]"
                  />
                  <label className="mt-1 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[.035] p-3 text-xs leading-5 text-white/55 transition hover:border-white/20">
                    <input
                      required
                      checked={consent}
                      onChange={(event) => setConsent(event.target.checked)}
                      type="checkbox"
                      name="consent"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#e3bb9d]"
                    />
                    <span>
                      Я даю <a href="/consent" className="text-[#e6c3a7] underline underline-offset-2 hover:text-white">согласие на обработку персональных данных</a> и принимаю <a href="/privacy" className="text-[#e6c3a7] underline underline-offset-2 hover:text-white">Политику</a>.
                    </span>
                  </label>
                  <Button
                    type="submit"
                    disabled={!consent || isSubmitting}
                    className="gold-shine relative mt-2 w-full overflow-hidden"
                  >
                    {isSubmitting ? "Отправляем…" : "Отправить заявку"} <ArrowRight className="ml-5 h-5 w-5" />
                  </Button>
                  {formSent && (
                    <p role="status" className="pt-2 text-sm text-[#e6c3a7]">
                      Спасибо! Заявка принята, мы скоро свяжемся с вами.
                    </p>
                  )}
                  {formError && <p role="alert" className="pt-2 text-sm text-red-300">{formError}</p>}
                </form>
                <a
                  href="tel:+79232323230"
                  className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-white/75 transition hover:text-[#e6c3a7]"
                >
                  Или позвоните: +7 923 232-32-30{" "}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
      <footer className="border-t border-white/10 px-6 py-10 text-sm text-white/45 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-4 md:flex-row">
          <p>© {new Date().getFullYear()} Архитектура улыбки</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a className="transition hover:text-[#d9b49c]" href="/privacy">Политика обработки данных</a>
            <a className="transition hover:text-[#d9b49c]" href="/consent">Согласие на обработку данных</a>
            <a className="transition hover:text-[#d9b49c]" href="tel:+79232323230">+7 923 232-32-30</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <motion.article
      whileHover={{ x: 6 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="group flex flex-1 items-start gap-5 border-b border-white/15 px-6 py-7 last:border-b-0 md:border-b-0 md:border-r md:px-8 lg:px-10"
    >
      <span className="pt-1 text-xs tracking-[.14em] text-[#d9b49c]">
        {number}
      </span>
      <div>
        <h3 className="font-serif text-xl leading-tight text-white transition group-hover:text-[#f0d9c5] md:text-2xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-white/50">{text}</p>
      </div>
    </motion.article>
  );
}
function Doctor({
  initials,
  specialty,
  name,
}: {
  initials: string;
  specialty: string;
  name: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="overflow-hidden bg-[#171918]"
    >
      <div className="grid aspect-[16/9] place-items-center bg-[radial-gradient(circle_at_50%_40%,#98725f_0%,#4c3830_31%,#1e1d1c_72%)] font-serif text-7xl tracking-[-.15em] text-[#f0d9c5]">
        {initials}
      </div>
      <div className="p-7">
        <p className="text-xs font-bold uppercase tracking-[.13em] text-[#d9b49c]">
          {specialty}
        </p>
        <h3 className="mt-3 font-serif text-3xl">{name}</h3>
      </div>
    </motion.article>
  );
}
function Journey({
  icon,
  num,
  title,
  text,
}: {
  icon: ReactNode;
  num: string;
  title: string;
  text: string;
}) {
  return (
    <Reveal>
      <motion.article
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="group h-full rounded-2xl border border-white/15 bg-white/[.025] p-7 transition duration-500 hover:-translate-y-1 hover:border-[#d9b49c]/50 hover:bg-white/[.05]"
      >
        <div className="flex items-center justify-between text-[#e3bb9d]">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[#d9b49c]/50">
            {icon}
          </span>
          <span className="text-sm">{num}</span>
        </div>
        <h3 className="mt-12 font-serif text-3xl">{title}</h3>
        <p className="mt-3 max-w-sm text-white/60">{text}</p>
      </motion.article>
    </Reveal>
  );
}

const storyFrames = [
  { video: "/videos/clinic-corridor.mp4", poster: "/interiors/reception.jpg", eyebrow: "01 / Пространство", title: "Всё начинается со спокойствия", text: "Свет, тишина и понятный маршрут помогают почувствовать себя уверенно ещё до встречи с врачом." },
  { video: "/videos/clinic-room.mp4", poster: "/interiors/office.jpg", eyebrow: "02 / Диалог", title: "Решение рождается вместе", text: "Мы обсуждаем ситуацию, показываем варианты и составляем план, в котором понятен каждый следующий шаг." },
  { video: "/videos/treatment-room.mp4", poster: "/interiors/dental-room.jpg", eyebrow: "03 / Лечение", title: "Точность становится результатом", text: "Современное оснащение и командная работа объединяют диагностику, лечение и восстановление улыбки." },
];

function ClinicStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [storyStage, setStoryStage] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const section = sectionRef.current;
    if (!section) return;
    const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max((latest - section.offsetTop) / travel, 0), 1);
    setStoryProgress(progress);
    setStoryStage(progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2);
  });

  return (
    <section id="story" ref={sectionRef} className="story-scroll relative h-[270vh] bg-[#0b0c0c]" aria-label="История клиники">
      <div className="sticky top-0 h-screen overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.video key={storyFrames[storyStage].video} src={storyFrames[storyStage].video} poster={storyFrames[storyStage].poster} autoPlay muted loop playsInline preload="metadata" initial={{ opacity: 0, scale: 1.07 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 0.65 }, scale: { duration: 2.2, ease: "easeOut" } }} className="absolute inset-0 h-full w-full object-cover will-change-transform" />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,6,.88)_0%,rgba(5,6,6,.58)_37%,rgba(5,6,6,.12)_70%),linear-gradient(0deg,rgba(5,6,6,.68),transparent_48%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0b0c0c] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b0c0c] to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1400px] items-center px-6 lg:px-10">
          <div className="relative h-[520px] w-full max-w-[670px]">
            <AnimatePresence mode="wait">
              <motion.div key={storyFrames[storyStage].title} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.42, ease: "easeOut" }} className="absolute inset-0 flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e3bb9d]">{storyFrames[storyStage].eyebrow}</p>
                <h2 className="mt-6 font-serif text-[clamp(3.2rem,6.5vw,6.8rem)] leading-[.88] tracking-[-.065em] text-[#f8f5f0]">{storyFrames[storyStage].title}</h2>
                <p className="mt-7 max-w-lg text-base leading-7 text-white/70 md:text-lg md:leading-8">{storyFrames[storyStage].text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="absolute bottom-10 right-6 top-1/2 hidden w-px -translate-y-1/2 bg-white/20 md:block lg:right-10"><motion.div animate={{ height: `${storyProgress * 100}%` }} transition={{ duration: 0.12, ease: "linear" }} className="w-px bg-[#e3bb9d]" /><span className="absolute -left-8 -top-8 text-[10px] tracking-[.16em] text-white/45">ПУТЬ</span></div>
        <div className="absolute bottom-6 left-6 flex items-center gap-3 text-[10px] uppercase tracking-[.16em] text-white/45 lg:left-10"><span className="h-px w-10 bg-[#e3bb9d]" /> Прокрутите, чтобы увидеть историю</div>
      </div>
    </section>
  );
}
