/*---- hero wallpaper animation -----*/
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll('.hero-slideshow .slide');
  let currentSlide = 0;
  const slideInterval = 4500;

  function nextSlide() {
    const activeSlide = slides[currentSlide];
    slides.forEach(slide => slide.classList.remove('last-active'));
    activeSlide.classList.remove('active');
    activeSlide.classList.add('last-active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  if (slides.length > 0) {
    slides[0].classList.add('active');
  }

  setInterval(nextSlide, slideInterval);
});

/*---- reel card -----*/
const N = 7;   // reel ගණන 5 සිට 7 කරා වෙනස් කළා
const ALL_STATES = [
  'state-center',
  'state-left1','state-left2',
  'state-right1','state-right2',
  'state-off-left','state-off-right'
];

const cards  = Array.from({length:N}, (_,i) => document.getElementById('card'+i));
const videos = Array.from({length:N}, (_,i) => document.getElementById('vid'+i));
const progs  = Array.from({length:N}, (_,i) => document.getElementById('prog'+i));
const dots   = Array.from({length:N}, (_,i) => document.getElementById('dot'+i));
const arrs   = Array.from({length:N}, (_,i) => document.getElementById('arr'+i));

let center = 0;
let intervals = new Array(N).fill(null);
let locked = false;

// N ඕනම ගණනකට (5, 7, 9...) වැඩ කරන විදිහට generic කළ stateOf()
function stateOf(idx) {
  const diff = ((idx - center) % N + N) % N;
  let offset = diff;
  if (offset > N / 2) offset -= N;   // right side / left side signed distance

  if (offset === 0)  return 'state-center';
  if (offset === 1)  return 'state-right1';
  if (offset === 2)  return 'state-right2';
  if (offset === -1) return 'state-left1';
  if (offset === -2) return 'state-left2';
  return offset > 0 ? 'state-off-right' : 'state-off-left';
}

function applyStates() {
  cards.forEach((card, i) => {
    ALL_STATES.forEach(s => card.classList.remove(s));
    card.classList.add(stateOf(i));
  });
  arrs.forEach((el, i) => {
    const s = stateOf(i);
    if (s === 'state-left1'  || s === 'state-left2')  el.innerHTML = '&#8592;';
    if (s === 'state-right1' || s === 'state-right2') el.innerHTML = '&#8594;';
  });
  dots.forEach((d,i) => d.classList.toggle('active', i === center));
}

function startProgress(idx) {
  const vid = videos[idx], bar = progs[idx];
  bar.style.width = '0%';
  if (intervals[idx]) clearInterval(intervals[idx]);
  intervals[idx] = setInterval(() => {
    if (!vid.duration) return;
    bar.style.width = ((vid.currentTime / vid.duration) * 100) + '%';
  }, 120);
}

function stopProgress(idx) {
  if (intervals[idx]) { clearInterval(intervals[idx]); intervals[idx] = null; }
  progs[idx].style.width = '0%';
}

function playCenter() {
  const vid = videos[center];
  const muteBtn = cards[center].querySelector('.mute-toggle');
  vid.currentTime = 0;
  vid.play().catch(()=>{});
  cards[center].classList.remove('paused');
  muteBtn.classList.add('show');
  startProgress(center);
}

function pauseCenter() {
  videos[center].pause();
  const muteBtn = cards[center].querySelector('.mute-toggle');
  cards[center].classList.add('paused');
  muteBtn.classList.remove('show')
  stopProgress(center);
}

function goNext() {
  if (locked) return;
  locked = true;
  pauseCenter();
  center = (center + 1) % N;
  applyStates();
  setTimeout(() => { playCenter(); locked = false; }, 100);
}

function goPrev() {
  if (locked) return;
  locked = true;
  pauseCenter();
  center = (center - 1 + N) % N;
  applyStates();
  setTimeout(() => { playCenter(); locked = false; }, 100);
}

videos.forEach((vid, i) => {
  vid.addEventListener('ended', () => { if (i === center) goNext(); });
});

cards.forEach((card, i) => {
  card.addEventListener('click', () => {
    const s = stateOf(i);
    if      (s === 'state-right1' || s === 'state-right2') goNext();
    else if (s === 'state-left1'  || s === 'state-left2')  goPrev();
    else if (s === 'state-center') {
      if (videos[i].paused) {
        videos[i].play();
        card.classList.remove('paused');
        startProgress(i);
      } else {
        videos[i].pause();
        card.classList.add('paused');
      }
    }
  });
});

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    if (i === center || locked) return;
    locked = true;
    pauseCenter();
    center = i;
    applyStates();
    setTimeout(() => { playCenter(); locked = false; }, 100);
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') goNext();
  if (e.key === 'ArrowLeft')  goPrev();
});

applyStates();
playCenter();

/*Variables required for swiping*/
let touchStartX = 0;
let touchEndX = 0;

const reelStage = document.querySelector('.reel-stage');

reelStage.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

reelStage.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, false);

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) { goNext(); } else { goPrev(); }
  }
}

/*---- reel card volume -----*/
function toggleMute(event) {
  event.stopPropagation();
  const card = event.target.closest('.reel-card');
  const video = card.querySelector('video');
  const icon = card.querySelector('.mute-toggle i');

  if (video.muted) {
    video.muted = false;
    icon.className = 'bi bi-volume-up-fill';
  } else {
    video.muted = true;
    icon.className = 'bi bi-volume-mute-fill';
  }
}

/*---- privacy promise section: scroll reveal -----*/
document.addEventListener('DOMContentLoaded', function () {
  const section = document.getElementById('privacy-promise');
  if (!section) return;

  const revealEls = section.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealEls.forEach((el) => observer.observe(el));
});

/* ============================================================
               TESTIMONIALS — AUTO SLIDER
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  const slider   = document.getElementById('testimonialSlider');
  const track    = document.getElementById('testimonialTrack');
  const slides   = track ? Array.from(track.children) : [];
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  const dotsWrap = document.getElementById('testimonialDots');
 
  if (!slider || !track || slides.length === 0) return;
 
  const AUTOPLAY_MS = 5000;
  let index = 0;
  let autoplayTimer = null;
 
  /* ---- build dots ---- */
  const dots = slides.map((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'testimonial-dot-btn' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    btn.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(btn);
    return btn;
  });
 
  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
 
    // retrigger the little "pop" entrance animation on the active card
    const activeCard = slides[index].querySelector('.testimonial-card');
    if (activeCard) {
      activeCard.classList.remove('is-active');
      void activeCard.offsetWidth; // force reflow so the animation restarts
      activeCard.classList.add('is-active');
    }
  }
 
  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
    restartAutoplay();
  }
 
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }
 
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }
  function restartAutoplay() { startAutoplay(); }
 
  /* ---- arrows ---- */
  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);
 
  /* ---- pause on hover / focus (desktop) ---- */
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);
  slider.addEventListener('focusin', stopAutoplay);
  slider.addEventListener('focusout', startAutoplay);
 
  /* ---- swipe support (mobile/touch) ---- */
  const viewport = slider.querySelector('.testimonial-viewport');
  let touchStartX = 0;
  let touchEndX = 0;
 
  if (viewport) {
    viewport.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });
 
    viewport.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      const SWIPE_THRESHOLD = 40;
      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        diff > 0 ? next() : prev();
      } else {
        startAutoplay();
      }
    }, { passive: true });
  }
 
  /* ---- init ---- */
  render();
  startAutoplay();
});