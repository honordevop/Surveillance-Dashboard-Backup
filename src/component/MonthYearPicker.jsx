"use client";

import { monthName } from "../utils/format";

export default function MonthYearPicker({ options, value, onChange }) {
  const years = Array.from(new Set(options.map((o) => o.year)));
  const year = value?.year || "";
  const month = value?.month || "";
  const monthsForYear = options
    .filter((o) => o.year === year)
    .map((o) => o.month);

  return (
    <div className="flex gap-2">
      <select
        className="rounded-lg border border-gray-300 px-3 py-2"
        value={year}
        onChange={(e) => {
          const y = Number(e.target.value);
          const ms = options.filter((o) => o.year === y).map((o) => o.month);
          const firstMonth = ms[0] || "";
          onChange(
            firstMonth ? { year: y, month: firstMonth } : { year: y, month: "" }
          );
        }}
      >
        {years.length === 0 && <option value="">No Years</option>}
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <select
        className="rounded-lg border border-gray-300 px-3 py-2 "
        value={month}
        onChange={(e) => onChange({ year, month: Number(e.target.value) })}
      >
        {monthsForYear.length === 0 && <option value="">No Months</option>}
        {monthsForYear.map((m) => (
          <option key={m} value={m}>
            {monthName(m)}
          </option>
        ))}
      </select>
    </div>
  );
}
