'use client';

import { useState } from 'react';
import { deleteTransaction, updateTransaction } from '../lib/api';

export default function TransactionTable({ transactions, onUpdate, categories }) {
  const [customCategories, setCustomCategories] = useState({}); // track per-tx custom inputs

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    onUpdate();
  };

  const handleChange = async (id, field, value) => {
    await updateTransaction(id, { [field]: value });
    onUpdate();
  };

  const handleCategoryChange = (id, value) => {
    if (value === "Other") {
      setCustomCategories((prev) => ({ ...prev, [id]: "" }));
      handleChange(id, "category", "Other");
    } else {
      setCustomCategories((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      handleChange(id, "category", value);
    }
  };

  const handleCustomCategoryBlur = async (id) => {
    const customValue = customCategories[id]?.trim();
    if (customValue) {
      await updateTransaction(id, { category: customValue });
      onUpdate();
    }
  };

  return (
    <div className="space-y-2">
      <div className="hidden sm:flex font-bold border-b border-gray-300 pb-2">
        <div className="flex-1">Date</div>
        <div className="flex-1">Description</div>
        <div className="w-24">Amount</div>
        <div className="flex-1">Category</div>
        <div className="w-24 text-center">Excluded</div>
        <div className="w-12 text-right">Delete</div>
      </div>

      {transactions.map((tx) => (
        <div key={tx.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 border-b border-gray-200 py-2">
          <div className="flex-1">{tx.date}</div>
          <div className="flex-1">{tx.description}</div>
          <div className="w-24">${Number(tx.amount).toFixed(2)}</div>
          <div className="flex-1">
            <select
              value={categories.includes(tx.category) ? tx.category : "Other"}
              onChange={(e) => handleCategoryChange(tx.id, e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="Other">Other</option>
            </select>

            {tx.category === "Other" || !categories.includes(tx.category) ? (
              <input
                type="text"
                placeholder="Custom category"
                className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
                value={customCategories[tx.id] ?? tx.category}
                onChange={(e) =>
                  setCustomCategories((prev) => ({ ...prev, [tx.id]: e.target.value }))
                }
                onBlur={() => handleCustomCategoryBlur(tx.id)}
              />
            ) : null}
          </div>

          <div className="w-24 flex justify-center">
            <input
              type="checkbox"
              checked={!!tx.excluded}
              onChange={(e) => handleChange(tx.id, 'excluded', e.target.checked ? 1 : 0)}
              className="w-4 h-4"
            />
          </div>
          <div className="w-12 text-right">
            <button
              onClick={() => handleDelete(tx.id)}
              className="text-red-500 hover:text-red-700"
            >
              🗑
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}