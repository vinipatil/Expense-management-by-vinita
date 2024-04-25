import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [totalSalary, setTotalSalary] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [totalSalaryInput, setTotalSalaryInput] = useState("");
  const [selectedMonthRight, setSelectedMonthRight] = useState("");
  const rightContainerRef = useRef(null); // Ref for the right container

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

  // Calculate and update the height of the right container
  useEffect(() => {
    if (rightContainerRef.current) {
      const height = rightContainerRef.current.scrollHeight;
      rightContainerRef.current.style.height = `${height}px`;
    }
  }, [expenses, selectedMonthRight]);

  const handleAddExpense = () => {
    if (name && amount && date) {
      const selectedDate = new Date(date);
      const selectedMonth = selectedDate.toLocaleString("en-us", { month: "long" });
      const newExpense = {
        id: new Date().getTime(),
        name,
        amount: parseFloat(amount),
        date,
        month: selectedMonth
      };
      setExpenses([...expenses, newExpense]);
      setName("");
      setAmount("");
      setDate("");
    } else {
      alert("Please enter name, amount, and choose a date.");
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
    setDate(expenseToEdit.date);
    setEditingId(id);
  };

  const handleSaveEdit = () => {
    if (name && amount && date) {
      const updatedExpenses = expenses.map((expense) =>
        expense.id === editingId
          ? { ...expense, name, amount: parseFloat(amount), date }
          : expense
      );
      setExpenses(updatedExpenses);
      setName("");
      setAmount("");
      setDate("");
      setEditingId(null);
    } else {
      alert("Please enter name, amount, and choose a date.");
    }
  };

  const handleUpdateTotalSalary = () => {
    if (totalSalaryInput) {
      setTotalSalary(totalSalaryInput);
      setTotalSalaryInput("");
    } else {
      alert("Please enter total salary.");
    }
  };

  const calculateTotalExpense = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateSavings = (totalSalary, totalExpense) => {
    return totalSalary - totalExpense;
  };

  const filteredExpensesByMonth = {};
  expenses.forEach((expense) => {
    if (!filteredExpensesByMonth[expense.month]) {
      filteredExpensesByMonth[expense.month] = [];
    }
    filteredExpensesByMonth[expense.month].push(expense);
  });

  const totalExpenseCost = selectedMonthRight
    ? filteredExpensesByMonth[selectedMonthRight]?.reduce((total, expense) => total + expense.amount, 0) || 0
    : expenses.reduce((total, expense) => total + expense.amount, 0);


  const remainingSalary = totalSalary - totalExpenseCost;

  return (
    <div className="background-video-container">
      {/* <video autoPlay loop muted className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <div>
        <h1>Expense Management</h1>
        <div className="container">
          <div className="left-container">
            <div>
              <label htmlFor="total-salary">Salary:</label>
              <input
                type="text"
                id="total-salary"
                placeholder="Enter Your Salary"
                value={totalSalaryInput}
                onChange={(e) => setTotalSalaryInput(e.target.value)}
              />
              <br />
              <button onClick={handleUpdateTotalSalary}>Submit</button>
            </div>
            <h2>Salary: ₹{totalSalary}</h2>
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
              <input
                type="date"
                placeholder="Date (YYYY-MM-DD)"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <br />
              <br />
              {editingId ? (
                <button onClick={handleSaveEdit}>Save</button>
              ) : (
                <button onClick={handleAddExpense}>Add Expense</button>
              )}
            </div>
          </div>
          <div className="right-container" ref={rightContainerRef}>
            <h3>Expenses</h3>
            <div>
              <label htmlFor="select-month-right">Select Month:</label>
              <select
                id="select-month-right"
                value={selectedMonthRight}
                onChange={(e) => setSelectedMonthRight(e.target.value)}
              >
                <option value="">All Months</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>
            {selectedMonthRight ? (
              <div>
                <h4>{selectedMonthRight}</h4>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpensesByMonth[selectedMonthRight] && (
                        filteredExpensesByMonth[selectedMonthRight].map((expense) => (
                          <tr key={expense.id}>
                            <td>{expense.name}</td>
                            <td>₹{expense.amount.toFixed(2)}</td>
                            <td>{expense.date}</td>
                            <td>
                              <button onClick={() => handleEditExpense(expense.id)} className="btn">
                                Edit
                              </button>
                              <button onClick={() => handleDeleteExpense(expense.id)} className="btn">
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}

                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <>
                {Object.keys(filteredExpensesByMonth).map((month) => (
                  <div key={month}>
                    <h4 style={{ fontSize: '24px' }}>{month}</h4>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredExpensesByMonth[month].map((expense) => (
                            <tr key={expense.id}>
                              <td>{expense.name}</td>
                              <td>₹{expense.amount.toFixed(2)}</td>
                              <td>{expense.date}</td>
                              <td>
                                <button onClick={() => handleEditExpense(expense.id)} className="btn">
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteExpense(expense.id)} className="btn">
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredExpensesByMonth[month] && filteredExpensesByMonth[month].length > 0 && (
                      <>
                        <div>
                          <h5>Total Expense for this month: ₹{calculateTotalExpense(filteredExpensesByMonth[month]).toFixed(2)}</h5>
                          <h5>Savings for this month: ₹{calculateSavings(totalSalary, calculateTotalExpense(filteredExpensesByMonth[month])).toFixed(2)}</h5>
                        </div>
                      </>
                    )}
                  </div>
                ))}

              </>
            )}
            <div>
              <h2>Total Expense: ₹{totalExpenseCost.toFixed(2)}</h2>
              <h2>Savings: ₹{remainingSalary.toFixed(2)}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
