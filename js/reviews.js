/* סלול ניהול נכסים, ביקורות גוגל (אחד לאחד מאתר שיווק הפרויקטים): שורה אינסופית שזזה לבד לרוחב, כמו קרוסלת הפרויקטים.
   השורה משוכפלת עד שהיא רחבה מהמסך בשני סטים ונעה ימינה (RTL) בלי תפר. ריחוף או מיקוד עוצרים אותה,
   החיצים מזיזים כרטיס אחד בתנועה רכה, ו"קרא עוד" מופיע רק בביקורות שנחתכו. מחוץ למסך התנועה עוצרת.
   הביקורות המקוריות נשארות ב-HTML לגוגל, והשכפולים מוסתרים מקוראי מסך. בפחות תנועה: גלילה ידנית. עובד גם באלמנטור. */
(function () {
  var SPEED = 32; // פיקסלים לשנייה

  Array.prototype.forEach.call(document.querySelectorAll('.reviews'), function (root) {
    var view = root.querySelector('.reviews__carousel'), track = root.querySelector('.reviews__track');
    if (!view || !track) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var originals = Array.prototype.slice.call(track.querySelectorAll('.review'));
    var setW = 0, off = 0, nudge = 0, last = 0, hold = false, visible = true;

    // "קרא עוד" רק כשהטקסט באמת חתוך (גם בשכפולים)
    var checkMore = function () {
      Array.prototype.forEach.call(track.querySelectorAll('.review'), function (c) {
        var t = c.querySelector('.review__text'), b = c.querySelector('.review__more');
        if (!t || !b || c.classList.contains('is-open')) return;
        b.hidden = t.scrollHeight <= t.clientHeight + 2;
      });
    };
    track.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.review__more');
      if (!b) return;
      var c = b.closest('.review'), open = c.classList.toggle('is-open');
      b.textContent = open ? 'הצג פחות' : 'קרא עוד';
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    var gap = function () { return parseFloat(getComputedStyle(track).columnGap) || 0; };
    var measure = function () {
      setW = originals.reduce(function (w, c) { return w + c.getBoundingClientRect().width + gap(); }, 0);
    };
    var build = function () {
      Array.prototype.forEach.call(track.querySelectorAll('.is-clone'), function (c) { c.remove(); });
      if (reduce || !setW) return;
      var sets = Math.ceil(view.clientWidth / setW) + 1;
      for (var s = 0; s < sets; s++) originals.forEach(function (o) {
        var c = o.cloneNode(true);
        c.classList.add('is-clone'); c.classList.remove('is-open'); c.setAttribute('aria-hidden', 'true');
        c.querySelectorAll('button').forEach(function (b) { b.setAttribute('tabindex', '-1'); });
        track.appendChild(c);
      });
    };
    var relayout = function () { measure(); build(); checkMore(); };

    // חיצים: כרטיס אחד בכל לחיצה. ב-RTL "הבא" מגיע משמאל, ולכן השורה זזה ימינה
    var step = function () { return (originals[0] ? originals[0].getBoundingClientRect().width : 320) + gap(); };
    var prev = root.querySelector('.reviews__nav--prev'), next = root.querySelector('.reviews__nav--next');
    if (prev) prev.addEventListener('click', function () { nudge -= step(); });
    if (next) next.addEventListener('click', function () { nudge += step(); });

    var frame = function (t) {
      var dt = last ? Math.min(0.1, (t - last) / 1000) : 0; last = t;
      if (!reduce && setW) {
        if (!hold && visible) off += SPEED * dt;
        if (Math.abs(nudge) > 0.5) { var d = nudge * 0.12; off += d; nudge -= d; } else nudge = 0;
        off = ((off % setW) + setW) % setW;
        track.style.transform = 'translate3d(' + off.toFixed(2) + 'px,0,0)';
      }
      requestAnimationFrame(frame);
    };

    track.addEventListener('pointerenter', function () { hold = true; });
    track.addEventListener('pointerleave', function () { hold = false; });
    root.addEventListener('focusin', function () { hold = true; });
    root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) hold = false; });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { rootMargin: '120px' }).observe(root);

    window.addEventListener('resize', relayout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
    relayout();
    requestAnimationFrame(frame);
  });
})();
