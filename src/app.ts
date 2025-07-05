import express from 'express';
import cors from 'cors';
import {
  borrowBook,
  createBook,
  deleteBook,
  getBooks,
  getBorrowSummary,
  updateBook
} from './app/controllers/bookControllers';

const app = express();

app.use(
  cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('📚 Library Management System API');
});

app.post('/books', createBook);
app.get('/books', getBooks);

app.patch('/books/:id', updateBook);
app.delete('/books/:id', deleteBook);
app.post('/borrow/:bookId', borrowBook);
app.get('/borrow-summary', getBorrowSummary);

export default app;
