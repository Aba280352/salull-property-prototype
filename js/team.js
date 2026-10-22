/* סלול ניהול נכסים: צוות באודות. כל שורה בזיגזג נחשפת כשהיא נכנסת למסך.
   בלי JS או למי שביקש פחות תנועה הכול פשוט מוצג. */
(() => {
  const rows = document.querySelectorAll('.crew__row');
  if (!rows.length || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    rows.forEach((r) => r.classList.add('is-in'));
    return;
  }
  document.documentElement.classList.add('crew-anim');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -20% 0px' });
  rows.forEach((r) => io.observe(r));
})();
