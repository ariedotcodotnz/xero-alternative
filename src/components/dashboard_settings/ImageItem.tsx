import React from "react";
import AccountDetailsMobSVG from "../../../assets/images/dashboard_settings/account_details_mobile.svg";
import AccountDetailsSVG from "../../../assets/images/dashboard_settings/account_details.svg";
import ArticlesMobSVG from "../../../assets/images/dashboard_settings/articles_mobile.svg";
import ArticlesSVG from "../../../assets/images/dashboard_settings/articles.svg";
import ExpensesMobSVG from "../../../assets/images/dashboard_settings/expenses_mobile.svg";
import ExpensesSVG from "../../../assets/images/dashboard_settings/expenses.svg";
import HnryCardMobSVG from "../../../assets/images/dashboard_settings/hnry_card_mobile.svg";
import HnryCardSVG from "../../../assets/images/dashboard_settings/hnry_card.svg";
import IncomeAndExpensesMobSVG from "../../../assets/images/dashboard_settings/income_and_expenses_mobile.svg";
import IncomeAndExpensesSVG from "../../../assets/images/dashboard_settings/income_and_expenses.svg";
import InvoicesMobSVG from "../../../assets/images/dashboard_settings/outstanding_invoices_mobile.svg";
import InvoicesSVG from "../../../assets/images/dashboard_settings/outstanding_invoices.svg";
import PayslipsMobSVG from "../../../assets/images/dashboard_settings/recent_payments_mobile.svg";
import PayslipsSVG from "../../../assets/images/dashboard_settings/recent_payments.svg";

interface ImageItemProps {
  className: string;
  alt: string;
  moduleName: string;
  mobile?: boolean;
}

function getFileSrc(moduleName: string, mobile: boolean) {
  switch (moduleName) {
    case "account_details":
      return mobile ? AccountDetailsMobSVG : AccountDetailsSVG;
    case "articles":
      return mobile ? ArticlesMobSVG : ArticlesSVG;
    case "expenses":
      return mobile ? ExpensesMobSVG : ExpensesSVG;
    case "hnry_card":
      return mobile ? HnryCardMobSVG : HnryCardSVG;
    case "income_and_expenditure":
      return mobile ? IncomeAndExpensesMobSVG : IncomeAndExpensesSVG;
    case "outstanding_invoices":
      return mobile ? InvoicesMobSVG : InvoicesSVG;
    case "recent_payments":
      return mobile ? PayslipsMobSVG : PayslipsSVG;
    default:
      return mobile ? ExpensesMobSVG : ExpensesSVG;
  }
}

const ImageItem = ({
  className,
  alt,
  moduleName,
  mobile = false,
}: ImageItemProps) => (
  <img
    src={getFileSrc(moduleName, mobile)}
    className={className}
    alt={alt}
    data-testid="hnry-card-no-balance"
  />
);

export default ImageItem;
