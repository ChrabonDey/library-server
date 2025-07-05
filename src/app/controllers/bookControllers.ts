import { Request, RequestHandler, Response } from 'express';
import Book from '../models/Book';
import Borrow from '../models/Borrow';

// Utility function to format book object
const formatBook = (book: any) => ({
  ...book.toObject(),
  id: book._id.toString(),
  _id: undefined,
  __v: undefined,
});

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find();
    const formattedBooks = books.map(formatBook);
    res.json(formattedBooks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.json(formatBook(book));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create book' });
  }
};

export const updateBook: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, req.body, { new: true });

    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    res.json(formatBook(book));
  } catch (error) {
    res.status(400).json({ message: 'Failed to update book' });
  }
};
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete book' });
  }
};

export const borrowBook = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    res.status(400).json({ message: 'Failed to borrow book' });
  }
};

export const getBorrowSummary = async (req: Request, res: Response) => {
  try {
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
          bookId: { $toString: '$_id' },
          title: '$bookInfo.title',
          isbn: '$bookInfo.isbn',
          totalBorrowed: '$totalQuantity',
          _id: 0,
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch borrow summary' });
  }
};
