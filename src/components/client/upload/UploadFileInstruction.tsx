import React from "react";
import I18n from "../../../utilities/translations";
import { getUserJurisdictionCode } from "../../../utilities/user_attributes";

const ctx = { scope: "clients.upload.add" };

const UploadFileInstruction = ({ templatePath }: { templatePath: string }) => (
  <>
    {["au", "nz"].includes(getUserJurisdictionCode()) && (
      <>
        <p>
          <strong>{I18n.t("xero_heading", ctx)}</strong>
        </p>
        <p>
          <>
            Upload your Xero client export below. Learn{" "}
            <a
              className="hui-link"
              href={I18n.t("instructions_link", ctx)}
              rel="noreferrer"
              target="_blank"
            >
              how to export from Xero
            </a>
            .
          </>
        </p>
        <p>
          <strong>{I18n.t("template_heading", ctx)}</strong>
        </p>
      </>
    )}
    <p>
      Download the{" "}
      <a className="hui-link" href={templatePath}>
        Hnry Client Template
      </a>
      , add your client data, then upload the file below. Learn{" "}
      <a
        className="hui-link"
        href={I18n.t("instructions_link", ctx)}
        rel="noreferrer"
        target="_blank"
      >
        how to bulk upload clients in Hnry
      </a>
      .
    </p>
  </>
);

export default UploadFileInstruction;
