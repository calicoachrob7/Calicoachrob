/* =============================================================
   CALICOACH ROB — Main JS
   Responsibilities:
     - Navbar scroll state
     - Mobile menu toggle
     - Smooth anchor close on mobile menu click
     - Ticker: nahtlose Endlosschleife ohne sichtbaren Reset
   ============================================================= */

(function () {
  'use strict';

  // ── Elements ──────────────────────────────────────────────────
  const navbar     = document.getElementById('navbar');
  const burgerBtn  = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  // ── Calendly Popup ────────────────────────────────────────────
  const CALENDLY_URL = 'https://calendly.com/robertbiller22/30min?hide_event_type_details=1&hide_gdpr_banner=1';

  window.openCalendly = function () {
    if (typeof Calendly !== 'undefined') {
      Calendly.initPopupWidget({ url: CALENDLY_URL });
    }
  };

  // ── Ticker ────────────────────────────────────────────────────
  function initTicker() {
    const track = document.getElementById('tickerTrack');
    if (!track) return;

    const setHTML = track.innerHTML;

    // Breite in einem position:fixed Clone messen — nicht beeinflusst
    // durch overflow:hidden des Elternelements, gibt exakten Float-Wert.
    const probe = track.cloneNode(true);
    probe.removeAttribute('id');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;top:-9999px;left:0;animation:none;pointer-events:none;visibility:hidden;';
    document.body.appendChild(probe);
    const setWidth = probe.getBoundingClientRect().width;
    document.body.removeChild(probe);

    if (!setWidth) return;

    // Clones einfügen bis Track ≥ 4× Viewport — kein DOM-Read im Loop
    const target = window.innerWidth * 4;
    let totalWidth = setWidth;
    while (totalWidth < target) {
      track.insertAdjacentHTML('beforeend', setHTML);
      totalWidth += setWidth;
    }

    // Exakter Float-Wert → kein Subpixel-Versatz beim Reset
    track.style.setProperty('--ticker-distance', '-' + setWidth + 'px');
    track.setAttribute('data-ready', '');
  }

  // Fonts laden → doppeltes rAF stellt sicher dass Layout vollständig ist
  function scheduleTicker() {
    requestAnimationFrame(function () {
      requestAnimationFrame(initTicker);
    });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleTicker);
  } else {
    window.addEventListener('load', scheduleTicker);
  }

  // ── Navbar: add background on scroll ──────────────────────────
  function handleScroll() {
    const scrolled = window.scrollY > 20;
    navbar.classList.toggle('is-scrolled', scrolled);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  // ── Mobile Menu: toggle open/close ────────────────────────────
  function openMenu() {
    burgerBtn.classList.add('is-open');
    mobileMenu.classList.add('is-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    burgerBtn.setAttribute('aria-label', 'Menü schließen');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    burgerBtn.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', 'Menü öffnen');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  }

  burgerBtn.addEventListener('click', toggleMenu);

  // Close menu when a nav link inside mobile menu is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
      burgerBtn.focus();
    }
  });

})();
