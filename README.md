# Transaction Tracker

A simple, local tool to enter, categorize, and export your credit card or business transactions — perfect for freelancers, small businesses, and Schedule C tax prep.

Built with:
- Next.js + Express
- SQLite (local storage)
- Tailwind CSS

---

## Features

- Add, edit, delete transactions
- Categorize using built-in Schedule C categories
- Custom categories + "Other" support
- Exclude personal transactions
- View totals grouped by category
- Export filtered transactions to CSV
- Filter by year
- Fully local: no cloud, no tracking

---

## Getting Started

### 1. Clone the project

```bash
git clone https://github.com/hmorlive/transaction-tracker.git
cd transaction-tracker
```

### 2. Install Deps
```bash
npm install
cd frontend
npm install
```

### 3. Run app
```bash
npm run dev
```

This runs both the Express API and the Next.js frontend concurrently.
Visit: http://localhost:3000

MIT License
