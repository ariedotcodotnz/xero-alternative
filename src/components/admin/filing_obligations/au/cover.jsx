import React from "react";
import { formattedDateWithMonthName } from "../../../utils/base_helper";
import Row from "./Row";
import Table from "./Table";
import Accordion from "../../../accordion";

const badgeComponent = ({ color, status }) => <span className={`badge ${color}`}>{status}</span>;

const cover = ({
  firstName,
  lastName,
  taxIdNumber,
  businessNumber,
  userStatus,
  leavingReason,
  leftPermanentlyDepartureDate,
  arrivedInMidYear,
  taxResidencyStartDate,
  taxResidencyEndDate,
  street,
  suburb,
  city,
  state,
  postcode,
  country,
  phoneCountryCode,
  phoneNumber,
  email,
  addressOutsideAu,
  dateOfBirth,
  bankAccountName,
  bankAccountBsb,
  bankAccountNumber,
  financialInstitution,
}) => {
  const taxResidencyCopy = "User was not an AU tax resident for the whole financial year";

  return (
    <Accordion baseId="cover" title="Cover" classes="custom-card-filing" open>
      <Table title="Individual information">
        {arrivedInMidYear && (
          <>
            {taxResidencyStartDate && (
              <Row
                fieldName="Tax residency start date"
                value={formattedDateWithMonthName(taxResidencyStartDate)}
                warningTooltip={taxResidencyCopy}
                copyLabel="tax-residency-start-date"
              />
            )}
            {taxResidencyEndDate && (
              <Row
                fieldName="Tax residency end date"
                value={formattedDateWithMonthName(taxResidencyEndDate)}
                warningTooltip={taxResidencyCopy}
                copyLabel="tax-residency-end-date"
              />
            )}
          </>
        )}
        <Row fieldName="First name" value={firstName} copyLabel="first-name" colWidth1="40%" colWidth2="20%" />
        <Row fieldName="Last name" value={lastName} copyLabel="last-name" />
        <Row fieldName="Date of birth" value={formattedDateWithMonthName(dateOfBirth)} copyLabel="date-of-birth" />
        <Row fieldName="TFN" value={taxIdNumber} copyLabel="tax-id-number" />
        <Row fieldName="ABN" value={businessNumber} copyLabel="cover-abn" />
        <Row fieldName="Status" value={badgeComponent(userStatus)} />
        {leavingReason === "overseas_resident" && (
          <>
            <Row
              fieldName="Did you cease to be a resident for tax purposes during the year?"
              value="Yes"
            />
            <Row
              fieldName="Australian residency end date"
              value={formattedDateWithMonthName(leftPermanentlyDepartureDate)}
              copyLabel="departure-date"
            />
          </>
        )}
        {leavingReason === "overseas_resident" && <Row fieldName="Final tax return" value="Yes" />}
      </Table>
      <Table title="Home address">
        <Row fieldName="Address" value={street} copyLabel="address" colWidth1="40%" colWidth2="20%" />
        {suburb.length > 0 && <Row fieldName="Suburb" value={suburb} copyLabel="suburb" />}
        <Row fieldName="Town/City" value={city} copyLabel="town-or-city" />
        <Row fieldName="State" value={state} copyLabel="state" />
        <Row fieldName="Postcode" value={postcode} copyLabel="postcode" />
        <Row fieldName="Country" value={country} copyLabel="country" warningTooltip={addressOutsideAu ? "Contact customer for more" : ""} />
      </Table>
      <Table title="Daytime contact number">
        <Row fieldName="Email" value={email} copyLabel="email" colWidth1="40%" />
        <Row fieldName="Phone country code" value={phoneCountryCode.replace("+", "")} copyLabel="phone-country-code" />
        <Row fieldName="Phone number" value={phoneNumber} copyLabel="phone-number" />
      </Table>
      <Table title="Electronic Funds Transfer (EFT)">
        <Row fieldName="Account name" value={bankAccountName} copyLabel="bank-account-name" colWidth1="40%" colWidth2="20%" />
        <Row fieldName="BSB number" value={bankAccountBsb} copyLabel="bank-account-number-bsb" />
        <Row fieldName="Account number" value={bankAccountNumber} copyLabel="bank-account-number" />
        <Row fieldName="Financial Institution" value={financialInstitution} copyLabel="financial-institution" warningTooltip={financialInstitution ? "" : "Unable to find a financial instition with the BSB number provided"} />
      </Table>
      <br />
    </Accordion>
  );
};

export default cover;
