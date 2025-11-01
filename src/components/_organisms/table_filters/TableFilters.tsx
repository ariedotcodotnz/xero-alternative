import React, {
  Fragment,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import NotificationButton from "../../_atoms/notification_button/NotificationButton";
import { iTableFilters } from "./types";
import tableFilterReducer, { initialiseState } from "./TableFilterReducer";
import debounce from "../../../utilities/debounce";
import FilterModal from "../filter_modal/FilterModal";
import SearchInput from "../../_atoms/input/SearchInput";
import SortPopover from "./SortPopover";
import FilterPopover from "./FilterPopover";

const TableFilters = ({
  defaultFilters = [],
  defaultSort,
  filterOptions = [],
  panelId,
  showSearch = true,
  sortOptions = [],
  queryPath,
  model,
}: iTableFilters) => {
  const form = useRef<HTMLFormElement>();
  const isFirstRender = useRef(true);

  const [isMobileFilterModalOpen, setIsMobileFilterModalOpen] = useState(false);
  const [state, dispatch] = useReducer(
    tableFilterReducer,
    {
      searchQuery: "",
      activeSort:
        defaultSort ||
        (sortOptions.length && { key: sortOptions[0].value, direction: "asc" }),
      activeFilters: [
        ...filterOptions.map((opt) => {
          if (defaultFilters.length) {
            const defaultFilter = defaultFilters.find(
              (filter) => filter.key === opt.fieldname,
            );
            if (defaultFilter) {
              return defaultFilter;
            }
          }
          return {
            key: opt.fieldname,
            value: opt.items[0].key,
          };
        }),
      ],
    },
    initialiseState,
  );

  const activeFilterCount = useMemo(() => {
    const currentlyActiveFilters = state.activeFilters.filter(
      (filter) => filter.value.toLowerCase() !== "all",
    );

    return currentlyActiveFilters.length;
  }, [state.activeFilters]);

  const sendRequest = useMemo(
    () =>
      debounce(() => {
        form.current.requestSubmit();
      }, 300),
    [],
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    sendRequest();
  }, [sendRequest, state]);

  useEffect(() => {
    let timeout;

    // Scroll up the background to show table updates
    if (isMobileFilterModalOpen) {
      const tabsEl = document.querySelector(".hui-tab-wrapper");

      timeout = setTimeout(() => tabsEl?.scrollIntoView(), 300);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isMobileFilterModalOpen]);

  const triggerTracking = (action, item) => {
    const payload = {
      tab: panelId,
      action,
      sort: `${state.activeSort.key}::${state.activeSort.direction}`
    };

    state.activeFilters.forEach(({ key: filterKey, value }) => { payload[filterKey] = value; });

    const { key, value } = item;
    payload[key] = value;

    window.analytics?.track(`${model}_sorted_filtered`, payload);
  }

  const handleSortChange = ({ key, direction }) => {
    dispatch({
      type: "UPDATE_SORT",
      payload: { key, direction },
    });
    triggerTracking("sorted", { key: "sort", value: `${key}::${direction}` });
  }

  const handleFilterChange = (item) => {
    const payload = {
      key: item.key,
      value: item.value,
    };

    dispatch({ type: "UPDATE_FILTER", payload });
    triggerTracking("filtered", payload);
  }

  const handleSearchBlur = () => {
    window.analytics?.track(`${model}_searched`, { tab: panelId, search_query: state.searchQuery });
  }

  const handleRemoveAll = () => {
    dispatch({ type: "REMOVE" });
    window.analytics?.track(`${model}_mobile_sort_filter_remove_all_clicked`, { tab: panelId });
  }

  return (
    <form
      data-remote="true"
      ref={form}
      key={panelId}
      method="GET"
      action={queryPath}
    >
      {/* Required for quotes tab param */}
      { panelId ? <input type="hidden" name="tab" value={panelId} /> : null }
      <div className="tw-flex tw-items-stretch tw-gap-4">
        {showSearch && (
          <>
            {/* START Replace this input component with the SearchInput component */}
            <SearchInput
              onBlur={handleSearchBlur}
              value={state.searchQuery}
              inputGroupClasses="tw-w-full sm:tw-w-auto sm:tw-mr-auto"
              setValue={(value) =>
                dispatch({ type: "UPDATE_SEARCH_QUERY", payload: value })
              }
              id={`${panelId}-search`}
              label="Search"
              showLabel={false}
            />
            {/* END Replace this input component with the SearchInput component */}

            {/* Keep the below hidden input to submit the form */}
            <input type="hidden" name="search" value={state.searchQuery} />
          </>
        )}

        {!!filterOptions.length &&
          filterOptions.map((filterOption) => (
            <Fragment key={filterOption.fieldname}>
              <FilterPopover
                filterName={filterOption.label}
                fieldName={filterOption.fieldname}
                items={filterOption.items}
                selected={state.activeFilters.find(
                  (filter) => filter.key === filterOption.fieldname).value
                }
                onChange={handleFilterChange}
              />
            </Fragment>
          ))}

        {!!sortOptions.length && (
          <>
            <SortPopover
              activeKey={state.activeSort.key}
              activeDirection={state.activeSort.direction}
              items={sortOptions}
              onChange={handleSortChange}
            />
            <input type="hidden" name="sort" value={state.activeSort.key} />
            <input
              type="hidden"
              name="direction"
              value={state.activeSort.direction}
            />
          </>
        )}

        {(!!filterOptions.length || !!sortOptions.length) && (
          <div className="sm:tw-hidden">
            <NotificationButton
              count={activeFilterCount}
              onClick={() =>
                setIsMobileFilterModalOpen(!isMobileFilterModalOpen)
              }
              trackClick={{ eventName: `${model}_mobile_sort_filter_btn_clicked`, data: { tab: panelId }}}
            />
            <FilterModal
              filterOptions={filterOptions}
              sortOptions={sortOptions}
              state={state}
              isOpen={isMobileFilterModalOpen}
              setIsOpen={setIsMobileFilterModalOpen}
              onRemoveAll={handleRemoveAll}
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default TableFilters;
