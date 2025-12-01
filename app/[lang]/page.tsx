'use client';

import { useEffect, useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import Script from "next/script";

import pt from "../i18n/pt";
import en from "../i18n/en";
import es from "../i18n/es";
import zh from "../i18n/zh";
import th from "../i18n/th";

const dictionaries = { pt, en, es, zh, th } as const;
type Lang = keyof typeof dictionaries;



export default function Home() {
  const params = useParams();
  const langParam = (params?.lang as string) || "pt";

  const [audienceIndex, setAudienceIndex] = useState(0);


  // URL que o usuário digita no hero
  const [heroUrl, setHeroUrl] = useState("");
  // URL que vai junto no formulário de contato
  const [contactUrl, setContactUrl] = useState("");

  // --- Filtro e formatação automática da URL digitada no Hero ---
const formatUrlInput = (value: string) => {
  let url = value.trim();

  // Se digitou só "www." → cria https://www.
  if (url === "www." || url === "www") {
    return "https://www.";
  }

  // Se começa com www mas sem http → adiciona https://
  if (url.startsWith("www.") && !url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  // Se não começa com http ou www → tenta formatar automaticamente
  if (
    !url.startsWith("http://") &&
    !url.startsWith("https://") &&
    !url.startsWith("www.")
  ) {
    url = "https://www." + url;
  }

  return url;
};

// Validação simples: precisa ter www e domínio
const isValidUrl = (value: string) => {
  return /^https?:\/\/www\.[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/.test(value);
};


// quando o usuário envia o formulário do hero
const handleSubmitHero = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  let trimmed = heroUrl.trim();

  // Se vazio → apenas rola para contacts (mantendo seu comportamento atual)
  if (!trimmed) {
    document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  // --- Filtro / formatação automática da URL ---
  const formatUrlInput = (value: string) => {
    let url = value.trim();

    // Se digitou só "www." ou "www" → corrige
    if (url === "www." || url === "www") {
      return "https://www.";
    }

    // Se começa com www mas sem http/https
    if (url.startsWith("www.") && !url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    // Se não começa com http e nem www, adiciona tudo
    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://") &&
      !url.startsWith("www.")
    ) {
      url = "https://www." + url;
    }

    return url;
  };

  // Aplica formatação
  const formatted = formatUrlInput(trimmed);

  // Validação final (precisa ter domínio)
  const isValidUrl = (value: string) => {
    return /^https?:\/\/www\.[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/.test(value);
  };

  if (!isValidUrl(formatted)) {
    alert("Por favor, insira um endereço válido com www.");
    return;
  }

  // Guarda a URL formatada
  setHeroUrl(formatted);
  setContactUrl(formatted);

  // Rola para a seção de contato
  document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
};


  // ---------- CAMPOS DO FORMULÁRIO DE CONTATO ----------
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  // 🔐 Token do Cloudflare Turnstile
const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  // feedback envio
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ENVIO FINAL PARA O FORMSPREE
const handleSubmitContact = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSending(true);
  setSuccessMsg("");
  setErrorMsg("");

  // 👇 Exige o token do Turnstile
  if (!recaptchaToken) {
    setErrorMsg("Por favor, confirme o captcha antes de enviar.");
    setIsSending(false);
    return;
  }

  const payload = {
    heroUrl: contactUrl, // vindo do primeiro formulário
    name,
    email,
    phone,
    company,
    message,
    turnstileToken: recaptchaToken, // se quiser receber no Formspree também
  };

  try {
    const res = await fetch("https://formspree.io/f/xqayjlbw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSuccessMsg("Mensagem enviada com sucesso!");
      setErrorMsg("");

      // limpa tudo
      setHeroUrl("");
      setContactUrl("");
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setMessage("");
      setRecaptchaToken(null);
    } else {
      setErrorMsg("Ocorreu um erro ao enviar. Tente novamente.");
    }
  } catch (error) {
    setErrorMsg("Erro inesperado. Tente mais tarde.");
  }

  setIsSending(false);
};


  // Controle do FAQ (evita piscar)
  const [openIndex, setOpenIndex] = useState<number | null>(0); // primeira pergunta aberta

  // rotas válidas na URL
  const validRoutes = ["pt", "en", "es", "ch", "th"];
  const safeRoute = validRoutes.includes(langParam) ? langParam : "pt";

  // na URL é "ch", no dicionário é "zh"
  const dictKey: Lang = safeRoute === "ch" ? "zh" : (safeRoute as Lang);
  const t = dictionaries[dictKey];

  // 👇 mapa para o que aparece no botão (flag + sigla)
  const langDisplayMap = {
    pt: { code: "PT", flag: "/assets/images/br.png" },
    en: { code: "EN", flag: "/assets/images/usa.png" },
    es: { code: "ES", flag: "/assets/images/es.png" },
    ch: { code: "CN", flag: "/assets/images/ch.png" },
    th: { code: "TH", flag: "/assets/images/th.png" },
  } as const;

  const currentLangDisplay =
    langDisplayMap[safeRoute as keyof typeof langDisplayMap];

  // 1) useEffect do seletor de idioma
  useEffect(() => {
    const langToggle = document.getElementById("langToggle");
    const langOptions = document.getElementById("langOptions");
    if (!langToggle || !langOptions) return;

    const handleToggle = () => {
      langOptions.classList.toggle("show");
    };

    const handleOptionsClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const li = target.closest("li[data-lang]") as HTMLElement | null;
      if (!li) return;

      // valor do data-lang: pt, en, es, zh, th
      const dataLang = li.getAttribute("data-lang");
      if (!dataLang) return;

      // rota real: pt, en, es, ch, th  (zh -> ch)
      const routeLang = dataLang === "zh" ? "ch" : dataLang;

      // Atualiza o botão (flag + código)
      const selectedCode =
        li.querySelector(".code")?.textContent?.trim() || "";

      const flagNode = li.querySelector(".flag") as HTMLElement | null;
      const flagHTML = flagNode ? flagNode.innerHTML : "";

      const codeSpan = langToggle.querySelector(".code") as HTMLElement | null;
      const flagSpan = langToggle.querySelector(".flag") as HTMLElement | null;

      if (codeSpan) codeSpan.textContent = selectedCode;
      if (flagSpan && flagHTML) flagSpan.innerHTML = flagHTML;

      // Remove prefixo de idioma atual da URL (/pt, /en, /es, /ch, /th)
      const path = window.location.pathname.replace(
        /^\/(pt|en|es|ch|th)/,
        ""
      );

      // Redireciona para o novo idioma, mantendo o resto da rota
      window.location.href = `/${routeLang}${path || ""}`;

      // Fecha o dropdown
      langOptions.classList.remove("show");
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".language-selector")) {
        langOptions.classList.remove("show");
      }
    };

    langToggle.addEventListener("click", handleToggle);
    langOptions.addEventListener("click", handleOptionsClick);
    document.addEventListener("click", handleClickOutside);

    // limpeza
    return () => {
      langToggle.removeEventListener("click", handleToggle);
      langOptions.removeEventListener("click", handleOptionsClick);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 1) useEffects Cloudflare
  useEffect(() => {
  // callback global que o Turnstile vai chamar
  (window as any).onTurnstileSuccess = (token: string) => {
    setRecaptchaToken(token);
  };
}, []);


  // 2) useEffect do carrossel (igual já estava)
  useEffect(() => {
    const imgs = document.querySelectorAll<HTMLImageElement>(
      ".boom-fade-wrapper .boom-fade-img"
    );
    if (!imgs.length) return;

    let index = 0;
    imgs[0].classList.add("active");

    const interval = setInterval(() => {
      const current = imgs[index];
      const nextIndex = (index + 1) % imgs.length;
      const next = imgs[nextIndex];

      current.classList.remove("active");
      next.classList.add("active");

      index = nextIndex;
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 3) AQUI é o retorno REAL do componente (JSX)

  return (
    <>
      <main>

        {/* Top header area start here */}
        <div className="header-top d-none d-lg-block">
          <div className="container">
            <div className="header-top-wrp">
              <ul className="info">
                <li>
                  <i className="fa-light fa-clock"></i>
                  <span className="paragraph-light">
                    <span className="text-white">
                      {t.topbar.atendimentoLabel}
                    </span>{" "}
                    {t.topbar.horario}
                  </span>
                </li>
              </ul>

              <div className="right-info">
                <ul className="site-link">
                  <li>
                    <a href={`mailto:${t.topbar.email}`}>{t.topbar.email}</a>
                  </li>
                </ul>

                <ul className="link-info">
                  <li>
                    <a href="#0">
                      <svg
                        width="8"
                        height="16"
                        viewBox="0 0 8 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.10223 8.99555V16H1.97333V8.99555H0V6.09778H1.97333V3.89334C1.97333 1.38667 3.46666 0 5.76 0C6.85333 0 8 0.195557 8 0.195557V2.65778H6.73778C5.49334 2.65778 5.10223 3.43111 5.10223 4.22222V6.09778H7.88444L7.44 8.99555H5.10223Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                  </li>

                  <li>
                    <a href="#0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.9466 4.69593C15.8843 3.41522 15.5906 2.27682 14.6563 1.34297C13.7219 0.409114 12.5829 0.11562 11.3014 0.053363C9.97553 -0.0177877 6.01557 -0.0177877 4.69855 0.053363C3.41713 0.11562 2.28699 0.409114 1.34372 1.34297C0.400455 2.27682 0.115684 3.41522 0.0533926 4.69593C-0.0177975 6.02111 -0.0177975 9.97887 0.0533926 11.3041C0.115684 12.5848 0.409354 13.7232 1.34372 14.657C2.28699 15.5909 3.41713 15.8844 4.69855 15.9466C6.02447 16.0178 9.98443 16.0178 11.3014 15.9466C12.5829 15.8844 13.7219 15.5909 14.6563 14.657C15.5906 13.7232 15.8843 12.5848 15.9466 11.3041C16.0178 9.97887 16.0178 6.02112 15.9466 4.70483V4.69593ZM7.99111 12.2201C5.65963 12.2201 3.76419 10.3257 3.76419 7.99555C3.76419 5.66536 5.65963 3.77098 7.99111 3.77098C10.3226 3.77098 12.218 5.66536 12.218 7.99555C12.218 10.3257 10.3226 12.2201 7.99111 12.2201ZM12.9032 3.99332C12.4138 3.99332 12.0133 3.5931 12.0133 3.10394C12.0133 2.61478 12.4049 2.21456 12.9032 2.21456C13.3926 2.21456 13.7931 2.61478 13.7931 3.10394C13.7931 3.5931 13.3926 3.99332 12.9032 3.99332ZM10.8832 7.99555C10.8832 9.58754 9.58399 10.886 7.99111 10.886C6.39823 10.886 5.09901 9.58754 5.09901 7.99555C5.09901 6.40355 6.39823 5.10505 7.99111 5.10505C9.58399 5.10505 10.8832 6.40355 10.8832 7.99555Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                  </li>

                  <li>
                    <a href="#0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.58958 15.9911H0.222698V5.89045H3.58958V15.9911ZM3.92717 1.96389C3.92717 0.897859 3.08323 0.0361424 2.01719 0.000607979C0.933392 -0.0260429 0.0272588 0.826778 0.00060798 1.91058C-0.0260429 2.99438 0.826779 3.90051 1.91058 3.92716C3.01215 3.93605 3.9094 3.06546 3.92717 1.96389ZM15.9467 9.88807C15.9467 6.74327 13.9124 5.78383 12.1801 5.78383C10.963 5.7483 9.81701 6.34351 9.15074 7.35624V5.89932H5.89933V16H9.26622V10.7587C9.26622 10.7054 9.26622 10.6521 9.26622 10.5988C9.26622 10.5988 9.26622 10.5988 9.26622 10.5899C9.19515 9.51495 10.0124 8.58218 11.0874 8.51111C11.9668 8.51111 12.6331 9.07966 12.6331 10.6787V16H16L15.9556 9.89695L15.9467 9.88807Z"
                          fill="white"
                        />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Top header area end here */}

{/* Header area start here */}
<header className="header-area border-none">
  <div className="container">
    <div className="header__main">
      {/* Logo */}
      <a className="logo" href="/">
        <img src="/assets/images/logo/logo.svg" alt="Boom logo" />
      </a>

      {/* Menu principal (desktop) */}
      <div className="main-menu">
        <nav>
          <ul>
            <li>
              <a href="#home">{t.nav.home}</a>
            </li>
            <li>
              <a href="#diferencials">{t.nav.diferencials}</a>
            </li>
            <li>
              <a href="#about">{t.nav.about}</a>
            </li>
            <li>
              <a href="#solutions">{t.nav.solutions}</a>
            </li>
            <li>
              <a href="#audience">{t.nav.audience}</a>
            </li>
            <li>
              <a href="#formats">{t.nav.formats}</a>
            </li>
            <li>
              <a href="#faqs">{t.nav.faq}</a>
            </li>
            <li>
              <a href="#contacts">{t.nav.contacts}</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* 🔤 Seletor de idioma – fora do menu, aparece em desktop e mobile */}
      <div className="language-selector header-lang">
        <button
          className="lang-current"
          id="langToggle"
          type="button"
        >
          <span className="flag">
            <img
              className="flag-img"
              src={currentLangDisplay.flag}
              alt={currentLangDisplay.code}
            />
          </span>
          <span className="code">{currentLangDisplay.code}</span>
          <img
            className="arrow-img"
            src="/assets/images/arrow.png"
            alt="arrow"
          />
        </button>

        <ul id="langOptions" className="lang-options">
          <li data-lang="pt">
            <span className="flag">
              <img
                className="flag-img"
                src="/assets/images/br.png"
                alt="PT"
              />
            </span>
            <span className="code">PT</span>
          </li>
          <li data-lang="en">
            <span className="flag">
              <img
                className="flag-img"
                src="/assets/images/usa.png"
                alt="EN"
              />
            </span>
            <span className="code">EN</span>
          </li>
          <li data-lang="es">
            <span className="flag">
              <img
                className="flag-img"
                src="/assets/images/es.png"
                alt="ES"
              />
            </span>
            <span className="code">ES</span>
          </li>
          <li data-lang="ch">
            <span className="flag">
              <img
                className="flag-img"
                src="/assets/images/ch.png"
                alt="CN"
              />
            </span>
            <span className="code">CN</span>
          </li>
          <li data-lang="th">
            <span className="flag">
              <img
                className="flag-img"
                src="/assets/images/th.png"
                alt="TH"
              />
            </span>
            <span className="code">TH</span>
          </li>
        </ul>
      </div>

      {/* Botão de menu mobile */}
      <button
        className="menubars d-block d-lg-none"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#menubar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </div>
</header>
{/* Header area end here */}

        {/* Sidebar area start here */}
        <div className="sidebar-area offcanvas offcanvas-end" id="menubar">
          <div className="offcanvas-header">
            <a className="logo" href="/">
              <img src="/assets/images/logo/logo-mix.svg" alt="logo" />
            </a>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
            >
              <i className="fa-regular fa-xmark"></i>
            </button>
          </div>

          <div className="offcanvas-body sidebar__body">
            <div className="mobile-menu overflow-hidden"></div>

            <div className="d-none d-lg-block">{/* extra desktop */}</div>

            <div className="sidebar__btns my-4">{/* extra buttons */}</div>
          </div>
        </div>
        {/* Sidebar area end here */}

        <div className="ScrollSmoother-content">
          {/* Banner area start here */}
          <section id="home" className="banner-three-area paralax__animation">
            <div className="container">
              <div className="banner-three__content">
                <span
                  className="wow splt-txt d-inline-flex align-items-center gap-2"
                  data-splitting
                >
                  {t.hero.badge}
                  <img src="/assets/images/icon/roket.png" alt="icon" />
                </span>

                <h1
                  className="wow fadeInUp"
                  data-wow-delay="400ms"
                  data-wow-duration="1500ms"
                >
                  {t.hero.title}
                </h1>

                <p
                  className="wow fadeInUp"
                  data-wow-delay="600ms"
                  data-wow-duration="1500ms"
                >
                  {t.hero.description}
                </p>

                {/* Formulario Aqui */}
                <form
                  onSubmit={handleSubmitHero}
                  className="input-feild wow fadeInUp"
                  data-wow-delay="700ms"
                  data-wow-duration="1500ms"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 0C3.5888 0 0 3.5888 0 8C0 12.4112 3.5888 16 8 16C12.4112 16 16 12.4112 16 8C16 3.5888 12.4128 0 8 0ZM14.7395 7.384H11.8723C11.7683 5.4192 11.1713 3.4192 10.1473 1.5856C12.6433 2.4224 14.4931 4.6736 14.7395 7.384ZM8.50586 1.25599C9.77306 3.14879 10.5186 5.2912 10.6418 7.384H5.36172C5.48492 5.2912 6.22889 3.14879 7.49609 1.25599C7.66249 1.24319 7.8304 1.2304 8 1.2304C8.1696 1.2304 8.33786 1.24479 8.50586 1.25599ZM5.85469 1.5856C4.83069 3.4208 4.23369 5.4192 4.12969 7.3856H1.2625C1.5089 4.6736 3.35869 2.4224 5.85469 1.5856ZM1.2625 8.616H4.12969C4.23369 10.5808 4.83069 12.5792 5.85469 14.416C3.35869 13.5776 1.5089 11.3264 1.2625 8.616ZM7.49609 14.744C6.22889 12.8496 5.48332 10.7088 5.36172 8.616H10.6418C10.5186 10.7104 9.77466 12.8512 8.50586 14.744C8.33946 14.7568 8.17116 14.7696 8.00156 14.7696C7.83196 14.7696 7.66249 14.7568 7.49609 14.744ZM10.1473 14.4144C11.1713 12.5792 11.7683 10.5808 11.8723 8.616H14.7395C14.4931 11.3264 12.6433 13.5776 10.1473 14.4144Z"
                      fill="#06120E"
                      fillOpacity="0.7"
                    />
                  </svg>

                  <input
                    type="text"
                    name="siteUrl"
                    placeholder={t.hero.inputPlaceholder}
                    value={heroUrl}
                    onChange={(e) => setHeroUrl(e.target.value)}
                  />

                  <button type="submit">{t.hero.button}</button>
                </form>
              </div>
              {/* Formulario acaba Aqui */}

              <div className="banner-three__image">
                <div
                  className="boom-fade-wrapper w-100 wow bounceInRight"
                  data-wow-delay="400ms"
                  data-wow-duration="1000ms"
                >
                  <img
                    src="/assets/images/people.png"
                    className="boom-fade-img img1"
                    alt=""
                  />
                  <img
                    src="/assets/images/people2.png"
                    className="boom-fade-img img2"
                    alt=""
                  />
                  <img
                    src="/assets/images/people3.png"
                    className="boom-fade-img img3"
                    alt=""
                  />
                  <img
                    src="/assets/images/people4.png"
                    className="boom-fade-img img4"
                    alt=""
                  />
                  <img
                    src="/assets/images/people5.png"
                    className="boom-fade-img img5"
                    alt=""
                  />
                  <img
                    src="/assets/images/people6.png"
                    className="boom-fade-img img6"
                    alt=""
                  />
                  <img
                    src="/assets/images/people7.png"
                    className="boom-fade-img img7"
                    alt=""
                  />
                </div>

                <img
                  className="here-bg"
                  src="/assets/images/banner/banner-three-hero-bg.png"
                  alt="image"
                />
              </div>
            </div>
          </section>
          {/* Banner area end here */}
        </div>

        {/* Brand area start here */}
        <section id="diferencials" className="feature-three-area">
          <div className="brand-area pb-120">
            <div className="container">
              <div className="marquee-area">
                <div className="marquee__wrp">
                  <div className="marquee__slide brand__slider">
                    {/* BLOCO ÚNICO */}
                    <div className="marquee__item-wrp">
                      <div className="marquee__item">
                        <img src="/assets/images/brand/1.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/2.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/3.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/4.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/5.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/6.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/7.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/8.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/9.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/10.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/12.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/14.png" />
                      </div>
                    </div>

                    {/* DUPLICAÇÃO AUTOMÁTICA PARA O LOOP */}
                    <div className="marquee__item-wrp">
                      <div className="marquee__item">
                        <img src="/assets/images/brand/1.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/2.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/3.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/4.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/5.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/6.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/7.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/8.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/9.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/10.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/12.png" />
                      </div>
                      <div className="marquee__item">
                        <img src="/assets/images/brand/14.png" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Brand area end here */}

        {/* Feature area start here */}
        <section className="feature-three-area">
          <div className="feature-three__container">
            <div className="d-flex flex-wrap mb-80 justify-content-between align-items-end gap-3">
              <div className="section-header">
                <h5 className="wow splt-txt" data-splitting>
                  {t.feature.sectionTag}
                </h5>

                <h2 className="fw-600 wow splt-txt" data-splitting>
                  {t.feature.sectionTitle}
                </h2>
              </div>

              <p
                className="wow fadeInUp"
                data-wow-delay="200ms"
                data-wow-duration="1500ms"
              >
                {t.feature.sectionDescription}
              </p>
            </div>

            <div className="row g-5">
              {/* Card 1 */}
              <div
                className="col-xxl-3 col-md-6 wow bounceInUp"
                data-wow-delay="200ms"
                data-wow-duration="1500ms"
              >
                <div className="feature-three__item">
                  <img
                    src="/assets/images/icon/feature-three-icon1.png"
                    alt="icon"
                  />
                  <h3 className="mt-20 mb-1">{t.feature.cards[0].title}</h3>
                  <p>{t.feature.cards[0].text}</p>
                </div>
              </div>

              {/* Card 2 */}
              <div
                className="col-xxl-3 col-md-6 wow bounceInUp"
                data-wow-delay="300ms"
                data-wow-duration="1500ms"
              >
                <div className="feature-three__item">
                  <img
                    src="/assets/images/icon/feature-three-icon2.png"
                    alt="icon"
                  />
                  <h3 className="mt-20 mb-1">{t.feature.cards[1].title}</h3>
                  <p>{t.feature.cards[1].text}</p>
                </div>
              </div>

              {/* Card 3 */}
              <div
                className="col-xxl-3 col-md-6 wow bounceInUp"
                data-wow-delay="400ms"
                data-wow-duration="1500ms"
              >
                <div className="feature-three__item">
                  <img
                    src="/assets/images/icon/feature-three-icon3.png"
                    alt="icon"
                  />
                  <h3 className="mt-20 mb-1">{t.feature.cards[2].title}</h3>
                  <p>{t.feature.cards[2].text}</p>
                </div>
              </div>

              {/* Card 4 */}
              <div
                className="col-xxl-3 col-md-6 wow bounceInUp"
                data-wow-delay="500ms"
                data-wow-duration="1500ms"
              >
                <div className="feature-three__item">
                  <img
                    src="/assets/images/icon/feature-three-icon4.png"
                    alt="icon"
                  />
                  <h3 className="mt-20 mb-1">{t.feature.cards[3].title}</h3>
                  <p>{t.feature.cards[3].text}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Feature area end here */}

        {/* About area start here */}
        <section id="about" className="about-area pt-120 pb-120">
          <div className="container">
            <div className="row g-5">
              {/* Left image */}
              <div className="col-lg-6">
                <div className="about__image">
                  <img
                    className="w-100"
                    src="/assets/images/about/about-image.png"
                    alt="image"
                  />
                  <img
                    className="about-line"
                    src="/assets/images/shape/about-three-shape.png"
                    alt="shape"
                  />
                  <img
                    className="about-kit"
                    src="/assets/images/about/about-three-kit.png"
                    alt="image"
                  />
                </div>
              </div>

              {/* Right content */}
              <div className="col-lg-6">
                <div className="about__item-right">
                  <div className="section-header">
                    <h5 className="wow splt-txt" data-splitting>
                      {t.about.tag}
                    </h5>

                    <h2 className="fw-600 wow splt-txt" data-splitting>
                      {t.about.title}
                    </h2>

                    <p
                      className="wow fadeInUp"
                      data-wow-delay="200ms"
                      data-wow-duration="1500ms"
                    >
                      {t.about.paragraph.split("\n\n").map((chunk, idx) => (
                        <span key={idx}>
                          {chunk}
                          {idx <
                            t.about.paragraph.split("\n\n").length - 1 && (
                            <>
                              <br />
                              <br />
                            </>
                          )}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* About area end here */}

        {/* Services area start here */}
        <section id="solutions" className="service-two-area pt-120 pb-120">
          <div className="container">
            <div className="about__item-right">
              {/* Tag */}
              <div className="section-header text-center">
                <h5 className="wow splt-txt" data-splitting>
                  {t.solutions.tag}
                </h5>
              </div>

              {/* Title */}
              <div className="section-header text-center mb-80">
                <h2 className="fw-600 splt-txt wow" data-splitting>
                  {t.solutions.titleLine1}
                  <br />
                  {t.solutions.titleLine2}
                </h2>
              </div>

              {/* Services List */}
              <div className="row g-4">
                {t.solutions.items.map((item, i) => (
                  <div
                    key={i}
                    className="col-lg-6 wow bounceInUp"
                    data-wow-delay={`${200 + i * 100}ms`}
                    data-wow-duration="3000ms"
                  >
                    <div className={`service-two__item bg${i + 1}`}>
                      <div className="icon">
                        <img
                          src={`/assets/images/icon/service-icon${i + 1}.png`}
                          alt="icon"
                        />
                      </div>

                      <div className="service-two__content">
                        <h3 className="mb-10">{item.title}</h3>

                        <p className="mb-20">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Services area end here */}

{/* Audience area start here */}
<section id="audience" className="feature-three-area2 pt-120 pt-120">
  <div className="feature-three__container2">
    <div className="d-flex flex-wrap mb-80 justify-content-between align-items-end gap-3">
      <div className="section-header-four">
        <h5 className="wow splt-txt" data-splitting>
          <span className="title-dot"></span>
          {t.audience.tag}
        </h5>
        <h2 className="wow splt-txt" data-splitting>
          {t.audience.title}
        </h2>
      </div>

      <p
        className="wow fadeInUp"
        data-wow-delay="200ms"
        data-wow-duration="1500ms"
      >
        {t.audience.description}
      </p>
    </div>

    {/* DESKTOP / TABLET – grade com TODOS os cards */}
    <div className="about-four__wrp pt-60 pb-60 audience-desktop">
      <div className="row g-4">
        {Object.values(t.audience.cards).map((card, i) => {
          const icons = [
            "impressions",
            "unique",
            "chanel",
            "years",
            "female",
            "male",
            "engage",
            "players",
          ];

          const iconName = icons[i] ?? "impressions";
          const numeric = card.value.replace(/[^\d.,]/g, "");
          const suffix = card.value.replace(/[\d.,]/g, "");

          return (
            <div
              key={i}
              className="col-xxl-3 col-md-6 wow bounceInUp"
              data-wow-delay={`${200 + i * 100}ms`}
              data-wow-duration="2000ms"
            >
              <div className="about-four__item">
                <h5 className="mb-20">{card.label}</h5>
                <div className="d-flex align-items-center justify-content-between gap-4">
                  <h2>
                    <span className="count">{numeric}</span>
                    {suffix}
                  </h2>
                  <img
                    src={`/assets/images/icon/${iconName}.png`}
                    alt={card.label}
                    className="about-four__icon"
                  />
                </div>
                <p className="fs-16 mt-2">{card.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* MOBILE – só os 4 primeiros cards, em blocos grandes */}
    <div className="about-four__wrp pt-60 pb-60 audience-mobile">
      {Object.values(t.audience.cards)
        .slice(0, 4)
        .map((card, i) => {
          const icons = [
            "impressions",
            "unique",
            "chanel",
            "years",
            "female",
            "male",
            "engage",
            "players",
          ];

          const iconName = icons[i] ?? "impressions";
          const numeric = card.value.replace(/[^\d.,]/g, "");
          const suffix = card.value.replace(/[\d.,]/g, "");

          return (
            <div key={i} className="audience-mobile-card">
              <div className="audience-mobile-header">
                <h5 className="mb-0">{card.label}</h5>
                <img
                  src={`/assets/images/icon/${iconName}.png`}
                  alt={card.label}
                  className="about-four__icon"
                />
              </div>

              <h2 className="audience-mobile-number">
                <span className="count">{numeric}</span>
                {suffix}
              </h2>

              <p className="fs-16 mt-2 audience-mobile-text">{card.text}</p>
            </div>
          );
        })}
    </div>
  </div>
</section>
{/* Audience area end here */}


        {/* Formats area start here */}
        <section id="formats" className="service-area sub-bg pt-120 pb-120">
          <div className="service__shape1 sway__animationX">
            <img src="/assets/images/shape/service-shape1.png" alt="shape" />
          </div>

          <div className="service__shape2 sway_Y__animationY">
            <img src="/assets/images/shape/service-shape2.png" alt="shape" />
          </div>

          <div className="container mt-80">
            <div className="row g-4">
              {/* Coluna do título / texto / botão */}
              <div className="col-xl-4 col-md-6">
                <div className="section-header line-title">
                  <h2 className="fw-600 splt-txt wow" data-splitting>
                    {t.formats.tag}{" "}
                    <span>
                      {t.formats.title}{" "}
                      <img
                        src="/assets/images/shape/title-line-service.png"
                        alt="shape"
                      />
                    </span>
                  </h2>

                  <p
                    className="wow fadeInUp"
                    data-wow-delay="400ms"
                    data-wow-duration="1500ms"
                  >
                    {t.formats.subtitle}
                  </p>

                  <a
                    className="btn-one active wow fadeInUp mt-40"
                    data-wow-delay="600ms"
                    data-wow-duration="1500ms"
                    href="#contacts"
                  >
                    {t.formats.buttonMoreFormats}
                    <span>
                      <i className="fa-regular fa-arrow-up-right arry1"></i>
                      <i className="fa-regular fa-arrow-up-right arry2"></i>
                    </span>
                  </a>
                </div>
              </div>

              {/* Colunas dos formatos */}
              {t.formats.list.map((item, i) => {
                const icons = [
                  "format1",
                  "format2",
                  "format3",
                  "format4",
                  "format5",
                ];
                const iconName = icons[i] ?? "format1";

                return (
                  <div key={i} className="col-xl-4 col-md-6">
                    <div className={`service__item ${i === 0 ? "active" : ""}`}>
                      <div className="d-flex align-items-center gap-2">
                        <div className="icon">
                          <img
                            src={`/assets/images/icon/${iconName}.png`}
                            alt={item.title}
                            className="about-four__icon"
                          />
                        </div>
                        <h4 className="splt-txt wow" data-splitting>
                          {item.title}
                        </h4>
                      </div>
                      <p className="mt-20 pb-20 fs-16">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        {/* Formats area end here */}

        {/* Faq area start here */}
        <section id="faqs" className="feature-three-area3 pt-120">
          <div className="feature-three__container3">
            <section className="faq-four-area pb-120">
              <div className="container">
                {/* Títulos */}
                <div className="d-flex flex-wrap mb-80 justify-content-between align-items-end gap-3">
                  <div className="section-header-four">
                    <h5>
                      <span className="title-dot"></span>
                      {t.faq.tag}
                    </h5>
                    <h2 className="fw-300">
                      {t.faq.titleLine1}
                      <br />
                      {t.faq.titleLine2}
                    </h2>
                  </div>

                  <div>
                    <p>{t.faq.intro}</p>
                  </div>
                </div>

                {/* Accordion controlado por React */}
                <div className="faq-four__accordion accordion-two">
                  <div className="accordion" id="accordionFaq">
                    {t.faq.items.map((item, i) => {
                      const isOpen = openIndex === i;

                      return (
                        <div className="accordion-item" key={i}>
                          {/* Pergunta */}
                          <h2 className="accordion-header">
                            <button
                              type="button"
                              className={
                                "accordion-button" +
                                (isOpen ? "" : " collapsed")
                              }
                              onClick={() =>
                                setOpenIndex(isOpen ? null : i)
                              }
                            >
                              {item.question}
                            </button>
                          </h2>

                          {/* Resposta */}
                          <div
                            className={
                              "accordion-collapse" + (isOpen ? " show" : "")
                            }
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            <div className="accordion-body">
                              <p>{item.answer}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
        {/* Faq area end here */}

        {/* Contact area start here */}
        <section id="contacts" className="contact-area pb-120">
          <div className="contact__shape1">
            <img src="assets/images/shape/contact-dots.png" alt="shape" />
          </div>

          <div className="contact__shape2">
            <img src="assets/images/shape/contact-roket.png" alt="shape" />
          </div>

          <div className="container">
            <br />
            <br />
            <br />

            <div className="row g-4 align-items-center justify-content-between">
              {/* LEFT SIDE */}
              <div className="col-lg-5">
                <div className="contact__item-left">
                  <div className="section-header mb-60">
                    <h2 className="fw-300">{t.contact.title}</h2>
                    <p>{t.contact.description}</p>
                  </div>

                  <div className="contact__content">
                    <div className="mb-30">
                      <h5>{t.contact.emailLabel}</h5>
                      <p>{t.contact.email}</p>
                    </div>

                    <div className="mb-30">
                      <h5>{t.contact.addressesLabel}</h5>
                      <p>{t.contact.address1}</p>
                      <p>{t.contact.address2}</p>
                    </div>

                    <div>
                      <h5>{t.contact.hoursLabel}</h5>
                      <p>{t.contact.hoursText}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="col-lg-6">
                <div className="contact__item-right">
                  <div className="contact__item">
                    <h3>{t.contact.formTitle}</h3>

<form onSubmit={handleSubmitContact}>
  {successMsg && (
    <p style={{ color: "green" }}>{successMsg}</p>
  )}
  {errorMsg && (
    <p style={{ color: "red" }}>{errorMsg}</p>
  )}

  <label htmlFor="name">{t.contact.fieldName}</label>
  <input
    id="name"
    type="text"
    placeholder={t.contact.fieldNamePlaceholder}
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />

  <div className="row g-4">
    <div className="col-6">
      <label htmlFor="email">
        {t.contact.fieldEmail}
      </label>
      <input
        id="email"
        type="email"
        placeholder={t.contact.fieldEmailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>

    <div className="col-6">
      <label htmlFor="number">
        {t.contact.fieldPhone}
      </label>
      <input
        id="number"
        type="text"
        placeholder={t.contact.fieldPhonePlaceholder}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
    </div>
  </div>

  <label htmlFor="company-name">
    {t.contact.fieldCompany}
  </label>
  <input
    id="company-name"
    type="text"
    placeholder={t.contact.fieldCompanyPlaceholder}
    value={company}
    onChange={(e) => setCompany(e.target.value)}
  />

  <label htmlFor="message">
    {t.contact.fieldMessage}
  </label>
  <textarea
    id="message"
    placeholder={t.contact.fieldMessagePlaceholder}
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    required
  ></textarea>

  {/* 🔐 Cloudflare Turnstile */}
  <div
    className="cf-turnstile"
    data-sitekey="0x4AAAAAACDZ8t7vPgpjrGNf"
    data-callback="onTurnstileSuccess"
  ></div>

  <button
    type="submit"
    className="btn-three mt-50"
    disabled={isSending}
    style={{
      cursor: isSending ? "not-allowed" : "pointer",
    }}
  >
    {isSending ? "Enviando..." : t.contact.button}
    <i className="fa-regular fa-arrow-right"></i>
  </button>
</form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Contact area end here */}

        {/* Footer area start here */}
        <footer className="footer-area secondary-bg pt-120">
          <div className="container">
            <div className="footer__wrp pb-60">
              {/* COLUNA 1 – LOGO + TEXTO + REDES */}
              <div className="footer__item footer-about">
                <a className="logo mb-4" href="/">
                  <img
                    src="/assets/images/logo/logo-mix.svg"
                    alt="logo"
                  />
                </a>

                <p>{t.footer.aboutText}</p>

                <div className="social-icons mt-20">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {/* SVG 1 */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M23.9982 23.9997V15.2098C23.9982 10.8898 23.0682 7.58984 18.0282 7.58984C15.5982 7.58984 13.9782 8.90983 13.3182 10.1698H13.2582V7.97984H8.48828V23.9997H13.4682V16.0498C13.4682 13.9498 13.8582 11.9398 16.4382 11.9398C18.9882 11.9398 19.0182 14.3098 19.0182 16.1698V23.9697H23.9982V23.9997Z"
                        fill="white"
                      />
                      <path
                        d="M0.390625 7.97949H5.37059V23.9994H0.390625V7.97949Z"
                        fill="white"
                      />
                      <path
                        d="M2.87998 0C1.28999 0 0 1.28999 0 2.87998C0 4.46997 1.28999 5.78996 2.87998 5.78996C4.46997 5.78996 5.75996 4.46997 5.75996 2.87998C5.75996 1.28999 4.46997 0 2.87998 0Z"
                        fill="white"
                      />
                    </svg>
                  </a>

                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {/* SVG 2 */}
                    <svg
                      width="24"
                      height="20"
                      viewBox="0 0 24 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.3171 2.3697C18.7874 1.66784 17.1471 1.15072 15.4319 0.854514C15.4007 0.848796 15.3695 0.863092 15.3534 0.891639C15.1424 1.26687 14.9088 1.75634 14.7451 2.14109C12.9005 1.8649 11.0652 1.8649 9.25836 2.14109C9.09468 1.74781 8.85252 1.26687 8.6406 0.891639C8.62452 0.86403 8.5933 0.849733 8.56208 0.854514C6.84796 1.14973 5.20761 1.66686 3.67696 2.3697C3.66369 2.37542 3.65235 2.38494 3.6448 2.39731C0.533426 7.04567 -0.318949 11.5798 0.0991759 16.0577C0.101051 16.0796 0.113379 16.1005 0.130395 16.1138C2.18319 17.6214 4.17172 18.5366 6.12327 19.1432C6.15449 19.1527 6.18758 19.1413 6.20746 19.1156C6.66908 18.4852 7.0806 17.8205 7.43343 17.1214C7.45424 17.0805 7.43436 17.0319 7.3918 17.0157C6.73907 16.7681 6.11755 16.4662 5.51966 16.1234C5.47236 16.0958 5.46857 16.0281 5.51211 15.9957C5.63793 15.9015 5.76379 15.8034 5.88393 15.7043C5.90568 15.6862 5.93596 15.6824 5.9615 15.6938C9.88925 17.4871 14.1415 17.4871 18.0229 15.6938C18.0485 15.6815 18.0787 15.6853 18.1014 15.7033C18.2216 15.8024 18.3474 15.9014 18.4742 15.9957C18.5177 16.0281 18.5148 16.0957 18.4676 16.1233C17.8697 16.4728 17.2482 16.7681 16.5945 17.0147C16.5519 17.0309 16.533 17.0804 16.5538 17.1214C16.9143 17.8194 17.3258 18.4842 17.7789 19.1146C17.7978 19.1413 17.8318 19.1527 17.8631 19.1432C19.8241 18.5366 21.8126 17.6213 23.8654 16.1138C23.8834 16.1005 23.8948 16.0805 23.8966 16.0586C24.3971 10.8816 23.0585 6.38469 20.3482 2.3982C20.3416 2.38494 20.3303 2.37542 20.3171 2.3697ZM8.02007 13.3311C6.83755 13.3311 5.86316 12.2455 5.86316 10.9122C5.86316 9.57884 6.81861 8.49322 8.02007 8.49322C9.23089 8.49322 10.1959 9.5884 10.1769 10.9122C10.1769 12.2455 9.22143 13.3311 8.02007 13.3311ZM15.9948 13.3311C14.8123 13.3311 13.8379 12.2455 13.8379 10.9122C13.8379 9.57884 14.7934 8.49322 15.9948 8.49322C17.2056 8.49322 18.1706 9.5884 18.1517 10.9122C18.1517 12.2455 17.2057 13.3311 15.9948 13.3311Z"
                        fill="white"
                      />
                    </svg>
                  </a>

                  <a
                    href="https://telegram.org"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {/* SVG 3 */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.2339 10.1624L22.9764 0H20.9047L13.3137 8.82384L7.2507 0H0.257812L9.42618 13.3432L0.257812 24H2.3296L10.3459 14.6817L16.7489 24H23.7418L14.2334 10.1624H14.2339ZM11.3963 13.4608L10.4674 12.1321L3.0761 1.55961H6.25825L12.2231 10.0919L13.1521 11.4206L20.9057 22.5113H17.7235L11.3963 13.4613V13.4608Z"
                        fill="white"
                      />
                    </svg>
                  </a>

                  <a
                    href="https://whatsapp.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {/* SVG 4 */}
                    <svg
                      width="24"
                      height="20"
                      viewBox="0 0 24 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.41718 13.1809L9.02018 18.7649C9.58818 18.7649 9.83418 18.5209 10.1292 18.2279L12.7922 15.6829L18.3102 19.7239C19.3222 20.2879 20.0352 19.9909 20.3082 18.7929L23.9302 1.82092L23.9312 1.81992C24.2522 0.323917 23.3902 -0.261083 22.4042 0.105917L1.11418 8.25692C-0.338822 8.82092 -0.316822 9.63092 0.867178 9.99792L6.31018 11.6909L18.9532 3.77992C19.5482 3.38592 20.0892 3.60392 19.6442 3.99792L9.41718 13.1809Z"
                        fill="white"
                      />
                    </svg>
                  </a>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {/* SVG 5 */}
                    <svg
                      width="14"
                      height="24"
                      viewBox="0 0 14 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.85941 24V13.0533H12.5323L13.0833 8.78588H8.85941V6.06176C8.85941 4.82664 9.20099 3.98492 10.9742 3.98492L13.232 3.98399V0.167076C12.8415 0.116334 11.5012 0 9.94123 0C6.68371 0 4.45356 1.98836 4.45356 5.63912V8.78588H0.769531V13.0533H4.45356V24H8.85941Z"
                        fill="white"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              {/* COLUNA 2 – MENU EMPRESA */}
              <div className="footer__item">
                <h3>{t.footer.menuEmpresaTitle}</h3>
                <ul>
                  <li>
                    <a href="#about">{t.footer.menuEmpresa.about}</a>
                  </li>
                  <li>
                    <a href="#solutions">
                      {t.footer.menuEmpresa.services}
                    </a>
                  </li>
                  <li>
                    <a href="#formats">
                      {t.footer.menuEmpresa.formats}
                    </a>
                  </li>
                  <li>
                    <a href="#faqs">{t.footer.menuEmpresa.faq}</a>
                  </li>
                </ul>
              </div>

              {/* COLUNA 3 – MENU JURÍDICO */}
              <div className="footer__item">
                <h3>{t.footer.menuJuridicoTitle}</h3>
                <ul>
                  <li>
                    <a href="/termos.html">
                      {t.footer.menuJuridico.termos}
                    </a>
                  </li>
                  <li>
                    <a href="/privacidade.html">
                      {t.footer.menuJuridico.privacidade}
                    </a>
                  </li>
                  <li>
                    <a href="/cookies.html">
                      {t.footer.menuJuridico.cookies}
                    </a>
                  </li>
                  <li>
                    <a href="/etica.html">
                      {t.footer.menuJuridico.etica}
                    </a>
                  </li>
                </ul>
              </div>

              {/* COLUNA 4 – NEWSLETTER */}
              <div className="footer__item footer-subscribe">
                <h3>{t.footer.subscribeTitle}</h3>
                <div className="subscribe-feild">
                  <input
                    type="text"
                    placeholder={t.footer.subscribePlaceholder}
                  />
                  <button>
                    <i className="fa-light fa-arrow-up-right"></i>
                  </button>
                </div>

                <div className="form-check mt-20">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    defaultChecked
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    {t.footer.subscribeCheckboxText}
                  </label>
                </div>
              </div>
            </div>

            {/* COPYRIGHT */}
            <div className="footer__copyright">
              <p>{t.footer.copyright}</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  width="14"
                  height="18"
                  viewBox="0 0 14 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6309 2.55094C10.3989 1.33583 8.75455 0.666626 7.00066 0.666626C5.24674 0.666626 3.60236 1.33583 2.37036 2.55094C0.0779159 4.812 -0.280968 7.52721 1.30371 10.621C2.6035 13.1587 4.94433 15.4671 6.65356 17.1527L6.72063 17.2189C6.79799 17.2951 6.89931 17.3333 7.00066 17.3333C7.10202 17.3333 7.20341 17.2951 7.2807 17.2189L7.3479 17.1526C9.05707 15.467 11.3979 13.1585 12.6976 10.6209C14.2823 7.52714 13.9234 4.812 11.6309 2.55094ZM11.9907 10.2687C10.8001 12.5932 8.64884 14.7628 7.00066 16.3902C5.35252 14.7628 3.20123 12.5931 2.01069 10.2688C0.577693 7.47102 0.878523 5.12721 2.93047 3.10338C4.05263 1.99661 5.52665 1.44319 7.00063 1.44319C8.47465 1.44319 9.94866 1.99657 11.0708 3.10338C13.1227 5.12717 13.4236 7.47099 11.9907 10.2687ZM7.00063 4.6314C5.39641 4.6314 4.09125 5.91871 4.09125 7.501C4.09125 9.08329 5.39641 10.3706 7.00063 10.3706C8.60488 10.3706 9.91005 9.08329 9.91005 7.501C9.91005 5.91871 8.60491 4.6314 7.00063 4.6314ZM7.00063 9.58935C5.83315 9.58935 4.88334 8.65253 4.88334 7.501C4.88334 6.34947 5.83315 5.41265 7.00063 5.41265C8.16814 5.41265 9.11796 6.34947 9.11796 7.501C9.11796 8.65253 8.16814 9.58935 7.00063 9.58935Z"
                    fill="white"
                    fillOpacity="0.7"
                  />
                </svg>
                {t.footer.addressLink}
              </a>
            </div>
          </div>
        </footer>
        {/* Footer area end here */}

        {/* Back to top btn area start here */}
        <button id="back-top" className="btn-backToTop">
          <i className="fa-solid fa-chevron-up"></i>
        </button>
        {/* Back to top btn area end here */}
      </main>

      {/* Scripts externos */}
      <Script
  src="https://challenges.cloudflare.com/turnstile/v0/api.js"
  strategy="afterInteractive"
  async
  defer
/>
      <Script
        src="/assets/js/jquery-3.7.1.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/bootstrap.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/meanmenu.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/swiper-bundle.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/jquery.counterup.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/parallax.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/wow.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/magnific-popup.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/nice-select.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/isotope.pkgd.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/jquery.waypoints.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/splitting.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/gsap/gsap.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/gsap/ScrollTrigger.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/gsap/ScrollSmoother.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/custom-gsap.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/js/script.js"
        strategy="afterInteractive"
      />
    </>
  );
}
