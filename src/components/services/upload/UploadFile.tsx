import React, { useState } from "react";
import { FileUpload } from "../../inputs/file_upload/file_upload";
import Button from "../../_atoms/button/Button";
import Modal from "../../_molecules/modal/Modal";
import { uploadFile } from "../../../API/services.api";
import Link from "../../_atoms/link/Link";
import I18n from "../../../utilities/translations";

interface iUploadFile {
  illustrationPath: string;
  templatePath: string;
  templateBody: string;
}

// these are snake case because the need to match the keys in the server response to access the values.
interface fileUploadError {
  create_count: number;
  error_count: number;
  errors: string[];
}

export default function UploadFile({
  illustrationPath,
  templatePath,
  templateBody,
}: iUploadFile) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [error, setError] = useState<fileUploadError>();
  const [activeFile, setActiveFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(true);

  const buttonLabel = I18n.t("services.upload.label");
  const addServicesTitle = I18n.t("services.upload.add.title");
  const uploadConfirmLabel = I18n.t("services.upload.add.upload_confirm_label");
  const uploadFailedTitle = I18n.t("services.upload.upload_failed_title");
  const uploadFailedConfirmLabel = I18n.t("services.upload.upload_failed_confirm_label");
  const templateHeading = I18n.t("services.upload.add.template_heading");

  const onUploadServicesClick = () => {
    setUploadModalOpen(true);
    setErrorModalOpen(false);
  };

  const onSuccess = () => {
    setErrorModalOpen(false);
    setUploadModalOpen(false);
    setIsLoading(false);
    setButtonDisabled(false);
    window.location = Routes.services_path();
  };

  const onError = (uploadError: fileUploadError) => {
    setError(uploadError);
    setErrorModalOpen(true);
    setUploadModalOpen(false);
    setIsLoading(false);
  };

  const onUploadConfirm = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("upload[file]", activeFile);
    const result = await uploadFile(formData);
    if (result.status === "bad_request") {
      return onError(result);
    }
    onSuccess();
  };

  const onFileUpload = async (event: React.BaseSyntheticEvent) => {
    // save the file in state ready to send to the backend
    const { files } = event.target;
    setActiveFile(files[0]);
    setButtonDisabled(false);
  };

  const onRemoveFile = () => {
    setButtonDisabled(true);
  };

  const onErrorConfirm = () => {
    setErrorModalOpen(false);
    setUploadModalOpen(true);
    setButtonDisabled(true);
  };

  const onErrorCancel = () => {
    window.location = Routes.services_path();
  };

  return (
    <>
      <Button
        type="button"
        onClick={onUploadServicesClick}
        variant="tertiary"
      >
        {buttonLabel}
      </Button>
      <Modal
        open={uploadModalOpen}
        setOpen={setUploadModalOpen}
        onConfirm={onUploadConfirm}
        title={addServicesTitle}
        confirmCTA="Next"
        loading={isLoading}
        disabled={isButtonDisabled}
      >
        <p><strong>{templateHeading}</strong></p>
        <p>{templateBody}</p>
        <p>
          You can <Link text="download" href={templatePath} /> the template to
          make it really easy.
        </p>

        <img
          src={illustrationPath}
          alt="example of a completed service upload template"
          className="tw-my-4"
        />

        <FileUpload
          targetObject={{ model: "upload" }}
          url="/services/upload/create"
          acceptedType="csv"
          required={true}
          inputProps={{ id: "upload[file]" }}
          customValidation={uploadConfirmLabel}
          requestMethod="POST"
          disableDragAndDrop={true}
          onError={onError}
          onFileUpload={onFileUpload}
          onRemoveFile={onRemoveFile}
        ></FileUpload>
      </Modal>
      <Modal
        open={errorModalOpen}
        setOpen={setErrorModalOpen}
        onConfirm={onErrorConfirm}
        onCancel={onErrorCancel}
        title={uploadFailedTitle}
        confirmCTA={uploadFailedConfirmLabel}
        loading={false}
      >
        { error && <p>{error.create_count} {I18n.p(error.create_count, "services.upload.add.service")} created successfully, {error.error_count} {I18n.p(error.error_count, "services.upload.add.service")} failed to upload due to errors.</p>}
        { error && error.errors ? <ul className="mb-0 errors-list">{error.errors.map((errorMessage, index) => <li className="errors-list__item" key={index}>{errorMessage}</li>)}</ul> : null }
      </Modal>
    </>
  );
}
