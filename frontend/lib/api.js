const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTransactions() {
  const res = await fetch(`${BASE_URL}/transactions`);
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  return res.json();
}

export async function addTransaction(data) {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteTransaction(id) {
  await fetch(`${BASE_URL}/transactions/${id}`, { method: 'DELETE' });
}

export async function updateTransaction(id, updates) {
  await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
}