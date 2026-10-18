/* סלול ניהול נכסים: צוות באודות. לחיצה על אחד מהשלושה בתמונה פותחת חלונית עם הביו שלו.
   נסגרת בכפתור, ב-Escape או בלחיצה על הרקע, והמיקוד חוזר לאדם שנלחץ. */
(() => {
  const dialog = document.querySelector('.team-modal');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const people = [...dialog.querySelectorAll('.team-modal__person')];
  let opener = null;

  document.querySelectorAll('.team-hot').forEach((btn) => btn.addEventListener('click', () => {
    opener = btn;
    people.forEach((p) => { p.hidden = p.dataset.person !== btn.dataset.person; });
    dialog.showModal();
    dialog.scrollTop = 0;
    if (window.salullLenis) window.salullLenis.stop();
  }));
  dialog.querySelector('.team-modal__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    if (window.salullLenis) window.salullLenis.start();
    if (opener) opener.focus();
  });
})();
