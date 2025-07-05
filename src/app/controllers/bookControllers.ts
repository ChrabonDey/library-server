import { Request, Response } from 'express';
import Book from '../models/Book';
import Borrow from '../models/Borrow';

export const getBooks = async (req: Request, res: Response) => {
  const books = await Book.find();
  res.json(books);
};

export const createBook = async (req: Request, res: Response) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
};

export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const book = await Book.findByIdAndUpdate(id, req.body, { new: true });
  res.json(book);
};

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Book.findByIdAndDelete(id);
  res.json({ message: 'Book deleted' });
};


export const borrowBook = async (req: Request, res: Response): Promise<void> => {
  const { bookId } = req.params;
  const { quantity, dueDate } = req.body;

  const book = await Book.findById(bookId);
  if (!book || book.copies < quantity) {
    res.status(400).json({ message: 'Not enough copies available' });
    return;
  }

  book.copies -= quantity;
  book.available = book.copies > 0;
  await book.save();

  const borrow = new Borrow({ book: bookId, quantity, dueDate });
  await borrow.save();

  res.json(borrow);
};

export const getBorrowSummary = async (req: Request, res: Response) => {
  const summary = await Borrow.aggregate([
    {
      $group: {
        _id: '$book',
        totalQuantity: { $sum: '$quantity' },
      },
    },
    {
      $lookup: {
        from: 'books',
        localField: '_id',
        foreignField: '_id',
        as: 'bookInfo',
      },
    },
    { $unwind: '$bookInfo' },
    {
      $project: {
        title: '$bookInfo.title',
        isbn: '$bookInfo.isbn',
        totalQuantity: 1,
      },
    },
  ]);
  res.json(summary);
};
