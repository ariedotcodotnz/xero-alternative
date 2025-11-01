import { UserVerificationPresenter } from "app/javascript/types/userVerification.type";
import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { postJson, putJson } from "../config/fetch.api";
import { PersonalDetailsType } from "./personal_details.api";

export default interface VerifyIdentityExternalVerificationResponseBody
  extends OnboardingResponseBody {
  data: {
    state: string;
    user_verification: UserVerificationPresenter;
  };
}

export const postVerifyIdentityExternalVerification =
  async (): Promise<VerifyIdentityExternalVerificationResponseBody> =>
    postJson(
      Routes.api_onboarding_verify_identity_external_verifications_path(),
      "",
      false,
    );

export const putVerifyIdentityExternalVerification = async (
  personalDetails: PersonalDetailsType,
): Promise<VerifyIdentityExternalVerificationResponseBody> =>
  putJson(
    Routes.api_onboarding_verify_identity_external_verifications_path(),
    JSON.stringify(personalDetails),
    false,
  );
