    (function () {
      const track = document.getElementById('testiTrack');
      const dots = document.querySelectorAll('.testi-dot');
      let current = 0;
      const total = dots.length;

      function goTo(idx) {
        current = (idx + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
      }

      document.getElementById('testiNext').addEventListener('click', () => goTo(current + 1));
      document.getElementById('testiPrev').addEventListener('click', () => goTo(current - 1));
      dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.idx)));

      // Auto-advance every 5 s
      setInterval(() => goTo(current + 1), 5000);
    })();