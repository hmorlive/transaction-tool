"use client";

import { useState } from "react";
import { updateTransaction, deleteTransaction } from "../../../lib/api";

export default function TransactionRow({ tx, categories, onRefresh }) {
  const [localTx, setLocalTx] = useState(tx);
  const [saving, setSaving] = useState(false);

  const handleFieldChange = (field, value) => {
    setLocalTx((prev) => ({ ...prev, [field]: value }));
  };

  const saveField = async (field, value) => {
    setSaving(true);
    try {
      await updateTransaction(localTx.id, { [field]: value });
      handleFieldChange(field, value);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await deleteTransaction(localTx.id);
    onRefresh(); // usually triggers a full reload
  };

  return (
    <div className="flex flex-col border-b pb-3 gap-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0">
        <div className="flex-1">{localTx.date}</div>

        <div className="flex-1">
          <input
            type="text"
            value={localTx.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            onBlur={(e) => saveField("description", e.target.value.trim())}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>

        <div className="w-24">${Number(localTx.amount).toFixed(2)}</div>

        <div className="w-24">
          <span
            className={`px-3 py-1 text-xs rounded-full text-white font-semibold ${
              localTx.type === "income" ? "bg-emerald-700" : "bg-red-700"
            }`}
          >
            {localTx.type}
          </span>
        </div>

        {/* Category and subcategory */}
        <div className="flex-1">
          {localTx.type === "expense" ? (
            <>
              <select
                value={localTx.category}
                onChange={(e) => {
                  const selected = e.target.value;
                  saveField("category", selected);
                  if (selected !== "Other") {
                    saveField("subcategory", "");
                  }
                }}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm mb-1"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {localTx.category === "Other" && (
                <input
                  type="text"
                  placeholder="Custom category"
                  value={localTx.subcategory || ""}
                  onChange={(e) =>
                    handleFieldChange("subcategory", e.target.value)
                  }
                  onBlur={(e) =>
                    saveField("subcategory", e.target.value.trim())
                  }
                  className="w-full border border-blue-300 rounded px-2 py-1 text-xs"
                />
              )}
            </>
          ) : (
            <span className="text-xs italic text-gray-400">—</span>
          )}
        </div>

        <div className="w-24 flex justify-center">
          <input
            type="checkbox"
            checked={!!localTx.excluded}
            onChange={(e) =>
              saveField("excluded", e.target.checked ? 1 : 0)
            }
            className="w-4 h-4"
          />
        </div>

        <div className="w-12 text-right">
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700"
          >
            🗑
          </button>
        </div>
      </div>

      <div className="pl-1 pr-2">
        <label className="text-xs font-medium text-gray-500 mb-1 block">
          Notes
        </label>
        <textarea
          rows={2}
          placeholder="Add a note..."
          value={localTx.notes || ""}
          onChange={(e) => handleFieldChange("notes", e.target.value)}
          onBlur={(e) => saveField("notes", e.target.value.trim())}
          className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm resize-none focus:ring-1 focus:ring-blue-400 focus:outline-none"
        />
      </div>
    </div>
  );
}
