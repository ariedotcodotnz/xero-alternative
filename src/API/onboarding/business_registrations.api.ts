import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { postJson } from "../config/fetch.api";

export interface businessRegistrationDto {
  has_registered_business: boolean;
}

export const postBusinessRegistration = async (
  businessRegistration: businessRegistrationDto,
): Promise<OnboardingResponseBody> =>
  postJson(
    Routes.api_onboarding_business_registration_path(),
    JSON.stringify(businessRegistration),
    false,
  );
