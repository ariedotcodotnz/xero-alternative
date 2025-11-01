import React from "react"
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { CardOptionData, iRadioCard } from "./types";

const defaultCardOptions: CardOptionData[] = [
  { name: "No", value: "false" },
  { name: "Yes", value: "true" }
]

const RadioCardGroup = ({ ariaLabel, name, cardOptions = defaultCardOptions, value, setValue, onBlur, required = false }: iRadioCard) => (
  <div className="tw-relative">
    <fieldset aria-label={ariaLabel} className="tw-w-full">
      <RadixRadioGroup.Root value={value} onValueChange={setValue} onBlur={onBlur} className="tw-w-full" aria-label={ariaLabel} name={name} required={required}>
        <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-m-1">
          {cardOptions.map((option) => (
            <RadixRadioGroup.Item
              key={`option-${option.name}`}
              value={option.value}
              className={"data-[state=checked]:tw-bg-gradient-to-b data-[state=checked]:tw-from-brand-900 data-[state=checked]:tw-from-10% data-[state=checked]:tw-to-[#0C105A] data-[state=checked]:hover:tw-from-[#020428] data-[state=checked]:hover:tw-to-[#030534] tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-rounded-md tw-px-6 tw-py-2.5 tw-text-sm tw-font-semibold tw-text-gray-900 tw-ring-1 tw-ring-gray-300 hover:tw-bg-gray-50 data-[state=checked]:tw-text-white tw-col-span-1"
              }
            >
              {option.name}
            </RadixRadioGroup.Item>
          ))}
        </div>
      </RadixRadioGroup.Root>
    </fieldset>
  </div>
)

export default RadioCardGroup;