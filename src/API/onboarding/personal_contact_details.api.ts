import { CountryIso2 } from "react-international-phone";
import {
  acquisitionOptionValues,
  OnboardingResponseBody,
} from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { ApiResponseBody, get, postJson } from "../config/fetch.api";

export type PersonalContactDetailsType = {
  acquisition: acquisitionOptionValues | string;
  acquisition_detail?: string;
  address_attributes: {
    address_line_1?: string;
    city?: string;
    country?: string;
    formatted_address?: string;
    google_place_id?: string;
    post_town?: string;
    postcode?: string;
    state?: string;
    street_address?: string;
    street_number?: string;
    suburb?: string;
  };
  input_phone_number?: {
    prefix: string;
    number: string;
    iso_code?: CountryIso2;
  };
  phone_number?: string;
};

export interface PersonalContactDetailsSuccessResponse extends ApiResponseBody {
  status: string;
  data: {
    personal_contact_details: PersonalContactDetailsType;
  };
}

export const fetchPersonalContactDetails = async (
  userId: number,
): Promise<PersonalContactDetailsSuccessResponse> =>
  get(Routes.api_onboarding_personal_contact_detail_path(userId));

export const postPersonalContactDetails = async (
  personalDetails: PersonalContactDetailsType,
): Promise<OnboardingResponseBody> =>
  postJson(
    Routes.api_onboarding_personal_contact_details_path(),
    JSON.stringify(personalDetails),
    false,
  );
