import React from "react";
import humps from "humps";
import Typedown from "../../inputs/typedown/typedown";
import { roundCurrencyAmount } from "../../utils/base_helper";
import Toggle from "../../inputs/toggle/Toggle";
import Tooltip from "../../tooltip";
import Expenses from "../expense_select/expenses";
import Deductions from "../../client/deductions/deductions";
import I18n, { storeRequiredLocales } from "../../../utilities/translations";

class RemediationForm extends React.Component {
  constructor(props) {
    super(props);
    const {
      transactionReconciliation, transactionReconciliationId, salesTax, client, existingClientDeductedExpense, financial,
    } = this.props;

    this.state = {
      disabled: false,
      options: { saveClientPriorDeductionPercentageChange: false },
      existingClientDeductedExpense,
      transactionReconciliationId,
      transactionReconciliation,
      salesTax,
      client,
      financial,
    };

    this.handleInvoiceChange = this.handleInvoiceChange.bind(this);
    this.setClient = this.setClient.bind(this);
    this.clearClient = this.clearClient.bind(this);
    this.handleInputChangeExpenseItem = this.handleInputChangeExpenseItem.bind(this);
    this.handlePriorDeductionChange = this.handlePriorDeductionChange.bind(this);
    this.handleClientDeductedExpenseChange = this.handleClientDeductedExpenseChange.bind(this);
    this.addExpense = this.addExpense.bind(this);
    this.removeExpense = this.removeExpense.bind(this);
    this.expenseOptionsForClient = this.expenseOptionsForClient.bind(this);
    this.setDisabledTo = this.setDisabledTo.bind(this);
    this.handleDeductsExpensesChange = this.handleDeductsExpensesChange.bind(this);

    storeRequiredLocales(this.props.locale);
  }

  handleClientChange(value) {
    const currentClient = this.state.client.id;
    const setClient = this.setClient;
    if (value) {
      $.rails.ajax({
        type: "GET",
        dataType: "json",
        url: Routes.admin_client_path({ id: value }),
        success(data) {
          if (data.client.id != currentClient) {
            setClient(data);
          }
        },
      });
    } else {
      this.clearClient();
    }
  }

  setClient(data) {
    this.setState({
      options: { saveClientPriorDeductionPercentageChange: false },
      existingClientDeductedExpense: data.existingClientDeductedExpense,
      salesTax: {
        ...this.state.salesTax,
        salesTaxShouldBeDeducted: data.client.paysSalesTax,
      },
      transactionReconciliation: {
        ...this.state.transactionReconciliation,
        clientId: data.client.id,
        expenseIds: [],
      },
      client: {
        id: data.client.id,
        deductsExpensesPriorToPayment: data.client.deductsExpensesPriorToPayment,
        paysUntaxedPerDiems: data.client.paysUntaxedPerDiems,
        hasPriorDeductionPercentage: data.client.hasPriorDeductionPercentage,
        priorDeductionPercentage: data.client.priorDeductionPercentage,
        clientDeductedExpenseAttributes: {
          deductionType: data.client.clientDeductedExpense.deductionType,
          value: data.client.clientDeductedExpense.value,
          expenseCategoryId: data.client.clientDeductedExpense.expenseCategoryId,
          includesSalesTax: data.client.clientDeductedExpense.includesSalesTax,
          clientId: data.client.clientDeductedExpense.clientId,
          salesTaxAmount: data.client.clientDeductedExpense.salesTaxAmount,
        },
      },
    });
  }

  clearClient() {
    this.setState({
      options: { saveClientPriorDeductionPercentageChange: false },
      existingClientDeductedExpense: null,
      transactionReconciliation: {
        ...this.state.transactionReconciliation,
        clientId: "",
        expenseIds: [],
      },
      client: {
        id: "",
        deductsExpensesPriorToPayment: false,
        paysUntaxedPerDiems: false,
        hasPriorDeductionPercentage: false,
        priorDeductionPercentage: 0,
        clientDeductedExpenseAttributes: {
          deductionType: null,
          value: null,
          expenseCategoryId: null,
          includesSalesTax: null,
          clientId: null,
          salesTaxAmount: null,
        },
      },
    });
  }

  handleInvoiceChange(value) {
    this.setState({
      transactionReconciliation: {
        ...this.state.transactionReconciliation,
        invoiceId: value,
      },
    });
  }

  handleInputChangeExpenseItem(newValue, index) {
    const expenseIds = [...this.state.transactionReconciliation.expenseIds];
    expenseIds[index] = newValue;

    this.setState({
      transactionReconciliation: {
        ...this.state.transactionReconciliation,
        expenseIds,
      },
    });
  }

  handleInputChange(event, stateName, state) {
    const target = event.target.id;
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;

    this.setState({
      [stateName]: {
        ...state,
        [target]: value,
      },
    });
  }

  handlePriorDeductionChange(event) {
    const target = event.target.id;
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    const hasPriorDeductionPercentage = (value > 0);

    this.setState({
      client: {
        ...this.state.client,
        priorDeductionPercentage: value,
        hasPriorDeductionPercentage,
      },
    });
  }

  handleDeductsExpensesChange(value) {
    this.setState({
      client: {
        ...this.state.client,
        deductsExpensesPriorToPayment: value,
      },
    });
  }

  handleClientDeductedExpenseChange(stateName, value) {
    if (stateName == "deductionType" && value == "VARIABLE") {
      this.setState({
        client: {
          ...this.state.client,
          clientDeductedExpenseAttributes: {
            id: this.state.client.clientDeductedExpenseAttributes.id,
            deductionType: "VARIABLE",
            value: null,
            expenseCategoryId: null,
            includesSalesTax: null,
            salesTaxAmount: null,
          },
        },
      });
    } else {
      this.setState({
        client: {
          ...this.state.client,
          clientDeductedExpenseAttributes: {
            ...this.state.client.clientDeductedExpenseAttributes,
            [stateName]: value,
          },
        },
      });
    }
  }

  addExpense() {
    this.setState({
      transactionReconciliation: {
        ...this.state.transactionReconciliation,
        expenseIds: [...this.state.transactionReconciliation.expenseIds, ""],
      },
    });
  }

  removeExpense(index) {
    const expenseIds = this.state.transactionReconciliation.expenseIds;
    const filteredExpenses = expenseIds.filter((_expenseId, i) => i !== index);

    this.setState({
      transactionReconciliation: {
        ...this.state.transactionReconciliation,
        expenseIds: filteredExpenses,
      },
    });
  }

  expenseOptionsForClient() {
    if (this.state.client.id) {
      const subset = this.props.expenseDropdownOptions.find((options) => options[0] == this.state.client.id);
      return subset[1];
    }
    return [];
  }

  salesTaxCollectedLaterWarning() {
    if (this.state.salesTax.salesTaxShouldBeDeducted && !this.state.salesTax.payIncludedSalesTax) {
      return (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger">
              Only proceed with this edit if the client has now paid the missing {I18n.translations[this.props.locale].global.sales_tax} into the user&apos;s Hnry Account and the transaction has been processed with &apos;Skip reconciliation&apos;
            </div>
            <div className="md-form pb-2">
              <input type="number" required="true" className="md-textarea md-textarea-auto form-control" id="lateSalesTaxPaymentAmount" name="lateSalesTaxPaymentAmount" min={0} step={0.01} onChange={(event) => this.handleInputChange(event, "salesTax", this.state.salesTax)} value={this.state.salesTax.lateSalesTaxPaymentAmount} />
              <label className="active" htmlFor="lateSalesTaxPaymentAmount">How much {I18n.translations[this.props.locale].global.sales_tax} should be deducted from this pay?</label>
            </div>
          </div>
        </div>
      );
    }
  }

  setDisabledTo(status) {
    this.setState({
      disabled: status,
    });
  }

  ajaxPreviewRequest(urlFunctionName) {
    this.setDisabledTo(true);
    const setDisabledTo = this.setDisabledTo;

    const urlFunction = Routes[urlFunctionName];
    const url = urlFunction({
      jurisdiction: this.props.jurisdictionCode,
      transactionReconciliationId: this.state.transactionReconciliation.id
    });

    $.rails.ajax({
      type: "POST",
      url,
      data: humps.decamelizeKeys(this.state),
      complete() {
        setDisabledTo(false);
      },
      error(errors, textStatus, errorThrown) {
        toastr.error(errors.responseText);
      },
    });
  }

  render() {
    return (
      <form>
        <div className="card mb-2">
          <div className="card-body">
            <div className="row">
              <div className="col-8">
                <h4 className="mb-2"><strong>Client & Invoice</strong></h4>
                <div className="row">
                  <div className="col-6">
                    <div className="md-form">
                      <Typedown
                        dropdownOptions={this.props.clientDropdownOptions}
                        label={"Client"}
                        fireChangeOnLoad={false}
                        inputProps={{
                          name: "transactionReconciliation[clientId]",
                          id: `${this.props.transactionReconciliationId}_client`,
                          required: true,
                          type: "text",
                          value: this.props.initialClient,
                          onChange: (event) => this.handleClientChange(event),
                        }
                        }
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="md-form invoice-select">
                      <Typedown
                        dropdownOptions={this.props.invoiceDropdownOptions}
                        fallbackOption={["Reconcile to client", ""]}
                        label={"Invoice"}
                        fireChangeOnLoad={false}
                        inputProps={{
                          name: "transactionReconciliation[invoiceId]",
                          id: `${this.props.transactionReconciliationId}_invoice`,
                          required: true,
                          type: "text",
                          value: this.props.initialInvoice,
                          onChange: (event) => this.handleInvoiceChange(event),
                        }
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="md-form pb-2">
                  <input type="checkbox" className="md-textarea md-textarea-auto form-control" id="isPartialPayment" name="isPartialPayment" onChange={(event) => this.handleInputChange(event, "transactionReconciliation", this.state.transactionReconciliation)} value={this.state.transactionReconciliation.isPartialPayment} checked={this.state.transactionReconciliation.isPartialPayment} />
                  <label htmlFor="isPartialPayment">Partial payment of Invoice</label>
                </div>
              </div>
              <div className="col-4">
                <div className="d-flex justify-content-end">
                  Gross {I18n.translations[this.props.locale].global.currency_symbol}{roundCurrencyAmount(this.props.grossAmount)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-2">
          <div className="card-body">
            <div className="row">
              <div className="col-8">
                <h4 className="mb-2"><strong>Income Tax</strong></h4>

                <div className="row">
                  <div className="col-4">
                    <div className="md-form">
                      <input type="number" className="md-textarea md-textarea-auto form-control" id="taxRateOverride" name="taxRateOverride" min={0} max={100} step={0.01} onChange={(event) => this.handleInputChange(event, "financial", this.state.financial)} value={this.state.financial.taxRateOverride} placeholder={"(e.g. 10 for 10%)"} />
                      <label className="active" htmlFor="taxRateOverride">Income Tax % <Tooltip text={`Latest tax rate: ${this.props.financial.latestTaxRate}%`} /></label>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-4">
                    <div className="md-form">
                      <input type="number" className="md-textarea md-textarea-auto form-control" id="priorDeductionPercentage" name="priorDeductionPercentage" min={0} max={100} step={0.01} onChange={(event) => this.handlePriorDeductionChange(event)} value={this.state.client.priorDeductionPercentage} placeholder={"(e.g. 10 for 10%)"} />
                      <label className="active" htmlFor="priorDeductionPercentage">Withholding Tax %</label>
                    </div>
                  </div>
                  <div className="col-6 mt-1">
                    <Toggle
                      label="Update Client"
                      inputProps={{
                        id: "saveClientPriorDeductionPercentageChange",
                        value: this.state.options.saveClientPriorDeductionPercentageChange,
                        onChange: (event) => this.handleInputChange(event, "options", this.state.options),
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-4">
                <div className="d-flex justify-content-end">
                  {I18n.translations[this.props.locale].global.currency_symbol}{roundCurrencyAmount(this.props.financial.incomeTaxTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-2">
          <div className="card-body">
            <div className="row">
              <div className="col-8">
                <h4 className="mb-2">
                  <strong>{I18n.translations[this.props.locale].global.sales_tax}</strong>
                  <span className="hidden-small-down ml-2"></span>
                </h4>
                <div className="row">
                  <div className="col-6">
                    <Toggle
                      label={`${I18n.translations[this.props.locale].global.sales_tax} should be deducted`}
                      inputProps={{
                        id: "salesTaxShouldBeDeducted",
                        value: this.state.salesTax.salesTaxShouldBeDeducted,
                        onChange: (event) => this.handleInputChange(event, "salesTax", this.state.salesTax),
                      }}
                    />
                  </div>
                  <div className="col-6">
                    <Toggle
                      label={`The original payment included ${I18n.translations[this.props.locale].global.sales_tax}`}
                      inputProps={{
                        id: "payIncludedSalesTax",
                        value: this.state.salesTax.payIncludedSalesTax,
                        onChange: (event) => this.handleInputChange(event, "salesTax", this.state.salesTax),
                      }}
                    />
                  </div>
                </div>
                {this.salesTaxCollectedLaterWarning()}
              </div>

              <div className="col-4">
                <div className="d-flex justify-content-end">
                  {I18n.translations[this.props.locale].global.currency_symbol}{roundCurrencyAmount(this.props.salesTaxTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.state.client.paysSuperannuationGuarantee && <div className="card mb-2">
          <div className="card-body">
            <div className="row">
              <div className="col-8">
                <h4 className="mb-2"><strong>Superannuation guarantee</strong></h4>
              </div>
              <div className="col-4">
                <div className="d-flex justify-content-end">
                  {I18n.translations[this.props.locale].global.currency_symbol}{roundCurrencyAmount(this.props.superannuationGuaranteeTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>}

        <div className="card mb-2">
          <div className="card-body">
            <div className="row">
              <div className="col-8">
                <h4 className="mb-2"><strong>Reimbursements</strong></h4>
                <Expenses
                  handleInputChange={this.handleInputChangeExpenseItem}
                  addItem={this.addExpense}
                  removeItem={this.removeExpense}
                  expenseOptions={this.expenseOptionsForClient()}
                  expenseIds={this.state.transactionReconciliation.expenseIds}
                />
              </div>
              <div className="col-4">
                <div className="d-flex justify-content-end">
                  {I18n.translations[this.props.locale].global.currency_symbol}{roundCurrencyAmount(this.props.expenseReimbursementTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-2">
          <div className="card-body">
            <div className="row">
              <div className="col-8">
                <h4 className="mb-2"><strong>Per Diems & Prior Deductions</strong></h4>

                <div className="row">
                  <div className="col-4">
                    <div className="md-form">
                      <input type="number" className="md-textarea md-textarea-auto form-control" id="untaxedPerDiemsAmount" name="untaxedPerDiemsAmount" min={0} step={0.01} disabled={!this.state.client.paysUntaxedPerDiems} onChange={(event) => this.handleInputChange(event, "transactionReconciliation", this.state.transactionReconciliation)} value={this.state.transactionReconciliation.untaxedPerDiemsAmount} />
                      <label className="active" htmlFor="untaxedPerDiemsAmount">Untaxed per-diems</label>
                    </div>
                  </div>
                  <div className="col-6">
                    <Toggle
                      label="Client pays per diems"
                      inputProps={{
                        id: "paysUntaxedPerDiems",
                        value: this.state.client.paysUntaxedPerDiems,
                        onChange: (event) => this.handleInputChange(event, "client", this.state.client),
                        "aria-controls": "pays-untaxed-per-diems",
                      }}
                    />
                  </div>
                </div>

                {this.state.client.clientDeductedExpenseAttributes.deductionType == "VARIABLE"
                  && <div className="row">
                    <div className="col-4">
                      <div className="md-form">
                        <input type="number" className="md-textarea md-textarea-auto form-control" id="priorExpensesAmount" name="priorExpensesAmount" min={0} step={0.01} disabled={!this.state.client.deductsExpensesPriorToPayment} onChange={(event) => this.handleInputChange(event, "transactionReconciliation", this.state.transactionReconciliation)} value={this.state.transactionReconciliation.priorExpensesAmount} />
                        <label className="active" htmlFor="priorExpensesAmount">Prior deductions (inc. {I18n.translations[this.props.locale].global.sales_tax})</label>
                      </div>
                    </div>
                  </div>
                }

                <div className="row">
                  <div className="col-12">
                    <Deductions
                      deductionOptions={this.props.clientDeductedExpenseDeductionOptions}
                      expenseCategoryOptions={this.props.clientDeductedExpenseExpenseCategoryOptions}
                      locale={this.props.locale}
                      salesTaxRate={this.props.salesTaxRate}
                      deductsExpensesPriorToPayment={this.state.client.deductsExpensesPriorToPayment}
                      clientDeductedExpense={this.state.existingClientDeductedExpense}
                      handleClientChange={this.handleDeductsExpensesChange}
                      handleInputChange={this.handleClientDeductedExpenseChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-4">
                <div className="d-flex justify-content-end">
                  {I18n.translations[this.props.locale].global.currency_symbol}{roundCurrencyAmount(this.props.perDiemAndPriorExpenseTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-row justify-content-between mb-3">
          <a className="mr-auto btn btn-blue-grey" href={Routes.admin_remediation_show_path({ jurisdiction: this.props.jurisdictionCode, transaction_reconciliation_id: this.state.transactionReconciliation.id })}>Cancel</a>
          <button type="button" className="mr-auto btn btn-danger" name="Submit Reversal" onClick={() => this.ajaxPreviewRequest('admin_remediation_preview_reversal_path')} disabled={this.state.disabled}>{this.state.disabled ? "Calculating..." : "Reverse"}</button>
          <button type="button" className="btn btn-primary" name="Submit" onClick={() => this.ajaxPreviewRequest('admin_remediation_preview_path')} disabled={this.state.disabled}>{this.state.disabled ? "Calculating..." : "Next"}</button>
        </div>
      </form>
    );
  }
}

export default RemediationForm;
