const express = require("express");
const db = require("../database/db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/save", authMiddleware, (req, res) => {
  const {
    google_book_id,
    title,
    author,
    thumbnail,
    description,
    pages,
    published_date,
    category,
    status,
  } = req.body;

  const existingBook = db
    .prepare(
      `
      SELECT * FROM books
      WHERE google_book_id = ?
      AND user_id = ?
    `,
    )
    .get(google_book_id, req.session.userId);

  if (existingBook) {
    return res.status(400).json({
      message: "Livro já salvo",
    });
  }

  db.prepare(
    `
    INSERT INTO books (
      google_book_id,
      user_id,
      title,
      author,
      thumbnail,
      description,
      pages,
      published_date,
      category,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    google_book_id,
    req.session.userId,
    title,
    author,
    thumbnail,
    description,
    pages,
    published_date,
    category,
    status,
  );

  res.json({
    message: "Livro salvo com sucesso",
  });
});

router.get("/", authMiddleware, (req, res) => {
  const books = db
    .prepare(
      `
      SELECT * FROM books
      WHERE user_id = ?
      ORDER BY id DESC
    `,
    )
    .all(req.session.userId);

  res.json(books);
});

router.get("/status/:status", authMiddleware, (req, res) => {
  const books = db
    .prepare(
      `
      SELECT * FROM books
      WHERE user_id = ?
      AND status = ?
      ORDER BY id DESC
    `,
    )
    .all(req.session.userId, req.params.status);

  res.json(books);
});

router.put("/:id/status", authMiddleware, (req, res) => {
  const { status } = req.body;

  db.prepare(
    `
    UPDATE books
    SET status = ?
    WHERE id = ?
    AND user_id = ?
  `,
  ).run(status, req.params.id, req.session.userId);

  res.json({
    message: "Status atualizado",
  });
});

router.delete("/:id", authMiddleware, (req, res) => {
  db.prepare(
    `
    DELETE FROM books
    WHERE id = ?
    AND user_id = ?
  `,
  ).run(req.params.id, req.session.userId);

  res.json({
    message: "Livro removido",
  });
});

module.exports = router;
