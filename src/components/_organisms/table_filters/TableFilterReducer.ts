import {
  TableFilterReducerAction,
  TableFilterReducerState,
  KeyValuePair,
} from "./types";

let initialStateCopy;

export const initialiseState = (initialState: TableFilterReducerState) => {
  initialStateCopy = { ...initialState };
  return { ...initialState };
};

const removeObjectWithKeyFromArray = (array: KeyValuePair[], key: string) =>
  array.filter((item) => item.key !== key);

export default function tableFilterReducer(
  state: TableFilterReducerState,
  action: TableFilterReducerAction,
) {
  switch (action.type) {
    case "REMOVE": {
      return {
        ...state,
        activeSort: initialStateCopy.activeSort,
        activeFilters: state.activeFilters.map(filter => ({ key: filter.key, value: "all" })),
      };
    }
    case "UPDATE_SEARCH_QUERY": {
      return {
        ...state,
        searchQuery: action.payload,
      };
    }
    case "UPDATE_SORT": {
      return {
        ...state,
        activeSort: action.payload,
      };
    }
    case "UPDATE_FILTER": {
      const updatedFilters = [
        ...removeObjectWithKeyFromArray(
          state.activeFilters,
          action.payload.key,
        ),
        action.payload,
      ];
      return {
        ...state,
        activeFilters: updatedFilters,
      };
    }
    default: {
      throw Error(`Unknown action: ${action}`);
    }
  }
}
