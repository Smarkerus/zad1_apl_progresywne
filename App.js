const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoStats = document.getElementById("todo-stats");
const clearCompletedBtn = document.getElementById("clear-completed");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {
  sortTodos();
  todoList.innerHTML = "";
  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;
    li.innerHTML = `
            <input type="checkbox" ${todo.completed ? "checked" : ""}>
            <span>${
              todo.text
            }</span><span class="created-at"> (Dodano: ${new Date(
      todo.createdAt
    ).toLocaleString()})</span>
            <button class="delete-btn">Usuń</button>
        `;
    li.querySelector("input").addEventListener("change", () =>
      toggleTodo(todo.id)
    );
    li.querySelector(".delete-btn").addEventListener("click", () =>
      deleteTodo(todo.id)
    );
    todoList.appendChild(li);
  });
  updateStats();
}

function updateStats() {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  todoStats.innerHTML = `Liczba zadań: ${total} <br/> Liczba ukończonych zadań: ${completed}`;
  saveTodos();
}

function sortTodos() {
  todos.sort((a, b) => {
    if (a.completed === b.completed) {
      return a.createdAt - b.createdAt;
    }
    return a.completed - b.completed;
  });
}

function addTodo(text) {
  const todo = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos = [todo, ...todos];
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    addTodo(text);
    todoInput.value = "";
  }
});

clearCompletedBtn.addEventListener("click", clearCompleted);

renderTodos();
