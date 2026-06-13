
/* ── Filter Logic ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const pmItems = document.querySelectorAll('.pm-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    pmItems.forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.classList.remove('hidden');
        item.style.animation = 'fadeInItem 0.4s ease forwards';
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ── Lightbox ── */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCap = document.getElementById('lightbox-caption');
const lbClose = document.getElementById('lightbox-close');

pmItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const cat = item.querySelector('.pm-overlay-cat').textContent;
    lbImg.src = img.src.replace('w=800', 'w=1200');
    lbImg.alt = img.alt;
    lbCap.textContent = cat;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}


/*index.html portfolio URL category*/
document.addEventListener("DOMContentLoaded", () => {

  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');

  if (category) {
    const targetButton = document.querySelector(`.portfolio-menu button[data-filter="${category}"]`) ||
      document.querySelector(`.filter-btn[data-filter="${category}"]`);

    if (targetButton) {
      targetButton.click();
      targetButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});