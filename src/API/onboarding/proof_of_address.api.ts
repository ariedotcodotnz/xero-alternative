import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { postJson } from "../config/fetch.api";

export const postProofOfAddress = async (): Promise<OnboardingResponseBody> =>
  postJson(Routes.api_onboarding_proof_of_addresses_path(), "", false);
