
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Plan Your Visit — best time tabs ---------- */
  const timeTabs = document.querySelectorAll('.explore-time-tab');
  const locations = document.querySelectorAll('.explore-location');
  const timeNote = document.getElementById('explore-time-note');
  const grid = document.getElementById('explore-grid');

  if (timeTabs.length && locations.length) {
    timeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        timeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const time = tab.dataset.time;
        const isAll = time === 'all';
        const label = tab.textContent.trim();

        if (timeNote) {
          timeNote.innerHTML = isAll
            ? 'Showing <span id="explore-time-label">all photography spots</span> — scroll down to explore the full list below.'
            : `Highlighting spots best suited for <span id="explore-time-label">${label}</span> — scroll down to see them glow in the list below.`;
        }

        locations.forEach(loc => {
          if (isAll) {
            loc.classList.remove('explore-hide');
            return;
          }
          const times = (loc.dataset.time || '').split(' ');
          const matches = times.includes(time);
          loc.classList.toggle('explore-hide', !matches);
        });

        // Gently scroll the list into view so the filtered result is visible.
        if (grid) {
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ---------- 2. Photography tips accordion ---------- */
  const tipItems = document.querySelectorAll('.tip-item');

  tipItems.forEach(item => {
    const question = item.querySelector('.tip-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all, then open the clicked one (unless it was already open).
      tipItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* ---------- 3. Graceful fallback for missing location photos ---------- */
  document.querySelectorAll('.explore-photo img').forEach(img => {
    img.addEventListener('error', () => img.remove(), { once: true });
  });

});

/* ══════════════════════════════════════════════════════════
          Best Restaurants & Cafes in Ella — marquee
   ══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const AUTO_SPEED_PX_PER_SEC = 60;
  const DRAG_THRESHOLD_PX     = 6;
  const GLIDE_TAU_MS          = 350;
  const MAX_FLING_PX_PER_MS   = 4;

  const POP_HOLD = 0.15;

  function init() {
    const section = document.getElementById('explore-eat');
    const marquee = document.getElementById('eatMarquee');
    const track   = document.getElementById('eatTrack');
    if (!section || !marquee || !track) return;

    const cards = Array.from(track.querySelectorAll('.eat-card'));
    if (!cards.length) return;

    track.style.animation = 'none';
    track.classList.remove('eat-paused');

    marquee.style.touchAction = 'pan-y';
    marquee.style.cursor = 'grab';
    marquee.style.userSelect = 'none';
    marquee.style.webkitUserSelect = 'none';

    track.querySelectorAll('img').forEach(img => { img.draggable = false; });
    marquee.addEventListener('dragstart', e => e.preventDefault());

    if (!document.getElementById('eat-marquee-style')) {
      const style = document.createElement('style');
      style.id = 'eat-marquee-style';
      style.textContent =
        '#explore-eat .eat-card{' +
          '--pop:0;' +
          'transition:none;' +
          'opacity:calc(.5 + .5 * var(--pop));' +
          'transform:scale(calc(.9 + .18 * var(--pop)));' +
          'filter:saturate(calc(.7 + .3 * var(--pop)));' +
          'box-shadow:0 30px 60px rgba(0,0,0,calc(.55 * var(--pop))),' +
                     '0 0 0 1px rgba(184,151,90,calc(.25 * var(--pop)));' +
        '}' +
        '@supports (border-color: color-mix(in srgb, red 50%, blue)){' +
          '#explore-eat .eat-card{' +
            'border-color:color-mix(in srgb, var(--eat-gold) calc(var(--pop) * 100%), var(--eat-border));' +
          '}' +
        '}';
      document.head.appendChild(style);
    }

    const reducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false };

    let autoSpeed = reducedMotion.matches ? 0 : AUTO_SPEED_PX_PER_SEC / 1000;
    if (reducedMotion.addEventListener) {
      reducedMotion.addEventListener('change', () => {
        autoSpeed = reducedMotion.matches ? 0 : AUTO_SPEED_PX_PER_SEC / 1000;
      });
    }

    let x = 0;
    let vel = autoSpeed;
    let loopWidth = 0;
    let centers = [];
    let spacing = 0;
    const popValues = [];

    let running = false;
    let rafId = 0;
    let lastTime = 0;

    function wrap(value) {
      if (!loopWidth) return 0;
      return ((value % loopWidth) + loopWidth) % loopWidth;
    }

    function measure() {

      const baseCenter = cards[0].offsetLeft + cards[0].offsetWidth / 2;
      centers = cards.map(c => c.offsetLeft + c.offsetWidth / 2 - baseCenter);
      const base = cards[0].offsetLeft;

      spacing = cards.length > 1 ? centers[1] - centers[0] : cards[0].offsetWidth;

      const firstClone = cards.find((c, i) => i > 0 && c.getAttribute('aria-hidden') === 'true');
      if (firstClone) {
        loopWidth = firstClone.offsetLeft - base;
      } else {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        loopWidth = (track.scrollWidth + gap) / 2;
      }
      x = wrap(x);
    }

    function updatePop() {
      const firstRect   = cards[0].getBoundingClientRect();
      const marqueeRect = marquee.getBoundingClientRect();
      const firstCenter = firstRect.left + firstRect.width / 2;
      const target = marqueeRect.left + marqueeRect.width / 2;

      const hold = Math.min(cards[0].offsetWidth * POP_HOLD, spacing * 0.45);
      const ramp = spacing - 2 * hold;

      for (let i = 0; i < cards.length; i++) {
        const dist = Math.abs(firstCenter + centers[i] - target);

        const t = Math.max(0, Math.min(1, (spacing - hold - dist) / ramp));
        const pop = t * t * (3 - 2 * t);

        if (popValues[i] === undefined || Math.abs(pop - popValues[i]) > 0.002) {
          popValues[i] = pop;
          cards[i].style.setProperty('--pop', pop.toFixed(3));
          cards[i].style.zIndex = pop > 0.5 ? '3' : '';
        }
      }
    }

    function tick(now) {
      if (!running) return;

      const dt = Math.min(Math.max(now - lastTime, 0), 50);
      lastTime = now;

      if (!dragging) {

        vel += (autoSpeed - vel) * (1 - Math.exp(-dt / GLIDE_TAU_MS));
        x += vel * dt;
      }

      x = wrap(x);
      track.style.transform = 'translate3d(' + (-x) + 'px, 0, 0)';
      updatePop();

      rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (running) return;
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    let activePointer = null;
    let dragging = false;
    let suppressClick = false;
    let startClientX = 0;
    let lastClientX = 0;
    let dragPos = 0;
    let samples = [];

    marquee.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (activePointer !== null) return;

      activePointer = e.pointerId;
      startClientX = lastClientX = e.clientX;
      suppressClick = false;
      dragging = false;
    });

    marquee.addEventListener('pointermove', e => {
      if (e.pointerId !== activePointer) return;

      if (!dragging) {
        if (Math.abs(e.clientX - startClientX) < DRAG_THRESHOLD_PX) return;

        dragging = true;
        suppressClick = true;
        lastClientX = e.clientX;
        dragPos = 0;
        samples = [{ t: e.timeStamp, p: 0 }];
        marquee.style.cursor = 'grabbing';
        try { marquee.setPointerCapture(e.pointerId); } catch (err) {  }
        return;
      }

      const dx = e.clientX - lastClientX;
      lastClientX = e.clientX;

      x = wrap(x - dx);
      dragPos -= dx;

      samples.push({ t: e.timeStamp, p: dragPos });
      while (samples.length > 2 && e.timeStamp - samples[0].t > 100) samples.shift();
    });

    function endDrag(e) {
      if (e.pointerId !== activePointer) return;
      activePointer = null;

      if (!dragging) return;
      dragging = false;
      marquee.style.cursor = 'grab';
      try { marquee.releasePointerCapture(e.pointerId); } catch (err) {  }

      let v = 0;
      if (e.type === 'pointerup' && samples.length >= 2) {
        const a = samples[0];
        const b = samples[samples.length - 1];
        const span = b.t - a.t;
        const idle = e.timeStamp - b.t;
        if (span > 0 && idle < 80) v = (b.p - a.p) / span;
      }
      vel = Math.max(-MAX_FLING_PX_PER_MS, Math.min(MAX_FLING_PX_PER_MS, v));
    }

    marquee.addEventListener('pointerup', endDrag);
    marquee.addEventListener('pointercancel', endDrag);

    marquee.addEventListener('click', e => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }
    }, true);

    marquee.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        x = wrap(x + e.deltaX);
      }
    }, { passive: false });

    marquee.addEventListener('scroll', () => { marquee.scrollLeft = 0; });

    measure();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        entries.forEach(entry => (entry.isIntersecting ? start() : stop()));
      }, { threshold: 0.05 }).observe(section);
    } else {
      start();
    }

    let resizeTimer = 0;
    function scheduleMeasure() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(measure, 120);
    }
    window.addEventListener('resize', scheduleMeasure);
    window.addEventListener('load', measure);
    if ('ResizeObserver' in window) new ResizeObserver(scheduleMeasure).observe(track);

    track.querySelectorAll('.eat-photo img').forEach(img => {
      img.addEventListener('error', () => img.remove(), { once: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();