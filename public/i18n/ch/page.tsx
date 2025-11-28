'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function Home() {
  // JS do seletor de idioma
useEffect(() => {
  const langToggle = document.getElementById('langToggle');
  const langOptions = document.getElementById('langOptions');

  if (!langToggle || !langOptions) return;

  const handleToggle = () => {
    langOptions.classList.toggle('show');
  };

  const handleOptionsClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const li = target.closest('li');
    if (!li) return;

    const lang = li.getAttribute('data-lang'); // pt, en, es, ch, th
    if (!lang) return;

    const codeEl = li.querySelector('.code') as HTMLElement | null;
    const flagEl = li.querySelector('.flag') as HTMLImageElement | null;

    const selectedCode = codeEl?.textContent || '';
    
    // Atualiza imagem da flag selecionada
    const selectedFlagSrc = flagEl?.getAttribute("src") || "";

    const codeSpan = langToggle.querySelector('.code') as HTMLElement | null;
    const flagImg = langToggle.querySelector('.flag') as HTMLImageElement | null;

    if (codeSpan) codeSpan.textContent = selectedCode;
    if (flagImg && selectedFlagSrc) flagImg.src = selectedFlagSrc;

    // Atualiza rota
    const { pathname, search, hash } = window.location;
    const cleanPath = pathname.replace(/^\/(pt|en|es|ch|th)(?=\/|$)/, '');
    const nextUrl = `/${lang}${cleanPath}${search}${hash}`;

    window.location.href = nextUrl;

    langOptions.classList.remove('show');
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-selector')) {
      langOptions.classList.remove('show');
    }
  };

  langToggle.addEventListener('click', handleToggle);
  langOptions.addEventListener('click', handleOptionsClick);
  document.addEventListener('click', handleClickOutside);

  return () => {
    langToggle.removeEventListener('click', handleToggle);
    langOptions.removeEventListener('click', handleOptionsClick);
    document.removeEventListener('click', handleClickOutside);
  };
}, []);



  // JS do carrossel de imagens .boom-fade-img
  useEffect(() => {
    const imgs = document.querySelectorAll<HTMLImageElement>(
      '.boom-fade-wrapper .boom-fade-img'
    );
    if (!imgs.length) return;

    let index = 0;
    imgs[0].classList.add('active');

    const interval = setInterval(() => {
      const current = imgs[index];
      const nextIndex = (index + 1) % imgs.length;
      const next = imgs[nextIndex];

      current.classList.remove('active');
      next.classList.add('active');

      index = nextIndex;
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
    
<main>

  {/* Preloader area start */}
<div id="loading" className="preloader">
    <div className="loading-overlay"></div>
    <div className="custom-loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>
{/* Preloader area end */}


{/* Top header area start here */}
<div className="header-top d-none d-lg-block">
  <div className="container">
    <div className="header-top-wrp">
      <ul className="info">
        <li>
          <i className="fa-light fa-clock"></i>
          <span className="paragraph-light">
            <span className="text-white">Atendimento:</span>
            {" "}
            Segunda - Sexta, 10am - 05pm
          </span>
        </li>
      </ul>

      <div className="right-info">
        <ul className="site-link">
          <li>
            <a href="mailto:hello@boom.ag">hello@boom.ag</a>
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
      <a className="logo" href="/">
        <img src="/assets/images/logo/logo.svg" alt="Boom logo" />
      </a>

      <div className="main-menu">
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#diferencials">Diferenciais</a></li>
            <li><a href="#about">Sobre Nós</a></li>
            <li><a href="#solutions">Soluções</a></li>
            <li><a href="#audience">Alcance</a></li>
            <li><a href="#formats">Formatos</a></li>
            <li><a href="#faqs">Faq</a></li>
            <li><a href="#contacts">Contatos</a></li>

            <li>
<div className="language-selector">
  <button className="lang-current" id="langToggle" type="button">
    <span className="flag">
      <img
        className="flag-img"
        src="/assets/images/br.png"
        alt="EN"
      />
    </span>
    <span className="code">PT</span>
    <img
      className="arrow-img"
      src="/assets/images/arrow.png"
      alt="arrow"
    />
  </button>

  {/* Dropdown – repara que NÃO tem "show" aqui */}
  <ul id="langOptions" className="lang-options">
    <li data-lang="pt">
      <span className="flag">
        <img className="flag-img" src="/assets/images/br.png" alt="PT" />
      </span>
      <span className="code">PT</span>
    </li>
    <li data-lang="en">
      <span className="flag">
        <img className="flag-img" src="/assets/images/usa.png" alt="EN" />
      </span>
      <span className="code">EN</span>
    </li>
    <li data-lang="es">
      <span className="flag">
        <img className="flag-img" src="/assets/images/es.png" alt="ES" />
      </span>
      <span className="code">EN</span>
    </li>
    <li data-lang="cn">
      <span className="flag">
        <img className="flag-img" src="/assets/images/ch.png" alt="CN" />
      </span>
      <span className="code">EN</span>
    </li>
    <li data-lang="th">
      <span className="flag">
        <img className="flag-img" src="/assets/images/th.png" alt="TH" />
      </span>
      <span className="code">EN</span>
    </li>
  </ul>
</div>            </li>
          </ul>
        </nav>
      </div>

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

    <div className="d-none d-lg-block">
      {/* se quiser colocar algo só pra desktop aqui depois */}
    </div>

    <div className="sidebar__btns my-4">
      {/* botões extras do sidebar, se tiver */}
    </div>
  </div>
</div>
{/* Sidebar area end here */}

<div className="ScrollSmoother-content">

    {/* Banner area start here */}
    <section id="home" className="banner-three-area paralax__animation">
      <div className="container">
        <div className="banner-three__content">
          <span
            className="wow splt-txt"
            data-splitting
          >
            ESTRATÉGIA, PARCERIA E RESULTADO.{" "}
            <img
              src="/assets/images/icon/roket.png"
              alt="icon"
            />
          </span>

          <h1
            className="wow fadeInUp"
            data-wow-delay="400ms"
            data-wow-duration="1500ms"
          >
            Hub pioneiro em mídia de performance para o público gamer.
          </h1>

          <p
            className="wow fadeInUp"
            data-wow-delay="600ms"
            data-wow-duration="1500ms"
          >
            Através de dados proprietários, clusterização gamer e tecnologia de
            performance, geramos aquisição, conversão e impacto de negócio, com
            total previsibilidade e mensuração.
          </p>

          <div
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
              placeholder="Insira sua URL"
            />
            <button>Gere Resultados Agora</button>
          </div>
        </div>

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

          {/*
          <img className="kit1" data-depth="0.03" src="/assets/images/tiktok.png" alt="image" />
          <img className="kit2" data-depth="0.1" src="/assets/images/youtube.png" alt="image" />
          <img className="kit3" data-depth="0.05" src="/assets/images/instagram.png" alt="image" />
          */}
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
              <div className="marquee__item"><img src="/assets/images/brand/1.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/2.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/3.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/4.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/5.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/6.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/7.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/8.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/9.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/10.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/12.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/14.png" /></div>
            </div>

            {/* DUPLICAÇÃO AUTOMÁTICA PARA O LOOP */}
            <div className="marquee__item-wrp">
              <div className="marquee__item"><img src="/assets/images/brand/1.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/2.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/3.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/4.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/5.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/6.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/7.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/8.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/9.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/10.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/12.png" /></div>
              <div className="marquee__item"><img src="/assets/images/brand/14.png" /></div>
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
          PORQUE ESCOLHER A BOOM
        </h5>
        <h2 className="fw-600 wow splt-txt" data-splitting>
          O Que Nos Torna Diferentes?
        </h2>
      </div>

      <p
        className="wow fadeInUp"
        data-wow-delay="200ms"
        data-wow-duration="1500ms"
      >
        Campanhas rápidas, decisões precisas e foco total em conversão, FTD e crescimento.
      </p>
    </div>

    <div className="row g-5">
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
          <h3 className="mt-20 mb-1">Performance Max</h3>
          <p>Você não compra mídia, você investe em resultados.</p>
        </div>
      </div>

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
          <h3 className="mt-20 mb-1">Otimização Diária</h3>
          <p>Ajustes constantes para extrair o máximo do investimento.</p>
        </div>
      </div>

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
          <h3 className="mt-20 mb-1">Execução Rápida</h3>
          <p>Campanhas ativas em poucos dias, com testes imediatos.</p>
        </div>
      </div>

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
          <h3 className="mt-20 mb-1">Crescimento Real</h3>
          <p>Estratégias guiadas por dados para escalar com eficiência.</p>
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
              QUEM SOMOS
            </h5>

            <h2 className="fw-600 wow splt-txt" data-splitting>
              Impulsionando marcas com performance real
            </h2>

            <p
              className="wow fadeInUp"
              data-wow-delay="200ms"
              data-wow-duration="1500ms"
            >
              Somos o primeiro hub de performance totalmente especializado no
              público gamer, e-sports e cultura digital. Trazemos 18 anos de
              experiência acumulada em marketing de alta performance, combinando
              dados, tecnologia e uma segmentação proprietária que entende como o
              gamer pensa, joga e consome.
              <br /><br />
              Nossa missão é ampliar sua presença, engajar sua comunidade e
              transformar atenção em ação, educando, nutrindo e empoderando cada
              usuário ao longo da jornada.
              <br /><br />
              Cada clique, lead e conversão representa um avanço concreto, com
              métricas claras, impacto real e resultados que impulsionam o seu
              negócio de forma consistente e mensurável.
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
      <div className="section-header text-center">
        <h5 className="wow splt-txt" data-splitting>
          NOSSAS SOLUÇÕES
        </h5>
      </div>

      <div className="section-header text-center mb-80">
        <h2 className="fw-600 splt-txt wow" data-splitting>
          Performance Para Crescer <br />
          No Universo Digital.
        </h2>
      </div>

      <div className="row g-4">
        <div
          className="col-lg-6 wow bounceInUp"
          data-wow-delay="200ms"
          data-wow-duration="3000ms"
        >
          <div className="service-two__item bg1">
            <div className="icon">
              <img
                src="/assets/images/icon/service-icon1.png"
                alt="icon"
              />
            </div>
            <div className="service-two__content">
              <h3 className="mb-10">Performance Media</h3>
              <p className="mb-20">
                Planejamento e otimização de campanhas para alcançar, engajar e
                converter pessoas nas principais plataformas.
              </p>
            </div>
          </div>
        </div>

        <div
          className="col-lg-6 wow bounceInUp"
          data-wow-delay="300ms"
          data-wow-duration="3000ms"
        >
          <div className="service-two__item bg2">
            <div className="icon">
              <img
                src="/assets/images/icon/service-icon2.png"
                alt="icon"
              />
            </div>
            <div className="service-two__content">
              <h3 className="mb-10">Growth &amp; Aquisição</h3>
              <p className="mb-20">
                Estratégias orientadas a métricas de crescimento: aquisição,
                retenção e monetização.
              </p>
            </div>
          </div>
        </div>

        <div
          className="col-lg-6 wow bounceInUp"
          data-wow-delay="400ms"
          data-wow-duration="3000ms"
        >
          <div className="service-two__item bg3">
            <div className="icon">
              <img
                src="/assets/images/icon/service-icon3.png"
                alt="icon"
              />
            </div>
            <div className="service-two__content">
              <h3 className="mb-10">Geração de Leads</h3>
              <p className="mb-20">
                Captação e nutrição de leads qualificados dentro do ecossistema
                gamer e digital de forma estruturada e escalável.
              </p>
            </div>
          </div>
        </div>

        <div
          className="col-lg-6 wow bounceInUp"
          data-wow-delay="500ms"
          data-wow-duration="3000ms"
        >
          <div className="service-two__item bg4">
            <div className="icon">
              <img
                src="/assets/images/icon/service-icon4.png"
                alt="icon"
              />
            </div>
            <div className="service-two__content">
              <h3 className="mb-10">Creator Performance</h3>
              <p className="mb-20">
                Ativação com creators, streamers, casters e influenciadores com
                modelo de performance.
              </p>
            </div>
          </div>
        </div>

        <div
          className="col-lg-6 wow bounceInUp"
          data-wow-delay="600ms"
          data-wow-duration="3000ms"
        >
          <div className="service-two__item bg5">
            <div className="icon">
              <img
                src="/assets/images/icon/service-icon5.png"
                alt="icon"
              />
            </div>
            <div className="service-two__content">
              <h3 className="mb-10">Inteligência &amp; Dados</h3>
              <p className="mb-20">
                Clusterização proprietária (Gamer Behavioral Stack™),
                construção de audiências e painel com KPIs growth/ROAS.
              </p>
            </div>
          </div>
        </div>

        <div
          className="col-lg-6 wow bounceInUp"
          data-wow-delay="700ms"
          data-wow-duration="3000ms"
        >
          <div className="service-two__item bg6">
            <div className="icon">
              <img
                src="/assets/images/icon/service-icon6.png"
                alt="icon"
              />
            </div>
            <div className="service-two__content">
              <h3 className="mb-10">Transmissões Ao Vivo</h3>
              <p className="mb-20">
                Conteúdos dinâmicos, produção impecável e entregas que conectam,
                engajam e convertem em tempo real.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>
{/* Services area end here */}

{/* Audience area start here */}
<section id="audience" className="feature-three-area2 pt-120">
  <div className="feature-three__container2">
    <div className="d-flex flex-wrap mb-80 justify-content-between align-items-end gap-3">
      <div className="section-header-four">
        <h5 className="wow splt-txt" data-splitting>
          <span className="title-dot"></span>
          NOSSO ALCANCE
        </h5>
        <h2 className="wow splt-txt" data-splitting>
          Audiência Premium
        </h2>
      </div>

      <p
        className="wow fadeInUp"
        data-wow-delay="200ms"
        data-wow-duration="1500ms"
      >
        Solid Strategy aligned with business needs and robust data <br />
        analysis are fundamental ingredients to extract actionable insights.
      </p>
    </div>

    <div className="about-four__wrp pt-60 pb-60">
      <div className="row g-5">
        <div
          className="col-xxl-3 col-md-6 wow bounceInUp"
          data-wow-delay="200ms"
          data-wow-duration="2000ms"
        >
          <div className="about-four__item">
            <h5 className="mb-20">/ Impressões Mensais</h5>
            <div className="d-flex align-items-center justify-content-between gap-4">
              <h2>
                <span className="count">23</span>bi+
              </h2>
              <img
                src="/assets/images/icon/impressions.png"
                alt="Ícone de impressões mensais"
                className="about-four__icon"
              />
            </div>
            <p className="fs-16 mt-2">
              We've brought to life all over 500+ digital projects.
            </p>
          </div>
        </div>

        <div
          className="col-xxl-3 col-md-6 wow bounceInUp"
          data-wow-delay="300ms"
          data-wow-duration="2000ms"
        >
          <div className="about-four__item">
            <h5 className="mb-20">/ Usuários Únicos</h5>
            <div className="d-flex align-items-center justify-content-between gap-4">
              <h2>
                <span className="count">120</span>mi+
              </h2>
              <img
                src="/assets/images/icon/unique.png"
                alt="Ícone de usuários únicos"
                className="about-four__icon"
              />
            </div>
            <p className="fs-16 mt-2">
              Our digital solutions have resonated with over 100,000 clients.
            </p>
          </div>
        </div>

        <div
          className="col-xxl-3 col-md-6 wow bounceInUp"
          data-wow-delay="400ms"
          data-wow-duration="2000ms"
        >
          <div className="about-four__item">
            <h5 className="mb-20">/ Canais Parceiros</h5>
            <div className="d-flex align-items-center justify-content-between gap-4">
              <h2>
                <span className="count">1.3</span>k+
              </h2>
              <img
                src="/assets/images/icon/chanel.png"
                alt="Ícone de canais parceiros"
                className="about-four__icon"
              />
            </div>
            <p className="fs-16 mt-2">
              We've honed our skills to perfection, staying ahead of industry trends.
            </p>
          </div>
        </div>

        <div
          className="col-xxl-3 col-md-6 wow bounceInUp"
          data-wow-delay="500ms"
          data-wow-duration="2000ms"
        >
          <div className="about-four__item">
            <h5 className="mb-20">/ Idade</h5>
            <div className="d-flex align-items-center justify-content-between gap-4">
              <h2>
                <span className="count">70</span>%
              </h2>
              <img
                src="/assets/images/icon/years.png"
                alt="Ícone de faixa etária"
                className="about-four__icon"
              />
            </div>
            <p className="fs-16 mt-2">
              Our team is a powerhouse of creativity, boasting 60+ individuals.
            </p>
          </div>
        </div>

        <div
          className="col-xxl-3 col-md-6 wow bounceInUp"
          data-wow-delay="500ms"
          data-wow-duration="2000ms"
        >
          <div className="about-four__item">
            <h5 className="mb-20">/ Sexo Feminino</h5>
            <div className="d-flex align-items-center justify-content-between gap-4">
              <h2>
                <span className="count">53.2</span>%
              </h2>
              <img
                src="/assets/images/icon/female.png"
                alt="Ícone de público feminino"
                className="about-four__icon"
              />
            </div>
            <p className="fs-16 mt-2">
              Our team is a powerhouse of creativity, boasting 60+ individuals.
            </p>
          </div>
        </div>

        <div
          className="col-xxl-3 col-md-6 wow bounceInUp"
          data-wow-delay="500ms"
          data-wow-duration="2000ms"
        >
          <div className="about-four__item">
            <h5 className="mb-20">/ Sexo Masculino</h5>
            <div className="d-flex align-items-center justify-content-between gap-4">
              <h2>
                <span className="count">46.8</span>%
              </h2>
              <img
                src="/assets/images/icon/male.png"
                alt="Ícone de público masculino"
                className="about-four__icon"
              />
            </div>
            <p className="fs-16 mt-2">
              Our team is a powerhouse of creativity, boasting 60+ individuals.
            </p>
          </div>
        </div>

        <div
          className="col-xxl-3 col-md-6 wow bounceInUp"
          data-wow-delay="500ms"
          data-wow-duration="2000ms"
        >
          <div className="about-four__item">
            <h5 className="mb-20">/ Engajam Marcas</h5>
            <div className="d-flex align-items-center justify-content-between gap-4">
              <h2>
                <span className="count">80.6</span>%
              </h2>
              <img
                src="/assets/images/icon/engage.png"
                alt="Ícone de engajamento com marcas"
                className="about-four__icon"
              />
            </div>
            <p className="fs-16 mt-2">
              Our team is a powerhouse of creativity, boasting 60+ individuals.
            </p>
          </div>
        </div>

        <div
          className="col-xxl-3 col-md-6 wow bounceInUp"
          data-wow-delay="500ms"
          data-wow-duration="2000ms"
        >
          <div className="about-four__item">
            <h5 className="mb-20">/ Jogam Diariamente</h5>
            <div className="d-flex align-items-center justify-content-between gap-4">
              <h2>
                <span className="count">42.7</span>%
              </h2>
              <img
                src="/assets/images/icon/players.png"
                alt="Ícone de jogadores diários"
                className="about-four__icon"
              />
            </div>
            <p className="fs-16 mt-2">
              Our team is a powerhouse of creativity, boasting 60+ individuals.
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>
{/* Audience area end here */}

{/* Formats area start here */}
<section id="formats" className="service-area sub-bg pt-120 pb-120">
    <div className="service__shape1 sway__animationX">
        <img src="assets/images/shape/service-shape1.png" alt="shape" />
    </div>

    <div className="service__shape2 sway_Y__animationY">
        <img src="assets/images/shape/service-shape2.png" alt="shape" />
    </div>

    <div className="container">
        <br />
        <br />

        <div className="row g-4">
            
            <div className="col-xl-4 col-md-6">
                <div className="section-header line-title">
                    <h2 className="fw-600 splt-txt wow" data-splitting>
                        Alguns{" "}
                        <span>
                            Formatos{" "}
                            <img
                                src="assets/images/shape/title-line-service.png"
                                alt="shape"
                            />
                        </span>
                    </h2>

                    <p className="wow fadeInUp" data-wow-delay="400ms" data-wow-duration="1500ms">
                        Our diverse range of services is designed to <br /> cater to the unique needs of our clients
                    </p>

                    <a
                        className="btn-one active wow fadeInUp mt-40"
                        data-wow-delay="600ms"
                        data-wow-duration="1500ms"
                        href="contact.html"
                    >
                        Mais Formatos+
                        <span>
                            <i className="fa-regular fa-arrow-up-right arry1"></i>
                            <i className="fa-regular fa-arrow-up-right arry2"></i>
                        </span>
                    </a>
                </div>
            </div>

            <div className="col-xl-4 col-md-6">
                <div className="service__item active">
                    <div className="d-flex align-items-center gap-2">
                        <div className="icon">
                            <img
                                src="assets/images/icon/format1.png"
                                alt="Ícone de cpc"
                                className="about-four__icon"
                            />
                        </div>
                        <h4 className="splt-txt wow" data-splitting>Custo Por Clique (CPC)</h4>
                    </div>
                    <p className="mt-20 pb-20 fs-16">
                        Geração de tráfego qualificado para landing pages ou sites de campanha.
                    </p>
                </div>
            </div>

            <div className="col-xl-4 col-md-6">
                <div className="service__item">
                    <div className="d-flex align-items-center gap-2">
                        <div className="icon">
                            <img
                                src="assets/images/icon/format2.png"
                                alt="Ícone de cpa"
                                className="about-four__icon"
                            />
                        </div>
                        <h4 className="splt-txt wow" data-splitting>Custo Por Ação (CPA)</h4>
                    </div>
                    <p className="mt-20 pb-20 fs-16">
                        Cada custo é gerado somente quando um usuário realiza a ação final definida.
                    </p>
                </div>
            </div>

            <div className="col-xl-4 col-md-6">
                <div className="service__item">
                    <div className="d-flex align-items-center gap-2">
                        <div className="icon">
                            <img
                                src="assets/images/icon/format3.png"
                                alt="Ícone de cpl"
                                className="about-four__icon"
                            />
                        </div>
                        <h4 className="splt-txt wow" data-splitting>Custo Por Lead (CPL)</h4>
                    </div>
                    <p className="mt-20 pb-20 fs-16">
                        O custo só é aplicado quando um lead válido é gerado no formulário.
                    </p>
                </div>
            </div>

            <div className="col-xl-4 col-md-6">
                <div className="service__item">
                    <div className="d-flex align-items-center gap-2">
                        <div className="icon">
                            <img
                                src="assets/images/icon/format4.png"
                                alt="Ícone de cpm"
                                className="about-four__icon"
                            />
                        </div>
                        <h4 className="splt-txt wow" data-splitting>Custo Por Mil (CPM)</h4>
                    </div>
                    <p className="mt-20 pb-20 fs-16">
                        O valor pago a cada mil visualizações (impressões) do anúncio.
                    </p>
                </div>
            </div>

            <div className="col-xl-4 col-md-6">
                <div className="service__item">
                    <div className="d-flex align-items-center gap-2">
                        <div className="icon">
                            <img
                                src="assets/images/icon/format5.png"
                                alt="Ícone de cpv"
                                className="about-four__icon"
                            />
                        </div>
                        <h4 className="splt-txt wow" data-splitting>Custo Por Venda (CPV)</h4>
                    </div>
                    <p className="mt-20 pb-20 fs-16">
                        O custo só é gerado quando ocorre uma venda validada pelo sistema.
                    </p>
                </div>
            </div>

        </div>
    </div>
</section>
{/* Formats area end here */}

{/* Faq area start here */}
<section id="faqs" className="feature-three-area3 pt-120">
  <div className="feature-three__container3">
    <section className="faq-four-area pb-120">
      <div className="container">
        <div className="d-flex flex-wrap mb-80 justify-content-between align-items-end gap-3">
          <div className="section-header-four">
            <h5>
              <span className="title-dot"></span>
              FAQ
            </h5>
            <h2 className="fw-300">
              Perguntas
              <br />
              Mais Recentes
            </h2>
          </div>
          <div>
            <p>
              Resposta à pergunta mais frequente. Tem mais alguma dúvida? Entre em
              contato conosco e responderemos o mais breve possível.
            </p>
          </div>
        </div>

        <div className="faq-four__accordion accordion-two">
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Como podem acelerar o crescimento da minha empresa?
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    A Boom utiliza estratégia, dados e criatividade de alta performance
                    para acelerar o seu crescimento. Construímos campanhas otimizadas,
                    criativos que realmente convertem e processos de escala contínua.
                    Nosso foco é simples: transformar orçamento em resultado imediato e
                    crescimento sustentável.
                  </p>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Quais resultados posso esperar?
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    Resultados mensuráveis, previsíveis e consistentes. Aumentamos
                    vendas, reduzimos custo por aquisição, ampliamos alcance e criamos
                    estratégias que convertem em todas as etapas do funil. Cada decisão
                    é baseada em dados e otimização diária — sem achismo.
                  </p>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingthree">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapsethree"
                  aria-expanded="false"
                  aria-controls="collapsethree"
                >
                  Vocês assumem toda a operação de marketing digital?
                </button>
              </h2>
              <div
                id="collapsethree"
                className="accordion-collapse collapse"
                aria-labelledby="headingthree"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    Sim. Podemos entrar como sua área completa de Performance, cuidando
                    da mídia, criativos, dados, funil, influenciadores e transmissões ao
                    vivo. Você recebe relatórios claros, KPIs reais e acompanhamento
                    estratégico direto dos nossos especialistas.
                  </p>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingfour">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapsefour"
                  aria-expanded="false"
                  aria-controls="collapsefour"
                >
                  Qual o investimento necessário para começar?
                </button>
              </h2>
              <div
                id="collapsefour"
                className="accordion-collapse collapse"
                aria-labelledby="headingfour"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    Trabalhamos com planos flexíveis para diferentes níveis de operação.
                    Seja uma startup ou uma grande marca, adaptamos investimento,
                    estratégia e velocidade de escala para garantir o melhor
                    custo-performance possível. Não importa o tamanho — importa o
                    resultado.
                  </p>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingfive">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapsefive"
                  aria-expanded="false"
                  aria-controls="collapsefive"
                >
                  Por que tantas marcas escolhem vocês?
                </button>
              </h2>
              <div
                id="collapsefive"
                className="accordion-collapse collapse"
                aria-labelledby="headingfive"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p>
                    Porque entregamos performance de verdade. São mais de 18 anos de
                    experiência, domínio profundo do público gamer e digital, tecnologia
                    própria, criativos de alta conversão e processos refinados ao longo
                    de milhares de campanhas. Não vendemos mídia — entregamos
                    crescimento real.
                  </p>
                </div>
              </div>
            </div>

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
      <div className="col-lg-5">
        <div className="contact__item-left">
          <div className="section-header mb-60">
            <h2 className="fw-300">Adorariamos Ouvir Você!</h2>
            <p>
              Sua opinião é importante! Envie-nos uma mensagem e compartilhe seus pensamentos.
              A AgenShark valoriza seu feedback e aguarda seu contato.
            </p>
          </div>

          <div className="contact__content">
            <div className="mb-30">
              <h5>Nosso E-mail</h5>
              <p>hello@boom.ag</p>
            </div>

            <div className="mb-30">
              <h5>Endereços</h5>
              <p>7345 W SAND LAKE RD, Orlando, 🇺🇸 USA</p>
              <p>AV. COPACABAN 268, Barueri, 🇧🇷 BR</p>
            </div>

            <div>
              <h5>Horário Comercial</h5>
              <p>
                Segunda - Sexta, <br />
                10:00 AM to 05:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="contact__item-right">
          <div className="contact__item">
            <h3>Contact Us</h3>

            <form action="contact.html#">
              <label htmlFor="name">Nome Completo</label>
              <input id="name" type="text" placeholder="Insira seu nome" />

              <div className="row g-4">
                <div className="col-6">
                  <label htmlFor="email">E-mail Corporativo</label>
                  <input id="email" type="text" placeholder="Insira seu e-mail" />
                </div>

                <div className="col-6">
                  <label htmlFor="number">Telefone</label>
                  <input id="number" type="text" placeholder="Insira seu telefone" />
                </div>
              </div>

              <label htmlFor="company-name">Nome da Empresa</label>
              <input id="company-name" type="text" placeholder="Inserir nome empresa" />

              <label htmlFor="massage">Como Podemos Ajudar?</label>
              <textarea
                name="massage"
                id="massage"
                placeholder="Escreva uma mensagem aqui"
              ></textarea>

              <a href="contact.html#0" className="btn-three mt-50">
                Enviar Mensagem
                <i className="fa-regular fa-arrow-right"></i>
              </a>
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
      <div className="footer__item footer-about">
        <a className="logo mb-4" href="index.html">
          <img src="assets/images/logo/logo-mix.svg" alt="logo" />
        </a>
        <p>
          Somos o primeiro hub de performance especializado no público gamer,
          e-sports e cultura digital.
        </p>

        <div className="social-icons mt-20">
          <a href="contact.html#0">
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
              <path d="M0.390625 7.97949H5.37059V23.9994H0.390625V7.97949Z" fill="white" />
              <path
                d="M2.87998 0C1.28999 0 0 1.28999 0 2.87998C0 4.46997 1.28999 5.78996 2.87998 5.78996C4.46997 5.78996 5.75996 4.46997 5.75996 2.87998C5.75996 1.28999 4.46997 0 2.87998 0Z"
                fill="white"
              />
            </svg>
          </a>

          <a href="contact.html#0">
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

          <a href="contact.html#0">
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

          <a href="contact.html#0">
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

          <a href="contact.html#0">
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

      <div className="footer__item">
        <h3>Empresa</h3>
        <ul>
          <li>
            <a href="#about">Sobre Nós</a>
          </li>
          <li>
            <a href="#solutions">Serviços</a>
          </li>
          <li>
            <a href="#formats">Formatos</a>
          </li>
          <li>
            <a href="#faqs">F.A.Q</a>
          </li>
        </ul>
      </div>

      <div className="footer__item">
        <h3>Jurídico</h3>
        <ul>
          <li>
            <a href="termos.html">Termos e Condições</a>
          </li>
          <li>
            <a href="privacidade.html">Política de Privacidade</a>
          </li>
          <li>
            <a href="cookies.html">Política de Cookies</a>
          </li>
          <li>
            <a href="error.html">Ética e Conduta</a>
          </li>
        </ul>
      </div>

      <div className="footer__item footer-subscribe">
        <h3>Inscreva-se Agora</h3>
        <div className="subscribe-feild">
          <input type="text" placeholder="Insira seu e-mail" />
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
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Aceito receber e-mails com novidades e promoções.
          </label>
        </div>
      </div>
    </div>

    <div className="footer__copyright">
      <p>
        &copy; Copyright 2025 <a href="contact.html#0">Boom Games</a>. Llc.
      </p>
      <a href="contact.html#0">
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
        7345 W Sand Lake Rd, Orlando - FL, USA
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
      <Script src="/assets/js/jquery-3.7.1.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/bootstrap.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/meanmenu.js" strategy="afterInteractive" />
      <Script src="/assets/js/swiper-bundle.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/jquery.counterup.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/parallax.js" strategy="afterInteractive" />
      <Script src="/assets/js/wow.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/magnific-popup.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/nice-select.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/isotope.pkgd.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/jquery.waypoints.js" strategy="afterInteractive" />
      <Script src="/assets/js/splitting.js" strategy="afterInteractive" />
      <Script src="/assets/js/gsap/gsap.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/gsap/ScrollTrigger.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/gsap/ScrollSmoother.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/custom-gsap.js" strategy="afterInteractive" />
      <Script src="/assets/js/script.js" strategy="afterInteractive" />
    </>
  );
}