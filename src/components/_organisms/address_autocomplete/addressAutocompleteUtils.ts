import { getAddressAutoComplete, getAddressDetails } from "../../../API/address.api";
import { Address, AddressAutocompleteDispatches, AddressAutocompleteState } from "./types";

export const MIN_QUERY_LENGTH = 1;
export const DEFAULT_PRESELECT_ID = "preselect-without-id";
export const DEBOUNCE_INTERVAL = 400;

/**
 * Grabs a list of suggestions provided by Google Places from the backend
 * @param {string} query - The user input to filter by
 * @returns {Promise} An Promise that should resolve to an array of Partial Address objects
 */
export const fetchAddressSuggestions = async (query: string) => {
    const suggestions = [];

    const data = await getAddressAutoComplete(query);

    const { addresses }: { addresses: Partial<Address>[] } = data.list;
    if (addresses) suggestions.push(...addresses);

    return suggestions;
};

/**
 * Grabs a list of suggestions provided by Google Places from the backend
 * @param {string} googlePlaceId - A googlePlaceId to fetch details for
 * @returns {Promise<Address>} A Promise that should resolve to Address object
 */
export const fetchAddressDetails = async (googlePlaceId: string) => {
    const data = await getAddressDetails(googlePlaceId);

    const { details }: { details: Partial<Address> } = data.list;

    return details;
};

const newAddress: Required<Address> = {
    addressLine1: "",
    city: "",
    country: "",
    formattedAddress: "",
    googlePlaceId: "",
    postTown: "",
    postcode: "",
    state: "",
    streetAddress: "",
    streetNumber: "",
    suburb: "",
};

export const defaultState: AddressAutocompleteState = {
    fields: { ...newAddress },
    isLoading: false,
    moreDetails: false,
    query: "",
    stateRequired: false,
    suggestions: [],
};

export const stateReducer = (
    state: AddressAutocompleteState,
    action: AddressAutocompleteDispatches,
) => {
    switch (action.type) {
        case "ENTER_MANUAL_ADDRESS":
            return {
                ...state,
                fields: { ...newAddress },
                moreDetails: true,
            };

        case "IS_LOADING":
            return {
                ...state,
                isLoading: true,
                suggestions: [
                    {
                        key: "",
                        value: "Loading...",
                    },
                ],
            };

        case "UPDATE_ADDRESS_FIELDS":
            return {
                ...state,
                fields: {
                    ...state.fields,
                    ...action.payload,
                },
                stateRequired: action.payload.country
                    ? action.payload.country.trim().toUpperCase() === "AUSTRALIA"
                    : state.stateRequired,
            };

        case "UPDATE_QUERY":
            return {
                ...state,
                query: action.payload,
            };

        case "UPDATE_MORE_DETAILS":
            return {
                ...state,
                moreDetails: action.payload,
            };

        case "UPDATE_SELECTED_SUGGESTION":
            return action.payload.googlePlaceId === "Other"
                ? {
                    ...state,
                    moreDetails: true,
                }
                : {
                    ...state,
                    fields: { ...newAddress, ...action.payload },
                };

        case "UPDATE_SUGGESTIONS":
            return {
                ...state,
                suggestions: action.payload,
                isLoading: false,
            };

        case "CLEAR_SELECTION":
            return {
                ...state,
                fields: { ...newAddress },
                query: "",
            };

        default:
            return state;
    }
};

export const removeEmptyKeys = (obj: Partial<Address>) =>
    Object.fromEntries(
        Object.entries(obj).filter(
            (entry) => entry[1] !== null && entry[1] !== undefined,
        ),
    );

export const wrapperToGetThingsMoving = (obj: Partial<Address>) => {
    if (obj) {
        return removeEmptyKeys(obj)
    }

}