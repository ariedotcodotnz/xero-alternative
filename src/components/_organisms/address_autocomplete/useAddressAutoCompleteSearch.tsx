import { useEffect, useReducer } from "react";
import {
  stateReducer, defaultState,
  wrapperToGetThingsMoving, DEFAULT_PRESELECT_ID,
  fetchAddressDetails, DEBOUNCE_INTERVAL,
  fetchAddressSuggestions, MIN_QUERY_LENGTH
} from "./addressAutocompleteUtils";


const useAddressAutoCompleteSearch = (formValues, showMoreDetails) => {
  const [state, stateDispatch] = useReducer(stateReducer, {
    ...defaultState,
    fields: {
      ...defaultState.fields,
      ...wrapperToGetThingsMoving(formValues),
      googlePlaceId: formValues?.googlePlaceId || DEFAULT_PRESELECT_ID,
    },
    moreDetails: showMoreDetails,
    suggestions: [
      {
        key: formValues?.googlePlaceId || DEFAULT_PRESELECT_ID,
        value: formValues?.formattedAddress,
      },
    ],
  });


  const { query } = state

  /*
    * Dispatchers
    */
  const setQuery = (searchQuery: string) => {
    stateDispatch({
      type: "UPDATE_QUERY",
      payload: searchQuery,
    });
  };

  const onManualInput = (input, component) => {
    stateDispatch({
      type: "UPDATE_ADDRESS_FIELDS",
      payload: {
        [component]: input,
        googlePlaceId: "",
      },
    });
  };

  const setSelectedSuggestion = async (suggestionId: string | number) => {
    const suggestionIdString: string = suggestionId?.toString() || "";

    if (suggestionIdString === "" || suggestionIdString === null) {
      stateDispatch({
        type: "CLEAR_SELECTION",
      });
      return;
    }

    if (suggestionIdString === "Other") {
      stateDispatch({
        type: "ENTER_MANUAL_ADDRESS",
      });
      return;
    }

    try {
      const response = await fetchAddressDetails(suggestionIdString);

      stateDispatch({
        type: "UPDATE_SELECTED_SUGGESTION",
        payload: {
          ...response,
          googlePlaceId: suggestionIdString,
        },
      });
    } catch (e) {
      if (typeof Rollbar !== "undefined") {
        Rollbar.warning(e);
      }
    }
  };

  const setMoreDetails = (evenMoreDetails: boolean) => {
    stateDispatch({
      type: "UPDATE_MORE_DETAILS",
      payload: evenMoreDetails,
    });
  };


  /*
 * Effects to update ReducerState if props change
 */
  useEffect(() => {
    const valuesToUpdate = formValues;

    if (valuesToUpdate) {
      /*
         * If no GooglePlaceID supplied we need to use our DEFAULT_PRESELECT_ID to
         * ensure the input field renders the supplied formattedAddress
         */
      valuesToUpdate.googlePlaceId = valuesToUpdate.googlePlaceId || DEFAULT_PRESELECT_ID;
       

      stateDispatch({
        type: "UPDATE_ADDRESS_FIELDS",
        payload: valuesToUpdate,
      });
    }
  }, [formValues]);

  useEffect(() => {
    stateDispatch({
      type: "UPDATE_MORE_DETAILS",
      payload: !!showMoreDetails,
    });
  }, [showMoreDetails]);



  /*
     * Effect that updates suggestions based on query, in a debounced fashion
     */
  useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) return;
    const timeoutId = setTimeout(async () => {
      stateDispatch({
        type: "IS_LOADING",
        payload: true,
      });
      try {
        const addressSuggestions = await fetchAddressSuggestions(query);

        const suggestionOptions = addressSuggestions.map((suggestion) => ({
          key: suggestion.googlePlaceId,
          value: suggestion.formattedAddress,
        }));

        stateDispatch({
          type: "UPDATE_SUGGESTIONS",
          payload: suggestionOptions,
        });
      } catch (e) {
        if (typeof Rollbar !== "undefined") {
          Rollbar.warning(e);
        }
      }
    }, DEBOUNCE_INTERVAL);
    return () => clearTimeout(timeoutId);
  }, [query]);


  return {
    state,
    stateDispatch,
    setQuery,
    setMoreDetails,
    setSelectedSuggestion,
    onManualInput
  }
}

export default useAddressAutoCompleteSearch;