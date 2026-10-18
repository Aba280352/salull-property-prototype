/* סלול ניהול נכסים: גלילה חלקה ואיטית (Lenis 1.1.13, מקומי). רק לגלגלת העכבר ולמשטח המגע במחשב; במגע בטלפון הגלילה נשארת טבעית.
   הדף נגלל באמת (גלילה רגילה של החלון), ולכן אירועי גלילה, האנימציות בגלילה, קישורים לעוגנים ו-SEO לא מושפעים.
   בזמן הפתיח הגלילה עצורה. בפחות תנועה, או בלי הספרייה, הגלילה נשארת רגילה. */
(() => {
  if (!window.Lenis || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new Lenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 0.8,
    smoothWheel: true,
  });
  window.salullLenis = lenis;

  const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);

  // עוצרים בזמן הפתיח וממשיכים כשהוא עולה
  if (document.documentElement.classList.contains('intro-run')) {
    lenis.stop();
    document.addEventListener('intro:done', () => lenis.start(), { once: true });
  }

  // תפריט המובייל פתוח: עוצרים כדי שהדף מאחור לא יזוז
  const burger = document.querySelector('.site-header__burger');
  if (burger) new MutationObserver(() => (burger.getAttribute('aria-expanded') === 'true' ? lenis.stop() : lenis.start()))
    .observe(burger, { attributes: true, attributeFilter: ['aria-expanded'] });

  // קישורים לעוגן באותו עמוד: גלילה חלקה עד היעד, בהתחשב בגובה ההדר
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const header = document.querySelector('.site-header');
    lenis.scrollTo(target, { offset: header ? -header.offsetHeight : 0 });
  });
})();
