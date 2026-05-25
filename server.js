const express = require("express");
const path = require("path");
const session = require("express-session");

const authRoutes = require("./routes/auth");
const booksRoutes = require("./routes/books");

const app = express();

app.use(express.json());

app.use(
  session({
    secret: "lendoo_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "strict",
    },
  }),
);

app.use("/auth", authRoutes);
app.use("/books", booksRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
