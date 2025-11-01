import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { postJson } from "../config/fetch.api";
import { BasicResponse } from "../types/basicResponse";

export const postResendConfirmationEmail = async (
  emailString: string,
): Promise<BasicResponse> =>
  postJson(
    Routes.user_confirmation_path(),
    JSON.stringify({ user: { email: emailString } }),
    true,
  );

export const postResendConfirmationEmailProgress =
  async (): Promise<OnboardingResponseBody> =>
    postJson(Routes.api_onboarding_resend_confirmation_email_index_path(), "");
