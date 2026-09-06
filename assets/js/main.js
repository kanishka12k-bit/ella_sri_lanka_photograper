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