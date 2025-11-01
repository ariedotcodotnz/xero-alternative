import React, { Fragment } from "react";
import Row from "./Row";
import Table from "./Table";
import Accordion from "../../../accordion";
import I18n from "../../../../utilities/translations";

const medicare = ({
  numberOfDependants,
  medicareExempted,
  medicareExemptionReason,
  fullLevyExemption,
  privateHealthInsurance,
  privateHealthInsuranceMembershipNo,
  taxCode,
  privateHealthInsuranceName,
  coveredFullYear,
  privateHealthInsuranceTotalDaysCovered,
}) => (
  <Accordion title="Medicare" baseId="medicare" classes="custom-card-filing" open>
    <Table title="Medicare levy reduction or exemption" code="M1">
      <Row fieldName="Number of dependent children and students" value={numberOfDependants} copyLabel="number-of-dependents" code="Y" />
      {medicareExempted && (
        <Fragment>
          <Row fieldName="Exempt - number of days full levy exemption" copyLabel="full-levy-exemption" value={fullLevyExemption} code="V" />
          <Row fieldName="Exemption reason" copyLabel="full-levy-exemption" value={medicareExemptionReason} />
        </Fragment>
      )}
    </Table>
    <Table title="Medicare levy surcharge" code="M2">
      <Row
        fieldName= {I18n.t("filing_obligations.filings.au.private_health_insurance_details.label")}
        value={coveredFullYear ? "Yes" : "No"}
        code="E"
      />
      {privateHealthInsurance && (
        <Row
          fieldName="Number of days not liable for surcharge"
          value={privateHealthInsuranceTotalDaysCovered}
          copyLabel="health-insurance-total-days-covered"
          code="A"
        />
      )}
    </Table>
    {privateHealthInsurance && (
      <Table title="Private health insurance policy detail">
        <Row fieldName="Provider name" value={privateHealthInsuranceName} copyLabel="health-insurance-name" colWidth2="20%" />
        <Row fieldName="Membership no." value={privateHealthInsuranceMembershipNo} copyLabel="health-insurance-membership-no" />
        <Row fieldName="Tax code" value={taxCode} copyLabel="tax-code" />
      </Table>
    )}
    <br />
  </Accordion>
);

export default medicare;
