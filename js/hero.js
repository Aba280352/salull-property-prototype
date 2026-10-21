/* סלול ניהול נכסים: מסך פתיחה. סרטון שנעצר מחוץ למסך ולמי שביקש פחות תנועה, ומספרים שרצים מ-0 כשהם נכנסים למסך. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const video = document.querySelector('video.hero__media');
  if (video) {
    if (reduce) {
      video.removeAttribute('autoplay');
      video.pause();
    } else {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }).observe(video);
    }
  }

  /* המספר האמיתי כתוב ב-HTML (לגוגל ולמי שאין JS), כאן רק מריצים אותו מ-0 */
  const counters = document.querySelectorAll('[data-count]');
  if (reduce || !counters.length) return;
  const run = (el) => {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const dur = 1800;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      run(e.target);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => { el.textContent = '0'; });
  /* אם הפתיח רץ, המספרים מתחילים רק כשהוא עולה, כדי שלא ירוצו מתחת לווילון */
  const start = () => counters.forEach((el) => io.observe(el));
  if (document.documentElement.classList.contains('intro-run')) document.addEventListener('intro:done', start, { once: true });
  else start();
})();
