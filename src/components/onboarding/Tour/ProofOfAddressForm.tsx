import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import Subheading from "@hui/_atoms/subheading/Subheading";
import Paragraph from "@hui/_atoms/paragraph/Paragraph";
import postFile from "../../../API/onboarding/postFile";
import I18n from "../../../utilities/translations";
import { postProofOfAddress } from "../../../API/onboarding/proof_of_address.api";
import handleError from "../../../API/utils/handleError";
import { FileUpload } from "../../inputs/file_upload/file_upload";
import FormWrapper from "./Shared/FormWrapper";
import FormBody from "./Shared/FormBody";
import {
  OnboardingTourFormRef,
  useOnboardingTour,
} from "./Shared/context/OnboardingTourContext";

const ProofOfAddressForm = forwardRef<
  OnboardingTourFormRef,
  { stateUpdate: (...args) => void }
>(({ stateUpdate }, ref) => {
  const ctx = { scope: "onboarding.v3.proof_of_address" };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDroppedOrSelected, setDroppedOrFileSelected] = useState(false);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setDroppedOrFileSelected(true);
    }
  };

  const { setCanSubmitForm, setIsSubmitting, isSubmitting } =
    useOnboardingTour();

  useEffect(() => {
    setCanSubmitForm(fileDroppedOrSelected);
  }, [fileDroppedOrSelected, setCanSubmitForm]);

  useImperativeHandle(ref, () => ({
    submitForm: () => onSubmit(), // Expose the submit function
  }));

  // Triggered when drag and dropped file
  const handleSuccess = () => {
    setSelectedFile(null);
    setDroppedOrFileSelected(true);
  };

  const handleRemoveFile = () => {
    setDroppedOrFileSelected(false);
    setSelectedFile(null);
  };

  const constructAndUploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    await postFile(
      formData,
      Routes.document_upload_api_onboarding_proof_of_addresses_path(),
    );
  };

  const onSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    try {
      if (selectedFile) {
        setIsSubmitting(true);
        await constructAndUploadFile(selectedFile);
      }
      const res = await postProofOfAddress();
      if (res.status === "ok") {
        stateUpdate(res.data.state);
      } else {
        handleError(res);
      }
    } catch (err) {
      toastr.error("Something went wrong, please try again");
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <FormWrapper>
        <form
          onSubmit={onSubmit}
          className="tw-flex tw-flex-1 tw-flex-col tw-overflow-hidden"
        >
          <FormBody>
            <div className="tw-row-span-9 md:tw-row-span-full">
              <Subheading>{I18n.t("paragraph_1", ctx)}</Subheading>
              <Paragraph>{I18n.t("paragraph_2", ctx)}</Paragraph>
              <ul className="list-disc tw-ml-4 !tw-list-outside tw-text-base tw-text-gray-700">
                <li>{I18n.t("document_options.item_1", ctx)}</li>
                <li>{I18n.t("document_options.item_2", ctx)}</li>
                <li>{I18n.t("document_options.item_3", ctx)}</li>
                <li>{I18n.t("document_options.item_4", ctx)}</li>
              </ul>
              <FileUpload
                targetObject={{
                  model:
                    "identity_verification_attributes[proof_of_address_attributes]",
                  id: 1,
                }}
                url={Routes.document_upload_api_onboarding_proof_of_addresses_path()}
                required={true}
                inputProps={{
                  id: "user[user_verification_attributes][verification_document]",
                }}
                requestMethod="POST"
                onFileUpload={handleFileInputChange}
                onSuccess={handleSuccess}
                onRemoveFile={handleRemoveFile}
                compactMode={true}
              ></FileUpload>
            </div>
          </FormBody>
        </form>
      </FormWrapper>
    </>
  );
});
ProofOfAddressForm.displayName = "ProofOfAddressForm";
export default ProofOfAddressForm;
