import React from "react";
import PropTypes from "prop-types";
import Tooltip from "../../../tooltip";
import CopyButton from "../../../CopyButton";

const Row = ({
  colWidth1 = "520px",
  colWidth2 = "10%",
  fieldName,
  value = null,
  copyLabel = "",
  code = "",
  warningTooltip = "",
  copyFieldName = false,
  className = "",
  additionalActionButton = null,
}) => {
  const copyId = copyLabel ? `copy-${copyLabel}` : "";

  return (
    <tr className={className}>
      <td style={{ width: "30px" }}></td>
      <td className="font-weight-bold" style={{ width: colWidth1 }}>
        <span data-copy-trigger={fieldName}>{fieldName}&nbsp;</span>
        {additionalActionButton && <span className="ml-2">{additionalActionButton}</span>}
        {copyFieldName && <CopyButton label={`Copy ${fieldName} field`} copyId={fieldName} />}
        {warningTooltip && <Tooltip text={warningTooltip} icon="warning" otherClasses="orange-text ml-2" />}
      </td>
      <td style={{ width: "30px" }} className="font-weight-bold">{code}</td>
      <td style={{ width: colWidth2 }} data-copy-exclude="$" data-copy-trigger={copyId}>
        {value}
      </td>
      <td>
        {copyLabel && <CopyButton label={`Copy ${fieldName} to clipboard`} copyId={copyId} />}
      </td>
    </tr>
  );
};

Row.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]),
  colWidth1: PropTypes.string,
  colWidth2: PropTypes.string,
  copyLabel: PropTypes.string,
  code: PropTypes.string,
  warningTooltip: PropTypes.string,
  copyFieldName: PropTypes.bool,
  className: PropTypes.string,
  additionalActionButton: PropTypes.node
};

export default Row;
