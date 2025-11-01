import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import "./styles.scss";

export interface iTextArea
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  setValue: (value: string) => void;
  label: string;
  renderLabel?: boolean;
  form?: string;
  note?: string;
  error?: string;
  autoGrow?: boolean;
  errorAlign?: "left" | "right";
  disableResize?: boolean;
  scrollbarWidth?: "auto" | "none" | "thin";
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = (props: iTextArea) => {
  const {
    id,
    name,
    value,
    setValue,
    label,
    renderLabel = true,
    note,
    error,
    autoGrow = true,
    errorAlign = "left",
    disableResize = false,
    scrollbarWidth,
    onChange,
    ...textAreaProps
  } = props;
  const idWithFallback = id || name || crypto.randomUUID();

  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current && autoGrow) {
      const textArea = textAreaRef.current;
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [value, autoGrow]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);

    if (onChange) {
      onChange(event);
    }
  }

  return (
    <>
      {renderLabel ? (
        <label
          htmlFor={idWithFallback}
          className={classNames("hnry-label", {
            "hnry-label--required": textAreaProps.required,
          })}
        >
          {label}
        </label>
      ) : <label htmlFor={idWithFallback} className="tw-sr-only">{label}</label>}
      <textarea
        className={classNames("hnry-textarea", { "hnry-textarea--invalid": error })}
        style={{
          scrollbarWidth: scrollbarWidth || "none",
          ...(disableResize && { resize: "none" })
        }}
        id={idWithFallback}
        name={name}
        value={value}
        onChange={handleChange}
        aria-invalid={!!error}
        aria-errormessage={error ? `${idWithFallback}-error` : null}
        ref={textAreaRef}
        data-1p-ignore
        {...textAreaProps}
      />
      {error ? (
        <p className={`hnry-error tw-text-${errorAlign}`} id={`${idWithFallback}-error`}>
          {error}
        </p>
      ) : (
        note && <p className="hnry-note">{note}</p>
      )}
    </>
  );
};

export default TextArea;
