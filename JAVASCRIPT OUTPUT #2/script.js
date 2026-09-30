// Array to store records
let records = [];

// Index of record currently being edited (null if adding a new record)
let editIndex = null;

// Local Storage Key
const STORAGE_KEY = "js_web_output_2_records";

// Form elements
const firstNameInput = document.getElementById("firstName");
const middleNameInput = document.getElementById("middleName");
const lastNameInput = document.getElementById("lastName");
const ageInput = document.getElementById("age");

const updateBtn = document.getElementById("updateBtn");
const clearBtn = document.getElementById("clearBtn");

// Records table element
const recordsBody = document.getElementById("recordsBody");

// Bottom controls
const clearRecordsBtn = document.getElementById("clearRecordsBtn");
const sortFieldSelect = document.getElementById("sortField");
const sortOrderSelect = document.getElementById("sortOrder");
const saveLocalStorageBtn = document.getElementById("saveLocalStorageBtn");


// ========================================
// INITIAL LOAD FROM LOCAL STORAGE
// ========================================
window.addEventListener("DOMContentLoaded", function () {
    const savedRecords = localStorage.getItem(STORAGE_KEY);
    if (savedRecords) {
        try {
            records = JSON.parse(savedRecords) || [];
            displayRecords();
        } catch (e) {
            console.error("Error parsing stored records:", e);
            records = [];
        }
    }
});


// ========================================
// DISPLAY RECORDS IN TABLE
// ========================================
function displayRecords() {
    recordsBody.innerHTML = "";

    records.forEach(function (record, index) {
        const tr = document.createElement("tr");

        // First Name
        const tdFirst = document.createElement("td");
        tdFirst.className = "text-left";
        tdFirst.textContent = record.firstName;
        tr.appendChild(tdFirst);

        // Middle Name
        const tdMiddle = document.createElement("td");
        tdMiddle.className = "text-left";
        tdMiddle.textContent = record.middleName;
        tr.appendChild(tdMiddle);

        // Last Name
        const tdLast = document.createElement("td");
        tdLast.className = "text-left";
        tdLast.textContent = record.lastName;
        tr.appendChild(tdLast);

        // Age
        const tdAge = document.createElement("td");
        tdAge.className = "text-center";
        tdAge.textContent = record.age;
        tr.appendChild(tdAge);

        // Action Column
        const tdAction = document.createElement("td");
        tdAction.className = "action-cell";

        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            deleteRecord(index);
        });

        // Edit Button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function () {
            editRecord(index);
        });

        tdAction.appendChild(deleteButton);
        tdAction.appendChild(editButton);
        tr.appendChild(tdAction);

        recordsBody.appendChild(tr);
    });
}


// ========================================
// ADD / UPDATE RECORD
// ========================================
updateBtn.addEventListener("click", function () {
    const firstName = firstNameInput.value.trim();
    const middleName = middleNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const ageValue = ageInput.value.trim();

    // Validation: no completely empty inputs and valid age
    if (!firstName || !middleName || !lastName || !ageValue) {
        alert("Please fill in all fields before submitting.");
        return;
    }

    const age = Number(ageValue);
    if (isNaN(age) || age <= 0) {
        alert("Please enter a valid positive age.");
        return;
    }

    const recordData = {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        age: age
    };

    if (editIndex !== null) {
        // Update existing record
        records[editIndex] = recordData;
        editIndex = null;
    } else {
        // Add new record
        records.push(recordData);
    }

    clearForm();
    applyCurrentSort();
    displayRecords();
});


// ========================================
// CLEAR FORM INPUTS
// ========================================
function clearForm() {
    firstNameInput.value = "";
    middleNameInput.value = "";
    lastNameInput.value = "";
    ageInput.value = "";
    editIndex = null;
    firstNameInput.focus();
}

clearBtn.addEventListener("click", function () {
    clearForm();
});


// ========================================
// EDIT RECORD
// ========================================
function editRecord(index) {
    const record = records[index];
    if (!record) return;

    firstNameInput.value = record.firstName;
    middleNameInput.value = record.middleName;
    lastNameInput.value = record.lastName;
    ageInput.value = record.age;

    editIndex = index;
    firstNameInput.focus();
}


// ========================================
// DELETE RECORD
// ========================================
function deleteRecord(index) {
    records.splice(index, 1);

    if (editIndex === index) {
        clearForm();
    } else if (editIndex !== null && editIndex > index) {
        editIndex--;
    }

    displayRecords();
}


// ========================================
// CLEAR ALL RECORDS
// ========================================
clearRecordsBtn.addEventListener("click", function () {
    records = [];
    localStorage.removeItem(STORAGE_KEY);
    clearForm();
    displayRecords();
    alert("All records have been cleared from the table and Local Storage.");
});


// ========================================
// SAVE TO LOCAL STORAGE
// ========================================
saveLocalStorageBtn.addEventListener("click", function () {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    alert("Records have been successfully saved to Local Storage!");
});


// ========================================
// SORTING LOGIC
// ========================================
function applyCurrentSort() {
    const field = sortFieldSelect.value;
    const order = sortOrderSelect.value;

    records.sort(function (a, b) {
        let comparison = 0;

        if (field === "age") {
            comparison = a.age - b.age;
        } else {
            const valA = (a[field] || "").toString().toLowerCase();
            const valB = (b[field] || "").toString().toLowerCase();
            comparison = valA.localeCompare(valB);
        }

        return order === "asc" ? comparison : -comparison;
    });
}

sortFieldSelect.addEventListener("change", function () {
    applyCurrentSort();
    displayRecords();
});

sortOrderSelect.addEventListener("change", function () {
    applyCurrentSort();
    displayRecords();
});


// Keyboard Enter support for quick entry
[firstNameInput, middleNameInput, lastNameInput, ageInput].forEach(function (input) {
    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            updateBtn.click();
        }
    });
});
