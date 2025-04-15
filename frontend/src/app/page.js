'use client';

import { useEffect, useState, useMemo } from 'react';
import { getTransactions, getCategories } from '../../lib/api';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import CategorySummary from './components/CategorySummary';
import { convertToCSV } from '../../lib/exportToCsv';
import { FiDownload, FiCalendar, FiCreditCard } from 'react-icons/fi';

export default function Page() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadData = async () => {
    const [txs, cats] = await Promise.all([getTransactions(), getCategories()]);
    setTransactions(txs);
    setCategories(cats);
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set(transactions.map(tx => tx.date?.slice(0, 4)).filter(Boolean));
    return ['All', ...Array.from(years).sort().reverse()];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const filtered = selectedYear === 'All'
      ? transactions
      : transactions.filter(tx => tx.date?.startsWith(selectedYear));
    return filtered;
  }, [transactions, selectedYear]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  }, [filteredTransactions]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  // Reset to page 1 when year or data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, transactions]);

  const handleDownloadCSV = () => {
    const filtered = filteredTransactions.filter(tx => !tx.excluded);
    const csv = convertToCSV(filtered);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${selectedYear}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6 text-sm text-gray-800">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold tracking-tight text-blue-800 flex items-center justify-center gap-2">
          <FiCreditCard /> Transaction Tracker
        </h1>
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-500" />
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
        <TransactionForm
          onAdd={(tx) => setTransactions((prev) => [...prev, tx])}
          categories={categories}
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
        <TransactionTable
          transactions={paginatedTransactions}
          onUpdate={loadData}
          categories={categories}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100">
        <CategorySummary transactions={filteredTransactions} />
      </div>

      <div className="text-right">
        <button
          onClick={handleDownloadCSV}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all text-sm"
        >
          <FiDownload className="text-base" />
          Download CSV for {selectedYear}
        </button>
      </div>
    </div>
  );
}
