import React from "react";
import Popover from "./Popover";
import RadioButtonList, { RadioButtonListItem } from "../radio_button_list/RadioButtonList";

export interface iRadioButtonPopover {
  ariaLabel: string;
  fieldName?: string;
  items: RadioButtonListItem[];
  onChange: (arg0: RadioButtonListItem) => void;
  selected: RadioButtonListItem;
  id: string;
}

const RadioButtonPopover = ({
  ariaLabel,
  fieldName,
  id,
  items,
  onChange,
  selected,
}: iRadioButtonPopover) => {
  const handleChange = (value) => {
    onChange(value);
  };

  return (
    <>
      <Popover id={id} buttonText={selected.name} ariaLabel={ariaLabel}>
        <RadioButtonList
          items={items}
          value={selected.value}
          onChange={handleChange}
          groupLabel={fieldName}
        />
      </Popover>
      {fieldName &&
        <>
          <label htmlFor={fieldName}>
            <input type="hidden" name={fieldName} value={selected.value} />
          </label>
        </>
      }
    </>
  );
};

export default RadioButtonPopover;
