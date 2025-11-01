import { CountryIso2 } from "react-international-phone";
import {
  acquisitionOptionValues,
  OnboardingResponseBody,
} from "@hui/onboarding/Tour/Shared/types/onboardingTypes";
import { ApiResponseBody, get, postJson } from "../config/fetch.api";

export type PersonalDetailsType = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  preferred_name?: string;
  input_phone_number?: {
    prefix: string;
    number: string;
    iso_code?: CountryIso2;
  };
  phone_number?: string;
  date_of_birth: string;
  acquisition: acquisitionOptionValues | string;
  acquisition_detail?: string;
  address_attributes?: {
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
  passport_attributes?: {
    passport_number?: string;
    expires_on?: string;
  };
};

export interface PersonalDetailsSuccessResponse extends ApiResponseBody {
  status: string;
  data: {
    personal_details: PersonalDetailsType;
  };
}

export const fetchPersonalDetails = async (
  userId: number,
): Promise<PersonalDetailsSuccessResponse> =>
  get(Routes.api_onboarding_personal_detail_path(userId));

export const postPersonalDetails = async (
  personalDetails: PersonalDetailsType,
): Promise<OnboardingResponseBody> =>
  postJson(
    Routes.api_onboarding_personal_details_path(),
    JSON.stringify(personalDetails),
    false,
  );
