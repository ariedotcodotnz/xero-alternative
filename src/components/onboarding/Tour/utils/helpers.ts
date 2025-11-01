import { countries } from "countries-list";
import {
  country,
  OnboardingStates,
  SectionIntroductionProps,
} from "../Shared/types/onboardingTypes";
import I18n from "../../../../utilities/translations";

const getCountries = (): country[] => {
  const keys = Object.keys(countries);
  const mappedCountries: country[] = keys.map((key) => ({
    key,
    value: countries[key].name,
  }));
  const ukKey = mappedCountries.findIndex((item) => item.key === "GB");
  const ukObject = mappedCountries.splice(ukKey, 1);
  return [...ukObject, ...mappedCountries];
};

export const ukAddressValidator = (value) =>
  ((value.streetNumber !== "" && value.streetAddress !== "") ||
    value.addressLine1 !== "") &&
  value.postTown !== "" &&
  value.postcode !== "" &&
  value.country !== "";

type SectionIntroductionHelperReturnProps = {
  heading: string;
  listItems: string;
  listItemsIntro: string;
  paragraph1: string;
  subHeading: string;
  paragraph2: string;
};

export const sectionIntroductionI18nHelper = (
  tourStep: OnboardingStates,
): SectionIntroductionHelperReturnProps => {
  const context = {
    scope: `onboarding.v3.section_introductions.${tourStep}`,
    defaultValue: "empty",
  };

  return {
    heading: I18n.t("heading", context),
    subHeading: I18n.t("sub_heading", context),
    paragraph1: I18n.t("paragraph1", context),
    paragraph2: I18n.t("paragraph2", context),
    listItemsIntro: I18n.t("list_items_intro", context),
    listItems: I18n.t("list_items", context),
  };
};

export const containsHTML = (string: string) => /<[^>]*>/.test(string);

export default getCountries;
