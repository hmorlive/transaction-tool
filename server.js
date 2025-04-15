import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import initDb from './db.js';
import scheduleC from './scheduleC.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// GET all transactions
app.get('/transactions', async (req, res) => {
  const db = await initDb();
  const rows = await db.all('SELECT * FROM transactions');
  res.json(rows);
});

// POST new transaction
app.post('/transactions', async (req, res) => {
  const db = await initDb();
  let {
    date,
    description,
    amount,
    category = '',
    excluded = 0,
    notes = '',
    type = 'expense',
  } = req.body;

  // Ensure no category is saved for income
  if (type === 'income') {
    category = '';
  }

  const result = await db.run(
    `INSERT INTO transactions (date, description, amount, category, excluded, notes, type)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [date, description, amount, category, excluded, notes, type]
  );

  res.status(201).json({
    id: result.lastID,
    date,
    description,
    amount,
    category,
    excluded,
    notes,
    type,
  });
});

// PATCH transaction
app.patch('/transactions/:id', async (req, res) => {
  const db = await initDb();
  const { id } = req.params;
  const updates = { ...req.body };

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No updates provided' });
  }

  // Optional: sanitize if type is being updated to income
  if (updates.type === 'income') {
    updates.category = '';
  }

  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);

  await db.run(`UPDATE transactions SET ${fields} WHERE id = ?`, [...values, id]);
  res.json({ success: true });
});

// DELETE transaction
app.delete('/transactions/:id', async (req, res) => {
  const db = await initDb();
  const { id } = req.params;
  await db.run('DELETE FROM transactions WHERE id = ?', [id]);
  res.status(204).end();
});

// GET Schedule C categories
app.get('/categories', (_, res) => {
  res.json(scheduleC);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});