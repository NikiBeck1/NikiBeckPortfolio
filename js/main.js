/* main.js - shared across all pages */

/* ─── Theme picker (runs before DOMContentLoaded for instant restore) ─── */
(function () {
  const THEMES = [
    { id: 'void',   title: 'Void — default dark' },
    { id: 'aurora', title: 'Aurora — blue-green' },
    { id: 'ember',  title: 'Ember — warm rust' },
    { id: 'iris',   title: 'Iris — deep violet' },
    { id: 'mist',   title: 'Mist — cool slate' },
  ];
  const KEY = 'nb-theme';

  function applyTheme(id) {
    document.body.classList.remove(...THEMES.map(t => 'theme-' + t.id));
    if (id !== 'void') document.body.classList.add('theme-' + id);
    document.querySelectorAll('.theme-swatch').forEach(s => {
      s.classList.toggle('is-active', s.dataset.theme === id);
    });
    localStorage.setItem(KEY, id);
  }

  /* Restore saved theme immediately */
  const saved = localStorage.getItem(KEY) || 'mist';
  if (saved !== 'void') document.body.classList.add('theme-' + saved);

  document.addEventListener('DOMContentLoaded', () => {
    /* Build picker DOM */
    const picker = document.createElement('div');
    picker.className = 'theme-picker';
    picker.setAttribute('aria-label', 'Background theme picker');

    const panel = document.createElement('div');
    panel.className = 'theme-picker__panel';

    THEMES.forEach(({ id, title }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-swatch' + (id === saved ? ' is-active' : '');
      btn.dataset.theme = id;
      btn.setAttribute('aria-label', title);
      btn.setAttribute('title', title);
      btn.addEventListener('click', () => applyTheme(id));
      panel.appendChild(btn);
    });

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'theme-picker__toggle';
    toggle.setAttribute('aria-label', 'Choose background theme');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2"/><circle cx="17.5" cy="10.5" r="2"/><circle cx="8.5" cy="7" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="15" cy="15.5" r="2"/><path d="M2 12c0-5.52 4.48-10 10-10 5.23 0 9.52 3.82 9.98 8.75.13 1.47-.88 2.75-2.35 2.75H17c-1.1 0-2 .9-2 2v2.5c0 1.38-1.12 2.5-2.5 2.5C6.22 20.5 2 16.78 2 12z"/></svg>';

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = picker.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', (e) => {
      if (!picker.contains(e.target)) {
        picker.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    picker.appendChild(panel);
    picker.appendChild(toggle);
    document.body.appendChild(picker);
  });
}());

document.addEventListener('DOMContentLoaded', () => {

  /* Scroll-reveal (Tier 2 animation) */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    /* Fallback: just show everything */
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* Mark active nav link */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* Image lightbox (all pages) */
  const imageSlots = document.querySelectorAll('.img-slot');

  if (imageSlots.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.setAttribute('aria-hidden', 'true');

    const panel = document.createElement('div');
    panel.className = 'image-lightbox__panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Enlarged image viewer');

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'image-lightbox__close';
    closeBtn.setAttribute('aria-label', 'Close enlarged image');
    closeBtn.textContent = 'x';

    const lightboxImg = document.createElement('img');
    lightboxImg.className = 'image-lightbox__img';
    lightboxImg.src = '';
    lightboxImg.alt = '';

    panel.appendChild(closeBtn);
    panel.appendChild(lightboxImg);
    lightbox.appendChild(panel);
    document.body.appendChild(lightbox);

    const openLightbox = (src, alt) => {
      lightboxImg.src = src;
      lightboxImg.alt = alt || 'Enlarged image';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      document.body.classList.remove('lightbox-open');
    };

    imageSlots.forEach(slot => {
      const img = slot.querySelector('img');
      if (!img) return;

      if (slot.querySelector('.img-enlarge-btn')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'img-enlarge-btn';
      btn.textContent = 'Enlarge';
      btn.setAttribute('aria-label', 'Enlarge ' + (img.alt || 'image'));

      btn.addEventListener('click', () => openLightbox(img.currentSrc || img.src, img.alt));
      slot.appendChild(btn);
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

});
