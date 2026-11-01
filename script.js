(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progressBar = document.querySelector('.scroll-progress span');
  let progressFrame = 0;
  const updateScrollProgress = () => {
    if (progressFrame) return;
    progressFrame = requestAnimationFrame(() => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      progressBar.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
      progressFrame = 0;
    });
  };
  window.addEventListener('scroll', updateScrollProgress, {passive: true});
  window.addEventListener('resize', updateScrollProgress);
  updateScrollProgress();

  if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.project-visual').forEach(visual => {
      visual.addEventListener('pointermove', event => {
        const bounds = visual.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;
        visual.style.setProperty('--pointer-x', `${x}%`);
        visual.style.setProperty('--pointer-y', `${y}%`);
        visual.classList.add('pointer-active');
      });
      visual.addEventListener('pointerleave', () => visual.classList.remove('pointer-active'));
    });
  }

  if (!reducedMotion && typeof window.ScrollReveal === 'function') {
    const reveal = window.ScrollReveal();
    const revealDefaults = {
      distance: '18px',
      duration: 650,
      easing: 'cubic-bezier(0.5, 0, 0, 1)',
      viewFactor: 0.15,
      reset: false
    };

    reveal.reveal('.hero-copy > *', {...revealDefaults, origin: 'bottom', interval: 90});
    reveal.reveal('.hero-art', {...revealDefaults, origin: 'right', distance: '28px', delay: 180});
    reveal.reveal('.section-kicker, .impact-heading, .section-heading-row', {...revealDefaults, origin: 'bottom'});
    reveal.reveal('.stat-card', {...revealDefaults, origin: 'bottom', interval: 100});
    reveal.reveal('.project-card, .reel-card', {...revealDefaults, origin: 'bottom', interval: 110});
    reveal.reveal('.about-stamp, .about-copy > *', {...revealDefaults, origin: 'bottom', interval: 90});
    reveal.reveal('.timeline-item', {...revealDefaults, origin: 'bottom', interval: 120});
    reveal.reveal('.skill-cloud span, .script-row', {...revealDefaults, origin: 'bottom', interval: 45});
    reveal.reveal('.contact-panel > *', {...revealDefaults, origin: 'bottom', interval: 100});
  } else if (!reducedMotion && document.querySelector('.timeline-item')) {
    console.warn('ScrollReveal did not load; content remains visible without animation.');
  }

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
  }));

  document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    const filter = button.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  }));

  const projects = {
    faiera: {eyebrow:'PERFORMANCE MARKETING · 2025',title:'Faiera — Growth campaign',summary:'Built the marketing function from scratch and executed multi-channel campaigns targeting students and parents, combining audience research, content and performance optimization.',focus:['Marketing function setup and campaign planning','Audience and competitor research','Multi-channel campaign execution','Content planning and 17+ reels'],highlights:['25K+ leads generated','1.2M views and 671K reach','23K link clicks','140K EGP budget managed']},
    noon: {eyebrow:'INFLUENCER MARKETING · 2025—PRESENT',title:'noon — Influencer campaigns',summary:'Managing influencer marketing activity across GCC markets, with a focus on UAE and KSA. The role spans creator selection, campaign planning, briefing, coordination and performance analysis.',focus:['Influencer identification and selection','Briefing and content alignment','Creator communication and relationship management','Campaign execution, reporting and optimization'],highlights:['Campaigns across UAE and KSA','End-to-end campaign lifecycle coordination','Influencer activations and events','Performance insights to inform improvements']},
    gbg: {eyebrow:'CONTENT & VIDEO · 2024—2025',title:'Global Brands Group — Content & storytelling',summary:'Created technology-focused content designed to make complex ideas clear and engaging, contributing across scripting, storyboarding, production and content planning.',focus:['Scriptwriting and storyboarding','Short-form video concepts','End-to-end video production','Content calendar management'],highlights:['10+ scripts and storyboards','9+ videos produced','Tech explainers, interviews and campaign ads','Creative concepts aligned with audience engagement']},
    schneider: {eyebrow:'MARKET RESEARCH · 2023',title:'Schneider Electric — EV market-entry strategy',summary:'A market-entry strategy presentation developed as part of the Marketing & Sales Program, exploring the electric vehicle sector.',focus:['Marketing and sales fundamentals','Market research and sector exploration','Market-entry strategy development'],highlights:['EV-sector strategy presentation','Completed the Marketing & Sales Program']}
  };
  const dialog = document.querySelector('.project-dialog');
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    document.querySelector('#dialog-eyebrow').textContent = project.eyebrow;
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-summary').textContent = project.summary;
    const fill = (selector, items) => {
      const list = document.querySelector(selector); list.replaceChildren();
      items.forEach(item => { const li = document.createElement('li'); li.textContent = item; list.append(li); });
    };
    fill('#dialog-focus', project.focus); fill('#dialog-highlights', project.highlights);
    dialog.showModal();
  }));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.querySelector('#year').textContent = new Date().getFullYear();

  const animateStat = value => {
    const target = Number(value.dataset.count);
    const suffix = value.dataset.suffix || '';
    const decimals = (value.dataset.count.split('.')[1] || '').length;
    const duration = 1100;

    if (reducedMotion) {
      value.textContent = `${target.toFixed(decimals)}${suffix}`;
      return;
    }

    const start = performance.now();
    const update = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      value.textContent = `${(target * eased).toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const statObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible'); statObserver.unobserve(entry.target);
    const value = entry.target.querySelector('[data-count]');
    if (value) animateStat(value);
  }), {threshold:.25});
  document.querySelectorAll('.stat-card').forEach(card => statObserver.observe(card));
})();
