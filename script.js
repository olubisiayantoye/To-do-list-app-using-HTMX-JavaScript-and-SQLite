function createTodoElement(todo) {
    const row = document.createElement("tr");

    // Task cell
    const taskCell = document.createElement("td");
    taskCell.textContent = todo.task;
    taskCell.classList.toggle("done", todo.done);
    taskCell.addEventListener("click", () => toggleTask(todo.id, todo.done));

    // Due date cell
    const dueDateCell = document.createElement("td");
    dueDateCell.textContent = todo.due_date || "No Due Date";

    // Priority cell
    const priorityCell = document.createElement("td");
    priorityCell.textContent = todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1);

    // Category cell
    const categoryCell = document.createElement("td");
    categoryCell.textContent = todo.category || "Uncategorized";

    // Progress cell (use a progress bar)
    const progressCell = document.createElement("td");
    const progressContainer = document.createElement("div");
    progressContainer.className = "progress-container";
    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    progressBar.style.width = `${todo.progress}%`;
    progressContainer.appendChild(progressBar);
    progressCell.appendChild(progressContainer);

    // Action cell (for Toggle and Delete buttons)
    const actionCell = document.createElement("td");

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = todo.done ? "Undo" : "Complete";
    toggleBtn.addEventListener("click", () => toggleTask(todo.id, todo.done));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(todo.id));

    actionCell.appendChild(toggleBtn);
    actionCell.appendChild(deleteBtn);

    // Append all cells to the row
    row.appendChild(taskCell);
    row.appendChild(dueDateCell);
    row.appendChild(priorityCell);
    row.appendChild(categoryCell);
    row.appendChild(progressCell);
    row.appendChild(actionCell);

    return row;
}

function loadTodos() {
    const transaction = db.transaction("todos", "readonly");
    const store = transaction.objectStore("todos");
    const request = store.getAll();

    request.onsuccess = () => {
        const todos = request.result;
        const tbody = document.querySelector("#todo-list tbody");
        tbody.innerHTML = ""; // Clear existing rows
        todos.forEach(todo => {
            tbody.appendChild(createTodoElement(todo));
        });
    };
}
