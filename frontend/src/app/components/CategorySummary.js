'use client';

import { scheduleCLineMap } from "../../../lib/scheduleCMap";

export default function CategorySummary({ transactions }) {
  const incomeTotal = transactions
    .filter((tx) => tx.type === 'income' && !tx.excluded)
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

  const expenseByCategory = transactions
    .filter((tx) => tx.type !== 'income' && !tx.excluded)
    .reduce((acc, tx) => {
      const category = tx.category || 'Uncategorized';
      const amt = Number(tx.amount || 0);
      acc[category] = (acc[category] || 0) + amt;
      return acc;
    }, {});

  const entries = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
  const totalExpenses = entries.reduce((sum, [, val]) => sum + val, 0);
  const netProfit = incomeTotal - totalExpenses;

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-3">📊 Summary</h2>

      {incomeTotal > 0 && (
        <div className="flex justify-between border-b pb-1 text-green-700 font-medium">
          <span>Total Income</span>
          <span>${incomeTotal.toFixed(2)}</span>
        </div>
      )}

      {entries.map(([category, total]) => (
        <div key={category} className="flex justify-between border-b pb-1 text-sm">
          <div>
            <span className="font-medium">{category}</span>
            {scheduleCLineMap[category] && (
              <span className="ml-2 text-gray-500 text-xs">
                ({scheduleCLineMap[category]})
              </span>
            )}
          </div>
          <span>${total.toFixed(2)}</span>
        </div>
      ))}

      {totalExpenses > 0 && (
        <div className="flex justify-between font-semibold border-t pt-2 mt-2">
          <span>Total Expenses</span>
          <span>${totalExpenses.toFixed(2)}</span>
        </div>
      )}

      <div
        className={`flex justify-between font-bold mt-2 pt-2 border-t ${
          netProfit >= 0 ? 'text-green-700' : 'text-red-600'
        }`}
      >
        <span>Net {netProfit >= 0 ? 'Profit' : 'Loss'}</span>
        <span>${netProfit.toFixed(2)}</span>
      </div>
    </div>
  );
}