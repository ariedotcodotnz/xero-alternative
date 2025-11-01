import I18n from "../../utilities/translations";

const modalOptions = {
  scope: "home.call_to_action.delinked",
  tax_agency: I18n.t("global.tax_collection_authority_short"),
  sales_tax: I18n.t("global.sales_tax"),
}

const confirmButton = I18n.t("shared.confirm_button", modalOptions)
const grantAuthority = I18n.t("shared.grant_authority", modalOptions)
const understandButton = I18n.t("shared.understand_button", modalOptions)
const understandImpacts = I18n.t("shared.understand_impacts", modalOptions)

export const banner = {
  button: I18n.t("banner.button", modalOptions),
  paragraph: I18n.t("banner.paragraph", modalOptions),
  title: I18n.t("banner.title", modalOptions),
}

export const allowToRelink = {
  noButton: I18n.t("allow_to_relink.no_button", modalOptions),
  noSalesTaxListHtml: I18n.t("allow_to_relink.no_sales_tax_list_html", modalOptions),
  paragraph: I18n.t("allow_to_relink.paragraph", modalOptions),
  salesTaxListHtml: I18n.t("allow_to_relink.sales_tax_list_html", modalOptions),
  title: I18n.t("allow_to_relink.title", modalOptions),
  yesButton: I18n.t("allow_to_relink.yes_button", modalOptions),
}

export const continueWithHnry = {
  paragraph: I18n.t("continue_with_hnry.paragraph", modalOptions),
  title: I18n.t("continue_with_hnry.title", modalOptions),
}

export const howToProceed = {
  intentionallyDelinkedButton: I18n.t("how_to_proceed.intentionally_delinked_button", modalOptions),
  interimDelinkedButton: I18n.t("how_to_proceed.interim_delinked_button", modalOptions),
  paragraphHtml: I18n.t("how_to_proceed.paragraph_html", modalOptions),
  title: I18n.t("how_to_proceed.title", modalOptions),
}

export const intentionallyDelinked = {
  button: understandButton,
  consentLabel: understandImpacts,
  contentHtml: I18n.t("intentionally_delinked.content_html", modalOptions),
  title: I18n.t("intentionally_delinked.title", modalOptions),
}

export const interimConfirmation = {
  paragraph: I18n.t("interim_confirmation.paragraph", modalOptions),
  title: I18n.t("interim_confirmation.title", modalOptions),
}

export const interimDelinked = {
  button: understandButton,
  consentLabel: understandImpacts,
  contentHtml: I18n.t("interim_delinked.content_html", modalOptions),
  title: I18n.t("interim_delinked.title", modalOptions),
}

export const linked = {
  button: confirmButton,
  consentLabel: grantAuthority,
  title: I18n.t("linked.title", modalOptions),
}

export const offBoardUser = {
  button: confirmButton,
  title: I18n.t("off_board_user.title", modalOptions),
  radioButton: {
    altArrangement: I18n.t("off_board_user.radio_button.alt_arrangement", modalOptions),
    graduated: I18n.t("off_board_user.radio_button.graduated", modalOptions),
    nlse: I18n.t("off_board_user.radio_button.nlse", modalOptions),
    overseasResident: I18n.t("off_board_user.radio_button.overseas_resident", modalOptions),
  }
}

export const salesTaxLinked = {
  button: confirmButton,
  consentLabel: grantAuthority,
  title: I18n.t("sales_tax_linked.title", modalOptions),
}

export const salesTaxOnlyConsent = {
  button: understandButton,
  consentLabel: understandImpacts,
  contentHtml: I18n.t("sales_tax_only_consent.content_html", modalOptions),
  title: I18n.t("sales_tax_only_consent.title", modalOptions),
}

export const salesTaxProceed = {
  paragraph: I18n.t("sales_tax_proceed.paragraph", modalOptions),
  noButton: I18n.t("sales_tax_proceed.no_button", modalOptions),
  title: I18n.t("sales_tax_proceed.title", modalOptions),
  yesButton: I18n.t("sales_tax_proceed.yes_button", modalOptions),
}

const relinkBannerOptions = {
  scope: "home.call_to_action.relink_banner",
  tax_agency: I18n.t("global.tax_collection_authority_short"),
  sales_tax: I18n.t("global.sales_tax"),
}

export const relinkBanner = {
  interim_delinked: {
    button: I18n.t("interim_delinked.button", relinkBannerOptions),
    title: I18n.t("interim_delinked.title", relinkBannerOptions),
  },
  sales_tax_linked: {
    button: I18n.t("sales_tax_linked.button", relinkBannerOptions),
    title: I18n.t("sales_tax_linked.title", relinkBannerOptions),
  },
  off_boarding: {
    button: I18n.t("off_boarding.button", relinkBannerOptions),
    title: I18n.t("off_boarding.title", relinkBannerOptions),
  }
}

export const relinkBannerContent = {
  interimDelinkedParagraph: I18n.t("content.interim_delinked_paragraph", relinkBannerOptions),
  salesTaxLinkedParagraph1: I18n.t("content.sales_tax_linked_paragraph_1", relinkBannerOptions),
  salesTaxLinkedParagraph2: I18n.t("content.sales_tax_linked_paragraph_2", relinkBannerOptions),
  offBoardingDelinkedParagraph: I18n.t("content.off_boarding_delinked_paragraph", relinkBannerOptions),
}
