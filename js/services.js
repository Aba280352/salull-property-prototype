/* סלול ניהול נכסים: שירותים. במסכי מגע אין ריחוף, אז לחיצה על כרטיס פותחת אותו (ולחיצה נוספת סוגרת).
   נפתח כרטיס אחד בכל פעם, והמסך גולל אליו כדי שהתיאור והכפתור יהיו בעין. */
(() => {
  if (!matchMedia('(hover: none)').matches) return;
  const grid = document.querySelector('.services__grid');
  const cards = [...document.querySelectorAll('.svc')];
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const open = !card.classList.contains('is-open');
      cards.forEach((c) => c.classList.remove('is-open'));
      grid.classList.toggle('has-open', open);
      if (!open) return;
      card.classList.add('is-open');
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(() => card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }), 60);
    });
  });
})();
