let entries = JSON.parse(localStorage.getItem("entries")) || [];

document.getElementById("add-btn").addEventListener("click", addExanpse);
document.querySelectorAll('input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', filterEntries);
});

// filter constants
const ALL = "all";
const INCOME = "income";
const EXPENSE = "expense"

// adding functionality
function addExanpse() {
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;
    const type = document.getElementById("type").value;

    if (description && amount) {
        const entry = { id: Date.now(), description, amount, type }
        entries.push(entry);
        updateEntries();
        displayEntries();
        updateTotals();
    }
}

// Listing the expense
function displayEntries(filter = ALL) {
    const entriesList = document.getElementById("entries");
    entriesList.innerHTML = "";

    const filteredEntries = entries.filter(entry => filter === ALL || entry.type === filter);

    filteredEntries.forEach(entry => {
        const li = document.createElement("li");
        li.className = entry.type;
        li.innerHTML = `${entry.description} - $${entry.amount}
             <div>
                <button><span class="material-icons edit" onclick="editEntry(${entry.id})">edit</span></button>
                <button><span class="material-icons" onclick="deleteEntry(${entry.id})">delete</span></button>
            </div>
        `;
        entriesList.appendChild(li);

    });
}

// edit 
function editEntry(id) {
    const entry = entries.find(entry => entry.id === id);
    document.getElementById('description').value = entry.description;
    document.getElementById('amount').value = entry.amount;
    document.getElementById('type').value = entry.type;

    deleteEntry(id);
}

// delete function
function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    updateEntries();
    displayEntries();
    updateTotals();
}

// filter
function filterEntries() {
    const filter = document.querySelector('input[name="filter"]:checked').value;
    displayEntries(filter);
}

// local storage update
function updateEntries() {
    localStorage.setItem("entries", JSON.stringify(entries));
}

function updateTotals() {
    //    filter the amount

    const totalIncome = entries.filter(entry => entry.type === INCOME)
        .reduce((sum, entry) => parseInt(sum) + parseInt(entry.amount), 0)
    const totalExpense = entries.filter(entry => entry.type === EXPENSE)
        .reduce((sum, entry) => parseInt(sum) + parseInt(entry.amount), 0);
    const netAmount = totalIncome - totalExpense;

    document.getElementById('total-income').textContent = `Total Income: $${totalIncome}`;
    document.getElementById('total-expense').textContent = `Total Expenses: $${totalExpense}`;
    document.getElementById('net-amount').textContent = `Net Amount: $${netAmount}`;
}

// Initialize the app updates
displayEntries();
updateTotals();