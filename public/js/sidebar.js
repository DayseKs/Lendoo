const menuBurguer = document.querySelector("#menuBurguer");
const closeBtn = document.querySelector("#closeBtn");
const sidebar = document.querySelector(".sidebar");

console.log(menuBurguer);
console.log(closeBtn);
console.log(sidebar);

if (menuBurguer) {
  menuBurguer.addEventListener("click", () => {
    console.log("abriu");

    sidebar.classList.add("open");
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    console.log("fechou");

    sidebar.classList.remove("open");
  });
}
