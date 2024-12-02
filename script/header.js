document.addEventListener("DOMContentLoaded", function () {
  const headerHtml = `
    <header>
      <nav class="navbar">
        <a href="/pages/index.html" class="nav-link">Главная</a>
        <a href="/pages/notebook.html" class="nav-link">Заметки</a>
        <a href="/pages/time.html" class="nav-link">Время</a>
        <a href="/pages/game.html" class="nav-link">Игра</a>
      </nav>
    </header>
  `;

  document.body.insertAdjacentHTML("afterbegin", headerHtml);
});
