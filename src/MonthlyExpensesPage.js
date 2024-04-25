import React from "react";

const MonthlyExpensesPage = ({ expenses }) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  return (
    <div>
      <h1>All Expenses</h1>
      {months.map((month) => (
        <div key={month}>
          <h2>{month}</h2>
          <ul>
            {expenses
              .filter((expense) => expense.month === month)
              .map((expense) => (
                <li key={expense.id}>
                  {expense.name} - ₹{expense.amount.toFixed(2)} - {expense.date}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MonthlyExpensesPage;
