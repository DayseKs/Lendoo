const path = window.location.pathname;

let status = "";

if (path.includes("lidos")) {
  status = "lido";
}

if (path.includes("lendo")) {
  status = "lendo";
}

if (path.includes("quero-ler")) {
  status = "quero";
}

async function carregarLivros() {
  const response = await fetch(`/books/status/${status}`);

  const books = await response.json();

  const booksGrid = document.querySelector(".books-grid");

  booksGrid.innerHTML = "";

  if (books.length === 0) {
    booksGrid.innerHTML = `
      <p>Nenhum livro encontrado.</p>
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

carregarLivros();
