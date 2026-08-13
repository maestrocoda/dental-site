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

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const targetProgressRef = useRef(0);
  const renderedProgressRef = useRef(0);
  const [layout, setLayout] = useState<"desktop" | "mobile" | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMode = () => {
      setLayout(desktop.matches ? "desktop" : "mobile");
      setReducedMotion(reduced.matches);
    };
    updateMode();
    desktop.addEventListener("change", updateMode);
    reduced.addEventListener("change", updateMode);
    return () => {
      desktop.removeEventListener("change", updateMode);
      reduced.removeEventListener("change", updateMode);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const section = video?.closest("section");
    if (!video || !section || layout === null || reducedMotion) return;

    let cancelled = false;
    let scrollTriggerCleanup: (() => void) | undefined;
    let lastFrameAt = performance.now();
    let lastSeekAt = 0;

    const startRenderLoop = () => {
      if (animationRef.current !== null || cancelled) return;
      lastFrameAt = performance.now();

      const renderFrame = (now: number) => {
        const elapsed = Math.min(now - lastFrameAt, 48);
        lastFrameAt = now;
        const target = targetProgressRef.current;
        const current = renderedProgressRef.current;
        const smoothing = 1 - Math.exp(-elapsed / 90);
        let next = current + (target - current) * smoothing;
        if (Math.abs(target - next) < 0.00035) next = target;
        renderedProgressRef.current = next;

        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${next})`;
        }

        if (
          Number.isFinite(video.duration) &&
          video.duration > 0 &&
          !video.seeking &&
          now - lastSeekAt > 28
        ) {
          const frameDuration = 1 / 25;
          const rawTime = next * Math.max(video.duration - 0.04, 0);
          const frameTime = Math.round(rawTime / frameDuration) * frameDuration;
          if (Math.abs(video.currentTime - frameTime) >= frameDuration * 0.72) {
            video.currentTime = frameTime;
            lastSeekAt = now;
          }
        }

        if (Math.abs(target - next) > 0.00035 || video.seeking) {
          animationRef.current = requestAnimationFrame(renderFrame);
        } else {
          animationRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(renderFrame);
    };

    const onSeeked = () => {
      if (Math.abs(targetProgressRef.current - renderedProgressRef.current) > 0.00035) {
        startRenderLoop();
      }
    };

    const prepare = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          targetProgressRef.current = self.progress;
          startRenderLoop();
        },
        onRefresh: (self) => {
          targetProgressRef.current = self.progress;
          startRenderLoop();
        },
      });
      scrollTriggerCleanup = () => trigger.kill();
      targetProgressRef.current = trigger.progress;
      startRenderLoop();
    };

    setReady(false);
    renderedProgressRef.current = targetProgressRef.current;
    video.addEventListener("seeked", onSeeked);
    video.load();
    void prepare();

    const unlockVideo = () => {
      void video.play().then(() => video.pause()).catch(() => undefined);
    };
    document.documentElement.addEventListener("touchstart", unlockVideo, { once: true, passive: true });

    return () => {
      cancelled = true;
      scrollTriggerCleanup?.();
      video.removeEventListener("seeked", onSeeked);
      document.documentElement.removeEventListener("touchstart", unlockVideo);
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
  }, [layout, reducedMotion]);

  const videoSource =
    layout === "mobile"
      ? "/videos/clinic-tour-scrub-mobile.mp4"
      : layout === "desktop"
        ? "/videos/clinic-tour-scrub-desktop.mp4"
        : undefined;

  return (
    <>
      <picture className="absolute inset-0 -z-20">
        <source media="(max-width: 767px)" srcSet="/videos/hero-clinic-mobile-poster.jpg" />
        <img
          src="/videos/hero-clinic-desktop-poster.jpg"
          alt=""
          className="h-full w-full object-cover object-center md:object-[62%_center]"
          aria-hidden="true"
        />
      </picture>
      <video
        ref={videoRef}
        muted
        playsInline
        preload={layout === null || reducedMotion ? "none" : "auto"}
        poster={layout === "mobile" ? "/videos/hero-clinic-mobile-poster.jpg" : "/videos/hero-clinic-desktop-poster.jpg"}
        onLoadedData={() => setReady(true)}
        onLoadedMetadata={(event) => {
          event.currentTarget.currentTime = targetProgressRef.current * Math.max(event.currentTarget.duration - 0.04, 0);
        }}
        className={`absolute inset-0 -z-20 h-full w-full object-cover object-center transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        aria-label="Интерьер клиники Архитектура улыбки"
        src={reducedMotion ? undefined : videoSource}
      />
      <div className="hero-scroll-progress pointer-events-none absolute inset-x-5 bottom-4 z-20 h-px bg-white/15 md:inset-x-10 md:bottom-6">
        <div ref={progressRef} className="h-px origin-left scale-x-0 bg-[#e3bb9d] will-change-transform" />
      </div>
      <p className="hero-scroll-hint pointer-events-none absolute right-5 top-28 z-20 hidden text-[9px] font-bold uppercase tracking-[.2em] text-white/42 md:right-10 md:block">
        Прокрутка управляет камерой
      </p>
    </>
  );
}

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
      <section className="hero-shell relative isolate h-[330svh] md:h-[410svh]">
        <div className="relative isolate sticky top-0 h-[100svh] min-h-[560px] overflow-hidden">
        <HeroVideo />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_46%,rgba(5,6,6,.18),transparent_34%),linear-gradient(90deg,rgba(5,6,6,.98)_0%,rgba(5,6,6,.93)_34%,rgba(5,6,6,.66)_60%,rgba(5,6,6,.35)_100%)]" />
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
                      <span className="font-serif text-[2.45rem] leading-none tracking-[-.05em] text-white">{item}</span>
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
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="hero-corner-caption absolute bottom-14 right-6 hidden max-w-[230px] border-l border-white/60 pl-5 font-serif text-3xl leading-none text-white/95 lg:right-10 lg:block">
            Интерьер, в котором спокойно
          </motion.p>
        </div>
        </div>
      </section>
      <Reveal className="relative z-10 mx-auto mt-8 max-w-[1400px] px-6 md:mt-12 lg:px-10">
        <section className="overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(110deg,#191b1b,rgba(28,23,21,.94))] md:flex">
          <Feature
            icon={<ClipboardCheck className="h-5 w-5" />}
            title="Диагностика и понятный план"
            text="Объясняем ситуацию и этапы лечения до первой процедуры"
          />
          <Feature
            icon={<Stethoscope className="h-5 w-5" />}
            title="Команда в одной клинике"
            text="Согласовываем лечение между специалистами без лишних визитов"
          />
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Контроль качества"
            text="Безопасность, стерилизация и внимание к деталям на каждом этапе"
          />
        </section>
      </Reveal>
      <section
        id="services"
        className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24"
      >
        <Reveal>
          <p className="text-xs font-bold tracking-[.15em] text-[#d9b49c]">
            ВАШ ЗАПРОС
          </p>
          <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h2 className="max-w-3xl font-serif text-5xl tracking-[-.06em] md:text-7xl">
              Найдём
              <br />
              <em className="font-normal text-[#d9b49c]">нужный маршрут</em>
            </h2>
            <p className="max-w-sm text-white/60">
              Пять направлений, с которых сегодня начинается работа клиники.
              На консультации определяем, какой следующий шаг нужен именно вам.
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
              Не нужно выбирать лечение по длинному списку. Расскажите, что
              беспокоит, — врач поможет разобраться в ситуации и предложит
              следующий шаг.
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
                <div className="flex items-start py-6 md:py-7">
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
                  className="absolute inset-0 h-full w-full scale-[1.02] border-0 opacity-70 grayscale contrast-[.9] saturate-[.7] transition duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-[linear-gradient(135deg,rgba(19,20,20,.96),rgba(19,20,20,.82))] p-5 shadow-[0_16px_45px_rgba(0,0,0,.3)] backdrop-blur-xl">
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
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="group flex flex-1 items-start gap-4 border-b border-white/15 px-6 py-5 last:border-b-0 md:border-b-0 md:border-r md:px-7 lg:px-8"
    >
      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#d9b49c]/25 bg-[#d9b49c]/[.08] text-[#e6c3a7] transition duration-300 group-hover:border-[#d9b49c]/60 group-hover:bg-[#d9b49c]/[.16]">
        {icon}
      </span>
      <div>
        <h3 className="font-serif text-lg leading-tight text-white transition group-hover:text-[#f0d9c5] md:text-xl">
          {title}
        </h3>
        <p className="mt-1.5 max-w-[310px] text-sm leading-5 text-white/50">{text}</p>
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
  { video: "/videos/clinic-corridor.mp4", poster: "/videos/clinic-corridor-poster.jpg", eyebrow: "01 / Пространство", title: "Спокойствие начинается с пространства", text: "Тихий свет, понятный маршрут и никакой больничной суеты. Мы продумали среду, в которой легче сосредоточиться на главном." },
  { video: "/videos/clinic-room.mp4", poster: "/videos/clinic-room-poster.jpg", eyebrow: "02 / Диагностика", title: "Точность начинается с деталей", text: "Врач собирает данные, объясняет ситуацию и только после диагностики предлагает последовательный план лечения." },
  { video: "/videos/treatment-room.mp4", poster: "/videos/treatment-room-poster.jpg", eyebrow: "03 / Лечение", title: "Внимание в каждом движении", text: "Оснащение помогает врачу работать точнее, а согласованная команда — проводить пациента через все этапы без лишней неопределённости." },
];

function MobileStoryClip({ video, poster, enabled }: { video: string; poster: string; enabled: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !enabled) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void element.play().catch(() => undefined);
        else element.pause();
      },
      { threshold: 0.45 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled]);

  return (
    <video
      ref={videoRef}
      src={enabled ? video : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      className="h-full w-full object-cover"
    />
  );
}

function ClinicStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [storyStage, setStoryStage] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const updateLayout = () => setIsDesktop(media.matches);
    updateLayout();
    media.addEventListener("change", updateLayout);
    return () => media.removeEventListener("change", updateLayout);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const section = sectionRef.current;
    if (!section || window.innerWidth < 768) return;
    const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max((latest - section.offsetTop) / travel, 0), 1);
    setStoryProgress(progress);
    const stage = Math.min(Math.floor(progress * storyFrames.length), storyFrames.length - 1);
    setStoryStage((current) => (current === stage ? current : stage));
  });

  return (
    <section id="story" ref={sectionRef} className="relative bg-[#0b0c0c]" aria-label="Клиника в движении">
      <div className="px-5 py-24 lg:hidden">
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#e3bb9d]">Клиника в движении</p>
        <h2 className="mt-5 max-w-sm font-serif text-5xl leading-[.92] tracking-[-.06em] text-[#f8f5f0]">
          Путь, в котором всё понятно
        </h2>
        <div className="mt-12 space-y-16">
          {storyFrames.map((frame) => (
            <article key={frame.video}>
              <div className="relative aspect-video overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#171918] shadow-[0_24px_70px_rgba(0,0,0,.34)]">
                <MobileStoryClip video={frame.video} poster={frame.poster} enabled={isDesktop === false} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>
              <p className="mt-6 text-[10px] font-bold uppercase tracking-[.18em] text-[#e3bb9d]">{frame.eyebrow}</p>
              <h3 className="mt-3 font-serif text-[2.15rem] leading-[.98] tracking-[-.045em] text-[#f8f5f0]">{frame.title}</h3>
              <p className="mt-4 text-[15px] leading-6 text-white/60">{frame.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="relative hidden h-[285vh] lg:block">
        <div className="sticky top-0 flex h-screen min-h-[680px] items-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,rgba(217,180,156,.11),transparent_32%),linear-gradient(135deg,#080909,#111313_58%,#0a0b0b)]" />
          <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-[.76fr_1.24fr] items-center gap-14 px-10 xl:gap-20">
            <div className="relative z-10 flex min-h-[450px] flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/38">Клиника в движении</p>
              <AnimatePresence mode="wait">
                <motion.div key={storyFrames[storyStage].title} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mt-16">
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e3bb9d]">{storyFrames[storyStage].eyebrow}</p>
                  <h2 className="mt-6 max-w-[560px] font-serif text-[clamp(3.6rem,5.2vw,6.4rem)] leading-[.89] tracking-[-.065em] text-[#f8f5f0]">{storyFrames[storyStage].title}</h2>
                  <p className="mt-7 max-w-[500px] text-base leading-7 text-white/62 lg:text-lg lg:leading-8">{storyFrames[storyStage].text}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-10 flex gap-2">
                {storyFrames.map((frame, index) => (
                  <span key={frame.video} className={`h-1 rounded-full transition-all duration-500 ${storyStage === index ? "w-12 bg-[#e3bb9d]" : "w-5 bg-white/18"}`} />
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 rounded-[3rem] bg-[#d9b49c]/[.055] blur-3xl" />
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/12 bg-[#161818] shadow-[0_35px_100px_rgba(0,0,0,.48)]">
                <AnimatePresence mode="wait">
                  <motion.video
                    key={storyFrames[storyStage].video}
                    src={isDesktop ? storyFrames[storyStage].video : undefined}
                    poster={storyFrames[storyStage].poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    initial={{ opacity: 0, scale: 1.025 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[.07]" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
                <p className="absolute bottom-6 left-7 text-[10px] font-bold uppercase tracking-[.18em] text-white/62">Дом функциональной стоматологии</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 h-px w-[min(92vw,1320px)] -translate-x-1/2 bg-white/10">
            <motion.div animate={{ width: `${storyProgress * 100}%` }} transition={{ duration: 0.15, ease: "linear" }} className="h-px bg-[#e3bb9d]" />
          </div>
        </div>
      </div>
    </section>
  );
}

const implantSteps = [
  {
    eyebrow: "01 / Основа",
    title: "Опора для будущего зуба",
    text: "Имплантация начинается с диагностики: врач оценивает состояние тканей, объём кости и выбирает план лечения.",
  },
  {
    eyebrow: "02 / Точность",
    title: "План, созданный для вашей ситуации",
    text: "Тип имплантата, его размер и положение определяются индивидуально — после обследования и консультации специалиста.",
  },
  {
    eyebrow: "03 / Результат",
    title: "Функция и естественный вид",
    text: "После завершения всех этапов конструкция помогает восстановить жевательную функцию и эстетику улыбки.",
  },
];

function ImplantExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextStep = progress < 0.39 ? 0 : progress < 0.71 ? 1 : 2;
    setActiveStep((current) => (current === nextStep ? current : nextStep));
  });

  return (
    <section ref={sectionRef} id="technology" className="relative h-[220vh] bg-[#111312]" aria-label="Технологии имплантации">
      <div className="sticky top-0 min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_43%,rgba(217,180,156,.16),transparent_25%),linear-gradient(115deg,#0a0b0b_8%,#151716_58%,#0c0d0d)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0b0c0c] to-transparent" />
        <div className="relative mx-auto grid min-h-screen max-w-[1400px] items-center gap-4 px-6 py-24 lg:grid-cols-[.84fr_1.16fr] lg:px-10">
          <div className="relative z-10 max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#e3bb9d]">Технологии / имплантация</p>
            <h2 className="mt-6 font-serif text-[clamp(3.3rem,6.1vw,6.6rem)] leading-[.89] tracking-[-.065em] text-[#f8f5f0]">Имплантация —<br /><em className="font-normal text-[#d9b49c]">понятно по этапам</em></h2>
            <AnimatePresence mode="wait">
              <motion.div key={implantSteps[activeStep].title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.34 }} className="mt-9 max-w-md">
                <p className="text-[11px] font-bold uppercase tracking-[.17em] text-[#e3bb9d]">{implantSteps[activeStep].eyebrow}</p>
                <h3 className="mt-3 font-serif text-3xl leading-tight text-white">{implantSteps[activeStep].title}</h3>
                <p className="mt-4 text-base leading-7 text-white/63">{implantSteps[activeStep].text}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-9 flex gap-2" aria-label="Этапы имплантации">
              {implantSteps.map((item, index) => <span key={item.eyebrow} className={`h-1.5 rounded-full transition-all duration-500 ${activeStep === index ? "w-12 bg-[#e3bb9d]" : "w-5 bg-white/20"}`} />)}
            </div>
            <p className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-white/45">
              <span className="h-px w-7 bg-[#e3bb9d]" /> Прокрутите страницу или потяните модель
            </p>
            <p className="mt-9 max-w-sm text-xs leading-5 text-white/38">Демонстрационная визуализация. Окончательное решение о лечении принимает врач после диагностики.</p>
          </div>
          <div className="relative mx-auto flex h-[min(68vh,720px)] w-full max-w-[620px] items-center justify-center">
            <div className="absolute inset-[12%] rounded-full bg-[#d9b49c]/15 blur-[100px]" />
            <div className="relative z-10 h-full w-full will-change-transform">
              <div aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
