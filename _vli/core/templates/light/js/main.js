document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothAnchorScroll();
  initCarousel();
  initPlantTabs();
  initLeadForm();
});

function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const panel = document.getElementById('mobile-menu-panel');
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    toggle.classList.toggle('is-open', open);
    panel.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setOpen(!panel.classList.contains('is-open'));
  });

  panel.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) setOpen(false);
  }, { passive: true });
}

function initSmoothAnchorScroll() {
  const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  if (!anchorLinks.length) return;

  function easeInOutPlume(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function getHeaderOffset() {
    const header = document.querySelector('header[role="banner"]');
    return header ? header.offsetHeight + 24 : 24;
  }

  function animateScrollTo(targetY) {
    if (window.innerWidth < 768) {
      window.scrollTo(0, targetY);
      return;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = Math.min(1800, Math.max(900, Math.abs(distance) * 0.75));
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutPlume(progress);
      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();

      const targetY = Math.max(
        0,
        window.scrollY + target.getBoundingClientRect().top - getHeaderOffset()
      );

      animateScrollTo(targetY);
      window.history.replaceState(null, '', hash);
    });
  });
}

function initCarousel() {
  const track = document.getElementById('carousel-track');
  const viewport = document.getElementById('carousel-viewport');
  const prevButton = document.getElementById('prevSlide');
  const nextButton = document.getElementById('nextSlide');
  const dotsContainer = document.getElementById('carousel-dots');
  const slides = Array.from(track?.children || []);

  if (!track || !viewport || !prevButton || !nextButton || !dotsContainer || !slides.length) return;

  let currentIndex = 0;

  const getVisibleSlides = () => (window.innerWidth >= 768 ? 3 : 1);
  const getMaxIndex = () => Math.max(0, slides.length - getVisibleSlides());

  function renderDots() {
    const positions = getMaxIndex() + 1;
    dotsContainer.innerHTML = '';

    for (let index = 0; index < positions; index += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.dataset.index = String(index);
      dot.setAttribute('aria-label', `Slide ${index + 1}`);
      dot.className = index === currentIndex
        ? 'w-12 h-[2px] bg-primary transition-all duration-300'
        : 'w-8 h-[1px] bg-stone-200 hover:bg-stone-400 transition-all duration-300';

      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });

      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = Array.from(dotsContainer.children);
    dots.forEach((dot, index) => {
      const active = index === currentIndex;
      dot.className = active
        ? 'w-12 h-[2px] bg-primary transition-all duration-300'
        : 'w-8 h-[1px] bg-stone-200 hover:bg-stone-400 transition-all duration-300';
    });
  }

  function updateButtons() {
    const maxIndex = getMaxIndex();
    prevButton.disabled = currentIndex <= 0;
    nextButton.disabled = currentIndex >= maxIndex;
    prevButton.classList.toggle('opacity-40', prevButton.disabled);
    nextButton.classList.toggle('opacity-40', nextButton.disabled);
  }

  function updateCarousel() {
    const maxIndex = getMaxIndex();
    currentIndex = Math.min(currentIndex, maxIndex);

    const currentSlide = slides[currentIndex];
    const offset = currentSlide ? currentSlide.offsetLeft : 0;
    track.style.transform = `translateX(-${offset}px)`;

    const expectedDots = maxIndex + 1;
    if (dotsContainer.children.length !== expectedDots) renderDots();
    updateDots();
    updateButtons();
  }

  nextButton.addEventListener('click', () => {
    currentIndex = Math.min(currentIndex + 1, getMaxIndex());
    updateCarousel();
  });

  prevButton.addEventListener('click', () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    updateCarousel();
  });

  window.addEventListener('resize', updateCarousel, { passive: true });

  renderDots();
  updateCarousel();
}

function initPlantTabs() {
  const tabs = document.querySelectorAll('.plant-tab-btn');
  const panels = document.querySelectorAll('[data-plant-panel]');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.plant;

      tabs.forEach(btn => {
        const active = btn === tab;
        btn.classList.toggle('text-primary', active);
        btn.classList.toggle('border-primary', active);
        btn.classList.toggle('border-b-2', active);
        btn.classList.toggle('text-stone-400', !active);
      });

      panels.forEach(panel => {
        const active = panel.dataset.plantPanel === target;
        panel.classList.toggle('hidden', !active);
        panel.classList.toggle('grid', active);
      });
    });
  });
}

function initLeadForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  const phoneInput = form.querySelector('[name="telefone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', (event) => {
      let value = event.target.value.replace(/\D/g, '').slice(0, 11);
      if (value.length > 6) value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
      else if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      else if (value.length > 0) value = `(${value}`;
      event.target.value = value;
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = form.querySelector('[name="nome"]')?.value.trim();
    const telefone = form.querySelector('[name="telefone"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();

    if (!nome || !telefone) {
      renderFormMessage(form, 'Preencha nome e telefone para continuar.', 'error');
      return;
    }

    const propertyName = document.querySelector('[data-bind="nome"]')?.textContent?.trim() || 'este imovel';
    const whatsappHref = document.querySelector('[data-wpp-link]')?.href;
    const message = `Ola! Meu nome e ${nome}. Tenho interesse em ${propertyName}. Telefone: ${telefone}${email ? ` | Email: ${email}` : ''}`;

    renderFormMessage(form, 'Abrindo WhatsApp para concluir o atendimento.', 'success');

    if (whatsappHref && whatsappHref.startsWith('https://wa.me/')) {
      const url = new URL(whatsappHref);
      url.searchParams.set('text', message);
      window.open(url.toString(), '_blank', 'noopener');
    }

    form.reset();
  });
}

function renderFormMessage(form, text, type) {
  const existing = form.querySelector('.form-message');
  if (existing) existing.remove();

  const msg = document.createElement('div');
  msg.className = 'form-message text-center text-sm';
  msg.textContent = text;
  msg.style.cssText = [
    'padding: 0.9rem 1rem',
    'border: 1px solid rgba(0,0,0,0.08)',
    'background: rgba(179, 147, 93, 0.08)',
    'color: #1b1c1c',
    'letter-spacing: 0.04em'
  ].join(';');

  if (type === 'error') {
    msg.style.background = 'rgba(185, 28, 28, 0.08)';
    msg.style.color = '#7f1d1d';
    msg.style.borderColor = 'rgba(185, 28, 28, 0.18)';
  }

  form.appendChild(msg);
  setTimeout(() => msg.remove(), 5000);
}
