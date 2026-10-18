/* סלול ניהול נכסים: סקשן "הכאב". מריץ את הטלפון שלב אחרי שלב (שיחה נכנסת, ואז התראות) בלופ, רק כשהוא על המסך. */
(() => {
  const visual = document.querySelector('.pain__visual');
  if (!visual || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = [...visual.querySelectorAll('[data-step]')];
  const offs = [...visual.querySelectorAll('[data-off]')];
  // שלב וזמן (במילישניות) מתחילת הלופ
  const timeline = [[1, 300], [2, 3000], [3, 3500], [4, 4300], [5, 5300], [6, 6600]];
  const LOOP = 8400; // כ-1.8 שניות על כל ההתראות, ואז מתחילים מחדש
  let timers = [];
  let running = false;

  const show = (step) => {
    els.forEach((el) => { if (Number(el.dataset.step) <= step) el.classList.add('is-on'); });
    offs.forEach((el) => el.classList.toggle('is-off', step >= Number(el.dataset.off)));
  };
  const reset = () => {
    els.forEach((el) => el.classList.remove('is-on'));
    offs.forEach((el) => el.classList.remove('is-off'));
  };
  const play = () => {
    reset();
    timers = timeline.map(([step, at]) => setTimeout(() => show(step), at));
    timers.push(setTimeout(play, LOOP));
  };
  const stop = () => { timers.forEach(clearTimeout); timers = []; };

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) { running = true; play(); }
    else if (!entry.isIntersecting && running) { running = false; stop(); }
  }, { threshold: 0.3 }).observe(visual);
})();
