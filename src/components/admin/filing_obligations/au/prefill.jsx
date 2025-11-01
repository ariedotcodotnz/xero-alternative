import React from "react";
import Row from "./Row";
import Table from "./Table";
import Accordion from "../../../accordion";
import { toLocaleString } from "../../../utils/base_helper";

const prefill = ({
  atoInterest,
  bankInterests,
  dividends,
  employmentTerminationPayments,
  firstHomeSuperSaver,
  governmentPayments,
  hasStudentLoan,
  hasAtoInterest,
  hasFhss,
  managedFundsDistributions,
  paygiReports,
  privateHealthInsurances,
  salaryAndWages,
  summary,
  superDeductions,
  superLumpSumPayments,
  annuitiesAndSuperannuation,
}) => (
  <Accordion baseId="prefill" title="Prefill" classes="custom-card-filing" open>
    <Table title="Summary">
      {summary.cgtPropertyTransfers
        && <Row fieldName="CGT property transfers" value={summary.cgtPropertyTransfers} colWidth1="40%" colWidth2="20%" />
      }
      {summary.cgtSharesDisposals
        && <Row fieldName="CGT shares disposals" value={summary.cgtSharesDisposals} colWidth1="40%" colWidth2="20%" />
      }
      {summary.cryptocurrency
        && <Row fieldName="Cryptocurrency" value={summary.cryptocurrency} colWidth1="40%" colWidth2="20%" />
      }
      {summary.priorYearCgtLossesCarryForward
        && <Row fieldName="Prior year CGT losses carried forward" value={`$${toLocaleString(summary.priorYearCgtLossesCarryForward)}`} copyLabel="prior-year-cgt-losses-carry-forward" colWidth1="40%" colWidth2="20%" />
      }
      {summary.totalSalaryIncome
        && <Row fieldName="Total salary income" value={`$${toLocaleString(summary.totalSalaryIncome)}`} copyLabel="test" colWidth1="40%" colWidth2="20%" />
      }
    </Table>
    {salaryAndWages.map(function (salary, i) {
      return (
        <Table title="Salary and wages" key={i}>
          {salary.payorName
            && <Row fieldName="Payor name" value={salary.payorName} copyLabel={`salary-${i}-payor-name`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.withholdingPayerNumber
            && <Row fieldName="Withholding Payer Number" value={salary.withholdingPayerNumber} copyLabel={`salary-${i}-withholding-payer`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.grossPayment
            && <Row fieldName="Gross payment" value={`$${toLocaleString(salary.grossPayment)}`} copyLabel={`salary-${i}-gross-payment`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.totalAllowance
            && <Row fieldName="Total allowance" value={`$${toLocaleString(salary.totalAllowance)}`} copyLabel={`salary-${i}-total-allowance`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.taxWithheld
            && <Row fieldName="Tax withheld" value={`$${toLocaleString(salary.taxWithheld)}`} copyLabel={`salary-${i}-tax-withheld`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.employerFbtExempt
            && <Row fieldName="Employer FBT exempt" value={salary.employerFbtExempt} colWidth1="40%" colWidth2="20%" />
          }
          {salary.employerSuperContribution
            && <Row fieldName="Employer super contribution" value={`$${toLocaleString(salary.employerSuperContribution)}`} copyLabel={`salary-${i}-employer-super-contribution`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.fringeBenefits
            && <Row fieldName="Fringe Benefits" value={`$${toLocaleString(salary.fringeBenefits)}`} copyLabel={`salary-${i}-fringe-benefits`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.unionFees
            && <Row fieldName="Union fees" value={`$${toLocaleString(salary.unionFees)}`} copyLabel={`salary-${i}-union-fees`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.workplaceGiving
            && <Row fieldName="Workplace giving" value={`$${toLocaleString(salary.workplaceGiving)}`} copyLabel={`salary-${i}-workplace-giving`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.exemptForeignEmploymentAmount
            && <Row fieldName="Exempt foreign employment amount" value={`$${toLocaleString(salary.exemptForeignEmploymentAmount)}`} copyLabel={`salary-${i}-exempt-foreign`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.communityDevelopmentEmploymentProjectAmount
            && <Row fieldName="CDEP amount" value={`$${toLocaleString(salary.communityDevelopmentEmploymentProjectAmount)}`} copyLabel={`salary-${i}-cdep`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.lumpSumAAmount
            && <Row fieldName="Lump Sum A amount" value={`$${toLocaleString(salary.lumpSumAAmount)}`} copyLabel={`salary-${i}-lump-sum-a`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.lumpSumACode
            && <Row fieldName="Lump Sum A code" value={salary.lumpSumACode} copyLabel={`salary-${i}-lump-sum-a-code`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.lumpSumBAmount
            && <Row fieldName="Lump Sum B amount" value={`$${toLocaleString(salary.lumpSumBAmount)}`} copyLabel={`salary-${i}-lump-sum-b`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.lumpSumDAmount
            && <Row fieldName="Lump Sum D amount" value={`$${toLocaleString(salary.lumpSumDAmount)}`} copyLabel={`salary-${i}-lump-sum-d`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.lumpSumEAmount
            && <Row fieldName="Lump Sum E amount" value={`$${toLocaleString(salary.lumpSumEAmount)}`} copyLabel={`salary-${i}-lump-sum-e`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.annuityUndeductedAmount
            && <Row fieldName="Annuity undeducted amount" value={`$${toLocaleString(salary.annuityUndeductedAmount)}`} copyLabel={`salary-${i}-annuity-undeducted`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.incomeOtherAmount
            && <Row fieldName="Other income amount" value={`$${toLocaleString(salary.incomeOtherAmount)}`} copyLabel={`salary-${i}-other-income`} colWidth1="40%" colWidth2="20%" />
          }
          {salary.IncomeTypeCode
            && <Row fieldName="" value={salary.IncomeTypeCode} copyLabel={`salary-${i}-lump-sum-a-code`} colWidth1="40%" colWidth2="20%" />
          }
        </Table>
      );
    })}
    {employmentTerminationPayments.map(function (etp, i) {
      return (
        <Table title="Employment termination payment" key={i}>
          <Row fieldName="Payor name" value={etp.payerOrganisationName} copyLabel={`etp-${i}-payor-name`} colWidth1="40%" colWidth2="20%" />
          <Row fieldName="Payment date" value={etp.paymentDate} copyLabel={`etp-${i}-payment-date`} colWidth1="40%" colWidth2="20%" />
          <Row fieldName="Taxable amount" value={`$${toLocaleString(etp.taxableAmount)}`} copyLabel={`etp-${i}-taxable-amount`} colWidth1="40%" colWidth2="20%" />
          <Row fieldName="Tax free amount" value={`$${toLocaleString(etp.taxFreeAmount)}`} copyLabel={`etp-${i}-tax-free-amount`} colWidth1="40%" colWidth2="20%" />
          <Row fieldName="Tax withheld" value={`$${toLocaleString(etp.paygTaxWithheldAmount)}`} copyLabel={`etp-${i}-tax-withheld`} colWidth1="40%" colWidth2="20%" />
          {etp.paygWithholdingPaymentTypeCode
            && <Row fieldName="Payment type code" value={etp.paygWithholdingPaymentTypeCode} copyLabel={`etp-${i}-code`} colWidth1="40%" colWidth2="20%" />
          }
        </Table>
      );
    })}
    {governmentPayments.map(function (governmentPayment, i) {
      return (
        <Table title="Government payment" key={i}>
          {governmentPayment.benefitType
            && <Row fieldName="Benefit type" value={governmentPayment.benefitType} copyLabel={`government-payment-${i}-benefit-type`} colWidth1="40%" colWidth2="20%" />
          }
          {governmentPayment.taxableIncome
            && <Row fieldName="Taxable income" value={`$${toLocaleString(governmentPayment.taxableIncome)}`} copyLabel={`government-payment-${i}-taxable-income`} colWidth1="40%" colWidth2="20%" />
          }
          {governmentPayment.allowance
            && <Row fieldName="Allowance" value={`$${toLocaleString(governmentPayment.allowance)}`} copyLabel={`government-payment-${i}-allowance`} colWidth1="40%" colWidth2="20%" />
          }
          {governmentPayment.taxExempt
            && <Row fieldName="Tax exempt" value={`$${toLocaleString(governmentPayment.taxExempt)}`} copyLabel={`government-payment-${i}-tax-exempt`} colWidth1="40%" colWidth2="20%" />
          }
          {governmentPayment.taxWithheld
            && <Row fieldName="Tax withheld" value={`$${toLocaleString(governmentPayment.taxWithheld)}`} copyLabel={`government-payment-${i}-tax-withheld`} colWidth1="40%" colWidth2="20%" />
          }
        </Table>
      );
    })}
    {bankInterests.map(function (bankInterest, i) {
      return (
        <Table title="Bank interest" key={i}>
          {bankInterest.accountNumber
            && <Row fieldName="Account number" value={bankInterest.accountNumber} copyLabel={`bank-interest-${i}-account-number`} colWidth1="40%" colWidth2="20%" />
          }
          {bankInterest.grossInterest
            && <Row fieldName="Gross interest" value={`$${toLocaleString(bankInterest.grossInterest)}`} copyLabel={`bank-interest-${i}-gross-interest`} colWidth1="40%" colWidth2="20%" />
          }
          {bankInterest.tfnAmountsWithheld
            && <Row fieldName="TFN amounts withheld" value={`$${toLocaleString(bankInterest.tfnAmountsWithheld)}`} copyLabel={`bank-interest-${i}-tfn-amounts-withheld`} colWidth1="40%" colWidth2="20%" />
          }
        </Table>
      );
    })}
    {dividends.map(function (dividend, i) {
      return (
        <Table title="Dividends" key={i}>
          {dividend.companyName
            && <Row fieldName="Company name" value={dividend.companyName} copyLabel={`dividend-${i}-company-name`} colWidth1="40%" colWidth2="20%" />
          }
          {dividend.unfrankedAmount
            && <Row fieldName="Unfranked amount" value={`$${toLocaleString(dividend.unfrankedAmount)}`} copyLabel={`dividend-${i}-unfranked-amount`} colWidth1="40%" colWidth2="20%" />
          }
          {dividend.frankedAmount
            && <Row fieldName="Franked amount" value={`$${toLocaleString(dividend.frankedAmount)}`} copyLabel={`dividend-${i}-franked-amount`} colWidth1="40%" colWidth2="20%" />
          }
          {dividend.frankingCredit
            && <Row fieldName="Franking credit" value={`$${toLocaleString(dividend.frankingCredit)}`} copyLabel={`dividend-${i}-franking-credit`} colWidth1="40%" colWidth2="20%" />
          }
          {dividend.tfnAmountsWithheld
            && <Row fieldName="TFN amounts withheld" value={`$${toLocaleString(dividend.tfnAmountsWithheld)}`} copyLabel={`dividend-${i}-tfn-amounts-withheld`} colWidth1="40%" colWidth2="20%" />
          }
        </Table>
      );
    })}
    {superDeductions.map(function (superDeduction, i) {
      return (
        <Table title="Superannuation deductions" key={i}>
          {superDeduction.providedNoticeOfIntent
            && <Row fieldName="Provided notice of intent" value={superDeduction.providedNoticeOfIntent} colWidth1="40%" colWidth2="20%" />
          }
          {superDeduction.fundName
            && <Row fieldName="Fund name" value={superDeduction.fundName} copyLabel={`super-deduction-${i}-fund-name`} colWidth1="40%" colWidth2="20%" />
          }
          {superDeduction.accountNumber
            && <Row fieldName="Account number" value={superDeduction.accountNumber} copyLabel={`super-deduction-${i}-account-number`} colWidth1="40%" colWidth2="20%" />
          }
          {superDeduction.deductionClaimed
            && <Row fieldName="Deduction claimed" value={`$${toLocaleString(superDeduction.deductionClaimed)}`} copyLabel={`super-deduction-${i}-deduction-claimed`} colWidth1="40%" colWidth2="20%" />
          }
        </Table>
      );
    })}
    {superLumpSumPayments.map(function (superLumpSumPayment, i) {
      return (
        <Table title="Superannuation lump sum payments" key={i}>
          <Row fieldName="Fund name" value={superLumpSumPayment.fundName} copyLabel={`super-lump-sum-${i}-fund-name`} colWidth1="40%" colWidth2="20%" />
          <Row fieldName="Payment date" value={superLumpSumPayment.paymentDate} copyLabel={`super-lump-sum-${i}-payment-date`} colWidth1="40%" colWidth2="20%" />
          <Row fieldName="Taxed amount" value={`$${toLocaleString(superLumpSumPayment.taxableComponentTaxedAmount)}`} copyLabel={`super-lump-sum-${i}-taxed-amount`} colWidth1="40%" colWidth2="20%" />
          <Row fieldName="Untaxed amount" value={`$${toLocaleString(superLumpSumPayment.taxableComponentUntaxedAmount)}`} copyLabel={`super-lump-sum-${i}-untaxed-amount`} colWidth1="40%" colWidth2="20%" />
          <Row fieldName="Tax free amount" value={`$${toLocaleString(superLumpSumPayment.taxFreeAmount)}`} copyLabel={`super-lump-sum-${i}-tax-free-amount`} colWidth1="40%" colWidth2="20%" />
          <Row fieldName="Tax withheld" value={`$${toLocaleString(superLumpSumPayment.paygTaxWithheldAmount)}`} copyLabel={`super-lump-sum-${i}-tax-withheld`} colWidth1="40%" colWidth2="20%" />
        </Table>
      );
    })}
    {hasAtoInterest
      && <Table title="ATO interest">
        {atoInterest.delayedRefundInterest
          && <Row fieldName="Delayed refund interest" value={`$${toLocaleString(atoInterest.delayedRefundInterest)}`} copyLabel={"ato-interest-delayed-refund-interest"} colWidth1="40%" colWidth2="20%" />
        }
        {atoInterest.exclusionReasonCode
          && <Row fieldName="Exclusion reason code" value={atoInterest.exclusionReasonCode} colWidth1="40%" colWidth2="20%" />
        }
        {atoInterest.gicSicLpiCredit
          && <Row fieldName="GIC SIC LPI credit" value={`$${toLocaleString(atoInterest.gicSicLpiCredit)}`} copyLabel={"ato-interest-gic-sic-lpi-credit"} colWidth1="40%" colWidth2="20%" />
        }
        {atoInterest.gicSicLpiDebit
          && <Row fieldName="GIC SIC LPI debit" value={`$${toLocaleString(atoInterest.gicSicLpiDebit)}`} copyLabel={"ato-interest-gic-sic-lpi-debit"} colWidth1="40%" colWidth2="20%" />
        }
        {atoInterest.interestOnEarlyPayments
          && <Row fieldName="Interest on early payments" value={`$${toLocaleString(atoInterest.interestOnEarlyPayments)}`} copyLabel={"ato-interest-interest-on-early-payments"} colWidth1="40%" colWidth2="20%" />
        }
        {atoInterest.interestOnOverpayments
          && <Row fieldName="Interest on overpayments" value={`$${toLocaleString(atoInterest.interestOnOverpayments)}`} copyLabel={"ato-interest-interest-on-overpayments"} colWidth1="40%" colWidth2="20%" />
        }
      </Table>
    }
    {hasFhss
      && <Table title="First home super saver">
        {firstHomeSuperSaver.releasedAmount
          && <Row fieldName="Released" value={`$${toLocaleString(firstHomeSuperSaver.releasedAmount)}`} copyLabel={"fhss-released"} colWidth1="40%" colWidth2="20%" />
        }
        {firstHomeSuperSaver.taxWithheldAmount
          && <Row fieldName="Tax withheld" value={`$${toLocaleString(firstHomeSuperSaver.taxWithheldAmount)}`} copyLabel={"fhss-tax-withheld"} colWidth1="40%" colWidth2="20%" />
        }
      </Table>
    }
    {managedFundsDistributions.map(function (managedFundsDistribution, i) {
      return (
        <Table title="Managed funds distribution" key={i}>
          <Row fieldName="Managed fund name" value={managedFundsDistribution.fundName} copyLabel={`managed-funds-distribution-${i}-fund-name`} colWidth1="40%" colWidth2="20%" />
          <Row fieldName="Investment reference number" value={managedFundsDistribution.accountReferenceNumber} copyLabel={`managed-funds-distribution-${i}-account-ref`} colWidth1="40%" colWidth2="20%" />
        </Table>
      );
    })}
    {annuitiesAndSuperannuation.map(function (annuity, i) {
      return (
        <Table title="Annuities and superannuation" key={i}>
          <Row fieldName="Payer name" value={annuity.payerName} colWidth1="40%" colWidth2="20%" copyLabel={`annuity-superannuation-${i}-payer-name`} />
          <Row fieldName="Taxed element" value={`$${toLocaleString(annuity.taxedElementAmount)}`} colWidth1="40%" colWidth2="20%" copyLabel={`annuity-superannuation-${i}-taxed-element`} />
          <Row fieldName="Untaxed element" value={`$${toLocaleString(annuity.untaxedElementAmount)}`} colWidth1="40%" colWidth2="20%" copyLabel={`annuity-superannuation-${i}-untaxed-element`} />
          <Row fieldName="Lump sum arrears taxed element" value={`$${toLocaleString(annuity.lumpSumArrearsTaxedElementAmount)}`} colWidth1="40%" colWidth2="20%" copyLabel={`annuity-superannuation-${i}-lump-sum-arrears-taxed-element`} />
          <Row fieldName="Lump sum arrears untaxed element" value={`$${toLocaleString(annuity.lumpSumArrearsUntaxedElementAmount)}`} colWidth1="40%" colWidth2="20%" copyLabel={`annuity-superannuation-${i}-lump-sum-arrears-untaxed-element`} />
        </Table>
      )
    })}
    {privateHealthInsurances.map(function (privateHealthInsurance, i) {
      return (
        <Table title="Private health insurance" key={i}>
          {privateHealthInsurance.policyEndDate
            && <Row fieldName="Policy end date" value={privateHealthInsurance.policyEndDate} copyLabel={`private-health-insurance-${i}-end-date`} colWidth1="40%" colWidth2="20%" />
          }
          {privateHealthInsurance.policyStartDate
            && <Row fieldName="Policy start date" value={privateHealthInsurance.policyStartDate} copyLabel={`private-health-insurance-${i}-start-date`} colWidth1="40%" colWidth2="20%" />
          }
          {privateHealthInsurance.insurerName
            && <Row fieldName="Insurer name" value={privateHealthInsurance.insurerName} copyLabel={`private-health-insurance-${i}-insurer-name`} colWidth1="40%" colWidth2="20%" />
          }
          {privateHealthInsurance.membershipNo
            && <Row fieldName="Membership number" value={privateHealthInsurance.membershipNo} copyLabel={`private-health-insurance-${i}-membership-no`} colWidth1="40%" colWidth2="20%" />
          }
          {privateHealthInsurance.premiumEligibleForRebate
            && <Row fieldName="Premium eligible for rebate" value={`$${toLocaleString(privateHealthInsurance.premiumEligibleForRebate)}`} copyLabel={`private-health-insurance-${i}-premium-eligible-for-rebate`} colWidth1="40%" colWidth2="20%" />
          }
          {privateHealthInsurance.rebateReceived
            && <Row fieldName="Rebate received" value={`$${toLocaleString(privateHealthInsurance.rebateReceived)}`} copyLabel={`private-health-insurance-${i}-rebate-received`} colWidth1="40%" colWidth2="20%" />
          }
          {privateHealthInsurance.benefitCode
            && <Row fieldName="Benefit code" value={privateHealthInsurance.benefitCode} copyLabel={`private-health-insurance-${i}-benefit-code`} colWidth1="40%" colWidth2="20%" />
          }
        </Table>
      );
    })}
    {paygiReports.map(function (paygiReport, i) {
      return (
        <Table title="PAYG instalment" key={i}>
          {paygiReport.amount
            && <Row fieldName="Amount" value={`$${toLocaleString(paygiReport.amount)}`} copyLabel={`paygiReport-${i}-amount`} colWidth1="40%" colWidth2="20%" />
          }
          {paygiReport.quarter
            && <Row fieldName="Quarter" value={paygiReport.quarter} colWidth1="40%" colWidth2="20%" />
          }
          {paygiReport.status
            && <Row fieldName="Status" value={paygiReport.status} colWidth1="40%" colWidth2="20%" />
          }
        </Table>
      );
    })}
    {hasStudentLoan
      && <Table title="Student loans">
        {summary.higherEducationLoanProgramBalance
          && <Row fieldName="Higher education loan program balance" value={`$${toLocaleString(summary.higherEducationLoanProgramBalance)}`} copyLabel="higher-education-loan-program" colWidth1="40%" colWidth2="20%" />
        }
        {summary.abstudyStudentStartupLoanBalance
          && <Row fieldName="AB study student startup loan balance" value={`$${toLocaleString(summary.abstudyStudentStartupLoanBalance)}`} copyLabel="abstudy-student-startup-loan" colWidth1="40%" colWidth2="20%" />
        }
        {summary.studentFinancialSupplementSchemeBalance
          && <Row fieldName="Student financial supplement scheme balance" value={`$${toLocaleString(summary.studentFinancialSupplementSchemeBalance)}`} copyLabel="student-financial-supplement-scheme" colWidth1="40%" colWidth2="20%" />
        }
        {summary.studentStartupLoanBalance
          && <Row fieldName="Student startup loan balance" value={`$${toLocaleString(summary.studentStartupLoanBalance)}`} copyLabel="student-startup-loan" colWidth1="40%" colWidth2="20%" />
        }
        {summary.tradeSupportLoanBalance
          && <Row fieldName="Trade support loan balance" value={`$${toLocaleString(summary.tradeSupportLoanBalance)}`} copyLabel="trade-support-loan" colWidth1="40%" colWidth2="20%" />
        }
        {summary.vetStudentLoanBalance
          && <Row fieldName="VET student loan balance" value={`$${toLocaleString(summary.vetStudentLoanBalance)}`} copyLabel="vet-student-loan" colWidth1="40%" colWidth2="20%" />
        }
      </Table>
    }
    <br />
  </Accordion>
);

export default prefill;
