import { iHnryComboboxEntry } from "../../_molecules/combobox/Combobox";

let trimmedQuery: string;
let jcIsInFilteredJobCategories: boolean;
const getIndexOfQueryInString = (str: string) => str.toLowerCase().indexOf(trimmedQuery);

// Insert the job category into the specified position in the list of filtered job categories
const insertJobCategoryIntoFilteredJobCategories = (fjcs: iHnryComboboxEntry[], i: number, jcToBeInserted: iHnryComboboxEntry) => {
  fjcs.splice(i, 0, jcToBeInserted);
  jcIsInFilteredJobCategories = true;
}

export default function jobCategoryFilter(
  query: string,
  jobCategories: iHnryComboboxEntry[]
) {
  // If no query exists, return the entire (unfiltered) list of job categories
  if (query === "" || query === undefined) {
    return jobCategories.slice();
  }

  // Trim the query of any additional whitespace to not impact results
  trimmedQuery = query.trim().toLowerCase();

  // Reduce the job categories, by checking each job category (jc) and adding it to the filtered job categories (fjcs), if it contains the query
  return jobCategories.reduce((fjcs, jc) => {
    // Safely handle missing "description" fields for the job category
    const jcDesc = jc.description ? jc.description : "";

    const queryIsInJobCategoryValueOrDescription = jc.value.toLowerCase().includes(trimmedQuery) || jcDesc.includes(trimmedQuery);

    // If the query is in the job category value or description
    if (queryIsInJobCategoryValueOrDescription) {
      // Get the index, if applicable, of the query in both the job category value and description
      const jcValIndex = getIndexOfQueryInString(jc.value);
      const jcDescIndex = getIndexOfQueryInString(jcDesc);
      jcIsInFilteredJobCategories = false;

      // Loop through each of the filtered job categories to see if we need to insert the current job category
      for (let i = 0; i < fjcs.length; i += 1) {
        const fjc = fjcs[i];
        // Get the index, if applicable, of the query in both the filtered job category value and description
        const fjcValIndex = getIndexOfQueryInString(fjc.value);
        const fjcDescIndex = fjc.description ? getIndexOfQueryInString(fjc.description) : -1;

        const queryAppearsInJobCategoryValueBeforeFilterJobCategoryValue = jcValIndex !== -1 && fjcValIndex !== -1;
        const queryAppearsInJobCategoryValueButNotTheFilterJobCategoryValue = jcValIndex !== -1 && fjcValIndex === -1;
        const queryDoesNotAppearInJobCategoryValueOrFilterJobCategoryValue = jcValIndex === -1 && fjcValIndex === -1;
        const queryAppearsInJobCategoryDescriptionBeforeFilterJobCategoryDescription = jcDescIndex < fjcDescIndex;

        // If the query is in the job category value being checked and the filtered job category value
        if (queryAppearsInJobCategoryValueBeforeFilterJobCategoryValue) {
          // And the query appears in the job category value being checked before the query appears in the filtered job category value
          if (jcValIndex < fjcValIndex) {
            insertJobCategoryIntoFilteredJobCategories(fjcs, i, jc);
            break;
          }
        }
        // If the query is in the job category value being checked, but not the filtered job category value
        else if (queryAppearsInJobCategoryValueButNotTheFilterJobCategoryValue) {
          insertJobCategoryIntoFilteredJobCategories(fjcs, i, jc);
            break;
        }
        // If the query is not in either the job category value being checked or the filtered job category value
        else if (queryDoesNotAppearInJobCategoryValueOrFilterJobCategoryValue) {
          // If the query appears in the job category description being checked before the query appears in the filtered job category description
          // or if the query doesn't appear in the filtered job category description 
          if (queryAppearsInJobCategoryDescriptionBeforeFilterJobCategoryDescription) {
            insertJobCategoryIntoFilteredJobCategories(fjcs, i, jc);
            break;
          }
        }
      }

      // If the job category isn't in the list of filtered job categories, add it
      if (!jcIsInFilteredJobCategories) {
        fjcs.push(jc);
      }
    }

    return fjcs;
  }, []);
}
