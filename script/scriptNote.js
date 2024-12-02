const notesContainer = document.querySelector(".notes-container");
const createBtn = document.querySelector(".btn");

// Load notes from localStorage
function showNotes() {
  const savedNotes = localStorage.getItem("notes");
  if (savedNotes) {
    notesContainer.innerHTML = savedNotes;
    addEventListenersToNotes();
  }
}
showNotes();

// Update localStorage with the current notes
function updateStorage() {
  localStorage.setItem("notes", notesContainer.innerHTML);
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
