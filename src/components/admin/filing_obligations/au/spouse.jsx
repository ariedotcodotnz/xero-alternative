import React from "react";
import { toLocaleString, formattedDateWithMonthName } from "../../../utils/base_helper";
import Row from "./Row";
import Table from "./Table";
import Accordion from "../../../accordion";

const spouse = ({
  firstName, lastName, dateOfBirth, gender, residency, fullYearSpouse, periodStart, periodEnd, died,
  estimatedTotalIncome, fhssFunds, fhssFundsAmount, fringeBenefits, fringeBenefitsAmount,
  superEmployerAmount, superPersonalAmount, pension, pensionAmount, foreignIncome, foreignIncomeAmount,
  investmentLoss, investmentLossAmount, investmentLossPropertyAmount, childSupport, childSupportAmount,
  superLumpSum, superLumpSumAmount, ...props
}) => {
  const showSuper = props.super || pension;
  const showInvestmentLoss = investmentLoss || childSupport || superLumpSum;

  return (
    <Accordion baseId="au-spouse" title="Spouse" classes="custom-card-filing" open>
      <Table title="Spouse's details">
        <Row fieldName="Surname or family name" value={lastName} copyLabel="spouse-last-name" colWidth2="15%" />
        <Row fieldName="First given name" value={firstName} copyLabel="spouse-first-name" />
        <Row fieldName="Your spouse's date of birth" value={formattedDateWithMonthName(dateOfBirth)} copyLabel="spouse-dob" code="K" />
        <Row fieldName="Your spouse's gender" value={gender} copyLabel="spouse-gender" />
        <Row fieldName="Your spouse has residency" value={residency ? "Yes" : "No"} />
        <Row fieldName="Did you have a spouse for the full year?" value={fullYearSpouse ? "Yes" : "No"} code="L" />
        {!fullYearSpouse && (
          <>
            <Row fieldName="From date" value={formattedDateWithMonthName(periodStart)} copyLabel="spouse-start-date" code="M" />
            <Row fieldName="To date" value={formattedDateWithMonthName(periodEnd)} copyLabel="spouse-end-date" code="N" />
            <Row fieldName="Did your spouse die during the year?" value={died ? "Yes" : "No"} />
          </>
        )}
      </Table>
      <br />

      <h4 className="mb-1">Spouse&apos;s income</h4>
      <Table title="Your spouse's taxable income (excluding FHSS released amount)">
        <Row
          fieldName="Your spouse's taxable income"
          value={`$${toLocaleString(estimatedTotalIncome, 0)}`}
          copyLabel="spouse-income-amount"
        />
        {fhssFunds && (
          <Row
            fieldName="Your spouses's assessable FHSS released amounts"
            value={`$${toLocaleString(fhssFundsAmount, 0)}`}
            copyLabel="spouse-fhss-funds-amount"
          />
        )}
      </Table>

      {fringeBenefits && (
        <Table title="Your spouse's total reportable fringe benefits amounts">
          <Row
            fieldName="Your spouse's total reportable fringe benefits amounts"
            value={`$${toLocaleString(fringeBenefitsAmount, 0)}`}
            copyLabel="spouse-fringe-amount"
            warningTooltip="Contact customer for more"
          />
        </Table>
      )}

      {showSuper && (
        <>
          <Table title="Spouse reportable superannuation contributions" code="A">
            {props.super && (
              <>
                <Row
                  fieldName="Spouse reportable employer superannuation contributions"
                  value={`$${toLocaleString(superEmployerAmount, 0)}`}
                  copyLabel="spouse-super-employer-amount"
                />
                <Row
                  fieldName="Spouse reportable personal superannuation contributions"
                  value={`$${toLocaleString(superPersonalAmount, 0)}`}
                  copyLabel="spouse-super-personal-amount"
                />
              </>
            )}
            {pension && (
              <Row
                fieldName="Your spouse's tax-free government pensions"
                value={`$${toLocaleString(pensionAmount, 0)}`}
                copyLabel="spouse-pension-amount"
                code="B"
              />
            )}
          </Table>
        </>
      )}

      {foreignIncome && (
        <Table title="Your spouse's target foreign income" code="C">
          <Row
            fieldName="Your spouse's foreign income"
            value={`$${toLocaleString(foreignIncomeAmount, 0)}`}
            copyLabel="spouse-foreign-income-amount"
          />
        </Table>
      )}

      {showInvestmentLoss && (
        <Table title="Your spouse's net investment loss" code="D">
          {investmentLoss && (
            <>
              <Row
                fieldName="Your spouse's net financial investment loss"
                value={`$${toLocaleString(investmentLossAmount, 0)}`}
                copyLabel="spouse-investment-loss-amount"
              />
              <Row
                fieldName="Your spouse's net rental property loss"
                value={`$${toLocaleString(investmentLossPropertyAmount, 0)}`}
                copyLabel="spouse-investment-loss-property-amount"
              />
            </>
          )}
          {childSupport && (
            <Row
              fieldName="Child support your spouse paid"
              value={`$${toLocaleString(childSupportAmount, 0)}`}
              copyLabel="spouse-child-support-amount"
              code="E"
            />
          )}
          {superLumpSum && (
            <Row
              fieldName="Your spouse's taxed element of a SLS zero tax rate"
              value={`$${toLocaleString(superLumpSumAmount, 0)}`}
              copyLabel="spouse-super-lump-sum-amount"
              code="F"
            />
          )}
        </Table>
      )}
      <br />
    </Accordion>
  );
};

export default spouse;
