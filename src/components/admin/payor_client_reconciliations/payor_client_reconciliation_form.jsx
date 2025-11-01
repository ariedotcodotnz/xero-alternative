import React, { useState } from "react";
import { format } from "date-fns";
import Typedown from "../../inputs/typedown/typedown";

const PayorClientReconciliationForm = (props) => {
  const [client, setClient] = useState(props.client);
  const [reconcileToRecruiter, setReconcileToRecruiter] = useState(false);

  const handleClientChange = (value) => {
    if (value) {
      $.rails.ajax({
        type: "GET",
        dataType: "json",
        url: Routes.admin_payor_client_reconciliations_fetch_client_path({ client_id: value }),
        success: (data) => {
          if (data.client.clientId != client.clientId) {
            setClient(data.client);
          }
        },
      });
    } else {
      clearClient();
    }
  };

  const clearClient = () => {
    setClient({
      clientId: null,
      previousPayorIncomeSourceReconciliations: [],
      payLines: [],
      clientTotal: null,
    });
  };

  const handleSubmit = () => {
    if (client.clientId) {
      $.rails.ajax({
        type: "POST",
        url: Routes.admin_payor_client_reconciliations_path({
          jurisdiction: props.jurisdictionCode,
          client_id: client.clientId,
          payor_declared_income_source_id: props.payorDeclaredIncomeSource.id,
          reconcile_to_recruiter: reconcileToRecruiter,
        }),
      });
    }
  };

  const handleCreateNewClient = () => {
    $.rails.ajax({
      type: "POST",
      url: Routes.admin_payor_client_reconciliations_path({
        jurisdiction: props.jurisdictionCode,
        new_client: true,
        payor_declared_income_source_id: props.payorDeclaredIncomeSource.id,
        reconcile_to_recruiter: reconcileToRecruiter,
      }),
    });
  };

  const handleReconcileToRecruiterChange = (event) => {
    setReconcileToRecruiter(event.target.checked);
  };

  return (
    <form>
      <div className="row mt-2">
        <div className="col-5 card pt-1">
          <div className="card-body">
            <h4>{props.payorDeclaredIncomeSource.payorName}</h4>
            <span>Total payments: ${props.payorDeclaredIncomeSource.payorIncomeDeclarationTotal}</span>
            <br/>
            <span>Average tax rate: {props.payorDeclaredIncomeSource.averageTaxRate}%</span>
            <div className="scrolling-table">
              <table className="table table-hover mt-2">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Month</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(props.payorDeclaredIncomeSource.payorIncomeDeclarations).map((month, index) => (
                    <tr key={index}>
                      <td>${props.payorDeclaredIncomeSource.payorIncomeDeclarations[month]}</td>
                      <td>{format(month, "MM/yyyy")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div className="col-2 text-center mt-5">
          <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={!client.clientId}>Reconcile</button>
        </div>

        <div className="col-5 card pt-1">
          <div className="card-body">
            <h4><a href={Routes.admin_user_path({ jurisdiction: props.jurisdictionCode, id: props.userId })}>{props.userName}</a></h4>

            <Typedown
              dropdownOptions={props.clientDropdownOptions}
              label={"Client"}
              fireChangeOnLoad={false}
              inputProps={{
                name: "transactionReconciliation[clientId]",
                id: `${props.payorDeclaredIncomeSource.id}_client`,
                type: "text",
                value: props.client.defaultClient,
                onChange: handleClientChange,
              }
              }
            />

            {client.clientTotal
              && <span>Total payments: ${client.clientTotal}</span>
            }

            { (Object.keys(client.payLines).length > 0)
              && <div className="scrolling-table">
                <table className="table table-hover mt-2">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Month</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(client.payLines).map((month, index) => (
                      <tr key={index}>
                        <td>${client.payLines[month]}</td>
                        <td>{format(month, "MM/yyyy")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }

            { (client.previousPayorIncomeSourceReconciliations.length > 0)
              && <span>This client has already been reconciled to the payor
                {client.previousPayorIncomeSourceReconciliations.map((previousPayorIncomeSourceReconciliation) => (
                  ` ${previousPayorIncomeSourceReconciliation.payor_name}`
                ))}
              </span>
            }

            <div className="md-form">
              <input type="checkbox" className="form-control" id={`${props.payorDeclaredIncomeSource.id}_reconcileToRecruiter`} name="reconcileToRecruiter" onChange={handleReconcileToRecruiterChange} value={true} />
              <label htmlFor={`${props.payorDeclaredIncomeSource.id}_reconcileToRecruiter`}>Reconcile to recruiter</label>
            </div>

            <div className="md-form">
              <button type="button" className="as-link" onClick={handleCreateNewClient}>Create client & reconcile</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PayorClientReconciliationForm;
