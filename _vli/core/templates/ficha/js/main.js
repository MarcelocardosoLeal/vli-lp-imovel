/* ============================================
   MAIN.JS — TEMPLATE FICHA
   Interações: header scroll, galeria, FAQ, form
   ============================================ */

(function () {
  'use strict';

  initMobileMenu();

  /* === HEADER: opacidade ao rolar === */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        header.style.background = 'var(--color-primary-dark)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
      } else {
        header.style.background = 'var(--color-primary)';
        header.style.boxShadow = 'none';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* === GALERIA: toggle "ver mais fotos" === */
  const galleryToggle = document.getElementById('gallery-toggle');
  const galleryExtra = document.getElementById('gallery-extra');
  if (galleryToggle && galleryExtra) {
    galleryToggle.addEventListener('click', () => {
      const isHidden = galleryExtra.classList.contains('hidden');
      galleryExtra.classList.toggle('hidden', !isHidden);
      galleryToggle.textContent = isHidden ? 'Ocultar fotos' : 'Ver mais fotos';
    });
  }

  /* === FAQ: fechar outros ao abrir === */
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item) other.removeAttribute('open');
        });
      }
    });
  });

  /* === FORMULÁRIO: feedback de envio === */
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', e => {
      e.preventDefault();

      const nome = leadForm.querySelector('[name="nome"]');
      const tel = leadForm.querySelector('[name="telefone"]');

      if (!nome || !nome.value.trim()) {
        showToast('Preencha seu nome para continuar.', 'warn');
        nome && nome.focus();
        return;
      }
      if (!tel || !tel.value.trim()) {
        showToast('Informe seu telefone ou WhatsApp.', 'warn');
        tel && tel.focus();
        return;
      }

      const btn = leadForm.querySelector('[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Enviando...';
      }

      /* Simula envio — substitua pela integração real (webhook, API, etc.) */
      setTimeout(() => {
        showToast('Mensagem enviada! Entraremos em contato em breve.', 'ok');
        leadForm.reset();
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Enviar mensagem';
        }
      }, 900);
    });
  }

  /* === SMOOTH SCROLL para âncoras === */
  initSmoothAnchorScroll();

  /* === TOAST === */
  function showToast(msg, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast toast--' + (type || 'ok');
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      background: type === 'warn' ? '#c23152' : '#25d366',
      color: '#fff',
      padding: '0.75rem 1.5rem',
      borderRadius: '6px',
      fontFamily: 'var(--font-body)',
      fontSize: '0.9rem',
      fontWeight: '500',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      zIndex: '9999',
      whiteSpace: 'nowrap',
      animation: 'fadeInUp 0.25s ease',
    });

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

  /* === ANIMAÇÃO DE ENTRADA nas sections === */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll(
      '.numbers__item, .diff-card, .ficha__row, .faq__item'
    ).forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      obs.observe(el);
    });
  }

  function initMobileMenu() {
    const toggle = document.querySelector('.header__menu-toggle');
    const menu = document.querySelector('.header__mobile-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
      toggle.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
    menu.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => setOpen(false));
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) setOpen(false);
    }, { passive: true });
  }

  function initSmoothAnchorScroll() {
    const links = Array.from(document.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;

    const easeInOutPlume = (t) => (
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    );

    const animateScrollTo = (top) => {
      if (window.innerWidth < 768) {
        window.scrollTo(0, top);
        return;
      }

      const startY = window.scrollY;
      const distance = top - startY;
      const duration = Math.min(1800, Math.max(900, Math.abs(distance) * 0.75));
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = easeInOutPlume(progress);
        window.scrollTo(0, startY + distance * eased);
        if (progress < 1) window.requestAnimationFrame(step);
      };

      window.requestAnimationFrame(step);
    };

    links.forEach(link => {
      link.addEventListener('click', e => {
        const hash = link.getAttribute('href');
        if (!hash || hash === '#') return;
        const target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerH - 12);
        animateScrollTo(top);
        window.history.replaceState(null, '', hash);
      });
    });
  }
})();
