import {
  OnboardingStates,
  OnboardingResponseBody,
} from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { postJson } from "../config/fetch.api";
import { OnboardingRoutesType } from "./OnboardingRoutes.interface";

export type IntroductionState =
  | "personal_details_section"
  | "work_details_section"
  | "identity_details_section"
  | "customise_hnry_section";

export const postSectionIntroduction = async (
  state: OnboardingStates,
): Promise<OnboardingResponseBody> => {
  const url = (
    Routes as unknown as OnboardingRoutesType
  ).api_onboarding_step_overview_index_path();

  return postJson(
    url,
    JSON.stringify({ state }),
    false,
  ) as Promise<OnboardingResponseBody>;
};
