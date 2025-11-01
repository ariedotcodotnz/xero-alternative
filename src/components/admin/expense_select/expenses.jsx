import React from "react";
import ExpenseList from "./expense_list";

export const ExpenseLinks = function (props) {
  return <div>
            <button className="btn btn-blue-hnry" onClick={props.addLine} disabled={props.disabled}>
              ADD EXPENSE
            </button>
          </div>;
};

class Expenses extends React.Component {
  constructor(props) {
    super(props);
  }

  addLine(e) {
    e.preventDefault();
    this.itemsList.addItem();
  }

  render() {
    return (
      <div id="expenseItems">
        <ExpenseList
          {...this.props}
          ref={(instance) => { this.itemsList = instance; }}
        />
      { (this.props.expenseIds.length == 0 && this.props.expenseOptions.length != 0)
        && <ExpenseLinks disabled={this.props.expenseOptions.length == this.props.expenseIds.length } addLine={this.addLine.bind(this)}/>
      }
      { (this.props.expenseOptions.length == 0)
        && <span>No available reimbursements</span>
      }
      </div>
    );
  }
}

export default Expenses;
