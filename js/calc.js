/* סלול ניהול נכסים: מחשבון תשואה. אותה נוסחה כמו באתר הקיים:
   הכנסה שנתית = שכירות × (12 פחות חודשים ריקים). ברוטו = הכנסה שנתית / שווי. נטו = (הכנסה שנתית פחות הוצאות × 12) / שווי.
   השדה המספרי והסליידר מסונכרנים, והמספרים רצים לערך החדש. */
(() => {
  const form = document.querySelector('.calc__panel');
  if (!form) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ils = new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 });
  const pct = (n) => `${n.toFixed(2)}%`;
  const out = (k) => document.querySelector(`[data-out="${k}"]`);
  const num = (id) => Number(document.getElementById(`calc-${id}`).value) || 0;
  const shown = {};

  // מספר שרץ מהערך הקודם לחדש
  const tween = (key, to, fmt) => {
    const el = out(key);
    if (!el) return;
    const from = shown[key] ?? 0;
    shown[key] = to;
    if (reduce || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / 500, 1);
      el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1 && shown[key] === to) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const fill = (range) => {
    const p = ((range.value - range.min) / (range.max - range.min)) * 100;
    range.style.setProperty('--p', `${p}%`);
  };

  const calc = () => {
    const value = num('value');
    const rent = num('rent');
    const expenses = num('expenses');
    const vacant = Math.min(Math.max(num('vacant'), 0), 12);
    const income = rent * (12 - vacant);
    const annual = income - expenses * 12;
    const gross = value > 0 ? (income / value) * 100 : 0;
    const net = value > 0 ? (annual / value) * 100 : 0;

    tween('gross', gross, pct);
    tween('net', net, pct);
    tween('annual', annual, ils.format);
    tween('monthly', annual / 12, ils.format);

    // פירוק של השכירות המלאה האפשרית בשנה: נטו, הוצאות, חודשים ריקים
    const potential = rent * 12;
    const vacLoss = rent * vacant;
    const exp = Math.min(expenses * 12, Math.max(potential - vacLoss, 0));
    const netPart = Math.max(potential - vacLoss - exp, 0);
    const w = (n) => (potential > 0 ? `${(n / potential) * 100}%` : '0%');
    form.querySelector('.calc__seg--net').style.width = w(netPart);
    form.querySelector('.calc__seg--exp').style.width = w(exp);
    form.querySelector('.calc__seg--vac').style.width = w(vacLoss);
    tween('leg-net', annual, ils.format);
    tween('leg-exp', expenses * 12, ils.format);
    tween('leg-vac', vacLoss, ils.format);
  };

  form.querySelectorAll('.calc-field__range').forEach((range) => {
    const field = document.getElementById(range.dataset.for);
    fill(range);
    range.addEventListener('input', () => { field.value = range.value; fill(range); calc(); });
    field.addEventListener('input', () => {
      range.value = field.value;
      fill(range);
      calc();
    });
  });
  calc();
})();
