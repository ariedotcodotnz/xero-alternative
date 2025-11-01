"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Combobox } from "@headlessui/react";
import classNames from "classnames";
import { iAutoComplete } from "./types";
import Icon from "../../_atoms/icons/icon/Icon";

const filterFn = (query, entries) =>
  (query === "" || query === undefined)
    ? entries.slice()
    : entries
      .slice()
      .filter((entry) =>
        entry.value.toLowerCase().includes(query?.trimStart()?.toLowerCase()),
      );

const setTextareaHeight = (textAreaRef) => {
  if (textAreaRef.current) {
    const textArea = textAreaRef.current;
    textArea.style.height = "";
    textArea.style.height = `${textArea.scrollHeight}px`;
  }
};

const AutoComplete = ({
  hideLabel = false,
  id = null,
  items = [],
  label,
  name = null,
  placeholder = null,
  render = "input",
  required = false,
  selectedItem,
  setSelectedItem,
  openMenuOnFocus = false,
}: iAutoComplete) => {
  const [query, setQuery] = useState(selectedItem?.value || "");
  const matches = useMemo(() => filterFn(query, items), [query, items]);

  const textAreaRef = useRef(null);
  // TODO: Replace this approach to useimmediate prop after upgrade to React 18
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const inputFocusRef = useRef(false);
  const dynamicOptionRef = useRef(null);

  const handleWindowResize = () => {
    setTextareaHeight(textAreaRef);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (render === "textarea") {
      setTextareaHeight(textAreaRef);
    }
  }, [query, render, selectedItem]);

  const inputAttributes = {
    id,
    name,
    placeholder,
    onChange: (e) => {
      setQuery(e.target.value);
      setSelectedItem({ key: null, value: e.target.value });
    },
    displayValue: (item) => item?.value,
  };

  const handleFocus = () => {
    // show menu when input is focused
    if (openMenuOnFocus && !inputFocusRef.current && selectedItem?.value === "") {
      searchBtnRef.current?.click();
      inputFocusRef.current = true;
    }
  }

  const handleBlur = () => {
    inputFocusRef.current = false;
  };

  /* 
   * When the user types a custom value (not from the list) we want to close the Combobox.Options
   * If we don't do this and the user wants to add a new line into the Combobox.Input by pressing Enter
   * the Combobox.Options will close on the first Enter event, requiring the user to press Enter again to get the linebreak
   * It's a bit nasty but without access to the internals this is the best we can do with this library
   */
  useEffect(() => {
    if (matches.length < 1) {
      dynamicOptionRef.current?.click();
    }
  }, [query, matches]);

  return (
    <Combobox value={selectedItem} onChange={setSelectedItem}>
      <Combobox.Label
        className={classNames("hnry-label", {
          "hnry-label--required": required,
          "tw-sr-only": hideLabel,
        })}
      >
        {label}
      </Combobox.Label>
      <div className="tw-relative">
        {render === "textarea" ? (
          <Combobox.Input
            {...inputAttributes}
            ref={textAreaRef}
            as="textarea"
            rows={1}
            className="hnry-textarea !tw-min-h-10 tw-resize-none tw-h-auto !tw-pr-8"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : (
          <Combobox.Input
            {...inputAttributes}
            ref={textAreaRef}
            className="hnry-input"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )}

        {query.length || selectedItem?.value !== "" ? (
          <button
            className="tw-absolute tw-top-1 tw-right-1 tw-p-1.5 tw-rounded hover:tw-bg-gray-100"
            onClick={() => {
              setQuery("");
              setSelectedItem(null);
            }}
            aria-label="Clear this input"
            type="button"
          >
            <Icon type="XMarkIcon" />
          </button>
        ) : null}
        <Combobox.Button className="tw-hidden" ref={searchBtnRef}>
          <span className="tw-sr-only">Search list</span>
        </Combobox.Button>
        <Combobox.Options
          className={classNames({
            "tw-absolute tw-z-10 tw-mt-1 tw-max-h-60 tw-w-full tw-overflow-auto tw-rounded-md tw-bg-white tw-py-1 tw-text-base tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none sm:tw-text-sm":
              matches.length,
            "tw-hidden": !matches.length,
          })}
        >
          {/* We need this option here so that the custom entered text is always the preferred option */}
          <Combobox.Option
            value={{ key: null, value: query }}
            ref={dynamicOptionRef}
          />

          {matches.map((match) => (
            <Combobox.Option
              key={match.key}
              value={match}
              className="tw-group tw-relative tw-cursor-default tw-select-none tw-py-2 tw-pl-3 tw-pr-9 tw-text-gray-900 data-[headlessui-state*='active']:tw-bg-brand-500 data-[headlessui-state*='active']:tw-text-white hover:tw-cursor-pointer"
            >
              <span className="tw-block group-data-[headlessui-state*='selected']:tw-font-semibold">
                {match.value}
              </span>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
};

export default AutoComplete;
