import React from "react";
import Icon from "../../icon/Icon";
import Typedown from "../../../admin/components/inputs/typedown/typedown";

class Expense extends React.Component {
  constructor(props) {
    super(props);
    this.removeItem = this.removeItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.selectedValue = this.selectedValue.bind(this);
  }

  removeItem(e) {
    this.props.removeItem(this.props.index);
  }

  addItem(e) {
    this.props.addItem();
  }

  removeAssociation() {
    if (!this.props.readonly) {
      return (
        <span className="remove-line small-column">
          <Icon
            type="actions/delete"
            label="Remove this expense"
            className="mb-1"
            asButton
            onClick={this.removeItem}
          />
        </span>
      );
    }
  }

  addItemButton() {
    if (this.props.lastItem && this.props.canAddItems) {
      return (
        <span className="remove-line small-column">
          <Icon
            type="actions/add"
            label="Add another expense"
            className="mb-1"
            asButton
            onClick={this.addItem}
          />
        </span>
      );
    }
  }

  selectedValue(expense) {
    return this.props.dropdownOptions.find((option) => option[1] == expense);
  }

  render() {
    return (
       <div className="row">
        <div className="col-6">
          <div className="md-form">
            <Typedown
              dropdownOptions={this.props.dropdownOptions}
              label={"Reimbursement"}
              fireChangeOnLoad={true}
              inputProps={{
                name: `transaction_reconciliation[expense_id][${this.props.expense}]`,
                id: `expense_select_${this.props.expense}`,
                type: "text",
                value: this.selectedValue(this.props.expense),
                onChange: (event, original) => this.props.handleInputChange(event, this.props.index),
              }
              }
            />
          </div>
        </div>
        <span className="d-flex align-items-center">
          {this.removeAssociation()}
          {this.addItemButton()}
        </span>
      </div>
    );
  }
}

export default Expense;
