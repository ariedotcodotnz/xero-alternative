import React, { useState, useEffect } from "react"
import AllowToRelinkModal from "./AllowToRelinkModal";
import ContinueWithHnryModal from "./ContinueWithHnryModal";
import DelinkedBanner from "./DelinkedBanner";
import HowToProceedModal from "./HowToProceedModal";
import IntentionallyDelinkedModal from "./IntentionallyDelinkedModal"
import InterimConfirmationModal from "./IntermConfimationModal";
import InterimDelinkedModal from "./InterimDelinkedModal";
import LinkedModal from "./LinkedModal";
import SalesTaxLinkedModal from "./SalesTaxLinkedModal";
import OffBoardUserModal from "./OffBoardUserModal";
import SalesTaxProceedModal from "./SalesTaxProceedModal";
import SalesTaxOnlyConsentModal from "./SalesTaxOnlyConsentModal";
import { taxAgencyAuthorisation as taa } from "../../types/taxAgencyAuthorisation.type";
import { delinkScreens } from "./types";

const DelinkFlow = ({ intercomLink, salesTaxRegistered, taxAgencyAuthorisation }: { intercomLink: string, salesTaxRegistered: boolean, taxAgencyAuthorisation: taa }) => {
  const [flowState, setFlowState] = useState<delinkScreens>() // sets which modal of the flow is open
  const [allowToRelinkModalOpen, setAllowToRelinkModalOpen] = useState(false)
  const [continueWithHnryModalOpen, setContinueWithHnryModalOpen] = useState(false)
  const [howToProceedModalOpen, setHowToProceedModalOpen] = useState(false)
  const [intentionallyDelinkedModalOpen, setIntentionallyDelinkedModalOpen] = useState(false)
  const [interimConfirmationModalOpen, setInterimConfirmationModalOpen] = useState(false)
  const [interimDelinkedModalOpen, setInterimDelinkedModalOpen] = useState(false)
  const [linkedModalOpen, setLinkedModalOpen] = useState(false)
  const [offBoardUserModalOpen, setOffBoardUserModalOpen] = useState(false)
  const [salesTaxLinkedModalOpen, setSalesTaxLinkedModalOpen] = useState(false)
  const [salesTaxProceedModalOpen, setSalesTaxProceedModalOpen] = useState(false)
  const [salesTaxOnlyConsentModalOpen, setSalesTaxOnlyConsentModalOpen] = useState(false)

  useEffect(() => {
    switch (flowState) {
    case "allow_to_relink":
      setAllowToRelinkModalOpen(true)
      break;
    case "continue_with_hnry":
      setContinueWithHnryModalOpen(true)
      break;
    case "how_to_proceed":
      setHowToProceedModalOpen(true)
      break;
    case "intentionally_delinked":
      setIntentionallyDelinkedModalOpen(true)
      break;
    case "interim_confirmation":
      setInterimConfirmationModalOpen(true)
      break;
    case "interim_delinked":
      setInterimDelinkedModalOpen(true)
      break;
    case "linked":
      setLinkedModalOpen(true)
      break;
    case "off_board_user":
      setOffBoardUserModalOpen(true)
      break;
    case "sales_tax_linked":
      setSalesTaxLinkedModalOpen(true)
      break;
    case "sales_tax_only_consent":
      setSalesTaxOnlyConsentModalOpen(true)
      break;
    case "sales_tax_proceed":
      setSalesTaxProceedModalOpen(true)
      break;
    default:
      break;
    }
  }, [flowState])

  return (
    <>
      <DelinkedBanner
        setFlowState={setFlowState}
      />
      {allowToRelinkModalOpen && (
        <AllowToRelinkModal
          allowToRelinkModalOpen={allowToRelinkModalOpen}
          salesTaxRegistered={salesTaxRegistered}
          setAllowToRelinkModalOpen={setAllowToRelinkModalOpen}
          setFlowState={setFlowState}
        />
      )}
      {continueWithHnryModalOpen && (
        <ContinueWithHnryModal
          continueWithHnryModalOpen={continueWithHnryModalOpen}
          setContinueWithHnryModalOpen={setContinueWithHnryModalOpen}
          setFlowState={setFlowState}
        />
      )}
      {howToProceedModalOpen && (
        <HowToProceedModal
          howToProceedModalOpen={howToProceedModalOpen}
          setHowToProceedModalOpen={setHowToProceedModalOpen}
          setFlowState={setFlowState}
        />
      )}
      {interimConfirmationModalOpen && (
        <InterimConfirmationModal
          interimConfirmationModalOpen={interimConfirmationModalOpen}
          setInterimConfirmationModalOpen={setInterimConfirmationModalOpen}
        />
      )}
      {intentionallyDelinkedModalOpen && (
        <IntentionallyDelinkedModal
          intentionallyDelinkedModalOpen={intentionallyDelinkedModalOpen}
          setIntentionallyDelinkedModalOpen={setIntentionallyDelinkedModalOpen}
          setFlowState={setFlowState}
          taxAgencyAuthorisation={taxAgencyAuthorisation}
        />
      )}
      {interimDelinkedModalOpen && (
        <InterimDelinkedModal
          interimDelinkedModalOpen={interimDelinkedModalOpen}
          setInterimDelinkedModalOpen={setInterimDelinkedModalOpen}
          setFlowState={setFlowState}
          taxAgencyAuthorisation={taxAgencyAuthorisation}
        />
      )}
      {linkedModalOpen && (
        <LinkedModal
          linkedModalOpen={linkedModalOpen}
          setFlowState={setFlowState}
          setLinkedModalOpen={setLinkedModalOpen}
          taxAgencyAuthorisation={taxAgencyAuthorisation}
        />
      )}
      {salesTaxLinkedModalOpen && (
        <SalesTaxLinkedModal
          salesTaxLinkedModalOpen={salesTaxLinkedModalOpen}
          setFlowState={setFlowState}
          setSalesTaxLinkedModalOpen={setSalesTaxLinkedModalOpen}
          taxAgencyAuthorisation={taxAgencyAuthorisation}
        />
      )}
      {offBoardUserModalOpen && (
        <OffBoardUserModal
          offBoardUserModalOpen={offBoardUserModalOpen}
          setFlowState={setFlowState}
          setOffBoardUserModalOpen={setOffBoardUserModalOpen}
          taxAgencyAuthorisation={taxAgencyAuthorisation}
        />
      )}
      {salesTaxProceedModalOpen && (
        <SalesTaxProceedModal
          intercomLink={intercomLink}
          salesTaxProceedModalOpen={salesTaxProceedModalOpen}
          setFlowState={setFlowState}
          setSalesTaxProceedModalOpen={setSalesTaxProceedModalOpen}
        />
      )}
      {salesTaxOnlyConsentModalOpen && (
        <SalesTaxOnlyConsentModal
          salesTaxOnlyConsentModalOpen={salesTaxOnlyConsentModalOpen}
          setFlowState={setFlowState}
          setSalesTaxOnlyConsentModalOpen={setSalesTaxOnlyConsentModalOpen}
        />
      )}
    </>
  )
}

export default DelinkFlow
