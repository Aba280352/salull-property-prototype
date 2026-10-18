/* סלול ניהול נכסים: לפני ואחרי. השורות נחשפות אחת אחרי השנייה כשהטבלה נכנסת למסך (פעם אחת). בלי JS הכול גלוי. */
(() => {
  const table = document.querySelector('.compare__table');
  if (!table || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  table.classList.add('is-ready');
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    table.classList.add('is-in');
    io.disconnect();
  }, { threshold: 0.15 });
  io.observe(table);
})();
