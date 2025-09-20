// utils/format.js
export function monthName(m) {
  const names = [ '', 'January','February','March','April','May','June','July','August','September','October','November','December' ];
  return names[m] || String(m);
}

export function fmt(n) {
  if (typeof n === 'number') return n.toLocaleString();
  const num = Number(n);
  return Number.isNaN(num) ? n : num.toLocaleString();
}
