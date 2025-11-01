import SEQUENCE_LABEL_COMPONENTS from "../table_filters/TableFilterSequences";
import {
  SequenceType,
  SortDirection,
  SortOption,
} from "../table_filters/types";

const generateSequenceLabel = (
  sequenceType: SequenceType,
  sortDirection: SortDirection,
) =>
  sortDirection === "asc"
    ? `${SEQUENCE_LABEL_COMPONENTS[sequenceType].start} -> ${SEQUENCE_LABEL_COMPONENTS[sequenceType].end}`
    : `${SEQUENCE_LABEL_COMPONENTS[sequenceType].end} -> ${SEQUENCE_LABEL_COMPONENTS[sequenceType].start}`;

/**
 * Generates a sort label based on the provided sort option and direction.
 *
 * @param {SortOption} sortOption - The sort option object.
 * @param {SortDirection} direction - The sort direction.
 * @returns {string} The generated sort label.
 */
const generateSortLabel = (sortOption: SortOption, direction: SortDirection) =>
  `${sortOption.label} (${generateSequenceLabel(
    sortOption.sequenceType,
    direction,
  )})`;
export default generateSortLabel;
