import PropTypes from "prop-types";

export const timeZoneType = PropTypes.shape({
  tzdataName: PropTypes.string,
  friendlyName: PropTypes.string,
  browserInTimezone: PropTypes.bool,
  utc: PropTypes.string,
  userJurisdictionTime: PropTypes.string,
  userJurisdictionOffset: PropTypes.number,
});

export default {
  timeZoneType,
};
