document.addEventListener("DOMContentLoaded", () => {
    const dbRequest = indexedDB.open("TodoDB", 1);
    let db;

    dbRequest.onupgradeneeded = (e) => {
        db = e.target.result;
        db.createObjectStore("todos", { keyPath: "id", autoIncrement: true });
    };

    dbRequest.onsuccess = (e) => {
        db = e.target.result;
        loadTodos();
    };

    dbRequest.onerror = (e) => {
        console.error("Error opening database:", e);
    };

    document.getElementById("add-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const taskInput = document.getElementById("new-task");
        const task = taskInput.value.trim();
        if (task) {
            addTask(task);
            taskInput.value = "";
        }
    });

    function loadTodos() {
        const transaction = db.transaction(["todos"], "readonly");
        const store = transaction.objectStore("todos");
        const request = store.getAll();

        request.onsuccess = () => {
            const todos = request.result;
            const list = document.getElementById("todo-list");
            list.innerHTML = "";
            todos.forEach(todo => {
                list.appendChild(createTodoElement(todo));
            });
        };
    }

    function addTask(task) {
        const transaction = db.transaction(["todos"], "readwrite");
        const store = transaction.objectStore("todos");
        const newTodo = { task, done: false };

        const request = store.add(newTodo);
        request.onsuccess = () => loadTodos();
    }

    function toggleTask(id, doneStatus) {
        const transaction = db.transaction(["todos"], "readwrite");
        const store = transaction.objectStore("todos");

        const request = store.get(id);
        request.onsuccess = () => {
            const todo = request.result;
            todo.done = !doneStatus;
            store.put(todo);
            loadTodos();
        };
    }

    function deleteTask(id) {
        const transaction = db.transaction(["todos"], "readwrite");
        const store = transaction.objectStore("todos");

        const request = store.delete(id);
        request.onsuccess = () => loadTodos();
    }

    function createTodoElement(todo) {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.textContent = todo.task;
        span.classList.toggle("done", todo.done);
        span.addEventListener("click", () => toggleTask(todo.id, todo.done));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteTask(todo.id));

        li.appendChild(span);
        li.appendChild(deleteBtn);

        return li;
    }
});
