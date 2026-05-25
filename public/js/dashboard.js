async function verificarLogin() {
  const response = await fetch("/auth/me");

  const data = await response.json();

  if (!data.logged) {
    window.location.href = "/pages/login.html";
  }
}

async function buscarLivros() {
  const response = await fetch("/books");

  const books = await response.json();

  const booksGrid = document.querySelector(".books-grid");

  booksGrid.innerHTML = "";

  if (books.length === 0) {
    booksGrid.innerHTML = `
      <p>Nenhum livro salvo.</p>
    `;

    return;
  }

  books.forEach((book) => {
    booksGrid.innerHTML += `
      <article class="book-card">
        <a href="/pages/livro.html?googleId=${book.google_book_id}">
          <img src="${book.thumbnail}" alt="${book.title}" />
        </a>

        <h2 class="book-title">${book.title}</h2>

        <p class="author">${book.author}</p>

        <span class="status">${book.status}</span>
      </article>
    `;
  });
}

verificarLogin();
buscarLivros();
