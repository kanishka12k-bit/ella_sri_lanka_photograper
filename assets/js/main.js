/* ----- Navbar: add .scrolled class when user scrolls ----- */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 80);
});

const menuBtn      = document.getElementById('mobileMenuBtn');
const offcanvasNav = document.getElementById('offcanvasNav');
const overlay      = document.getElementById('offcanvasOverlay');
const closeBtn     = document.getElementById('offcanvasClose');

function openMenu() {
  menuBtn.classList.add('active');
  offcanvasNav.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  const waBtn = document.querySelector('.whatsapp-float');
  if (waBtn) waBtn.classList.add('wa-hidden');
}

function closeMenu() {
  menuBtn.classList.remove('active');
  offcanvasNav.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';

  const waBtn = document.querySelector('.whatsapp-float');
  if (waBtn) waBtn.classList.remove('wa-hidden');
}

menuBtn .addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
overlay .addEventListener('click', closeMenu);

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

document.querySelectorAll('.offcanvas-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});
/*---- preloader  -----*/
window.addEventListener('load', function () {
  const preloader = document.getElementById('creative-preloader');

  if (preloader) {
    preloader.classList.add('preloader-fade-out');

    setTimeout(() => {
      preloader.remove();

      const waBtn = document.querySelector('.whatsapp-float');
      if (waBtn) waBtn.classList.remove('wa-hidden');
    }, 600);
  } else {
    const waBtn = document.querySelector('.whatsapp-float');
    if (waBtn) waBtn.classList.remove('wa-hidden');
  }
});


/*---- Language switcher (per-language JSON files) -----*/
(function () {
  const STORAGE_KEY  = 'site-lang';
  const DEFAULT_LANG = 'en';
  const cache = {};

  // short code (data-lang value in index.html) -> actual JSON file name on disk
  const FILE_NAMES = {
    en: 'english',
    ru: 'russian',
    zh: 'chinese',
    de: 'german',
    it: 'italian',
    fr: 'french',
    es: 'spanish',
    ja: 'japanese',
    ko: 'korean'
  };

  function renderLanguage(lang, dict) {
    // Translate every tagged element
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) el.innerHTML = dict[key];
    });

    // Update the short language code shown on the desktop button
    document.querySelectorAll('.lang-current').forEach(el => {
      el.textContent = lang;
    });

    // Highlight the active option in both (desktop + mobile) menus
    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.lang === lang);
    });

    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }

  function applyLanguage(lang) {
    // Already fetched this language before -> use the cached copy, no new request
    if (cache[lang]) {
      renderLanguage(lang, cache[lang]);
      return;
    }

    const fileName = FILE_NAMES[lang] || lang; // falls back to the code itself if not mapped

    fetch(`./assets/i18n/lang/${fileName}.json`)
      .then(res => res.json())
      .then(dict => {
        cache[lang] = dict;
        renderLanguage(lang, dict);
      })
      .catch(err => console.error(`Language file for "${lang}" could not be loaded:`, err));
  }

  const savedLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  applyLanguage(savedLang);

  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      applyLanguage(option.dataset.lang);
    });
  });
})();

/*---- Enable tooltips  -----*/
document.addEventListener('DOMContentLoaded', function () {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl =>
    new bootstrap.Tooltip(tooltipTriggerEl)
  )
});

/*------ Scroll fade-up animation ------*/
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.20 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

/*------ Counter animation ------*/
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;

      if (current >= target) {
        el.textContent = target.toLocaleString() + "+";
        clearInterval(timer);
      }
      else {
        el.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);

    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-number').forEach(el => counterObserver.observe(el));