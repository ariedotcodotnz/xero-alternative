import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Dropzone from "dropzone";
import classNames from "classnames";
import { useDragAndDrop, useCustomEventDispatch } from "../../utils/Hooks";
import Loader from "../_elements/loader";
import { hasFeatureFlag } from "../../../utilities/feature_flags";
import Icon, { IconType } from "../../_atoms/icons/icon/Icon";


const FILE_TYPE = {
  image: {
    mimeTypes: "image/jpeg, image/png, image/heic, image/heif, application/pdf",
    errorTypes: "JPEG, PNG, PDF, HEIC, HEIF",
  },
  csv: {
    mimeTypes: "text/csv",
    errorTypes: "CSV",
  },
};

const PATCH_REQUEST_METHOD = "PATCH";
const POST_REQUEST_METHOD = "POST";
const REQUEST_METHODS = [PATCH_REQUEST_METHOD, POST_REQUEST_METHOD];

export const FileUpload = ({
  inputProps,
  targetObject,
  url,
  subLabel = [],
  enabledBtnName,
  disabledBtn,
  acceptedType = "image",
  maxFileSize = 0,
  required = false,
  customValidation = "Please upload a file",
  disableDragAndDrop = false,
  slimSize = false,
  nativeReceiptScanner = false,
  requestMethod = PATCH_REQUEST_METHOD,
  onSuccess = null,
  onError = null,
  onFileUpload = null,
  onRemoveFile,
  compactMode = false,
}) => {
  const [isHighlighted, setHighlighted] = useState(false);
  const [activeFile, setActiveFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [promptLabel, setPromptLabel] = useState("Drag and drop file to upload");
  const [promptSubLabel, setPromptSubLabel] = useState(subLabel);
  const [fileInputValue, setFileInputValue] = useState("");
  const [disabledSubmitButton, setDisabledSubmitButton] = useState(disabledBtn || false);
  const [acceptedTypes, setAcceptedTypes] = useState(FILE_TYPE[acceptedType].mimeTypes);
  const [inputRequired, setInputRequired] = useState(required || false);
  const [error, setError] = useState(customValidation);
  const [hasFile, setHasFile] = useState(false);

  const DropZoneRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setAcceptedTypes(FILE_TYPE[acceptedType].mimeTypes);
  }, [acceptedType]);

  const setDispatchEvent = useCustomEventDispatch({
    eventName: "fieldValueChange",
    detail: { type: "file", target: inputRef.current },
  });

  useDragAndDrop({
    target: DropZoneRef,
    onDragOver: () => setHighlighted(true),
    onDragEnter: () => setHighlighted(true),
    onDragLeave: () => setHighlighted(false),
  });

  const updateButtonValidity = () => {
    if (enabledBtnName && disabledSubmitButton && activeFile) {
      document.getElementById(enabledBtnName).disabled = false;
      document.getElementById(inputProps.id).required = false;
      setDisabledSubmitButton(false);
    } else if (enabledBtnName && activeFile === null && !disabledSubmitButton) {
      document.getElementById(enabledBtnName).disabled = true;
      document.getElementById(inputProps.id).required = true;
    }
  }

  useEffect(() => {
    updateButtonValidity();
  }, [activeFile, disabledSubmitButton, enabledBtnName]);

  useEffect(() => {
    if (!isMobile && !disableDragAndDrop) {
      const { model, id } = targetObject;
      const fullUrl = (requestMethod === PATCH_REQUEST_METHOD) ? `${url}.js?${model}[id]=${id}` : `${url}.js?`;
      const csrfNode = document.querySelector('meta[name="csrf-token"]');
      const myDropzone = new Dropzone(`.${DropZoneRef.current.classList[0]}`, {
        url: fullUrl,
        method: requestMethod,
        createImageThumbnails: false,
        init() {
          this.on("drop", (event) => {
            const file = event.dataTransfer.files[0];
            const accepted = acceptedTypes.split(", ");

            if (accepted.includes(file.type)) {
              setIsUploading(true);
              setActiveFile(file);
            } else {
              toastr.error(`File needs to be in a valid format (${FILE_TYPE[acceptedType].errorTypes})`);
            }
            setHighlighted(false);
          });
        },
        headers: {
          "X-CSRF-Token": csrfNode ? csrfNode.getAttribute("content") : "",
        },
        acceptedFiles: acceptedTypes,
        clickable: false,
        success: () => {
          setIsUploading(false);
          setHasFile(true);
          setDisabledSubmitButton(true);
          if (onSuccess) {
            onSuccess();
          }
        },
        error: (_file, message) => {
          setIsUploading(false);
          updated("", null);
          if (onError) {
            onError(message);
          }
        },
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= window.breakpoints.tabletMin);
    }
  }, []);

  useEffect(() => {
    if (isUploading) {
      setPromptLabel("Uploading your file...");
      setPromptSubLabel([]);
    } else if (activeFile) {
      setPromptLabel(truncate(activeFile.name));
      setPromptSubLabel([]);
      setInputRequired(false);
      setDispatchEvent(true);
    } else if (isMobile) {
      setPromptLabel("Take a picture or choose one from your phone to upload");
      setPromptSubLabel(subLabel);
      setInputRequired(required);
    } else {
      setPromptLabel(disableDragAndDrop ? "Select file to upload" : "Drag and drop file to upload");
      setPromptSubLabel(subLabel);
      setInputRequired(required);
    }
  }, [activeFile, isMobile, isUploading]);

  const updated = (value, file) => {
    setFileInputValue(value || "");
    setActiveFile(file);
    inputRef.current.blur();
  };


  useEffect(() => {
    // fires a custom event for form validation in Choose An Id Document in ANZ
    const form = document.getElementById("sign-up-tour-form");
    if (form && hasFile) {
      form.dispatchEvent(new Event("fileUploaded", { bubbles: true }))
    }
  }, [hasFile])

  const handleInputChange = (event) => {
    event.preventDefault();
    const { value, files } = event.target;
    const file = event.target.files[0];

    setHasFile(true);

    if (validateFileSize(file)) {
      updated(value, files[0]);
      if (customValidation) { setError(customValidation); }
    }

    if (onFileUpload) {
      onFileUpload(event);
    }
  };

  const uploadFileClick = (event) => {
    if (
      nativeReceiptScanner
      && typeof window.ReceiptUploadCallback === "object"
    ) {
      event.preventDefault();
      window.ReceiptUploadCallback.showUploadReceiptDialog();
    }
  };

  const handleRemoveFile = (event) => {
    setHasFile(false);
    if (onRemoveFile) {
      onRemoveFile(event);
    }
  };

  const resetRequired = () => {
    // input file value cannot be changed manually so
    // remove required attribute to clear client-side validation
    setInputRequired(required);
  };

  const validateFileSize = (file) => {
    if (maxFileSize > 0 && file.size > maxFileSize) {
      const fileSizeInMB = maxFileSize / 1024 ** 2;
      setError(`File size should be less than ${fileSizeInMB} MB`);
      setDispatchEvent(true);
      setHasFile(false);
      return false;
    }
    return true;
  };

  const truncate = (string) => {
    const maxLength = slimSize ? 20 : 35;
    const charLength = slimSize ? 8 : 14;
    if (string?.length > maxLength) {
      return `${string.slice(0, charLength)}...${string.slice(string.length - charLength, string.length)}`;
    }
    return string;
  };

  return (
    <div
      className={
        classNames("drop-zone", {
          highlight: isHighlighted,
          mobile: isMobile,
          slim: slimSize,
          loading: isUploading,
          "has-file": hasFile,
          compact: compactMode,
        })}
      ref={DropZoneRef
      }>
      <div className="dnd-message">
        {isUploading ? (
          <Loader />
        ) : (
          <div className="file-prompt">
            <div className={classNames("hnry-icon__circle", { success: activeFile })}>
              <i className={`fa fa-${activeFile ? "check" : "upload"}`} aria-hidden="true"></i>
            </div>
            <div className="file-prompt__name">
              {truncate(activeFile?.name)}
            </div>
          </div>
        )}

        {!slimSize && <p className="tw-font-semibold tw-text-base tw-text-gray-900">{promptLabel}</p>}

        {promptSubLabel.map((label, i) => <span key={`fileUploadLabel${i}`} className="sub-label tw-text-sm tw-text-center">{label}<br /></span>)}
      </div>

      <input
        type="hidden"
        {...inputProps}
        id={`${inputProps.id}__hidden`}
        name={inputProps.name || inputProps.id}
        required={inputRequired}
      />
      <input
        ref={inputRef}
        type="file"
        {...inputProps}
        data-custom-validation={error}
        required={inputRequired}
        name={inputProps.name || inputProps.id}
        onChange={(event) => handleInputChange(event)}
        onClick={(event) => uploadFileClick(event)}
        accept={acceptedTypes}
        value={fileInputValue}
        data-testid="uploadFileId"
      />
      <Prompt
        inputId={inputProps.id}
        hasFile={hasFile}
        isUploading={isUploading}
        handleUpdate={updated}
        handleRemoveFile={handleRemoveFile}
        resetRequired={resetRequired}
        slimSize={slimSize}
      />
    </div>
  );
};

const Prompt = ({
  inputId, hasFile, handleRemoveFile, handleUpdate, isUploading, resetRequired, slimSize
}) => {
  const handleClick = () => {
    handleUpdate("", null);
    resetRequired();
    handleRemoveFile();
  };
  // No file present
  if (!hasFile) {
    return (
      <label className={classNames("hnry-button hnry-button--secondary hnry-button--small tw-mb-0")} htmlFor={inputId}>
        Select file
      </label>
    );
    // If a file is present and uploading
  } if (!isUploading) {
    return( 
      slimSize ? 
        <button type="button" onClick={handleClick}>
          <Icon type="XMarkIcon" asButton={true} onClick={handleClick} /> 
        </button>
        : 
        <button
          type="button"
          className="hnry-button hnry-button--tertiary hnry-button--small"
          onClick={handleClick}
        >
          Remove file
        </button>
    )
  }
  return null;
};

FileUpload.propTypes = {
  acceptedType: PropTypes.oneOf(["image", "csv"]),
  maxFileSize: PropTypes.number,
  targetObject: PropTypes.object.isRequired,
  inputProps: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  enabledBtnName: PropTypes.string,
  disabledBtn: PropTypes.bool,
  required: PropTypes.bool,
  disableDragAndDrop: PropTypes.bool,
  subLabel: PropTypes.arrayOf(PropTypes.string),
  customValidation: PropTypes.string,
  slimSize: PropTypes.bool,
  nativeReceiptScanner: PropTypes.bool,
  requestMethod: PropTypes.oneOf(REQUEST_METHODS),
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  onFileUpload: PropTypes.func,
  onRemoveFile: PropTypes.func,
  compactMode: PropTypes.bool,
};

export default FileUpload;
