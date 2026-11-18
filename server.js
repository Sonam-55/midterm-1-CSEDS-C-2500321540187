const http = require("node:http");

const express = require('express');

const app = express();

app.use(express.json());

let books = [
    {
        id: "101",
        title: "The Alchemist",
        author: "Paulo Celho",
        category: "Fiction"
    }
];

app.get('/books', (req, res) => {
    res.status(200).json(books);
});

app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === req.params.id);

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({
            message: "Book not found"
        });
    }
});

app.post('/books', (req, res) => {
    const { id, title, author, category } = req.body;

    if (!id || !title || !author || !category) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const existingBook = books.some(b => b.id === id);

    if (existingBook) {
        return res.status(409).json({
            message: "Book ID already exists"
        });
    }

    const newBook = { id, title, author, category };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.id === req.params.id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, category } = req.body;

    if (!title || !author || !category) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    book.title = title;
    book.author = author;
    book.category = category;

    res.status(200).json({
        message: "Book updated successfully",
        book: book
    });
});
app.delete('/books/:id', (req, res) => {
    const index = books.findIndex(b => b.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook[0]
    });
});

const server = http.createServer(app);

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Library Management Server running at http://localhost:${PORT}`);
});