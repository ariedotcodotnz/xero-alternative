import React from "react";
import { toLocaleString } from "../../../utils/base_helper";
import Row from "./Row";
import Table from "./Table";
import Accordion from "../../../accordion";

const income_tests = ({
  numberOfDependants,
  childSupport,
  childSupportAmount,
  taxFreeGovtPensionAmount,
}) => {
  const show = !!(taxFreeGovtPensionAmount > 0 || childSupport || numberOfDependants > 0);

  return (
    <Accordion baseId="income-tests" title="Income tests" classes="custom-card-filing" open={show}>
      <Table
        title="Income tests"
        show={show}
      >
        {taxFreeGovtPensionAmount > 0 && (
          <Row
            fieldName="Tax-free government pensions"
            copyLabel="tax-free-govt-pensions-amount"
            value={`$${toLocaleString(taxFreeGovtPensionAmount, 0)}`}
            code="IT3"
            colWidth1="53%"
          />
        )}
        {childSupport && (
          <Row
            fieldName="Child support paid"
            value={`$${toLocaleString(childSupportAmount, 0)}`}
            copyLabel="child-support-amount"
            code="IT7"
            colWidth1="53%"
          />
        )}
        {numberOfDependants > 0 && (
          <Row
            fieldName="Number of dependent children"
            value={numberOfDependants}
            copyLabel="number-of-children"
            code="IT8"
            colWidth1="53%"
          />
        )}
      </Table>
      <br />
    </Accordion>
  );
};

export default income_tests;
