const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn");

// Load notes from localStorage
function showNotes() {
  const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
  notesContainer.innerHTML = ""; // Очистка контейнера перед добавлением заметок

  savedNotes.forEach((note) => {
    const inputBox = document.createElement("p");
    const img = document.createElement("img");

    inputBox.className = "input-box";
    inputBox.setAttribute("contenteditable", "true");
    inputBox.textContent = note.text;
    img.src = "/images/delete.png";
    img.className = "delete-icon";

    inputBox.appendChild(img);
    notesContainer.appendChild(inputBox);
  });

  addEventListenersToNotes();
}
showNotes();

// Update localStorage with the current notes
function updateStorage() {
  const notes = Array.from(document.querySelectorAll(".input-box")).map(
    (note) => ({
      text: note.textContent, // Текст заметки
    })
  );
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Add new note
createBtn.addEventListener("click", () => {
  const inputBox = document.createElement("p");
  const img = document.createElement("img");

  inputBox.className = "input-box";
  inputBox.setAttribute("contenteditable", "true");
  img.src = "/images/delete.png";
  img.className = "delete-icon";

  inputBox.appendChild(img);
  notesContainer.appendChild(inputBox);

  addEventListenersToNotes();
  updateStorage();
});

// Add event listeners to notes
function addEventListenersToNotes() {
  const notes = document.querySelectorAll(".input-box");

  notes.forEach((note) => {
    // Delete note
    const deleteBtn = note.querySelector("img");
    deleteBtn.addEventListener("click", () => {
      note.remove();
      updateStorage();
    });

    // Save changes when typing
    note.addEventListener("input", updateStorage);
  });
}
