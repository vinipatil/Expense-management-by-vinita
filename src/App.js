import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [totalSalary, setTotalSalary] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [totalSalaryInput, setTotalSalaryInput] = useState("");

  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
    setExpenses(storedExpenses);

    const storedTotalSalary = localStorage.getItem("totalSalary") || "";
    setTotalSalary(storedTotalSalary);
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("totalSalary", totalSalary);
  }, [totalSalary]);

  const handleAddExpense = () => {
    if (name && amount) {
      const newExpense = {
        id: new Date().getTime(),
        name,
        amount: parseFloat(amount),
        date: new Date().toLocaleDateString()
      };
      setExpenses([...expenses, newExpense]);
      setName("");
      setAmount("");
    } else {
      alert("Please enter name and amount.");
    }
  };

  const handleUpdateTotalSalary = () => {
    if (totalSalaryInput) {
      setTotalSalary(totalSalaryInput);
    } else {
      alert("Please enter total salary.");
    }
  };

  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
  };

  const handleEditExpense = (id) => {
    const expenseToEdit = expenses.find((expense) => expense.id === id);
    setName(expenseToEdit.name);
    setAmount(expenseToEdit.amount.toString());
    setEditingId(id);
  };

  const handleSaveEdit = () => {
    if (name && amount) {
      const updatedExpenses = expenses.map((expense) =>
        expense.id === editingId
          ? { ...expense, name, amount: parseFloat(amount) }
          : expense
      );
      setExpenses(updatedExpenses);
      setName("");
      setAmount("");
      setEditingId(null);
    } else {
      alert("Please enter name and amount.");
    }
  };

  const totalExpenseCost = expenses.reduce((total, expense) => total + expense.amount, 0);

  const remainingSalary = totalSalary - totalExpenseCost;

  return (
    <div><h1>Expense Management</h1>
      <div className="container">
        <div className="left-container">
          <div>
            <label htmlFor="total-salary">Total Salary:</label>
            <input
              type="text"
              id="total-salary"
              placeholder="Enter Total Salary"
              value={totalSalaryInput}
              onChange={(e) => setTotalSalaryInput(e.target.value)}
            /><br></br>
            <button onClick={handleUpdateTotalSalary}>Submit</button>
          </div>
          <h2>Total Salary: ₹{totalSalary}</h2>
          <div>
            <input
              type="text"
              placeholder="Expense Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {editingId ? (
              <button onClick={handleSaveEdit}>Save</button>
            ) : (
              <button onClick={handleAddExpense}>Add Expense</button>
            )}
          </div>
          <h2>Total Expense Cost: ₹{totalExpenseCost.toFixed(2)}</h2>
        </div>
        <div className="right-container">
          <h3>Expenses</h3>
        <ul>
            {expenses.map((expense) => (
              <div key={expense.id} className="expense-item">
                <span>{expense.name}</span> - <span>₹{expense.amount.toFixed(2)}</span> - <span>{expense.date}</span>
                <span className="action-icons">
                  <button onClick={() => handleEditExpense(expense.id)}>Edit</button>
                  <button onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
                </span>
              </div>
            ))}

          </ul>
          <div>
            <h2>Savings: ₹{remainingSalary.toFixed(2)}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
