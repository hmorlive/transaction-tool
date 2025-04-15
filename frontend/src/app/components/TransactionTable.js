'use client';

import { useState } from 'react';
import { deleteTransaction, updateTransaction } from '../../../lib/api';

export default function TransactionTable({ transactions, onUpdate, categories }) {
  const [notesMap, setNotesMap] = useState({});

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    onUpdate();
  };

  const handleChange = async (id, field, value) => {
    await updateTransaction(id, { [field]: value });
    onUpdate();
  };

  const handleCategoryChange = (id, value) => {
    handleChange(id, 'category', value);
  };

  const handleNotesBlur = async (id, currentNote) => {
    const trimmed = currentNote.trim();
    if (trimmed !== transactions.find(t => t.id === id)?.notes) {
      await updateTransaction(id, { notes: trimmed });
      onUpdate();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="hidden sm:flex font-bold border-b border-gray-300 pb-2 text-sm text-gray-600">
        <div className="flex-1">Date</div>
        <div className="flex-1">Description</div>
        <div className="w-24">Amount</div>
        <div className="w-24 flex items-center">
          <span className="text-xs text-gray-500">Type</span>
        </div>
        <div className="flex-1">Category</div>
        <div className="w-24 text-center">Excluded</div>
        <div className="w-12 text-right">Delete</div>
      </div>

      {transactions.length === 0 && (
        <div className="flex justify-center items-center h-32 text-gray-500">
          No transactions found.
        </div>
      )}

      {/* Rows */}
      {transactions.map((tx) => (
        <div key={tx.id} className="flex flex-col border-b pb-3 gap-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
            <div className="flex-1">{tx.date}</div>
            <div className="flex-1">{tx.description}</div>
            <div className="w-24">${Number(tx.amount).toFixed(2)}</div>
            <div className="w-24 flex items-center">
              <span
                className={`px-3 py-1 text-xs rounded-full text-white font-semibold ${
                  tx.type === 'income' ? 'bg-emerald-700' : 'bg-red-700'
                }`}
              >
                {tx.type}
              </span>
            </div>
            <div className="flex-1">
              {tx.type === 'expense' ? (
                <select
                  value={tx.category}
                  onChange={(e) => handleCategoryChange(tx.id, e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              ) : (
                <span className="text-xs italic text-gray-400">—</span>
              )}
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

          {/* Notes Area */}
          <div className="pl-1 pr-2">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Notes</label>
            <textarea
              rows={2}
              placeholder="Add a note..."
              defaultValue={tx.notes}
              onChange={(e) =>
                setNotesMap((prev) => ({ ...prev, [tx.id]: e.target.value }))
              }
              onBlur={(e) => handleNotesBlur(tx.id, e.target.value)}
              className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm resize-none focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>
      ))}
    </div>
  );
}