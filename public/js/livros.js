const params = new URLSearchParams(window.location.search);

const googleId = params.get("googleId");

let currentBook = {};
let savedBookId = null;

async function buscarLivro() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${googleId}?key=AIzaSyCKHxrusEqTkpvttcrh6nDmTkz_Uhvc3Vg`,
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar livro");
    }

    const data = await response.json();

    const info = data.volumeInfo;

    currentBook = {
      id: data.id,

      title: info.title,
      author: info.authors?.[0] || "Autor desconhecido",

      thumbnail: info.imageLinks?.thumbnail || "",

      description: info.description || "Sem descrição",

      pages: info.pageCount || 0,

      published_date: info.publishedDate || "Desconhecido",

      category: info.categories?.[0] || "Sem categoria",

      status: "quero",
    };

    renderizarLivro();

    verificarSeLivroEstaSalvo();
  } catch (error) {
    console.error(error);
  }
}

function renderizarLivro() {
  document.querySelector(".book-cover").src = currentBook.thumbnail;

  document.querySelector(".book-title").textContent = currentBook.title;

  document.querySelector(".author").textContent = currentBook.author;

  document.querySelector(".years").textContent = currentBook.published_date;

  document.querySelector(".pages").textContent = `${currentBook.pages} páginas`;

  document.querySelector(".genre").textContent = currentBook.category;

  document.querySelector(".sinopse p").innerHTML = currentBook.description;
}

async function verificarSeLivroEstaSalvo() {
  try {
    const response = await fetch("/books");

    const books = await response.json();

    const savedBook = books.find((book) => book.google_book_id === googleId);

    if (!savedBook) return;

    savedBookId = savedBook.id;

    currentBook.status = savedBook.status;

    atualizarBotaoEstante(true);

    ativarStatus(savedBook.status);
  } catch (error) {
    console.error(error);
  }
}

function ativarStatus(status) {
  document.querySelectorAll(".status-options button").forEach((btn) => {
    btn.classList.remove("active");
  });

  if (status === "lido") {
    document.querySelector(".lido").classList.add("active");
  }

  if (status === "lendo") {
    document.querySelector(".lendo").classList.add("active");
  }

  if (status === "quero") {
    document.querySelector(".quero").classList.add("active");
  }
}

function atualizarBotaoEstante(salvo) {
  const btnAdicionar = document.querySelector(".btn-favorito");

  const btnRemover = document.querySelector(".btn-remover");

  if (salvo) {
    btnAdicionar.style.display = "none";
    btnRemover.style.display = "block";
  } else {
    btnAdicionar.style.display = "block";
    btnRemover.style.display = "none";
  }
}

buscarLivro();

const btnVoltar = document.querySelector(".btn-voltar");

btnVoltar.addEventListener("click", () => {
  window.history.back();
});

const btnAdicionar = document.querySelector(".btn-favorito");

btnAdicionar.addEventListener("click", async () => {
  try {
    const response = await fetch("/books/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        google_book_id: currentBook.id,
        title: currentBook.title,
        author: currentBook.author,
        thumbnail: currentBook.thumbnail,
        description: currentBook.description,
        pages: currentBook.pages,
        published_date: currentBook.published_date,
        category: currentBook.category,
        status: currentBook.status || "quero",
      }),
    });

    const data = await response.json();

    alert(data.message);
  } catch (error) {
    console.error(error);
  }
});

const btnRemover = document.querySelector(".btn-remover");

btnRemover.addEventListener("click", async () => {
  try {
    const response = await fetch(`/books/${savedBookId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    alert(data.message);

    savedBookId = null;

    atualizarBotaoEstante(false);
  } catch (error) {
    console.error(error);
  }
});

const botoesStatus = document.querySelectorAll(".status-options button");

botoesStatus.forEach((button) => {
  button.addEventListener("click", async () => {
    botoesStatus.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    let status = "quero";

    if (button.classList.contains("lido")) {
      status = "lido";
    }

    if (button.classList.contains("lendo")) {
      status = "lendo";
    }

    if (button.classList.contains("quero")) {
      status = "quero";
    }

    currentBook.status = status;

    if (!savedBookId) return;

    try {
      await fetch(`/books/${savedBookId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  });
});
