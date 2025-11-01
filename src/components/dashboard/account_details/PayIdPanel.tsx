import React, { useEffect, useState } from "react";
import Input from "../../_atoms/input/Input";
import { updatePayId } from "../../../API/settings.api";
import CopyButton from "../../_molecules/copy_button/CopyButton";
import Icon from "../../_atoms/icons/icon/Icon";

interface PayIdPanelProps {
  eventContext: string;
  payId: string;
  payIdName: string;
  setPayId: (payId: string) => void;
  payIdDomain: string;
}

/**
 * Removes the specified domain from the given PayID.
 *
 * @param {string} payId - The PayID to strip the domain from.
 * @param {string} domain - The domain to be removed from the PayID.
 * @returns {string} - The PayID with the domain removed.
 */
const stripPayIdDomain = (payId: string, domain: string): string =>
  payId.replace(domain, "");

/**
 * Adds the domain to the given payId.
 *
 * @param {string} payId - The payId to add the domain to.
 * @param {string} domain - The domain to be added to the PayID.
 * @returns {string} The payId with the domain added.
 */
const addPayIdDomain = (payId: string, domain: string) => payId + domain;

const PayIdPanel = ({
  eventContext,
  payId,
  payIdName,
  setPayId,
  payIdDomain,
}: PayIdPanelProps) => {
  // A random ID so that the PayID field can be uniquely identified even if multiple instances of the input are present on a page
  const PayIDInputID = crypto.randomUUID();

  const [workingPayId, setWorkingPayId] = useState(payId);
  const [errors, setErrors] = useState<string>();
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isValidPayId = /^[a-zA-Z0-9]+$/.test(workingPayId);
    const isPayIdTooLong = workingPayId.length > 256;

    if (!isValidPayId) {
      setErrors("PayID can consist only of letters and numbers");
    } else if (isPayIdTooLong) {
      setErrors("PayID must be 256 characters or less");
    } else {
      setErrors(undefined);
    }
  }, [workingPayId]);

  const handleEditMode = () => {
    setWorkingPayId(stripPayIdDomain(payId, payIdDomain));
    setEditMode(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const updateRequest = await updatePayId(workingPayId);

      if (updateRequest.errors) {
        setErrors(updateRequest.errors);
        return;
      }
    } catch (error) {
      setErrors("An error occurred. Please try again later.");
    }

    setPayId(addPayIdDomain(workingPayId, payIdDomain));
    setEditMode(false);
    setIsLoading(false);
    if (window.toastr) window.toastr.success("PayID updated successfully");
  };

  const handleCancel = () => {
    setEditMode(false);
    setErrors(null);
  };

  const canSubmit =
    !isLoading && workingPayId !== stripPayIdDomain(payId, payIdDomain);

  const content = editMode ? (
    <>
      <label htmlFor={PayIDInputID} className="!tw-text-sm tw-font-semibold">
        PayID
      </label>
      <div className="tw-flex tw-items-start tw-gap-4">
        <div className="tw-flex tw-grow tw-gap-2">
          <div>
            <Input
              label="Hnry Account PayID"
              placeholder="Enter PayID"
              value={workingPayId}
              setValue={(value) => setWorkingPayId(value)}
              id={PayIDInputID}
              labelRendered={false}
              aria-invalid={errors ? "true" : "false"}
              aria-errormessage={`payIdError-${PayIDInputID}`}
              disabled={isLoading}
            />
          </div>
          <div className="tw-leading-10 tw-text-gray-500">@hnry.co</div>
        </div>
        <div className="tw-flex">
          <button
            type="button"
            className="tw-p-2 disabled:tw-cursor-not-allowed"
            onClick={handleConfirm}
            disabled={!canSubmit}
          >
            <Icon
              type="CheckIcon"
              classes={!canSubmit && "!tw-text-gray-400"}
            />
            <span className="tw-sr-only">Save new PayID</span>
          </button>
          <button type="button" className="tw-p-2" onClick={handleCancel}>
            <Icon type="XMarkIcon" />
            <span className="tw-sr-only">Cancel editing PayID</span>
          </button>
        </div>
      </div>
      {errors && (
        <p
          className="tw-mt-2 tw-block tw-text-sm tw-text-red-600"
          id={`payIdError-${PayIDInputID}`}
        >
          {errors}
        </p>
      )}
    </>
  ) : (
    <>
      <div className="tw-font-semibold">PayID</div>

      <div className="tw-flex tw-items-center tw-gap-4">
        <div className="tw-grow tw-leading-10">{payId}</div>
        <div className="tw-flex">
          <button
            type="button"
            className="tw-border-0 tw-p-2"
            onClick={handleEditMode}
          >
            <Icon type="PencilSquareIcon" />
            <span className="tw-sr-only">Edit PayID</span>
          </button>
          <CopyButton
            copyValue={payId}
            label="Copy PayID"
            buttonClasses="tw-border-0 tw-pl-2"
            eventName={`${eventContext}_account_details_PayID_copied`}
          >
            <span className="tw-sr-only">Copy PayID</span>
          </CopyButton>
        </div>
      </div>
    </>
  );

  return (
    <div className="tw-flex tw-flex-col tw-gap-4 tw-text-sm tw-text-gray-900">
      <div className="tw-flex tw-flex-col tw-items-stretch">
        <div className="tw-font-semibold">Hnry Account PayID Name</div>
        <div className="tw-flex tw-items-center tw-justify-between">
          <span className="tw-grow tw-leading-10">{payIdName}</span>
          <div>
            <CopyButton
              copyValue={payIdName}
              label="Pay ID account name"
              buttonClasses="tw-border-0"
              eventName={`${eventContext}_account_details_PayID_name_copied`}
            >
              <span className="tw-sr-only">Copy Pay ID account name</span>
            </CopyButton>
          </div>
        </div>
      </div>
      <div className="tw-flex tw-flex-col tw-items-stretch">{content}</div>
    </div>
  );
};

export default PayIdPanel;
