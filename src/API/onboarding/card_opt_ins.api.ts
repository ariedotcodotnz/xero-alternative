import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { post, postJson } from "../config/fetch.api";

export interface cardOptInDto {
  signup_card_allocation_preference_percentage: number;
}

export const postCardOptIn = async (
  cardOptIn: cardOptInDto,
): Promise<OnboardingResponseBody> =>
  postJson(
    Routes.api_onboarding_card_opt_in_path(),
    JSON.stringify(cardOptIn),
    false,
  );

export const postSkipCardOptIn = async (): Promise<OnboardingResponseBody> =>
  post(Routes.skip_card_opt_in_api_onboarding_card_opt_in_path(), null);
