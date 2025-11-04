import React from "react";
import I18n from "../../../utilities/translations";
// import "./styles.scss";

interface iSCAConfirm {
  deviceName: string;
}

const SCAContent = ({
  deviceName,
}: iSCAConfirm) => (
  <>
    <p className="tw-mb-3 !tw-text-gray-700">{I18n.t("sca_confirm.paragraph")}</p>
    <div className="tw-flex tw-mb-6 tw-flex-col">
      <p className="!tw-text-gray-700 tw-mb-2">{I18n.t("sca_confirm.device_name")}</p>
      <p className="!tw-text-gray-700 tw-font-light tw-mb-0">{deviceName}</p>
    </div>
  </>
);

export default SCAContent;
