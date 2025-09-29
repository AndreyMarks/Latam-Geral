// JavaScript para rolagem suave e outras interatividades
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});




// === Controle de visibilidade do header ===
let lastScroll = 0;
const header = document.querySelector("header");

if (header) {
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll) {
      // Rolando para baixo → esconder
      header.classList.add("hidden");
    } else {
      // Rolando para cima → mostrar
      header.classList.remove("hidden");
    }

    lastScroll = currentScroll;
  });
}
