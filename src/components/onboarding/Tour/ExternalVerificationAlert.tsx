import React from "react";
import Alert from "@hui/_molecules/alert/Alert";
import CloudCheckAlert from "@hui/tour/cloud-check-alert";
import { UserVerificationPresenter } from "app/javascript/types/userVerification.type";
import I18n from "../../../utilities/translations"

const ctx = { scope: "onboarding.v3.verify_identity_external_verification" };

const MaxAttemptsContent = ({ intercomLink }: { intercomLink: string }) => (
  <div>
    {I18n.t("home.call_to_action.verification_failed.paragraph_1")}{" "}
    <a href={intercomLink}>Send us a message</a>
  </div>
);

const FailedVerificationContent = () => (
  <div>{I18n.t("errors.failed", ctx)}</div>
);

const ExternalVerificationAlert = ({
  failedVerification, maxFailedAttemptsReached, intercomLink, userVerification, isUkForm
}: {
  failedVerification: boolean,
  maxFailedAttemptsReached: boolean,
  intercomLink: string,
  userVerification: UserVerificationPresenter,
  isUkForm: boolean
}) => {

  const ANzPassport = !isUkForm && userVerification?.verifiable_type === "Passport" && ["NZ", "AU"].includes(userVerification?.verifiable.passport_country_of_issue)

  // if more alerts get used in here then we can extend this switch statement
  const renderAlert = () => {
    switch (true) {
      case maxFailedAttemptsReached: return <MaxAttemptsContent intercomLink={intercomLink} />
      default: return <FailedVerificationContent />
    }
  }

  // we moved cloudcheckalert into its own return as it is a legacy component and we don't want to change its internals. If we put it
  // in the switch statement then we see a duplicate header on the alert.
  if (ANzPassport && !maxFailedAttemptsReached && userVerification?.external_verification_errors?.known_response) {
    return (<CloudCheckAlert userVerification={userVerification} />)
  }

  return (
    <>
      {maxFailedAttemptsReached || failedVerification ? (
        <div className="tw-mx-2" id="cloud-check-alert-component">
          <div className="tw-flex tw-flex-col">
            <Alert variant="danger">
              {renderAlert()}
            </Alert >
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ExternalVerificationAlert;
