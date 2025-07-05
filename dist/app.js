"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bookControllers_1 = require("./app/controllers/bookControllers");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.send('📚 Library Management System API');
});
app.post('/books', bookControllers_1.createBook);
app.get('/books', bookControllers_1.getBooks);
app.patch('/books/:id', bookControllers_1.updateBook);
app.delete('/books/:id', bookControllers_1.deleteBook);
app.post('/borrow/:bookId', bookControllers_1.borrowBook);
app.get('/borrow-summary', bookControllers_1.getBorrowSummary);
exports.default = app;
