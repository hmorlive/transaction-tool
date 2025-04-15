import TransactionRow from "./TransactionRow";

export default function TransactionTable({
  transactions,
  onUpdate,
  categories,
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="hidden sm:flex font-bold border-b border-gray-300 pb-2 text-sm text-gray-600">
        <div className="flex-1">Date</div>
        <div className="flex-1">Description</div>
        <div className="w-24">Amount</div>
        <div className="w-24">Type</div>
        <div className="flex-1">Category</div>
        <div className="w-24 text-center">Excluded</div>
        <div className="w-12 text-right">Delete</div>
      </div>

      {transactions.length === 0 && (
        <div className="flex justify-center items-center h-32 text-gray-500">
          No transactions found.
        </div>
      )}

      {transactions.map((tx) => (
        <TransactionRow
          key={tx.id}
          tx={tx}
          categories={categories}
          onRefresh={onUpdate}
        />
      ))}

      {/* Pagination Controls */}
      {transactions.length > 0 && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            ◀ Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}