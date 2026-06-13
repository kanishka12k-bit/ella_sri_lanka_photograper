/*---- preloader  -----*/
window.addEventListener('load', function () {
  const preloader = document.getElementById('creative-preloader');

  if (preloader) {
    preloader.classList.add('preloader-fade-out');

    setTimeout(() => {
      preloader.remove();
    }, 600);
  }
});
/*---- Enable tooltips  -----*/
document.addEventListener('DOMContentLoaded', function () {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl =>
    new bootstrap.Tooltip(tooltipTriggerEl)
  )
});

/*---- Navbar scroll effect -----*/
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 120);
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