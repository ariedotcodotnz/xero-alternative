import { iTableFilters } from "./types";

const tabItems: iTableFilters = {
  panelId: "Invoices",
  defaultFilters: [
    { key: "status_filter", value: "all" },
    { key: "financial_year_filter", value: "2023/24" },
  ],
  defaultSort: {
    direction: "desc", key: "due_date",
  },
  showSearch: true,
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
  queryPath: "#",
  model: "invoices",
};

export default tabItems;

export const noSortProps: iTableFilters = {
  panelId: "Invoices",
  defaultFilters: [
    { key: "status_filter", value: "all" },
    { key: "financial_year_filter", value: "2023/24" },
  ],
  showSearch: true,
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
  queryPath: "#",
  model: "invoices",
};

export const noSearchProps: iTableFilters = {
  panelId: "Invoices",
  showSearch: false,
  defaultFilters: [
    { key: "status_filter", value: "all" },
    { key: "financial_year_filter", value: "2023/24" },
  ],
  defaultSort: {
    direction: "desc", key: "due_date",
  },
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
  queryPath: "#",
  model: "invoices",
};

export const noFilteringProps: iTableFilters = {
  panelId: "Invoices",
  defaultSort: {
    direction: "desc", key: "due_date",
  },
  showSearch: true,
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
  queryPath: "#",
  model: "invoices",
};