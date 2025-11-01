import React from "react";
import Icon from "../../icon/Icon";

class TransactionSplitInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { amounts: [""] };
  }

  handleAddRow = (event) => {
    event.preventDefault();
    this.setState({
      amounts: [...this.state.amounts, ""],
    });
  };

  handleRemoveSpecificRow = (event, index) => {
    event.preventDefault();
    const amounts = [...this.state.amounts];
    amounts.splice(index, 1);
    this.setState({ amounts });
  };

  handleChange = (event, index) => {
    event.preventDefault();
    const { amount, value } = event.target;
    const amounts = [...this.state.amounts];
    amounts[index] = value;
    this.setState({
      amounts,
    });
  };

  render() {
    return (
      <div>
        Amount(s) to split by:
        <div className="container">
          {this.state.amounts.map((item, index) => (
            <div className="row clearfix" key={index}>
              <div className="col-md-8 column">
                <input
                  type="number"
                  name={`splitAmount${index}`}
                  id={`splitAmount${index}`}
                  min={0}
                  step={0.01}
                  value={this.state.amounts[index]}
                  onChange={(event) => this.handleChange(event, index)}
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <Icon
                  type="actions/delete"
                  label="Delete row"
                  className="mt-05"
                  asButton
                  onClick={(event) => this.handleRemoveSpecificRow(event, index)}
                />
              </div>
              <div className="col-md-2">
                <Icon
                  type="actions/add"
                  label="Add row"
                  className="mt-05"
                  asButton
                  onClick={(event) => this.handleAddRow(event)}
                />
              </div>
            </div>
          ))}
        </div>

        <input type="hidden" name="amounts" value={this.state.amounts} />
      </div>
    );
  }
}

export default TransactionSplitInput;
