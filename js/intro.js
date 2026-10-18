/* סלול ניהול נכסים: פתיח, רץ בכל טעינה. ההחלטה אם להריץ נעשית בסקריפט קטן ב-head (intro-run / intro-skip). כאן רק מתזמנים יציאה ומסירים. */
(() => {
  const root = document.documentElement;
  const intro = document.getElementById('intro');
  if (!intro) return;
  if (!root.classList.contains('intro-run')) { intro.remove(); return; }

  const HOLD = 2500; // הלוגו מתמלא והטאגליין עולה
  const EXIT = 900;  // הווילון עולה
  setTimeout(() => {
    intro.classList.add('intro--out');
    root.classList.remove('intro-run');
    document.dispatchEvent(new Event('intro:done'));
    setTimeout(() => intro.remove(), EXIT + 50);
  }, HOLD);
})();
