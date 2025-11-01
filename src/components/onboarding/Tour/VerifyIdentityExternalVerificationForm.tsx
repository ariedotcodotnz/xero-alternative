import React, { forwardRef, useEffect, useState } from "react";
import { fetchUserVerificationDetails } from "@api/onboarding/userVerification.api";
import handleError from "@api/utils/handleError";
import { UserVerificationPresenter } from "app/javascript/types/userVerification.type";
import { iVerifyIdentityExternalVerificationForm } from "./Shared/types/onboardingTypes";
import { UkExternalVerificationForm } from "./externalVerificationRequestForms/UkExternalVerificationForm";
import { ANZExternalVerificationForm } from "./externalVerificationRequestForms/ANZExternalVerificationForm";
import SignUpTourLoader from "./Shared/SignUpTourLoader";
import I18n from "../../../utilities/translations";
import usePersonalDetails from "./Shared/hooks/usePersonalDetails";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

const ctx = { scope: "onboarding.v3.verify_identity_external_verification" };

const VerifyIdentityExternalVerificationForm = forwardRef<
  OnboardingTourFormRef,
  iVerifyIdentityExternalVerificationForm
>(({ stateUpdate, intercomLink, runVerificationOnLoad, userId }, ref) => {
  const [isUkJurisdiction, setIsUkJurisdiction] = useState<boolean | null>(
    null,
  ); // Explicitly boolean | null
  const [userVerification, setUserVerification] = useState<
    UserVerificationPresenter | undefined
  >(); // undefined is fine
  const [loading, setLoading] = useState(true); // General loading for API calls

  const { personalDetails } = usePersonalDetails({ userId });
  const { setPrimaryBtnName } = useOnboardingTour();

  useEffect(() => {
    const getDetails = async () => {
      if (userId) {
        setLoading(true);
        try {
          const res = await fetchUserVerificationDetails(userId);
          if (res?.status === "ok") {
            const userVerificationResponse = res.data?.user_verification;
            setUserVerification(res.data?.user_verification);

            const passportCountry =
              userVerificationResponse?.verifiable?.passport_country_of_issue?.toUpperCase();
            const canViewANZForm =
              passportCountry && ["AU", "NZ"].includes(passportCountry);

            setIsUkJurisdiction(!canViewANZForm);
          } else {
            handleError(res);
          }
        } catch (error) {
          toastr.error("Something went wrong, please try again");
          setIsUkJurisdiction(true);
          throw error;
        } finally {
          setLoading(false);
        }
      }
    };

    if (!userVerification) {
      getDetails();
    }
  }, [userId, userVerification]);

  useEffect(() => {
    setPrimaryBtnName(null);
  }, [setPrimaryBtnName]);

  if (loading || isUkJurisdiction === null) {
    return <SignUpTourLoader text={I18n.t("loading", ctx)} />;
  }

  return isUkJurisdiction ? (
    <UkExternalVerificationForm
      stateUpdate={stateUpdate}
      intercomLink={intercomLink}
      runVerificationOnLoad={runVerificationOnLoad}
      userId={userId}
      ref={ref}
      personalDetails={personalDetails}
      userVerification={userVerification}
      setUserVerification={setUserVerification}
    />
  ) : (
    <ANZExternalVerificationForm
      stateUpdate={stateUpdate}
      intercomLink={intercomLink}
      runVerificationOnLoad={runVerificationOnLoad}
      userId={userId}
      ref={ref}
      personalDetails={personalDetails}
      userVerification={userVerification}
      setUserVerification={setUserVerification}
    />
  );
});

VerifyIdentityExternalVerificationForm.displayName =
  "VerifyIdentityExternalVerificationForm";
export default VerifyIdentityExternalVerificationForm;
