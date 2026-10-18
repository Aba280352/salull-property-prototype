/* סלול ניהול נכסים: הדר. תפריט עוד (לחיצה, Escape, לחיצה בחוץ) ותפריט מובייל. */
(() => {
  const nav = document.getElementById('site-nav');
  const burger = document.querySelector('.site-header__burger');
  const sub = document.querySelector('.has-sub');
  const more = sub && sub.querySelector('.site-nav__more');
  if (!nav || !burger) return;

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'סגירת התפריט' : 'פתיחת התפריט');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  const setSub = (open) => {
    if (!sub) return;
    sub.classList.toggle('is-open', open);
    more.setAttribute('aria-expanded', String(open));
  };

  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  if (more) more.addEventListener('click', () => setSub(!sub.classList.contains('is-open')));
  document.addEventListener('click', (e) => { if (sub && !sub.contains(e.target)) setSub(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    setSub(false);
    setMenu(false);
  });
  matchMedia('(min-width: 1025px)').addEventListener('change', () => setMenu(false));
})();
