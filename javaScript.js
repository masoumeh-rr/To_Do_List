let todoInput = document.querySelector("#input_tasks");
let addingTodoBtn = document.querySelector("#add_tasks_btn");
let todosList = document.querySelector("#task_list");
let fillter = document.querySelector(".filter_option");
let deleteAllTodosBtn = document.querySelector(".delete_all_btn");

addingTodoBtn.addEventListener("click", addTodos);
todosList.addEventListener("click", handelDeleteTodo);
todosList.addEventListener("change", handelChangeTodo);
fillter.addEventListener("change", filltered);
deleteAllTodosBtn.addEventListener("click", deleteAllTodos)
document.addEventListener("DOMContentLoaded", getLocalStoragText);

function addTodosElements(text, completed) {
    //div
    let todosContainer = document.createElement("div");
    todosContainer.classList.add("task_container");

    if (completed) todosContainer.classList.add("completed");

    //div text
    let textContainer = document.createElement("div");
    textContainer.classList.add("text_container");
    todosContainer.append(textContainer);

    //li
    let todoItem = document.createElement("li");
    todoItem.classList.add("task_text");
    textContainer.append(todoItem);

    //checkbox
    let checkTodo = document.createElement("input");
    checkTodo.setAttribute("type", "checkbox");
    checkTodo.id = "check_todo";
    textContainer.append(checkTodo);
    checkTodo.checked = completed;

    //label
    let todoLabel = document.createElement("label");
    todoLabel.setAttribute("for", "check_todo");
    todoLabel.textContent = text;
    textContainer.append(todoLabel);
    todoLabel.classList.add("task_label");

    //button
    let deleteTodoBtn = document.createElement("button");
    deleteTodoBtn.innerHTML = `<span class="material-symbols-outlined">delete_forever</span>`;
    deleteTodoBtn.classList.add("delete_task_btn");
    todosContainer.append(deleteTodoBtn);

    return todosContainer;

}

function addTodos() {

    let todo = todoInput.value.trim();
    if (todoInput.value === "") return;

    saveLocalStorage(todo, false);
    todosList.append(addTodosElements(todo, false));
    updateDeleteAllBtn();
    todoInput.value = "";
}

function filltered(event) {
    let option = event.target.value;
    let fillteredClass = todosList.querySelectorAll(".task_container");
    fillteredClass.forEach(item => {
        switch (option) {
            case "all":
                item.style.display = "flex";
                break;

            case "completed":
                item.style.display = item.classList.contains("completed") ? "flex" : "none";
                break;

            case "uncompleted":
                item.style.display = item.classList.contains("completed") ? "none" : "flex";
                break;
        }
    })

}

function handelDeleteTodo(event) {
    let item = event.target.parentElement;
    let innetText = item.parentElement.querySelector(".text_container").querySelector(".task_label").textContent;

    if (item.classList[0] === "delete_task_btn") {
        item.parentElement.remove();
        deleteLocalStorage(innetText);
        updateDeleteAllBtn();
    }
}

function handelChangeTodo(event) {
    let item = event.target;
    let text = item.parentElement;
    let allDiv = text.parentElement;

    if (item.id === "check_todo") {
        allDiv.classList.toggle("completed");
    }
    
    let todo = getLocalStorag();
    let innerText = text.querySelector(".task_label").textContent;
    let target = todo.find(item => item.text === innerText);

    if (target) target.completed = allDiv.classList.contains("completed");
    localStorage.setItem("todos", JSON.stringify(todo))

}

function getLocalStorag() {
    return JSON.parse(localStorage.getItem("todos")) || [];
}

function saveLocalStorage(text, completed = false) {
    let todo = getLocalStorag();
    todo.push({ text, completed });
    localStorage.setItem("todos", JSON.stringify(todo));
}

function deleteLocalStorage(text) {
    let todo = getLocalStorag();
    todo = todo.filter(t => t.text !== text)
    localStorage.setItem("todos", JSON.stringify(todo));
    updateDeleteAllBtn();
}

function getLocalStoragText() {
    let todos = getLocalStorag();
    todos.forEach(todo => {
        todosList.append(addTodosElements(todo.text, todo.completed));
        updateDeleteAllBtn();
    })
}

function deleteAllTodos() {
    localStorage.removeItem("todos");
    todosList.innerHTML = "";
    updateDeleteAllBtn();
}



function updateDeleteAllBtn() {
    if (todosList.children.length > 0) {
        deleteAllTodosBtn.style.display = "block";
    } else {
        deleteAllTodosBtn.style.display = "none";
    }
}