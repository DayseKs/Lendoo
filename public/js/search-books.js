const input = document.querySelector("#search");

if (input) {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      buscarLivros(input.value);
    }
  });
}

async function buscarLivros(search) {
  if (!search.trim()) return;

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(search)}&maxResults=12&key=AIzaSyCKHxrusEqTkpvttcrh6nDmTkz_Uhvc3Vg`,
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar livros");
    }

    const data = await response.json();

    const booksGrid = document.querySelector(".books-grid");

    booksGrid.innerHTML = "";

    if (!data.items) {
      booksGrid.innerHTML = `
        <p>Nenhum livro encontrado.</p>
      `;
      return;
    }

    data.items.forEach((item) => {
      const info = item.volumeInfo;

      booksGrid.innerHTML += `
        <article class="book-card">
          <a href="/pages/livro.html?googleId=${item.id}">
            <img
              src="${info.imageLinks?.thumbnail || ""}"
              alt="${info.title}"
            />
          </a>

          <h2 class="book-title">
            ${info.title || "Sem título"}
          </h2>

          <p class="author">
            ${info.authors?.[0] || "Autor desconhecido"}
          </p>
        </article>
      `;
    });
  } catch (error) {
    console.error(error);

    document.querySelector(".books-grid").innerHTML = `
      <p>Erro ao buscar livros.</p>
    `;
  }
}
