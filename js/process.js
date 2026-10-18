/* סלול ניהול נכסים: תהליך עבודה בסגנון "מסע".
   1. בונה קו מקווקו מתעקל מתחתית כל כרטיס אל הנעץ של הכרטיס הבא, לפי המיקום האמיתי שלהם (מתעדכן בשינוי גודל).
   2. הקו נמשך לפי הגלילה (גלילה אחורה מחזירה).
   3. הכרטיס שבמרכז המסך מקבל is-active ומתמלא בכחול כהה. */
(() => {
  const journey = document.querySelector('.journey');
  if (!journey) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const trips = [...journey.querySelectorAll('.trip')];

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'journey__path');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = '<defs><mask id="journey-mask" maskUnits="userSpaceOnUse"><path class="journey__mask" pathLength="100"/></mask></defs><path class="journey__line" mask="url(#journey-mask)"/>';
  journey.prepend(svg);
  const line = svg.querySelector('.journey__line');
  const mask = svg.querySelector('.journey__mask');

  const build = () => {
    const j = journey.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${j.width} ${j.height}`);
    let d = '';
    for (let i = 0; i < trips.length - 1; i++) {
      const a = trips[i].getBoundingClientRect();
      const pin = trips[i + 1].querySelector('.trip__pin').getBoundingClientRect();
      // יוצאים מתחתית הכרטיס, בצד שפונה לכרטיס הבא, ונכנסים לראש הנעץ הבא
      const toLeft = pin.left + pin.width / 2 < a.left + a.width / 2;
      const x1 = (toLeft ? a.left + a.width * .38 : a.right - a.width * .38) - j.left;
      const y1 = a.bottom - j.top - 2;
      const x2 = pin.left + pin.width / 2 - j.left;
      const y2 = pin.top - j.top + 6;
      const dy = y2 - y1;
      d += `M${x1.toFixed(1)} ${y1.toFixed(1)} C${x1.toFixed(1)} ${(y1 + dy * .55).toFixed(1)}, ${x2.toFixed(1)} ${(y2 - dy * .55).toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)} `;
    }
    line.setAttribute('d', d);
    mask.setAttribute('d', d);
    update();
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    if (reduce) { journey.style.setProperty('--draw', 1); return; }
    const r = journey.getBoundingClientRect();
    const vh = innerHeight;
    const start = vh * .75;
    const end = vh * .6 - r.height;
    const p = Math.min(Math.max((start - r.top) / (start - end), 0), 1);
    journey.style.setProperty('--draw', p.toFixed(4));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  new ResizeObserver(build).observe(journey);
  if (document.fonts) document.fonts.ready.then(build);
  build();

  // הכרטיס במרכז המסך
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('is-active', e.isIntersecting));
  }, { rootMargin: '-45% 0px -45% 0px' });
  trips.forEach((t) => io.observe(t));
})();
