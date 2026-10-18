/* סלול ניהול נכסים: שאלות ותשובות. אקורדיון שפותח שאלה אחת בכל פעם, וטופס פרוטוטייפ:
   בודק שם וטלפון ומציג הודעת הצלחה (השליחה האמיתית תהיה בטופס של אלמנטור). */
(() => {
  const items = [...document.querySelectorAll('.qa')];
  items.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) items.forEach((o) => { if (o !== d) o.open = false; });
  }));

  const form = document.querySelector('.lead-form');
  if (!form) return;
  const err = form.querySelector('.lead-form__error');
  const ok = form.querySelector('.lead-form__success');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements.name;
    const phone = form.elements.phone;
    const badName = !name.value.trim();
    const badPhone = phone.value.replace(/\D/g, '').length < 9;
    name.setAttribute('aria-invalid', String(badName));
    phone.setAttribute('aria-invalid', String(badPhone));
    err.hidden = !(badName || badPhone);
    if (badName || badPhone) { (badName ? name : phone).focus(); return; }
    ok.hidden = false;
    form.reset();
  });
})();
