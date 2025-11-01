import React, { Fragment } from "react";
import Accordion from "../../../accordion";
import { toLocaleString } from "../../../utils/base_helper";
import Row from "./Row";
import Table from "./Table";
import ExpenseRow from "./ExpenseRow";

export const getCategorisedExpenses = (expenses, type) => {
  if (expenses === undefined) return null;

  return expenses[type] || null;
};

const BooleanRow = ({ value, ...props }) => (value != null && <Row value={value ? "Yes" : "No"} {...props}/>);

const business = ({
  userJobCategories,
  selfEmployedIncomeTotalByUserJobCategory,
  businessExpenses,
  businessExpensesTotals,
  tradingName,
  businessNumber,
  statusOfBusinessCode,
  addressStreet,
  addressSuburb,
  addressCity,
  addressState,
  addressPostcode,
  deferredBusinessLosses,
  deferredLossAmount,
  deferredLossWorkType,
  businessIndustryDescription,
  businessIndustryCode,
}) => {
  const expensesByJobCategory = JSON.parse(businessExpenses);
  const expensesByJobCategoryTotals = JSON.parse(businessExpensesTotals);
  const incomeByJobCategory = JSON.parse(selfEmployedIncomeTotalByUserJobCategory);

  return (
    <Accordion baseId="business" title="Business" classes="custom-card-filing" open>
      <Table title="Personal services income">
        <Row
          fieldName="Status of business code"
          value={statusOfBusinessCode}
          code="P4"
          colWidth1="40%"
          colWidth2="30%"
        />
      </Table>

      <Table title="Description of main business or professional activity" code="P2">
        {businessIndustryDescription
          && <Row fieldName="Business industry description" value={businessIndustryDescription} copyLabel="ato-business-industry-description" colWidth1="40%" colWidth2="40%" />
        }
        {businessIndustryCode
          && <Row fieldName="Business industry code" value={businessIndustryCode} copyLabel="ato-business-industry-code" colWidth1="40%" colWidth2="20%" />
        }
      </Table>

      <Table title="Business name of main business and Australian business number (ABN)" code="P5">
        <Row fieldName="Business name of main business" value={tradingName} copyLabel="trading-name" colWidth1="40%" colWidth2="25%" />
        <Row fieldName="Australian Business Number" value={businessNumber} copyLabel="abn" />
        <Row fieldName="Street" value={addressStreet} copyLabel="business-street" colWidth2="28%" />
        {addressSuburb.length > 0 && <Row fieldName="Suburb" value={addressSuburb} copyLabel="business-suburb" />}
        <Row fieldName="City" value={addressCity} copyLabel="business-city" />
        <Row fieldName="State" value={addressState} copyLabel="business-state" />
        <Row fieldName="postcode" value={addressPostcode} copyLabel="business-postcode" />
      </Table>

      {userJobCategories.map((jobTitle) => {
        const purchasesAndOtherCosts = getCategorisedExpenses(expensesByJobCategory[jobTitle], "Purchases and other costs");
        const depreciation = getCategorisedExpenses(expensesByJobCategory[jobTitle], "Depreciation expenses");
        const subContractorFees = getCategorisedExpenses(expensesByJobCategory[jobTitle], "Contractors");
        const rentExpenses = getCategorisedExpenses(expensesByJobCategory[jobTitle], "Rent expenses");
        const motorVehicleExpenses = getCategorisedExpenses(expensesByJobCategory[jobTitle], "Motor vehicle expenses - B");
        const mileageExpenses = getCategorisedExpenses(expensesByJobCategory[jobTitle], "Motor vehicle expenses - S");
        const motorVehiclePurchase = getCategorisedExpenses(expensesByJobCategory[jobTitle], "Motor vehicle purchase");
        const allOtherExpenses = getCategorisedExpenses(expensesByJobCategory[jobTitle], "All other expenses");
        const incomeDetails = incomeByJobCategory[jobTitle];
        const incomeTotal = incomeDetails ? incomeDetails.total : 0;
        const totalExpenses = expensesByJobCategoryTotals[jobTitle] || 0;
        const deferredLoss = deferredBusinessLosses && deferredLossWorkType == jobTitle ? deferredLossAmount : 0;
        const netIncomeLoss = incomeTotal - totalExpenses;
        const totalNetIncomeLoss = netIncomeLoss - deferredLoss;
        const incomeTooltip = incomeDetails
                              && incomeDetails.total_non_hnry != 0
                              && `$${toLocaleString(incomeDetails.total_non_hnry, 0)} of \
                              $${toLocaleString(incomeTotal, 0)} was non-Hnry self-employed income`;

        return (
          <Fragment key={`${jobTitle}-income-and-expenses`}>
            <Table title={`${jobTitle} - PSI, Income and Expenses`}>
              <Row
                fieldName="Did you receive any personal services income?"
                value={incomeDetails && incomeDetails.received_psi ? "Yes" : "No"}
                code="P1"
              />
              {incomeDetails && (
                <Fragment key={`${jobTitle}-psi-results`}>
                  <BooleanRow fieldName="Did you satisfy the results test?" value={incomeDetails.results_test} code="P"/>
                  <BooleanRow fieldName="Have you received a personal services business determination?" value={incomeDetails.business_determination_held} code="C"/>
                  <BooleanRow fieldName="Did you receive 80% or more of your PSI from one source?" value={incomeDetails.received_80_or_more_psi_from_one_source} code="Q"/>
                  <BooleanRow fieldName="PSI - unrelated clients test" value={incomeDetails.unrelated_clients_test} code="D1"/>
                  <BooleanRow fieldName="PSI - employment test" value={incomeDetails.employment_test} code="E1"/>
                  <BooleanRow fieldName="PSI - business premises test" value={incomeDetails.business_premises_test} code="F1"/>
                </Fragment>
              )}
              <Row
                fieldName="Description of main business or professional activity"
                value={jobTitle}
                copyLabel={`worktype-${jobTitle}`}
                code="P2"
                colWidth1="50%"
                colWidth2="25%"
              />
              <Row
                fieldName="Total income"
                value={`$${toLocaleString(incomeTotal, 0)}`}
                copyLabel={`${jobTitle}TotalIncome`}
                warningTooltip={incomeTooltip}
              />
              <ExpenseRow copyLabel={`${jobTitle}-purchase-and-other-costs-l`} expense={purchasesAndOtherCosts} code="L" />
              <ExpenseRow copyLabel={`${jobTitle}-sub-contractor-f`} expense={subContractorFees} code="F" />
              <ExpenseRow copyLabel={`${jobTitle}-rent-expenses-k`} expense={rentExpenses} code="K" />
              <ExpenseRow copyLabel={`${jobTitle}-depreciation-m`} expense={depreciation} code="M" />
              <ExpenseRow copyLabel={`${jobTitle}-motor-vehicle-expenses-n`} expense={motorVehicleExpenses} code="N" />
              <ExpenseRow copyLabel={`${jobTitle}-mileage-expenses-n`} expense={mileageExpenses} code="N" />
              <ExpenseRow copyLabel={`${jobTitle}-motor-vehicle-purchase`} expense={motorVehiclePurchase} />
              <ExpenseRow copyLabel={`${jobTitle}-all-other-expenses-p`} expense={allOtherExpenses} code="P" />
              <Row
                fieldName="Total expenses"
                value={`$${toLocaleString(totalExpenses, 0)}`}
                className="table-total-row"
              />
              <Row
                fieldName="Net income/loss"
                value={`$${toLocaleString(netIncomeLoss, 0)}`}
                warningTooltip={netIncomeLoss < 0 ? "Work type has a loss outcome" : ""}
              />
              {deferredBusinessLosses && deferredLossWorkType == jobTitle &&
                <Fragment key={`${jobTitle}-income-and-expenses-deferred-loss`}>
                  <Row
                    fieldName="Deferred losses from a prior year - Amount"
                    value={`$${toLocaleString(deferredLossAmount, 0)}`}
                    colWidth1="45%"
                    colWidth2="35%"
                    copyLabel={`deferred-loss-amount`}
                  />
                </Fragment>
              }
              <Row
                fieldName="Total net income/loss"
                value={`$${toLocaleString(totalNetIncomeLoss, 0)}`}
                colWidth1="45%"
                colWidth2="35%"
                copyLabel={`deferred-loss-amount`}
              />
            </Table>
            <br />
          </Fragment>
        );
      })}

      <br />
    </Accordion>
  );
};

export default business;
