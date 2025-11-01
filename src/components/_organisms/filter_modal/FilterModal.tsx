import React, { useEffect, useState } from "react";
import Modal from "../../_molecules/modal/Modal";
import {
  FilterOption,
  SortOption,
  TableFilterReducerState,
  KeyValuePair,
  SortSelection,
} from "../table_filters/types";
import IndexContent from "./FilterModalContentIndex";
import SortTemplate from "./FilterModalContentSort";
import FilterTemplate from "./FilterModalContentFilter";
import HeaderActions from "./FilterModalHeaderActions";

interface FilterModal {
  filterOptions: FilterOption[];
  isOpen: boolean;
  onFilterChange: (item: KeyValuePair) => void;
  onRemoveAll: () => void;
  onSortChange: ({ key, direction }: SortSelection) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sortOptions: SortOption[];
  state: TableFilterReducerState;
}

const DEFAULT_SCREEN = "index";

const FilterModal = ({
  filterOptions = [],
  isOpen,
  onFilterChange,
  onRemoveAll,
  onSortChange,
  setIsOpen,
  sortOptions = [],
  state,
}: FilterModal) => {
  const [screen, setScreen] = useState(DEFAULT_SCREEN);

  /*
   * When the modal is closed, the screen is reset to the default screen.
   * This is done after a delay to allow the modal to close before the screen is reset.
   */
  useEffect(() => {
    let timeout;
    if (!isOpen) {
      timeout = setTimeout(() => setScreen(DEFAULT_SCREEN), 300);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen]);

  /*
   * screenLookup is a mapping of screen names to the screen template
   * that should be displayed when that screen is active.
   * This allows the use of a template pattern to render the correct screen.
   */

  const screenLookup: { [key: string]: "index" | "filter" | "sort" } = {
    index: DEFAULT_SCREEN,
    sort: "sort",
  };

  filterOptions.forEach((filter) => {
    screenLookup[filter.fieldname] = "filter";
  });

  const modalContent = (() => {
    switch (screenLookup[screen]) {
      case DEFAULT_SCREEN:
        return (
          <IndexContent
            filterOptions={filterOptions}
            sortOptions={sortOptions}
            state={state}
            setScreen={setScreen}
          />
        );
      case "filter":
        return (
          <FilterTemplate
            filterOptions={filterOptions}
            filterName={screen}
            onChange={onFilterChange}
            state={state}
          />
        );
      case "sort":
        return (
          <SortTemplate
            sortOptions={sortOptions}
            state={state}
            onChange={onSortChange}
          />
        );
      default: {
        if (window.Rollbar) {
          window.Rollbar.error("Requested invalid screen name on FilterModal.");
        }
        return null;
      }
    }
  })();

  const modalTitle = (() => {
    switch (screenLookup[screen]) {
      case DEFAULT_SCREEN:
        return "Sort & Filter";
      case "filter":
        return filterOptions.find((option) => option.fieldname === screen)
          .label;
      case "sort":
        return "Sort by";
      default: {
        return "";
      }
    }
  })();

  return (
    <Modal
      title={modalTitle}
      setOpen={setIsOpen}
      open={isOpen}
      hideOverlay
      closable
      extraHeaderContent={
        <HeaderActions
          onRemoveAll={onRemoveAll}
          screen={screen}
          setScreen={setScreen}
        />
      }
    >
      {modalContent}
    </Modal>
  );
};

export default FilterModal;
