import React, { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "../_molecules/alert/Alert";
import { UserVerification, UserVerificationPresenter } from "../../types/userVerification.type";
import I18n from "../../utilities/translations";

// this should be an exhaustive list 
const cloudCheckValidationTree = [
  {
    name: "first_name",
    id: "user_first_name_legal",
    errorMessage: "First name"
  },
  {
    name: "middle_name",
    id: "user_middle_name_legal",
    errorMessage: "Middle name"
  },
  {
    name: "last_name",
    id: "user_last_name_legal",
    errorMessage: "Last name"
  },
  {
    name: "passport_number",
    id: "verifiable_passport_number",
    errorMessage: "Passport number"
  },
  {
    name: "document_expiry",
    id: "verifiable[expires_on]",
    errorMessage: "Expiry date"
  },
  {
    name: "expiry_date",
    id: "verifiable[expires_on]",
    errorMessage: "Expiry date"
  },
  {
    name: "date_of_birth",
    id: "user_date_of_birth_legal",
    errorMessage: "Date of birth"
  },
  {
    name: "licence_number",
    id: "verifiable_licence_number",
    errorMessage: "Drivers license number"
  },
  {
    name: "licence_version",
    id: "verifiable_licence_version",
    errorMessage: "Drivers license version number"
  },
  {
    name: "card_number",
    id: "verifiable_card_number",
    errorMessage: "Drivers license card number"
  }
];

function CloudCheckAlert({
  userVerification
}: { userVerification: UserVerification | UserVerificationPresenter }) {
  const [errorMessages, setErrorMessages] = useState(Array<string>);
  const [erroringIds, setErroringIds] = useState(Array<string>);
  const [showAlert, setShowAlert] = useState(false);
  const [externalErrors, setExternalErrors] = useState<Record<string, boolean>>(null);
  const [knownResponse, setKnownResponse] = useState(true);
  const linkToProvideAlternativeID = document.getElementById("linkToProvideAlternativeID");
  const submitLink = document.getElementById("tour-next-btn");
  const cloudCheckParentWrap = document.getElementById("cloud-check-alert-wrapper");

  const blanketLicenseNumberErrorCount = 3;
  const getLengthOfErrors = (obj: Record<string, boolean>): number => {
    // this should only look for false values
    const valWithoutValid = Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => key !== "valid" && value === false))
    const lengthOfErrors = Object.keys(valWithoutValid).length;
    return lengthOfErrors;
  };


  useMemo(() => {
    linkToProvideAlternativeID?.addEventListener("click", () => {
      cloudCheckParentWrap?.remove();
    });

    submitLink?.addEventListener("click", () => {
      cloudCheckParentWrap?.remove()
    });
  }, [cloudCheckParentWrap, linkToProvideAlternativeID, submitLink]);

  useEffect(() => {
    if (externalErrors) {
      if (Object.values(externalErrors).includes(false)) {
        setShowAlert(true);
      };
      const lengthOfErrors = getLengthOfErrors(externalErrors);
      if (typeof lengthOfErrors === "number" && lengthOfErrors < blanketLicenseNumberErrorCount) {
        const tempIdState = []
        const tempErrorMessagingState = []
        cloudCheckValidationTree.forEach(val => {
          if (externalErrors[val.name] === false) {
            if (!erroringIds.includes(val.id)) {
              tempIdState.push(val.id)
            };

            if (!errorMessages.includes(val.errorMessage)) {
              tempErrorMessagingState.push(val.errorMessage)
            };
          };
        });
        setErroringIds(tempIdState)
        setErrorMessages(tempErrorMessagingState);
      };

      if (typeof lengthOfErrors === "number" && lengthOfErrors >= blanketLicenseNumberErrorCount) {
        // only two types of documents are allowed, if not a drivers licence then should be a passport type
        if (userVerification.document_type === "driving_licence") {
          setErroringIds(["verifiable_licence_number"]);
          setErrorMessages(["Drivers license number"]);
        } else {
          // if visa & passport send the same details through to Cloudcheck so should show same error, will need to extend this when/if we add more id types
          setErroringIds(["verifiable_passport_number"]);
          setErrorMessages(["Passport number"]);
        };
      };
    };
    // exhaustive deps on erroring ids and error messages causes infinite loop, no  good
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalErrors, setErrorMessages, setErroringIds]);

  const addClassToFormElement = (idObjects: Array<string>) => {
    Object.values(idObjects).forEach(id => {
      document.getElementById(id)?.classList?.add("is-invalid");
    });
  };

  useEffect(() => {
    setExternalErrors(userVerification.external_verification_errors);
    setKnownResponse(userVerification.external_verification_errors?.known_response);
  }, [userVerification]);

  const parseCustomValidations = useCallback((errorIds: Array<string>) => {
    // doing this behind a timeout because date fields are react objects and are not available to update when page is first available;
    setTimeout(() => {
      addClassToFormElement(errorIds)
    }, 500);
  }, []);

  const clickHandler = () => {
    cloudCheckParentWrap?.remove();
  };

  useEffect(() => {
    parseCustomValidations(erroringIds);
  }, [erroringIds, parseCustomValidations]);

  return (
    <>
      {showAlert ? (
        <div className="tw-mx-2" id="cloud-check-alert-component">
          <div className="tw-flex tw-flex-col">
            <Alert variant="danger" dismissible={true}>
              {knownResponse ? (
                <KnownResponseAlert
                  documentValid={externalErrors.valid}
                  errorMessages={errorMessages}
                  failedVerificationAttempts={userVerification.failed_verification_attempts}
                  clickHandler={clickHandler}
                />
              ) : (
                <UnknownResponseAlert clickHandler={clickHandler} />
              )}
            </Alert >
          </div>
        </div>
      ) : null}
    </>
  );
};

interface KnownResponseAlert {
  documentValid: boolean
  errorMessages: string[]
  failedVerificationAttempts: number
  clickHandler: () => void
}

function KnownResponseAlert({ documentValid = true, errorMessages, failedVerificationAttempts, clickHandler }: KnownResponseAlert) {
  const documentInvalid = {
    title: I18n.t("onboarding_tour.enter_document_details.alert.invalid_document.title",),
    body: I18n.t("onboarding_tour.enter_document_details.alert.invalid_document.body"),
    linkMessage: I18n.t("onboarding_tour.enter_document_details.alert.invalid_document.link_message"),
    link: decodeURIComponent(Routes.onboarding_tour_path("choose_an_id_document?force_progression=true&reset_document_type=true"))
  };
  const errorCountToPromptUserToChangeDocument = 2;

  return (
    <>
      <div className="tw-font-semibold">
        {documentValid ? (I18n.t("onboarding_tour.enter_document_details.alert.valid_document.title")) : (documentInvalid.title)}
      </div>

      {
        !documentValid ? (
          <div>
            <div className="tw-py-2"> {documentInvalid.body} </div>
          </div>
        ) : null
      }

      <div className={`${errorMessages.length === 0 ? "tw-hidden" : null}tw-py-2`}>
        <div className="tw-ml-4">
          <ul className="!tw-mb-0">
            {errorMessages.map((errorMessage) => (<li className="tw-py-1 !tw-list-disc" key={errorMessage.toString()}> {errorMessage} </li>))}
          </ul>
        </div>
      </div>

      {
        failedVerificationAttempts >= errorCountToPromptUserToChangeDocument ? (
          <div>
            <div className="tw-font-bold">
              <a href={documentInvalid.link}
                data-track-click='{ "eventName": "ID_verification_change_document", "data": { "section" : "cloud-check-error"} }'
                data-remote="true"
                onClick={() => clickHandler}>
                <span className="tw-py-2 tw-font-bold !tw-text-red-700"> {documentInvalid.linkMessage} </span>
              </a>
            </div>
          </div>
        ) : null
      }
    </>
  );
};

function UnknownResponseAlert({ clickHandler }: { clickHandler: () => void }) {
  const unknownResponse = {
    title: I18n.t("onboarding_tour.enter_document_details.alert.unknown_response.title"),
    body: I18n.t("onboarding_tour.enter_document_details.alert.unknown_response.body"),
    linkMessage: I18n.t("onboarding_tour.enter_document_details.alert.unknown_response.link_message"),
    link: decodeURIComponent(Routes.onboarding_tour_path("choose_an_id_document?force_progression=true&reset_document_type=true"))
  };

  return (
    <>
      <div className="tw-font-semibold">
        {unknownResponse.title}
      </div>

      <div>
        <div className="tw-py-2"> {unknownResponse.body} </div>
      </div>

      <div>
        <div className="tw-font-bold">
          <a href={unknownResponse.link}
            data-track-click='{ "eventName": "ID_verification_change_document", "data": { "section" : "cloud-check-error"} }'
            data-remote="true"
            onClick={() => clickHandler}>
            <span className="tw-py-2 tw-font-bold !tw-text-red-700"> {unknownResponse.linkMessage} </span>
          </a>
        </div>
      </div>
    </>
  );
};

export default CloudCheckAlert;
