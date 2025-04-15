export function convertToCSV(transactions) {
    const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Subcategory', 'Excluded'];
    const rows = transactions.map((tx) => [
      tx.date,
      `"${tx.description.replace(/"/g, '""')}"`, // Escape quotes
      tx.amount,
      tx.type,
      `"${tx.category || '-'}"`,
      `"${tx.subcategory || '-'}"`,
      tx.excluded ? 'Yes' : 'No',
    ]);
  
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
  