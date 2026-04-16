/* ============================================
   MAIN.JS — TEMPLATE VITRINE
   Interações: galeria, FAQ, scroll, form
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initSmoothAnchorScroll();
  initGallery();
  initFAQ();
  initFloatingCTA();
  initScrollAnimations();
  initForm();
  initLightbox();
});

function initMobileMenu() {
  const toggle = document.querySelector('.header-menu-toggle');
  const menu = document.querySelector('.header-mobile-menu');

  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setOpen(!menu.classList.contains('is-open'));
  });

  menu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) setOpen(false);
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

  const getHeaderOffset = () => {
    const header = document.querySelector('.site-header');
    return header ? header.offsetHeight + 24 : 24;
  };

  const animateScrollTo = (targetY) => {
    if (window.innerWidth < 768) {
      window.scrollTo(0, targetY);
      return;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
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
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - getHeaderOffset());
      animateScrollTo(top);
      window.history.replaceState(null, '', hash);
    });
  });
}

/* === HEADER SCROLL === */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 80) {
      header.classList.add('site-header--scrolled');
      header.classList.remove('site-header--transparent');
    } else {
      header.classList.remove('site-header--scrolled');
      header.classList.add('site-header--transparent');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* === GALERIA COM FILTRO === */
function initGallery() {
  const navBtns = document.querySelectorAll('.gallery__nav-btn');
  const items = document.querySelectorAll('.gallery__item');

  if (!navBtns.length) return;

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      navBtns.forEach(b => b.classList.remove('gallery__nav-btn--active'));
      btn.classList.add('gallery__nav-btn--active');

      items.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'todos' || category === filter) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* === FAQ ACCORDION === */
function initFAQ() {
  const questions = document.querySelectorAll('.faq__question');

  questions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq__item');
      const answer = item.querySelector('.faq__answer');
      const isOpen = item.classList.contains('faq__item--open');

      // Fecha todos
      document.querySelectorAll('.faq__item--open').forEach(openItem => {
        openItem.classList.remove('faq__item--open');
        openItem.querySelector('.faq__answer').style.maxHeight = '0';
      });

      // Abre o clicado (se não estava aberto)
      if (!isOpen) {
        item.classList.add('faq__item--open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* === CTA FLUTUANTE === */
function initFloatingCTA() {
  const floatingCTA = document.querySelector('.floating-cta');
  const hero = document.querySelector('.hero');

  if (!floatingCTA || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        floatingCTA.classList.remove('floating-cta--visible');
      } else {
        floatingCTA.classList.add('floating-cta--visible');
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(hero);
}

/* === ANIMAÇÕES NO SCROLL === */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-on-scroll--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* === FORMULÁRIO === */
function initForm() {
  const form = document.querySelector('#lead-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = form.querySelector('[name="nome"]')?.value?.trim();
    const telefone = form.querySelector('[name="telefone"]')?.value?.trim();
    const email = form.querySelector('[name="email"]')?.value?.trim();

    if (!nome || !telefone) {
      showFormMessage('Por favor, preencha nome e telefone.', 'error');
      return;
    }

    // Exibe mensagem de sucesso
    showFormMessage('Obrigado! Entraremos em contato em breve.', 'success');
    form.reset();

    // Aqui você pode adicionar integração com API/webhook
    console.log('Lead capturado:', { nome, telefone, email });
  });

  // Máscara simples de telefone
  const phoneInput = form.querySelector('[name="telefone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.slice(0, 11);
      if (val.length > 6) {
        val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
      } else if (val.length > 2) {
        val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
      } else if (val.length > 0) {
        val = `(${val}`;
      }
      e.target.value = val;
    });
  }
}

function showFormMessage(text, type) {
  const existing = document.querySelector('.form-message');
  if (existing) existing.remove();

  const msg = document.createElement('div');
  msg.className = `form-message form-message--${type}`;
  msg.textContent = text;
  msg.style.cssText = `
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-small);
    text-align: center;
    margin-top: 0.75rem;
    animation: fadeIn 0.3s ease;
    ${type === 'success'
      ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
      : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
    }
  `;

  const form = document.querySelector('#lead-form');
  form.appendChild(msg);

  setTimeout(() => msg.remove(), 5000);
}

/* === LIGHTBOX === */
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox__img');
  const closeBtn = document.querySelector('.lightbox__close');
  const prevBtn = document.querySelector('.lightbox__nav--prev');
  const nextBtn = document.querySelector('.lightbox__nav--next');
  const galleryItems = document.querySelectorAll('.gallery__item img');

  if (!lightbox || !galleryItems.length) return;

  let currentIndex = 0;
  const images = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
    lightbox.classList.add('lightbox--active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
  }

  galleryItems.forEach((item, i) => {
    item.closest('.gallery__item').addEventListener('click', () => openLightbox(i));
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => navigate(-1));
  nextBtn?.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('lightbox--active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

/* === WHATSAPP HELPER === */
function openWhatsApp(phone, message) {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(message || 'Olá! Tenho interesse neste imóvel.');
  window.open(`https://wa.me/55${cleanPhone}?text=${encodedMsg}`, '_blank');
}

/* === CSS ANIMATION KEYFRAME INJECTION === */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);
