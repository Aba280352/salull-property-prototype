/* סלול ניהול נכסים: אזורי שירות. הנעצים נוחתים כשהמפה נכנסת למסך (פעם אחת). */
(() => {
  const map = document.querySelector('.areas__map');
  if (!map) return;
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    map.classList.add('is-in');
    io.disconnect();
  }, { threshold: 0.35 });
  io.observe(map);
})();
