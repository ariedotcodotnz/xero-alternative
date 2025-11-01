import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { postJson } from "../config/fetch.api";

export interface verifyIdentityBasicDetailsDto {
  country_of_birth: string;
  nationality: string;
}

export const postVerifyIdentityBasicDetails = async (
  verifyIdentityBasicDetails: verifyIdentityBasicDetailsDto,
): Promise<OnboardingResponseBody> =>
  postJson(
    Routes.api_onboarding_verify_identity_basic_details_path(),
    JSON.stringify(verifyIdentityBasicDetails),
    false,
  );
