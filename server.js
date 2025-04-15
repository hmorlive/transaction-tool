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
  const { date, description, amount, category = '', excluded = 0 } = req.body;

  const result = await db.run(
    `INSERT INTO transactions (date, description, amount, category, excluded)
     VALUES (?, ?, ?, ?, ?)`,
    [date, description, amount, category, excluded]
  );

  res.status(201).json({ id: result.lastID, ...req.body });
});

// PATCH transaction
app.patch('/transactions/:id', async (req, res) => {
  const db = await initDb();
  const { id } = req.params;
  const updates = req.body;

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