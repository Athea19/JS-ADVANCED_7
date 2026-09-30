// Track whether data has already been loaded to prevent duplicate requests
let isLoaded = false;
let isLoading = false;

const loadBtn = document.getElementById("loadBtn");
const clearBtn = document.getElementById("clearBtn");
const todoBody = document.getElementById("todoBody");
const statusMessage = document.getElementById("statusMessage");

const API_URL = "https://jsonplaceholder.typicode.com/todos/";


// ========================================
// LOAD DATA FROM API
// ========================================
loadBtn.addEventListener("click", function () {
    // Prevent repeated loading if already loaded
    if (isLoaded) {
        alert("Data has already been loaded.");
        return;
    }

    if (isLoading) {
        return;
    }

    isLoading = true;
    statusMessage.textContent = "Loading data from API...";
    statusMessage.className = "status-message loading";

    fetch(API_URL)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP error! Status: " + response.status);
            }
            return response.json();
        })
        .then(function (todos) {
            // Clear existing rows before appending to ensure no duplicates
            todoBody.innerHTML = "";

            todos.forEach(function (todo) {
                const tr = document.createElement("tr");

                // User ID
                const tdUserId = document.createElement("td");
                tdUserId.className = "col-user-id";
                tdUserId.textContent = todo.userId;
                tr.appendChild(tdUserId);

                // Task ID
                const tdTaskId = document.createElement("td");
                tdTaskId.className = "col-task-id";
                tdTaskId.textContent = todo.id;
                tr.appendChild(tdTaskId);

                // Title
                const tdTitle = document.createElement("td");
                tdTitle.className = "col-title";
                tdTitle.textContent = todo.title;
                tr.appendChild(tdTitle);

                // Status
                const tdStatus = document.createElement("td");
                tdStatus.className = "col-status";

                if (todo.completed) {
                    tdStatus.textContent = "Completed";
                    tdStatus.className = "col-status status-completed";
                } else {
                    tdStatus.textContent = "Not yet Completed";
                    tdStatus.className = "col-status status-not-completed";
                }

                tr.appendChild(tdStatus);
                todoBody.appendChild(tr);
            });

            isLoaded = true;
            statusMessage.textContent = "";
            statusMessage.className = "status-message";
        })
        .catch(function (error) {
            console.error("Fetch error:", error);
            statusMessage.textContent = "Failed to load data from API. Please check your internet connection.";
            statusMessage.className = "status-message error";
        })
        .finally(function () {
            isLoading = false;
        });
});


// ========================================
// CLEAR TABLE
// ========================================
clearBtn.addEventListener("click", function () {
    todoBody.innerHTML = "";
    isLoaded = false;
    statusMessage.textContent = "";
    statusMessage.className = "status-message";
});
