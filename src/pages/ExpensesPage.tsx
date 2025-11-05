import React, { useState, useEffect } from 'react';
import ExpenseFormRender from '../components/expenses/ExpenseFormRender';
import ExpenseTabFilters from '../components/expenses/ExpenseTabFilters';
import ExpenseContextProvider from '../components/expenses/ExpenseContext';

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchExpenses();
  }, [activeTab]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/expenses?filter=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateExpense = () => {
    setSelectedExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense: any) => {
    setSelectedExpense(expense);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedExpense(null);
    fetchExpenses();
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <ExpenseContextProvider>
      <div className="expenses-page">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Expenses</h1>
          <button className="btn btn-primary" onClick={handleCreateExpense}>
            Add Expense
          </button>
        </div>

        <ExpenseTabFilters onTabChange={setActiveTab} activeTab={activeTab} />

        <div className="card mt-4">
          <div className="card-body">
            {expenses.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No expenses found</p>
                <button className="btn btn-primary" onClick={handleCreateExpense}>
                  Add Your First Expense
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id}>
                        <td>{new Date(expense.date).toLocaleDateString()}</td>
                        <td>{expense.description || 'N/A'}</td>
                        <td>{expense.category || 'Uncategorized'}</td>
                        <td>${expense.amount?.toFixed(2) || '0.00'}</td>
                        <td>
                          <span className="badge bg-secondary">{expense.type || 'General'}</span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditExpense(expense)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {showForm && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectedExpense ? 'Edit Expense' : 'Add Expense'}
                  </h5>
                  <button type="button" className="btn-close" onClick={handleCloseForm}></button>
                </div>
                <div className="modal-body">
                  <ExpenseFormRender
                    expense={selectedExpense}
                    onClose={handleCloseForm}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ExpenseContextProvider>
  );
};

export default ExpensesPage;
