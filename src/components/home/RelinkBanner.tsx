import React, { useState } from "react";
import Button from "@hui/_atoms/button/Button"
import LinkedModal from "./LinkedModal";
import RelinkBannerContent from "./RelinkBannerContent";
import { taxAgencyAuthorisation as taa, taxAgencyAuthorisationStates as states } from "../../types/taxAgencyAuthorisation.type";
import { relinkBanner } from "./translations";

const RelinkBanner = ({ taxAgencyAuthorisation, currentState }: { taxAgencyAuthorisation: taa, currentState: states | "off_boarding" }) => {
  const [linkedModalOpen, setLinkedModalOpen] = useState(false)

  const copy = relinkBanner[currentState]
  const bannerClasses = (currentState === "off_boarding") ? "alert alert-danger" : "alert alert-new"

  return (
    <>
      <div className={bannerClasses} role="alert" >
        <h2 className="hnry-heading hnry-heading--marketing-h1">{copy.title}</h2>
        <RelinkBannerContent currentState={currentState}/>
        <Button type="button" onClick={() => setLinkedModalOpen(true)}>
          {copy.button}
        </Button>
      </div>
      {linkedModalOpen && (
        <LinkedModal 
          linkedModalOpen={linkedModalOpen}
          setLinkedModalOpen={setLinkedModalOpen}
          taxAgencyAuthorisation={taxAgencyAuthorisation}
        />
      )}
    </>
  )
};

export default RelinkBanner
