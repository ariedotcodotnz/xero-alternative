import React from "react";
import { toLocaleString } from "../../../utils/base_helper";
import Row from "./Row";
import Table from "./Table";
import SalaryCheckbox from "./SalaryCheckbox";
import Accordion from "../../../accordion";
import CapitalTaxEvent from "./CapitalTaxEvent";

const salaryThreshold = (salaryIncome, above) => {
  const amount = parseInt(salaryIncome || 0);
  const result = Math.round(above ? amount + (amount * 0.1) : amount - (amount * 0.1));

  return `$${toLocaleString(result, 0)}`;
};

const income = ({
  incomeTaxFilingId,
  disabled,
  salaryIncome,
  totalPersonalServicesIncome,
  totalBusinessIncomeNetOfExpenses,
  foreignIncomeAmount,
  rentalExpensesInterest,
  rentalExpensesCapitalWorks,
  rentalExpensesAdvertising,
  rentalExpensesAgentsFees,
  rentalExpensesCleaning,
  rentalExpensesCouncilRates,
  rentalExpensesInsurance,
  rentalExpensesLandTax,
  rentalExpensesRepairs,
  rentalExpensesStrataBodyCorporateFees,
  rentalExpensesWater,
  rentalExpensesOther,
  rentalExpensesTotal,
  rentalIncomeNetOfExpenses,
  capitalGainsTaxEvent,
  userDeclaredInterest,
  userDeclaredDividends,
  userDeclaredTrustIncome,
  governmentAllowances,
  employerAllowances,
  allOtherIncomeAmounts,
  atoSalaryCheck,
  rentalPropertyIncomeSources,
  primaryJobCategory,
  cryptocurrency,
  capitalTaxes,
  salaryAndWageOccupationDescription,
  salaryAndWageOccupationCode,
  salaryArrearsPayments,
  filingObligation,
  userDeclaredManagedFundsIncome,
}) => (
  <Accordion baseId="income" title="Income" classes="custom-card-filing" open>
    <Table title="Salary or wages" code="1">
      {salaryAndWageOccupationDescription
        && <Row fieldName="Main salary or wage occupation" value={salaryAndWageOccupationDescription} copyLabel="salary-occupation-description" colWidth1="40%" colWidth2="40%" />
      }
      {salaryAndWageOccupationCode
        && <Row fieldName="Main salary or wage occupation code" value={salaryAndWageOccupationCode} copyLabel="salary-occupation-code" colWidth1="40%" colWidth2="20%" />
      }
      <Row fieldName="Salary recorded in Hnry" value={`$${toLocaleString(salaryIncome, 0)}`} />
      <Row
        fieldName={`ATO salary check (required): ${salaryThreshold(salaryIncome, false)} - ${salaryThreshold(salaryIncome, true)}`}
        warningTooltip="Please check the ATO information against the salary amount provided by the user. If the salary is not within the range displayed, please place on hold"
        value={<SalaryCheckbox incomeTaxFilingId={incomeTaxFilingId} disabled={disabled} atoSalaryCheck={atoSalaryCheck} />}
      />
      {salaryIncome > 0 && <Row fieldName="Main work type in Hnry" value={`${primaryJobCategory}`} />}
    </Table>

    {salaryArrearsPayments && salaryArrearsPayments.map(function (salary, i) {
      return (
        <Table title="Salary Lump Sum E breakdown" key={i} code="1">
          <Row fieldName="Payor name" value={salary.payorName} copyLabel={`salary-${i}-payor-name`} colWidth1="40%" colWidth2="20%" />
          <Row fieldName="Lump Sum E total" value={`$${salary.lumpSumEAmount}`} copyLabel={`salary-${i}-lump-sum-e-amount`} colWidth1="40%" colWidth2="20%" />

          {salary.arrearsPayments.map(function (payment, j) {
            return (
              <Row fieldName={`${payment.formattedFinancialYear}`} value={`$${toLocaleString(payment.amount)}`} copyLabel={`salary-${i}-${j}-arrears-payment`} colWidth1="40%" colWidth2="20%" />
            );
          })}

        </Table>
      );
    })}

    <Table title="Australian Government allowances and payments like newstart, youth allowance and austudy payment" code="5" show={governmentAllowances > 0}>
      <Row fieldName="Other government allowances" copyLabel="other-government-allowances" value={`$${toLocaleString(governmentAllowances, 0)}`} />
    </Table>

    <Table title="Interest" code="10" show={userDeclaredInterest > 0}>
      <Row fieldName="Gross interest" copyLabel="gross-interest" value={`$${toLocaleString(userDeclaredInterest, 0)}`} />
    </Table>

    <Table title="Dividend" code="11" show={userDeclaredDividends > 0}>
      <Row fieldName="Franked amount" copyLabel="franked-amount" value={`$${toLocaleString(userDeclaredDividends, 0)}`} />
    </Table>

    <Table title="Partnerships and trusts" code="13" show={userDeclaredTrustIncome > 0}>
      <Row fieldName="Franked distributions from trusts" copyLabel="franked-distributions-from-trusts" value={`$${toLocaleString(userDeclaredTrustIncome, 0)}`} />
    </Table>

    <Table title="Personal services income" code="14" show={totalPersonalServicesIncome > 0}>
      <Row fieldName="Net PSI" code="A" copyLabel="net-psi" value={`$${toLocaleString(totalPersonalServicesIncome, 0)}`} />
    </Table>

    <Table title="Employer allowances" show={employerAllowances > 0}>
      <Row fieldName="Employer allowances" copyLabel="employer-allowances" value={`$${toLocaleString(employerAllowances, 0)}`} />
    </Table>

    <Table title="Net income or loss from business" code="15" show={totalBusinessIncomeNetOfExpenses > 0}>
      <Row
        fieldName="Net income/loss"
        copyLabel="business-income-loss"
        value={`$${toLocaleString(totalBusinessIncomeNetOfExpenses, 0)}`}
        warningTooltip={totalBusinessIncomeNetOfExpenses < 0 ? "Customer is making a loss" : ""}
        code="B"
        additionalActionButton={
          <a href={Routes.admin_filing_obligation_pay_lines_path(filingObligation, { jurisdiction: "au" })} className="btn btn-primary btn-floating m-0">
            <i className="fa fa-calculator no-pointer"></i>
          </a>
        }
      />
    </Table>

    <CapitalTaxEvent
      capitalGainsTaxEvent={capitalGainsTaxEvent}
      rentalPropertyIncomeSources={rentalPropertyIncomeSources}
      cryptocurrency={cryptocurrency}
      capitalTaxes={capitalTaxes}
    />

    <Table title="Foreign source income and foreign assets or property" code="20" show={foreignIncomeAmount > 0}>
      <Row
        fieldName="Assessable foreign source income"
        copyLabel="assessable-foreign-source-income"
        value={`$${toLocaleString(foreignIncomeAmount, 0)}`}
        warningTooltip={foreignIncomeAmount > 0 ? "Customer has foreign income" : ""}
      />
    </Table>

    {rentalPropertyIncomeSources.map(({
      rentalPropertyAddress, incomeAmount, rentalPropertyIncomeStartDate, rentalPropertyAvailableWeeks,
      rentalPropertyRentedWeeks, rentalPropertyOwnershipPercentage, rentalPropertySold, city, state, postcode
    }, index) => {
      const i = index + 1;

      return (
        <Table title={`Rent - Property ${i}`} code="21" key={`rent-property-${i}`}>
          <Row fieldName="Rental property ownership percentage" copyLabel={`rental-property-ownership-percentage${i}`} value={rentalPropertyOwnershipPercentage || ""} />
          <Row fieldName="Street Address" copyLabel={`rental-property-income-address-street${i}`} value={rentalPropertyAddress || ""} />
          <Row fieldName="Town/City" copyLabel={`rental-property-income-address-city${i}`} value={city || ""} />
          <Row fieldName="State" copyLabel={`rental-property-income-address-state${i}`} value={state || ""} />
          <Row fieldName="Postcode" copyLabel={`rental-property-income-address-postcode${i}`} value={postcode || ""} />
          <Row fieldName="Rental property income start date" copyLabel={`rental-property-income-start-date${i}`} value={rentalPropertyIncomeStartDate || ""} />
          <Row fieldName="Rental property available weeks" copyLabel={`rental-property-available-weeks${i}`} value={rentalPropertyAvailableWeeks || ""} />
          <Row fieldName="Rental property rented weeks" copyLabel={`rental-property-rented-weeks${i}`} value={rentalPropertyRentedWeeks || ""} />
          {rentalPropertySold
            && <Row fieldName="Rental property sold" value={rentalPropertySold ? "Yes" : "No"} />
          }
          <Row fieldName="Gross rent" copyLabel={`rental-property-income-gross-rent${i}`} value={`$${toLocaleString(incomeAmount, 0)}`} colWidth1="40%" colWidth2="40%" />
        </Table>
      );
    })}

    {rentalPropertyIncomeSources.length > 0 && (
      <Table title="Rental property expenses" warningTooltip={rentalPropertyIncomeSources.length > 1 && "Contains multiple rental property incomes, contact customer for more"}>
        {rentalExpensesAdvertising > 0 && <Row fieldName="Advertising" copyLabel="rental-expenses-advertising" value={`$${toLocaleString(rentalExpensesAdvertising, 0)}`} code="D" />}
        {rentalExpensesStrataBodyCorporateFees > 0 && <Row fieldName="Strata Body Corporate Fees" copyLabel="rental-expenses-strata-body-corporate-fees" value={`$${toLocaleString(rentalExpensesStrataBodyCorporateFees, 0)}`} code="E" />}
        {rentalExpensesCleaning > 0 && <Row fieldName="Cleaning" copyLabel="rental-expenses-cleaning" value={`$${toLocaleString(rentalExpensesCleaning, 0)}`} code="G" />}
        {rentalExpensesCouncilRates > 0 && <Row fieldName="Council Rates" copyLabel="rental-expenses-council-rates" value={`$${toLocaleString(rentalExpensesCouncilRates, 0)}`} code="H" />}
        {rentalExpensesInsurance > 0 && <Row fieldName="Insurance" copyLabel="rental-expenses-insurance" value={`$${toLocaleString(rentalExpensesInsurance, 0)}`} code="K" />}
        {rentalExpensesInterest > 0 && <Row fieldName="Interest deductions" copyLabel="rental-expenses-interest-deductions" value={`$${toLocaleString(rentalExpensesInterest, 0)}`} code="L" />}
        {rentalExpensesLandTax > 0 && <Row fieldName="Land Tax" copyLabel="rental-expenses-land-tax" value={`$${toLocaleString(rentalExpensesLandTax, 0)}`} code="M" />}
        {rentalExpensesAgentsFees > 0 && <Row fieldName="Agents Fees" copyLabel="rental-expenses-agents-fees" value={`$${toLocaleString(rentalExpensesAgentsFees, 0)}`} code="P" />}
        {rentalExpensesRepairs > 0 && <Row fieldName="Repairs" copyLabel="rental-expenses-repairs" value={`$${toLocaleString(rentalExpensesRepairs, 0)}`} code="Q" />}
        {rentalExpensesCapitalWorks > 0 && <Row fieldName="Capital works deductions" copyLabel="rental-expenses-capital-works-deductions" value={`$${toLocaleString(rentalExpensesCapitalWorks, 0)}`} code="R" />}
        {rentalExpensesWater > 0 && <Row fieldName="Water" copyLabel="rental-expenses-water" value={`$${toLocaleString(rentalExpensesWater, 0)}`} code="U" />}
        {rentalExpensesOther > 0 && <Row fieldName="Sundry" copyLabel="rental-expenses-other-rental-deductions" value={`$${toLocaleString(rentalExpensesOther, 0)}`} code="V" />}
        {rentalExpensesTotal > 0 && <Row fieldName="Total expenses" value={`$${toLocaleString(rentalExpensesTotal, 0)}`} code="W" />}
        <Row fieldName="Net rent" copyLabel="net-rent" value={`$${toLocaleString(rentalIncomeNetOfExpenses, 0)}`} code="X" />
      </Table>
    )}

    <Table title="Other income" code="24" show={allOtherIncomeAmounts[allOtherIncomeAmounts.length - 1][1] > 0}>
      {allOtherIncomeAmounts.map(([title, amount], index) => (amount > 0 ? (
        <Row
          fieldName={title}
          copyLabel={`${title}Amount`}
          value={`$${toLocaleString(amount, 0)}`}
          key={`${title}Row`}
          className={allOtherIncomeAmounts.length - 1 == index ? "table-total-row" : null}
        />
      ) : null))}
    </Table>

    {userDeclaredManagedFundsIncome.map((mfd, mfdIndex) => (
      <Table title={`Managed Funds Distribution - ${mfdIndex + 1}`} key={`${mfdIndex}-mfd-section`}>
        {mfd.map(({ amount, displayText, code }, i) => (
          <Row
            fieldName={displayText}
            copyLabel={`${mfdIndex}-mfd-${i}-Amount`}
            value={amount}
            key={`${mfdIndex}-mfd-${i}-Row`}
            code={code}
          />
        )
        )}
      </Table>
    ))}
    <br />
  </Accordion>
);

export default income;
