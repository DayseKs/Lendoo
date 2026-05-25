const logoutBtn = document.querySelector("a[href='../pages/perfil.html']");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    await fetch("/auth/logout", {
      method: "POST",
    });

    window.location.href = "/pages/login.html";
  });
}
