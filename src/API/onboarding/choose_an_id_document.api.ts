import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { postJson } from "../config/fetch.api";

export interface chooseAnIdDocumentDto {
  country_of_issue: string | null;
  document_type: "passport" | "driving_licence";
  has_uploaded_file: boolean;
  passport_number: string | null;
  licence_number: string | null;
  expires_on: string | null;
  input_expires_on: Record<string, never> | null;
  // Record<string, never> is the type for an empty object
}

export const postChooseAnIdDocument = async (
  chooseAnIdDocument: chooseAnIdDocumentDto,
): Promise<OnboardingResponseBody> =>
  postJson(
    Routes.api_onboarding_choose_an_id_document_path(),
    JSON.stringify(chooseAnIdDocument),
    false,
  );
