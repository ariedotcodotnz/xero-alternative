import React from "react";
import { taxAgencyAuthorisationStates as states } from "../../types/taxAgencyAuthorisation.type";
import { relinkBannerContent } from "./translations";

const { interimDelinkedParagraph, salesTaxLinkedParagraph1, salesTaxLinkedParagraph2, offBoardingDelinkedParagraph } = relinkBannerContent

const RelinkBannerContent = ({ currentState }: { currentState: states | "off_boarding" }) => (
  <>
    {(currentState === "interim_delinked") && (
      <p>
        {interimDelinkedParagraph}
      </p>
    )}
  
    {(currentState === "sales_tax_linked") && (
      <>
        <p>
          {salesTaxLinkedParagraph1}
        </p>
        <p>
          {salesTaxLinkedParagraph2}
        </p>
      </>
    )}

    {(currentState === "off_boarding") && (
      <p>
        {offBoardingDelinkedParagraph}
      </p>
    )}
  </>
);

export default RelinkBannerContent
