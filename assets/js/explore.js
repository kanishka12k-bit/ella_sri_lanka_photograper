
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
