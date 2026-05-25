// routes/auth.js

const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database/db");

const router = express.Router();

router.post("/cadastro", async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);

  if (userExists) {
    return res.status(400).json({
      error: "Email já cadastrado",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.prepare(
    `
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
  `,
  ).run(name, email, hashedPassword);

  res.status(201).json({
    message: "Usuário cadastrado",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) {
    return res.status(400).json({
      error: "Email ou senha inválidos",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({
      error: "Email ou senha inválidos",
    });
  }

  req.session.userId = user.id;
  req.session.userName = user.name;

  res.json({
    message: "Login realizado",
  });
});

router.get("/me", (req, res) => {
  if (!req.session.userId) {
    return res.json({
      logged: false,
    });
  }

  res.json({
    logged: true,
    user: {
      id: req.session.userId,
      name: req.session.userName,
    },
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({
      message: "Logout realizado",
    });
  });
});

module.exports = router;
