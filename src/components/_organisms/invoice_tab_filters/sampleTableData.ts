import { iInvoiceTabFilters } from "./InvoiceTabFilters";

const tabItems: iInvoiceTabFilters = {
  views: [
    {
      tab: {
        name: "Invoices",
        url: "#/tab-1",
        active: true,
        remote: true,
      },
      search: true,
      sort: {
        columns: [
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
            label: "Due date",
            value: "due_date",
            sequenceType: "date",
          },
        ],
        default: {
          key: "due_date",
          direction: "desc",
        },
      },
      filter: [
        {
          label: "Status",
          fieldname: "status_filter",
          items: [
            { key: "all", value: "All" },
            { key: "draft", value: "Draft" },
            { key: "sent", value: "Sent" },
          ],
          default: "draft",
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
          default: "2024/25",
        },
      ],
      queryPath: "#",
    },
    {
      tab: {
        name: "Recurring",
        url: "#/tab-2",
        active: false,
        remote: true,
      },
      search: true,
      sort: {
        columns: [
          {
            label: "Client name",
            value: "clients.organisation_name",
            sequenceType: "alpha",
          },
          {
            label: "Recurs",
            value: "next_occurrence_at",
            sequenceType: "date",
          },
        ],
        default: {
          key: "next_occurrence_at",
          direction: "desc",
        },
      },
      queryPath: "#",
    },
    {
      tab: {
        name: "Reminders",
        url: "#/tab-3",
        active: false,
        remote: true,
      },
      search: true,
      sort: {
        columns: [
          {
            label: "Client name",
            value: "clients.organisation_name",
            sequenceType: "alpha",
          },
          {
            label: "Sent date",
            value: "sent_at",
            sequenceType: "date",
          },
          {
            label: "Invoice number",
            value: "invoice_number",
            sequenceType: "numeric",
          },
        ],
        default: {
          key: "sent_at",
          direction: "desc",
        },
      },
      filter: [
        {
          label: "Status",
          fieldname: "status_filter",
          items: [
            { key: "all", value: "All" },
            { key: "payment_processing", value: "Payment processing" },
            { key: "sent", value: "Sent" },
            { key: "part_paid", value: "Part paid" },
          ],
          default: "all",
        },
      ],
      queryPath: "#",
    },
  ],
  model: "invoices",
};

export default tabItems;
