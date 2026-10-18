/* סלול ניהול נכסים: קרוסלת פוקוס בלופ אינסופי. כל שקופית ממוקמת לפי המרחק שלה מהפעילה (הבאה משמאל, כמו בעברית).
   חיצים, גרירה בעכבר או אצבע, מקשי חצים, ומעבר אוטומטי כל 5 שניות שנעצר בריחוף. */
(() => {
  const root = document.querySelector('.focus');
  if (!root) return;
  const track = root.querySelector('.focus__track');
  const slides = [...root.querySelectorAll('.focus__slide')];
  const n = slides.length;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active = 0;

  const layout = () => {
    const w = slides[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(root).getPropertyValue('--gap')) || 24;
    slides.forEach((s, i) => {
      let k = i - active;
      if (k > n / 2) k -= n;
      if (k < -n / 2) k += n;
      // שקופית מוקטנת ל-0.8: מקרבים אותה כדי שהרווח הנראה יישאר קבוע
      s.style.setProperty('--x', `${-k * (w * .9 + gap)}px`);
      s.classList.toggle('is-active', k === 0);
      s.classList.toggle('is-far', Math.abs(k) > 1);
      s.setAttribute('aria-hidden', String(k !== 0));
    });
  };
  const fit = () => {
    slides.forEach((s) => { s.style.minHeight = '0'; });
    const h = Math.max(...slides.map((s) => s.offsetHeight));
    slides.forEach((s) => { s.style.minHeight = ''; });
    track.style.setProperty('--h', `${h}px`);
    layout();
  };
  const go = (d) => { active = (active + d + n) % n; layout(); };

  root.querySelector('.focus__btn--next').addEventListener('click', () => go(1));
  root.querySelector('.focus__btn--prev').addEventListener('click', () => go(-1));
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(1);
    if (e.key === 'ArrowRight') go(-1);
  });
  slides.forEach((s, i) => s.addEventListener('click', () => { if (i !== active && !dragged) { active = i; layout(); } }));

  // גרירה: משיכה שמאלה מקדמת לבאה
  let x0 = null, dragged = false;
  track.addEventListener('pointerdown', (e) => { x0 = e.clientX; dragged = false; track.classList.add('is-drag'); });
  addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    track.classList.remove('is-drag');
    if (Math.abs(dx) > 40) { dragged = true; go(dx < 0 ? 1 : -1); }
    x0 = null;
  });

  // מעבר אוטומטי
  let timer = null;
  const play = () => { if (!reduce) { clearInterval(timer); timer = setInterval(() => go(1), 5000); } };
  root.addEventListener('mouseenter', () => clearInterval(timer));
  root.addEventListener('mouseleave', play);
  root.addEventListener('focusin', () => clearInterval(timer));

  new ResizeObserver(fit).observe(root);
  if (document.fonts) document.fonts.ready.then(fit);
  fit();
  play();
})();
