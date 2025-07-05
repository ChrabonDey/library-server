"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBorrowSummary = exports.borrowBook = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBooks = void 0;
const Book_1 = __importDefault(require("../models/Book"));
const Borrow_1 = __importDefault(require("../models/Borrow"));
// Utility function to format book object
const formatBook = (book) => (Object.assign(Object.assign({}, book.toObject()), { id: book._id.toString(), _id: undefined, __v: undefined }));
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield Book_1.default.find();
        const formattedBooks = books.map(formatBook);
        res.json(formattedBooks);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch books' });
    }
});
exports.getBooks = getBooks;
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = new Book_1.default(req.body);
        yield book.save();
        res.json(formatBook(book));
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to create book' });
    }
});
exports.createBook = createBook;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const book = yield Book_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!book)
            return res.status(404).json({ message: 'Book not found' });
        res.json(formatBook(book));
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to update book' });
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield Book_1.default.findByIdAndDelete(id);
        res.json({ message: 'Book deleted' });
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to delete book' });
    }
});
exports.deleteBook = deleteBook;
const borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const { quantity, dueDate } = req.body;
        const book = yield Book_1.default.findById(bookId);
        if (!book || book.copies < quantity) {
            res.status(400).json({ message: 'Not enough copies available' });
            return;
        }
        book.copies -= quantity;
        book.available = book.copies > 0;
        yield book.save();
        const borrow = new Borrow_1.default({ book: bookId, quantity, dueDate });
        yield borrow.save();
        res.json(borrow);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to borrow book' });
    }
});
exports.borrowBook = borrowBook;
const getBorrowSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield Borrow_1.default.aggregate([
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
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch borrow summary' });
    }
});
exports.getBorrowSummary = getBorrowSummary;
