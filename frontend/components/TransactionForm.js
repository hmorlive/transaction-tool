'use client';

import { useState } from 'react';
import { addTransaction } from '../lib/api';
import { FiCalendar, FiTag, FiDollarSign, FiList, FiPlus } from 'react-icons/fi';

export default function TransactionForm({ onAdd, categories }) {
  const [form, setForm] = useState({
    date: '',
    description: '',
    amount: '',
    category: categories[0] || '',
    excluded: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tx = await addTransaction(form);
    onAdd(tx);
    setForm({ ...form, description: '', amount: '' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row flex-wrap gap-3 sm:items-end text-sm"
    >
      <div className="flex flex-col flex-1 min-w-[140px]">
        <label className="flex items-center gap-1 text-gray-600 mb-1">
          <FiCalendar />
          Date
        </label>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          className="px-2 py-1 border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-[180px]">
        <label className="flex items-center gap-1 text-gray-600 mb-1">
          <FiTag />
          Description
        </label>
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="px-2 py-1 border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex flex-col w-[120px]">
        <label className="flex items-center gap-1 text-gray-600 mb-1">
          <FiDollarSign />
          Amount
        </label>
        <input
          name="amount"
          type="number"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          required
          className="px-2 py-1 border border-gray-300 rounded-md"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-[160px]">
        <label className="flex items-center gap-1 text-gray-600 mb-1">
          <FiList />
          Category
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="px-2 py-1 border border-gray-300 rounded-md"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center mt-1 sm:mt-5">
        <label className="inline-flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            name="excluded"
            checked={form.excluded}
            onChange={handleChange}
            className="w-4 h-4"
          />
          Exclude
        </label>
      </div>

      <div className="sm:mt-5">
        <button
          type="submit"
          className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FiPlus />
          Add
        </button>
      </div>
    </form>
  );
}
