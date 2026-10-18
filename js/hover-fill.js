/* סלול ניהול נכסים: אפקט ריחוף "מילוי מעיגול". העיגול נולד בנקודת הכניסה של העכבר, מתפשט עד שהוא ממלא את האלמנט, וחוזר לנקודת היציאה. */
(() => {
  const SEL = '.btn, .card';
  const place = (el, x, y) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', x == null ? '50%' : x - r.left + 'px');
    el.style.setProperty('--y', y == null ? '50%' : y - r.top + 'px');
    el.style.setProperty('--d', Math.ceil(Math.hypot(r.width, r.height) * 2) + 'px');
  };
  const onPointer = (e) => {
    const el = e.target.closest && e.target.closest(SEL);
    if (el && !el.contains(e.relatedTarget)) place(el, e.clientX, e.clientY);
  };
  document.addEventListener('pointerover', onPointer);
  document.addEventListener('pointerout', onPointer);
  document.addEventListener('focusin', (e) => {
    const el = e.target.closest && e.target.closest(SEL);
    if (el) place(el);
  });
})();
