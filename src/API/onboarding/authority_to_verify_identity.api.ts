import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { postJson } from "../config/fetch.api";

const postAuthorityToVerifyIdentity = async (
  authorityToVerifyIdentity: boolean,
): Promise<OnboardingResponseBody> =>
  postJson(
    Routes.api_onboarding_authority_to_verify_identity_path(),
    JSON.stringify({ authority_to_verify_identity: authorityToVerifyIdentity }),
    true,
  );

export default postAuthorityToVerifyIdentity;
