/* ============================================
   MAIN.JS — TEMPLATE BAIRRO
   Header scroll · Carousel · FAQ · Form · Animações
   ============================================ */

(function () {
  'use strict';

  initMobileMenu();
  initCarousel();
  initFAQ();
  initForm();
  initScrollAnimations();

  /* === HEADER: fundo ao rolar === */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        header.style.background = 'var(--color-primary-dark)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.25)';
      } else {
        header.style.background = 'var(--color-primary)';
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  /* === PARALLAX SUAVE no hero === */
  const heroBg = document.querySelector('.hero__bg img');
  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = 'translateY(' + (window.scrollY * 0.25) + 'px)';
    }, { passive: true });
  }

  /* === SMOOTH SCROLL === */
  initSmoothScroll();

  /* ─────────────────────────────────────── */
  /* CAROUSEL                                */
  /* ─────────────────────────────────────── */
  function initCarousel() {
    const carousel = document.querySelector('.galeria__carousel');
    if (!carousel) return;

    const slides  = Array.from(carousel.querySelectorAll('.galeria__slide'));
    const dots    = Array.from(carousel.querySelectorAll('.galeria__dot'));
    const thumbs  = Array.from(document.querySelectorAll('.galeria__thumb'));
    const counter = carousel.querySelector('.galeria__counter');
    const prevBtn = carousel.querySelector('.galeria__prev');
    const nextBtn = carousel.querySelector('.galeria__next');
    const total   = slides.length;
    if (!total) return;

    let current = 0;
    let autoTimer = null;

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current]  && dots[current].classList.remove('is-active');
      thumbs[current] && thumbs[current].classList.remove('is-active');

      current = ((index % total) + total) % total;

      slides[current].classList.add('is-active');
      dots[current]  && dots[current].classList.add('is-active');
      thumbs[current] && thumbs[current].classList.add('is-active');
      if (counter) counter.textContent = (current + 1) + ' / ' + total;
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAuto() { clearInterval(autoTimer); }

    prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); stopAuto(); startAuto(); });
    nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); stopAuto(); startAuto(); });
    dots.forEach((dot, i)   => dot.addEventListener('click', ()   => { goTo(i); stopAuto(); startAuto(); }));
    thumbs.forEach((th, i)  => th.addEventListener('click',  ()   => { goTo(i); stopAuto(); startAuto(); }));

    /* Swipe touch */
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend',   e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 44) { goTo(current + (diff > 0 ? 1 : -1)); stopAuto(); startAuto(); }
    });

    /* Teclado (quando o carousel está em foco) */
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { goTo(current - 1); stopAuto(); startAuto(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); stopAuto(); startAuto(); }
    });

    goTo(0);
    startAuto();
  }

  /* ─────────────────────────────────────── */
  /* FAQ — um aberto por vez                 */
  /* ─────────────────────────────────────── */
  function initFAQ() {
    const items = document.querySelectorAll('.faq__item');
    items.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          items.forEach(other => { if (other !== item) other.removeAttribute('open'); });
        }
      });
    });
  }

  /* ─────────────────────────────────────── */
  /* FORMULÁRIO                              */
  /* ─────────────────────────────────────── */
  function initForm() {
    const form = document.getElementById('lead-form');
    if (!form) return;

    /* Se o form tem action (FormSubmit), deixa submeter normalmente */
    if (form.getAttribute('action') && !form.getAttribute('action').startsWith('#')) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const nome = form.querySelector('[name="nome"]');
      const tel  = form.querySelector('[name="telefone"]');
      if (!nome?.value.trim()) { showToast('Preencha seu nome para continuar.', 'warn'); nome?.focus(); return; }
      if (!tel?.value.trim())  { showToast('Informe seu telefone ou WhatsApp.', 'warn'); tel?.focus();  return; }

      const btn = form.querySelector('[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }

      setTimeout(() => {
        showToast('Mensagem enviada! Entraremos em contato em breve.', 'ok');
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = 'Enviar'; }
      }, 900);
    });
  }

  /* ─────────────────────────────────────── */
  /* ANIMAÇÕES DE ENTRADA                    */
  /* ─────────────────────────────────────── */
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.07 }
    );
    document.querySelectorAll('.resumo__card, .diff-item, .bairro__card, .ficha__item, .faq__item').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = `opacity 0.4s ease ${i * 0.035}s, transform 0.4s ease ${i * 0.035}s`;
      obs.observe(el);
    });
  }

  /* ─────────────────────────────────────── */
  /* TOAST                                   */
  /* ─────────────────────────────────────── */
  function showToast(msg, type) {
    document.querySelector('.toast')?.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed', bottom: '5rem', left: '50%', transform: 'translateX(-50%)',
      background: type === 'warn' ? '#b91c1c' : '#40916c',
      color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px',
      fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: '500',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)', zIndex: '9999', whiteSpace: 'nowrap',
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  /* ─────────────────────────────────────── */
  /* MENU MOBILE                             */
  /* ─────────────────────────────────────── */
  function initMobileMenu() {
    const toggle = document.querySelector('.header__menu-toggle');
    const menu   = document.querySelector('.header__mobile-menu');
    if (!toggle || !menu) return;
    const setOpen = open => {
      toggle.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
    menu.querySelectorAll('a[href^="#"]').forEach(l => l.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 768) setOpen(false); }, { passive: true });
  }

  /* ─────────────────────────────────────── */
  /* SMOOTH SCROLL                           */
  /* ─────────────────────────────────────── */
  function initSmoothScroll() {
    const ease = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const hash = link.getAttribute('href');
        if (!hash || hash === '#') return;
        const target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        const hh   = header ? header.offsetHeight : 0;
        const top  = Math.max(0, target.getBoundingClientRect().top + window.scrollY - hh - 12);
        const from = window.scrollY;
        const dist = top - from;
        const dur  = Math.min(1600, Math.max(700, Math.abs(dist) * 0.7));
        const t0   = performance.now();
        const step = now => {
          const p = Math.min((now - t0) / dur, 1);
          window.scrollTo(0, from + dist * ease(p));
          if (p < 1) requestAnimationFrame(step);
        };
        if (window.innerWidth > 768) requestAnimationFrame(step);
        else window.scrollTo(0, top);
        history.replaceState(null, '', hash);
      });
    });
  }

})();
