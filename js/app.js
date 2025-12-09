document.addEventListener("DOMContentLoaded", () => {
    console.log("JS loaded ✅");

    let tasks = [];

    const taskInput = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("taskList");
    const taskCount = document.getElementById("taskCount");
    const filterButtons = document.querySelectorAll(".filters button");

    function loadTask() {
        const data = localStorage.getItem("tasks");
        if (data) {
            tasks = JSON.parse(data);
        } else {
            tasks = [];
        }
        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks(filter = "all") {
        taskList.innerHTML = "";

        const filteredTasks = tasks.filter(task => {
            if (filter === "completed") return task.completed;
            if (filter === "pending") return !task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement("li");
            li.classList.add("task-enter")

            setTimeout(() =>{
                li.classList.add("task-enter-active");
            }, 10);

            li.innerHTML = `
                <span class="${task.completed ? "completed" : ""}">
                    ${task.text}
                </span>
                <button onclick="toggleTask(${task.id})" id="completeBtn">   
                    <img src="asserts/check.png" alt="Done" style="width: 20px; height: 20px;">
                </button>
                <button onclick="deleteTask(${task.id})" id="deleteBtn">
                    <img src="asserts/delete.png" alt="Done" style="width: 20px; height: 20px;">
                </button>
            `;

            taskList.appendChild(li);
        });

        taskCount.innerHTML = `Total: ${filteredTasks.length}`;
    }

    addBtn.addEventListener("click", () => {
        const text = taskInput.value.trim();
        if (text === "") return;

        const task = {
            id: Date.now(),
            text,
            completed: false
        };

        tasks.push(task);
        taskInput.value = "";
        saveTasks();
        renderTasks();
    });

    window.toggleTask = function (id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    };

    window.deleteTask = function (id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            const currActive = document.querySelector(".filters button.active");
            if(currActive){
                currActive.classList.remove("active")
            }
            btn.classList.add("active");

            const mode = btn.getAttribute("data-filter");
            renderTasks(mode);
        });
    });

    const themeToggle = document.getElementById("themeToggle");
    if(localStorage.getItem("theme") === "dark"){
        document.body.classList.add("dark");
        themeToggle.textContent = "☀️";
    }
    themeToggle.addEventListener("click", () =>{
        document.body.classList.toggle("dark");
        
        const themes = document.body.classList.contains("dark") ? "dark" : "light";
        themeToggle.textContent = themes === "dark" ? "☀️" : "🌙";
        localStorage.setItem("theme", themes)
    })

    loadTask();
});
