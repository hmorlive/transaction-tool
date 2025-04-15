'use client';

import { scheduleCLineMap } from '../lib/scheduleCMap';

export default function CategorySummary({ transactions }) {
  const grouped = transactions
    .filter((tx) => !tx.excluded)
    .reduce((acc, tx) => {
      const category = tx.category || "Uncategorized";
      const amt = Number(tx.amount) || 0;
      if (!acc[category]) acc[category] = 0;
      acc[category] += amt;
      return acc;
    }, {});

  const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-3">📊 Category Totals (Schedule C)</h2>
      <div className="space-y-2 text-sm">
        {entries.map(([category, total]) => (
          <div key={category} className="flex justify-between border-b pb-1">
            <div>
              <span className="font-medium">{category}</span>
              {scheduleCLineMap[category] && (
                <span className="ml-2 text-gray-500">({scheduleCLineMap[category]})</span>
              )}
            </div>
            <div>${total.toFixed(2)}</div>
          </div>
        ))}

        <div className="flex justify-between mt-2 font-bold border-t pt-2">
          <span>Total</span>
          <span>
            $
            {entries.reduce((sum, [, val]) => sum + val, 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}