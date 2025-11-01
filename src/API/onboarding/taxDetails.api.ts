import { OnboardingResponseBody } from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { get, postJson } from "../config/fetch.api";
import BasicResponse from "../types/basicResponse";

export interface taxDetailsDto {
  vatNumber?: string;
  taxIdNumber: string;
  utrNumber?: string;
}

export interface gstInformation {
  is_gst_registered: boolean;
}

export default interface getTaxDetailsResponseBody extends BasicResponse {
  data: {
    is_gst_registered: boolean;
    vat_number: string;
    tax_id_number: string;
    utr_number: string;
  };
}

export const postTaxDetails = async (
  body: taxDetailsDto,
): Promise<OnboardingResponseBody> =>
  postJson(
    Routes.api_onboarding_tax_details_path(),
    JSON.stringify(body),
    false,
  );

export const getTaxDetails = async (): Promise<getTaxDetailsResponseBody> =>
  get(Routes.api_onboarding_tax_details_path());
