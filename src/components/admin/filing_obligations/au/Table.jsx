import React from "react";
import PropTypes from "prop-types";
import Tooltip from "../../../tooltip";

const Table = ({
  children = null, title, code = "", show = true, warningTooltip = "",
}) => {
  if (!show) return null;

  return (
    <table className="table custom-card-filing__table table-hover">
      <thead>
        <tr className="row__header ">
          <th style={{ width: "30px" }}>{code}</th>
          <th colSpan="4">
            {title}
            {warningTooltip && <Tooltip text={warningTooltip} icon="warning" otherClasses="orange-text ml-2" />}
          </th>
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  show: PropTypes.bool,
  code: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  warningTooltip: PropTypes.string,
};

export default Table;
