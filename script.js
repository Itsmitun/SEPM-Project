document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const appSection = document.getElementById("app-section");
    const loginSection = document.getElementById("login-section");
    const logoutButton = document.getElementById("logout-button");
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const recurringCheckbox = document.getElementById("recurring-expense");
    const recurringFrequency = document.getElementById("recurring-frequency");

    recurringCheckbox.addEventListener("change", function() {
        recurringFrequency.disabled = !recurringCheckbox.checked;
    });

    function getExpenses() {
        return JSON.parse(localStorage.getItem("expenses")) || [];
    }

    function saveExpenses(expenses) {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    function addExpense(name, amount, category, recurring, frequency) {
        const expenses = getExpenses();
        const newExpense = { id: Date.now(), name, amount, category, recurring, frequency, date: new Date().toISOString() };
        expenses.push(newExpense);
        saveExpenses(expenses);
        renderExpenses();
    }

    function deleteExpense(id) {
        const expenses = getExpenses().filter(expense => expense.id !== id);
        saveExpenses(expenses);
        renderExpenses();
    }

    function editExpense(index) {
        let expenses = getExpenses();
        let expense = expenses[index];
    
        // Populate the form with the selected expense
        document.getElementById("expense-name").value = expense.name;
        document.getElementById("expense-amount").value = expense.amount;
        document.getElementById("expense-category").value = expense.category;
        document.getElementById("recurring-checkbox").checked = expense.recurring;
    
        // Show frequency only if it's recurring
        if (expense.recurring) {
            document.getElementById("recurring-frequency").value = expense.frequency;
            document.getElementById("recurring-frequency").disabled = false;
        } else {
            document.getElementById("recurring-frequency").disabled = true;
        }
    
        editIndex = index; // Store the index of the expense being edited
    }

    function renderExpenses() {
        expenseList.innerHTML = "";
        let total = 0;
        getExpenses().forEach((expense, index) => {
            const listItem = document.createElement("li");
    
            const text = document.createElement("span");
            text.textContent = `${expense.name} - ₹${expense.amount} (${expense.category})${expense.recurring ? ` - Recurs ${expense.frequency}` : ''}`;
    
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button-container");
    
            const editButton = document.createElement("button");
            editButton.classList.add("edit");
            editButton.innerHTML = "✏️";
            editButton.onclick = () => editExpense(index);
    
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete");
            deleteButton.innerHTML = "❌";
            deleteButton.onclick = () => deleteExpense(index);
    
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);
    
            listItem.appendChild(text);
            listItem.appendChild(buttonContainer);
            expenseList.appendChild(listItem);
    
            total += parseFloat(expense.amount);
        });
        totalAmount.textContent = total.toFixed(2);
    }

    let editIndex = -1;
    function editExpense(index) {
        let expenses = getExpenses();
        let expense = expenses[index];
    
        document.getElementById("expense-name").value = expense.name;
        document.getElementById("expense-amount").value = expense.amount;
        document.getElementById("expense-category").value = expense.category;
        document.getElementById("recurring-checkbox").checked = expense.recurring;
    
        if (expense.recurring) {
            document.getElementById("recurring-frequency").value = expense.frequency;
            document.getElementById("recurring-frequency").disabled = false;
        } else {
            document.getElementById("recurring-frequency").disabled = true;
        }
    
        editIndex = index; // ✅ Store the index for updating
    }
    
    function deleteExpense(index) {
        const expenses = getExpenses();
        expenses.splice(index, 1); // Remove the selected expense
        saveExpenses(expenses);
        renderExpenses();
    }

    function checkRecurringExpenses() {
        const expenses = getExpenses();
        const today = new Date();
        const updatedExpenses = [...expenses];

        expenses.forEach(expense => {
            if (expense.recurring && expense.frequency === "monthly") {
                const expenseDate = new Date(expense.date);
                if (today.getMonth() !== expenseDate.getMonth()) {
                    updatedExpenses.push({ ...expense, date: today.toISOString(), id: Date.now() });
                }
            }
        });

        saveExpenses(updatedExpenses);
        renderExpenses();
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        showApp();
    });

    function showApp() {
        loginSection.style.display = "none";
        appSection.style.display = "block";
        renderExpenses();
        checkRecurringExpenses();
    }

    expenseForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("expense-name").value;
        const amount = document.getElementById("expense-amount").value;
        const category = document.getElementById("expense-category").value;
        const recurring = recurringCheckbox.checked;
        const frequency = recurring ? recurringFrequency.value : null;

        addExpense(name, amount, category, recurring, frequency);

        expenseForm.reset();
        recurringFrequency.disabled = true;
    });

    logoutButton.addEventListener("click", function () {
        appSection.style.display = "none";
        loginSection.style.display = "block";
    });

    document.getElementById("expense-form").addEventListener("submit", function (event) {
        event.preventDefault();
    
        const name = document.getElementById("expense-name").value.trim();
        const amount = document.getElementById("expense-amount").value.trim();
        const category = document.getElementById("expense-category").value.trim();
        const recurring = document.getElementById("recurring-checkbox").checked;
        const frequency = recurring ? document.getElementById("recurring-frequency").value : null;
    
        if (!name || !amount || isNaN(amount) || !category) {
            alert("Please fill all fields correctly.");
            return;
        }
    
        let expenses = getExpenses();
    
        if (editIndex !== -1) {
            // ✅ Update existing expense
            expenses[editIndex] = { name, amount, category, recurring, frequency };
            editIndex = -1; // ✅ Reset edit mode after updating
        } else {
            // ✅ Add a new expense
            expenses.push({ name, amount, category, recurring, frequency });
        }
    
        saveExpenses(expenses);
        renderExpenses();
        expenseForm.reset();
        document.getElementById("recurring-frequency").disabled = true;
    });
    
    

    if (localStorage.getItem("expenses")) {
        showApp();
    }
});
