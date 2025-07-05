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
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield Book_1.default.find();
    res.json(books);
});
exports.getBooks = getBooks;
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const book = new Book_1.default(req.body);
    yield book.save();
    res.json(book);
});
exports.createBook = createBook;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const book = yield Book_1.default.findByIdAndUpdate(id, req.body, { new: true });
    res.json(book);
});
exports.updateBook = updateBook;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield Book_1.default.findByIdAndDelete(id);
    res.json({ message: 'Book deleted' });
});
exports.deleteBook = deleteBook;
const borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.borrowBook = borrowBook;
const getBorrowSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                title: '$bookInfo.title',
                isbn: '$bookInfo.isbn',
                totalQuantity: 1,
            },
        },
    ]);
    res.json(summary);
});
exports.getBorrowSummary = getBorrowSummary;
