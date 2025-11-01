import { get } from "./config/fetch.api";

export const getAddressAutoComplete = async (query: string) => get(Routes.address_autocomplete_path({ query }));

export const getAddressDetails = async (googlePlaceId: string) => get(Routes.address_details_path({ google_place_id: googlePlaceId }));
