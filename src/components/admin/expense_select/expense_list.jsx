import React from "react";
import Expense from "./expense";

class ExpenseList extends React.Component {
  constructor(props) {
    super(props);
    this.expenseList = this.expenseList.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.dropdownItemsForExpense = this.dropdownItemsForExpense.bind(this);
  }

  expenseList() {
    const removeItem = this.removeItem;
    const addItem = this.addItem;
    const handleInputChange = this.props.handleInputChange;
    const dropdownItemsForExpense = this.dropdownItemsForExpense;
    const lastIndex = this.props.expenseIds.length - 1;
    const canAddItems = this.props.expenseOptions.length != this.props.expenseIds.length;
    return this.props.expenseIds.map(function (expenseId, i) {
      const dropdownOptions = dropdownItemsForExpense(expenseId);
      return (
        <Expense
          handleInputChange={handleInputChange}
          removeItem={removeItem}
          addItem={addItem}
          expense={expenseId}
          dropdownOptions={dropdownOptions}
          index={i}
          lastItem={lastIndex == i}
          canAddItems={canAddItems}
          key={`expense_${i}_${expenseId}`}
        />
      );
    });
  }

  dropdownItemsForExpense(expenseId) {
    const expenseIds = this.props.expenseIds;
    const filteredExpenses = this.props.expenseOptions.filter((expense) => expenseIds.indexOf(expense[1]) == -1 || expense[1] == expenseId);

    return filteredExpenses;
  }

  addItem() {
    this.props.addItem();
  }

  removeItem(id) {
    this.props.removeItem(id);
  }

  render() {
    return (
      this.expenseList()
    );
  }
}

export default ExpenseList;
