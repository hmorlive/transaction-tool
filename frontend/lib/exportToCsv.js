export function convertToCSV(transactions) {
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Excluded'];
    const rows = transactions.map((tx) => [
      tx.date,
      `"${tx.description.replace(/"/g, '""')}"`, // Escape quotes
      tx.amount,
      `"${tx.category || ''}"`,
      tx.excluded ? 'Yes' : 'No',
    ]);
  
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  