import { FilterOption, SortOption } from "../table_filters/types";

type Data = {
  sortOptions: SortOption[];
  filterOptions: FilterOption[];
};

const data: Data = {
  sortOptions: [
    {
      label: "Invoice number",
      value: "invoice_number",
      sequenceType: "numeric",
    },
    {
      label: "Client name",
      value: "clients.organisation_name",
      sequenceType: "alpha",
    },
    {
      label: "Invoice date",
      value: "invoice_date",
      sequenceType: "date",
    },
    {
      label: "Due date",
      value: "due_date",
      sequenceType: "date",
    },
  ],
  filterOptions: [
    {
      label: "Status",
      fieldname: "status_filter",
      items: [
        { key: "all", value: "All" },
        { key: "draft", value: "Draft" },
        { key: "sent", value: "Sent" },
      ],
    },
    {
      label: "Financial Year",
      fieldname: "financial_year_filter",
      items: [
        { key: "all", value: "All" },
        { key: "2024/25", value: "2024/25" },
        { key: "2023/24", value: "2023/24" },
        { key: "2022/23", value: "2022/23" },
        { key: "2021/22", value: "2021/22" },
      ],
    },
  ],
};

export default data;
