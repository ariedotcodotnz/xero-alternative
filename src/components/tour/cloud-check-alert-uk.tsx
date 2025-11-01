import React, { useEffect, useState } from "react";
import Alert from "../_molecules/alert/Alert";
import { UserVerification } from "../../types/userVerification.type";
import I18n from "../../utilities/translations";



function CloudCheckAlertUK({
  userVerification, maxFailedAttemptsReached, intercomLink
}: { userVerification: UserVerification,
    maxFailedAttemptsReached: boolean,
    intercomLink: string,
 }) {
  const [showAlert, setShowAlert] = useState(false);

  const MaxAttemptsContent = () => 
    (<div>
      {I18n.t("home.call_to_action.verification_failed.paragraph_1")} <a href={intercomLink} >Send us a message</a>
    </div>)

  const FailedVerificationContent = () => 
    (<div>
      {I18n.t("onboarding_tour.verify_your_identity.alert.body")}
    </div>)

  useEffect(() => {
    if (userVerification.failed_verification_attempts >= 1 && !userVerification.externally_verified_at) {
      setShowAlert(true);
    }
  }, [userVerification])


  return (
    <>
      {showAlert ? (
        <div className="tw-mx-2" id="cloud-check-alert-component">
          <div className="tw-flex tw-flex-col">
            <Alert variant="danger">
              {maxFailedAttemptsReached ? <MaxAttemptsContent/> : <FailedVerificationContent/>}
            </Alert >
          </div>
        </div>
      ) : null}
    </>
  );
};



export default CloudCheckAlertUK;
