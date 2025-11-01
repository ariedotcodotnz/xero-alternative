import React, { useEffect, useState } from "react"
import { CountryIso2, CountrySelector } from "react-international-phone";
import classNames from "classnames";
import "react-international-phone/style.css";


export interface iphNumberType  {
  prefix: string,
  number: string
  isoCode?: CountryIso2
}

interface iMobileNumberInput {
  value?: iphNumberType;
  onChange?: (...args) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  name: string
  required: boolean
  countryDisabled?: boolean
  invalid?: string
  hideDropdown?: boolean
}

export default function PhoneNumberInput({onChange, onBlur, required, value, countryDisabled = false, invalid, hideDropdown = false}: iMobileNumberInput) {

  const [country, setCountry] = useState<{ isoCode: CountryIso2, dialCode: string}>({dialCode:value?.prefix || "44", isoCode: value?.isoCode || "gb"})
  const [number, setNumber] = useState(value?.number || "")

  useEffect(()=> {
    const {dialCode} = country
    onChange({number, prefix: dialCode})
  },[country, number])


  return (
    <div className="tw-min-w-full no-bs tw-mt-2 " id="phone-input-wrap">
      <label
        htmlFor="phone-input"
        className={classNames("hnry-label",{
          "after:tw-content-['*'] after:tw-inline after:tw-text-red after:tw-ml-1":
            required,
        })}
      >
        Mobile number
      </label>

      <div className={classNames("tw-flex tw-rounded-md tw-shadow-sm tw-ring-1 tw-ring-inset tw-ring-gray-300",
        "has-[input:focus-within]:tw-outline-none has-[input:focus-within]:tw-ring-brand-200",
        { "tw-ring-red-500 has-[input:focus-within]:tw-ring-2 has-[input:focus-within]:tw-ring-red-500": invalid })}>

        <div>
          <div className="tw-flex tw-flex-col tw-shrink-0 tw-grid-cols-1 focus-within:tw-relative">
            <CountrySelector
              className="tw-flex-1
              !tw-border-none
              tw-row-start-1
              tw-w-full
              tw-appearance-none
              tw-p-1.5
              tw-pl-3
              tw-text-base
              tw-text-gray-500
              placeholder:tw-text-gray-400 focus:tw-outline focus:tw-outline-2 focus:tw--outline-offset-2
              focus:tw-outline-indigo-600 sm:tw-text-sm/6
              tw-min-w-full tw-min-h-full !tw-border-0 tw-rounded-md"
              selectedCountry={country.isoCode}
              hideDropdown={hideDropdown}
              disabled={countryDisabled}
              buttonClassName="tw-border-0"
              onSelect={(count) => {
                setCountry({isoCode: count.iso2,  dialCode: count.dialCode});
              }}
            />
          </div>
        </div>

        <div className="tw-flex tw-flex-row">
          <div className="tw-align-middle tw-flex tw-items-center tw-justify-center">(+{country.dialCode})</div>
          <div className="tw-min-h-full tw-flex tw-flex-col tw-flex-1">
            <input id="phone-input"
              className="no-bs no-bs-no-ring tw-flex-1 tw-pl-4 !tw-m-0 !tw-ring-0 tw-text-gray-800"
              type="tel"
              data-testid="phone-input-number"
              value={number}
              onChange={(e) => {
                setNumber(e?.target?.value);
              }}
              onBlur={onBlur}
            />
          </div>
        </div>
      </div>
    </div>
  )
}