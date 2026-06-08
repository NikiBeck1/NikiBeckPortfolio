/* main.js - shared across all pages */

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
