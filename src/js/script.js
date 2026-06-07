document.addEventListener('DOMContentLoaded', () => {

  /* ══ NAVBAR SCROLL EFFECT ══ */
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ══ SMOOTH SCROLL WITH OFFSET ══ */
  const NAV_H = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_H - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ══ MOBILE BURGER MENU ══ */
  const burger = document.getElementById('burgerBtn');
  const mMenu  = document.getElementById('mobileMenu');
  let menuOpen = false;

  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mMenu.classList.toggle('open', menuOpen);
    burger.setAttribute('aria-label', menuOpen ? 'Fechar menu' : 'Abrir menu');
    burger.innerHTML = menuOpen
      ? `<svg viewBox="0 0 22 22" fill="none"><path d="M5 5l12 12M17 5L5 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
      : `<svg viewBox="0 0 22 22" fill="none"><path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  });

  document.querySelectorAll('.mob-link, .nav-mobile .btn-nav').forEach(a => {
    a.addEventListener('click', () => {
      menuOpen = false;
      mMenu.classList.remove('open');
      burger.setAttribute('aria-label', 'Abrir menu');
      burger.innerHTML = `<svg viewBox="0 0 22 22" fill="none"><path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    });
  });

  /* ══ SERVICES CAROUSEL ══ */
  const slides = [...document.querySelectorAll('.c-slide')];
  const dotsEl = document.getElementById('cDots');
  let cur = 0;
  let timer;

  if (slides.length > 0 && dotsEl) {
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Ir para serviço ' + (i + 1));
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    });

    function goTo(n) {
      slides[cur].classList.remove('active');
      dotsEl.children[cur].classList.remove('active');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('active');
      dotsEl.children[cur].classList.add('active');
      clearInterval(timer);
      timer = setInterval(() => goTo(cur + 1), 5500);
    }

    document.getElementById('prevBtn')?.addEventListener('click', () => goTo(cur - 1));
    document.getElementById('nextBtn')?.addEventListener('click', () => goTo(cur + 1));
    timer = setInterval(() => goTo(cur + 1), 5500);
  }

  /* ══ INTERSECTION OBSERVER (REVEAL) ══ */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  /* ══ FORM SUBMIT TO WHATSAPP ══ */
  document.getElementById('submitBtn')?.addEventListener('click', () => {
    const name    = document.getElementById('fname').value.trim();
    const email   = document.getElementById('femail').value.trim();
    const service = document.getElementById('fservice').value;
    const msg     = document.getElementById('fmsg').value.trim();

    if (!name || !email) {
      alert('Por favor, preencha pelo menos nome e e-mail.');
      return;
    }

    const waMsg = encodeURIComponent(
      `Olá! Me chamo ${name}.\n\nTenho interesse em: ${service || 'conhecer os serviços'}.\n\n${msg ? 'Mensagem: ' + msg : ''}\n\nE-mail para retorno: ${email}`
    );

    // Corrigido para incluir o nono dígito correto (99380)
    window.open('https://wa.me/5571993808070?text=' + waMsg, '_blank');
  });

  /* ══ ACTIVE NAV HIGHLIGHT ══ */
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');

  const onScroll = () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - NAV_H - 60) current = s.id;
    });
    navAs.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--tp)' : '';
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

});