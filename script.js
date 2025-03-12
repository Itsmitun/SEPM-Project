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
        const newExpense = { name, amount, category, recurring, frequency, date: new Date().toISOString() };
        expenses.push(newExpense);
        saveExpenses(expenses);
        renderExpenses();
    }

    function renderExpenses() {
        expenseList.innerHTML = "";
        let total = 0;
        getExpenses().forEach(expense => {
            const listItem = document.createElement("li");
            listItem.textContent = `${expense.name} - ₹${expense.amount} (${expense.category})${expense.recurring ? ` - Recurs ${expense.frequency}` : ''}`;
            expenseList.appendChild(listItem);
            total += parseFloat(expense.amount);
        });
        totalAmount.textContent = total.toFixed(2);
    }

    function checkRecurringExpenses() {
        const expenses = getExpenses();
        const today = new Date();
        const updatedExpenses = [...expenses];

        expenses.forEach(expense => {
            if (expense.recurring && expense.frequency === "monthly") {
                const expenseDate = new Date(expense.date);
                if (today.getMonth() !== expenseDate.getMonth()) {
                    updatedExpenses.push({ ...expense, date: today.toISOString() });
                }
            }
        });

        saveExpenses(updatedExpenses);
        renderExpenses();
    }

    // Login Logic
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

    if (localStorage.getItem("expenses")) {
        showApp();
    }
});
