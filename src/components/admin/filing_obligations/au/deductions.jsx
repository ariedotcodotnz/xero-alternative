import React, { useMemo } from "react";
import { toLocaleString } from "../../../utils/base_helper";
import Row from "./Row";
import Table from "./Table";
import Accordion from "../../../accordion";
import ExpenseRow from "./ExpenseRow";
import { getExpensesGroup, getSummarisedExpensesGroup } from "./expenses_helper";

const Deductions = ({
  deductions,
  totalDeductions,
  superContributions,
  superAmount,
  claimDeductionOnSuper,
  deductionsMileageExpensesInKm,
}) => {
  const carExpenses = getExpensesGroup(deductions, "car-expenses");
  const mileageExpenses = getExpensesGroup(deductions, "mileage-expenses");
  const travelExpenses = getExpensesGroup(deductions, "travel-expenses");
  const clothingExpenses = getExpensesGroup(deductions, "clothing-expenses");
  const educationExpenses = getExpensesGroup(deductions, "education-expenses");
  const donations = getExpensesGroup(deductions, "donations");
  const dividendDeductions = getExpensesGroup(deductions, "dividend-deductions");
  const accountingExpenses = getExpensesGroup(deductions, "consulting-and-accounting");
  const otherExpenses = getSummarisedExpensesGroup(deductions, "other-expenses", "Other expenses (combined)");
  const superExpenses = getExpensesGroup(deductions, "superannuation-expenses");

  const getSuperExpensesTotal = useMemo(() => Number(superExpenses.length > 0 && superExpenses[0][1].sum));

  const getSuperContributionTotal = useMemo(() => {
    const superAddedInEOYForm = Number(superContributions && superAmount);

    return Number(superAddedInEOYForm + getSuperExpensesTotal);
  }, [superContributions, superAmount]);

  return (
    <Accordion baseId="deductions" title="Deductions" classes="custom-card-filing" open>
      <Table title="Work-related car expenses" code="D1" show={carExpenses.length > 0 || mileageExpenses.length > 0}>
        {carExpenses.map((expense) => <ExpenseRow key={expense[0]} expense={expense[1]} warningTooltip={expense[1].warning} copyLabel="deductions-car-expenses-d1" />)}
        {mileageExpenses.map((expense) => <ExpenseRow key={expense[0]} expense={expense[1]} warningTooltip={expense[1].warning} copyLabel="deductions-mileage-d1" />)}
        {deductionsMileageExpensesInKm > 0 && <Row fieldName="Business KM's travelled" value={toLocaleString(deductionsMileageExpensesInKm, 0)} copyLabel="deductions-mileage-expenses-kms" />}
      </Table>

      <Table title="Work-related national and international travel expenses" code="D2" show={travelExpenses.length > 0}>
        {travelExpenses.map((expense) => <ExpenseRow key={expense[0]} expense={expense[1]} copyLabel="deductions-travel-expenses-d2" />)}
      </Table>

      <Table title="Work-related clothing, laundry, and dry cleaning expenses" code="D3" show={clothingExpenses.length > 0}>
        {clothingExpenses.map((expense) => <ExpenseRow key={expense[0]} expense={expense[1]} copyLabel="deductions-clothing-expenses-d3" />)}
      </Table>

      <Table title="Work-related self-education expenses" code="D4" show={educationExpenses.length > 0}>
        {educationExpenses.map((expense) => <ExpenseRow key={expense[0]} expense={expense[1]} copyLabel="deductions-education-expenses-d4" />)}
      </Table>

      <Table title="Other work-related expenses" code="D5" show={otherExpenses[0][1].sum > 0}>
        {otherExpenses.map((expense) => <ExpenseRow key={expense[0]} expense={expense[1]} copyLabel={"deductions-other-expenses-d5"} />)}
      </Table>

      <Table title="Dividends" code="D8" show={dividendDeductions.length > 0}>
        {dividendDeductions.map((expense) => <ExpenseRow key={expense[0]} expense={expense[1]} copyLabel="deductions-dividends-d8" />)}
      </Table>

      <Table title="Gifts or donations" code="D9" show={donations.length > 0}>
        {donations.map((expense) => <ExpenseRow key={expense[0]} expense={expense[1]} copyLabel="deductions-donations-expenses-d9" />)}
      </Table>

      <Table title="Cost of managing tax affairs" code="D10" show={accountingExpenses.length > 0}>
        {accountingExpenses.map((expense) => <ExpenseRow key={expense[0]} expense={expense[1]} copyLabel="deductions-accounting-expenses-d10" />)}
      </Table>
      <Table title="Personal superannuation contributions" code="D12" show={getSuperContributionTotal > 0}>
        <Row
          fieldName="Total contribution"
          value={`$${toLocaleString(getSuperContributionTotal, 0)}`}
          copyLabel="deductions-personal-super-amount-d12"
          warningTooltip={`$${toLocaleString(getSuperExpensesTotal, 0)} of $${toLocaleString(getSuperContributionTotal, 0)} was added in expenses`}
        />
        <Row
          fieldName="I provided my fund (including a retirement savings account) with a notice of intent to claim a deduction for personal superannuation contributions"
          value={(superContributions && claimDeductionOnSuper) ? "Yes" : "No"}
          warningTooltip={superContributions && claimDeductionOnSuper ? "" : "Contact customer for more"}
        />
      </Table>
      {totalDeductions
        && <div className="filing-total-row">
          <span>Total Deductions</span>
          <span>{`$${toLocaleString(totalDeductions, 0)}`}</span>
        </div>
      }
      <br />
    </Accordion>
  );
};

export default Deductions;
