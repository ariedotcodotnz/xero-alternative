import React, { useState } from "react";
import { FileUpload } from "../../inputs/file_upload/file_upload";
import Button from "../../_atoms/button/Button";
import Modal from "../../_molecules/modal/Modal";
import { uploadFile } from "../../../API/clients.api";
import I18n from "../../../utilities/translations";
import UploadFileInstruction from "./UploadFileInstruction";

const ctx = { scope: "clients.upload" };

interface iUploadFile {
  templatePath: string;
  buttonClasses?: string;
}

export default function UploadFile({
  templatePath,
  buttonClasses,
}: iUploadFile) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [createCount, setCreateCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [errorMessages, setErrorMessages] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(true);

  const onUploadClientsClick = () => {
    setUploadModalOpen(true);
    setErrorModalOpen(false);
  };

  const onSuccess = () => {
    setErrorModalOpen(false);
    setUploadModalOpen(false);
    setIsLoading(false);
    setButtonDisabled(false);
    window.location = Routes.clients_path();
  };

  const onError = (message) => {
    setCreateCount(message.create_count);
    setErrorCount(message.error_count);
    setErrorMessages(
      message.errors.map((error: string, index: number) => (
        <li className="errors-list__item" key={index}>
          {error}
        </li>
      )),
    );
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
    window.location = Routes.clients_path();
  };

  return (
    <>
      <Button
        type="button"
        onClick={onUploadClientsClick}
        variant="tertiary"
        classes={buttonClasses}
        dataTrackClick={{ eventName: "upload_clients_csv" }}
      >
        {I18n.t("label", ctx)}
      </Button>
      <Modal
        open={uploadModalOpen}
        setOpen={setUploadModalOpen}
        onConfirm={onUploadConfirm}
        title={I18n.t("add.title", ctx)}
        confirmCTA="Next"
        loading={isLoading}
        disabled={isButtonDisabled}
      >
        <UploadFileInstruction templatePath={templatePath} />

        <FileUpload
          targetObject={{ model: "upload" }}
          url="/clients/upload/create"
          acceptedType="csv"
          required={true}
          inputProps={{ id: "upload[file]" }}
          customValidation={I18n.t("add.upload_confirm_label", ctx)}
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
        title={I18n.t("upload_failed_title", ctx)}
        confirmCTA={I18n.t("upload_failed_confirm_label", ctx)}
        loading={false}
      >
        <p>
          {createCount} {I18n.p(createCount, "add.client", ctx)} created
          successfully, {errorCount} {I18n.p(errorCount, "add.client", ctx)}{" "}
          failed to upload due to errors.
        </p>
        <ul className="mb-0 errors-list">{errorMessages}</ul>
      </Modal>
    </>
  );
}
