import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { postJson } from "../config/fetch.api";

export type StepOverviewState =
  | "step_overview_1"
  | "step_overview_2"
  | "step_overview_3"
  | "step_overview_4";

export const postStepOverview = (
  state: StepOverviewState,
): Promise<OnboardingResponseBody> =>
  postJson(
    Routes.api_onboarding_step_overview_index_path(),
    JSON.stringify({ state }),
    false,
  );
