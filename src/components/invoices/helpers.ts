import { InvoiceForm } from "app/javascript/types/invoiceForm.type";
import {
  InvoiceSuccessResponse,
  createInvoice,
  updateInvoice,
} from "@api/invoices.api";
import { ApiErrorResponse } from "@api/config/fetch.api";
import { urlSanitizer } from "@hutils/urlSanitizer";

export function formDataToNestedJson(formData: FormData) {
  const json = {};

  Array.from(formData.entries()).forEach(([key, value]) => {
    const parts = key.replace(/\[/g, ".").replace(/\]/g, "").split(".");
    let current = json;

    // Handle array parameters FIRST
    if (parts[parts.length - 1] === "") {
      parts.pop();
      const arrayKey = parts.join(".");

      // Create nested objects if they don't exist
      const nestedParts = arrayKey.split(".");
      let nestedCurrent = json;
      nestedParts.forEach((part, index) => {
        if (index < nestedParts.length - 1) {
          if (!nestedCurrent[part]) {
            nestedCurrent[part] = {};
          }
          nestedCurrent = nestedCurrent[part];
        }
      });

      if (!nestedCurrent[nestedParts[nestedParts.length - 1]]) {
        nestedCurrent[nestedParts[nestedParts.length - 1]] = [];
      }
      nestedCurrent[nestedParts[nestedParts.length - 1]].push(value);
      return; // Important: exit early after handling the array
    }

    // Handle regular parameters
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        current[part] = value;
      } else {
        const nextPart = parts[index + 1];
        if (!current[part]) {
          current[part] = /^\d+$/.test(nextPart) ? [] : {};
        }
        current = current[part];
      }
    });
  });

  return json;
}

export const getFormData = (selector) => {
  const form: HTMLFormElement = document.querySelector(selector);
  const formData = new FormData(form);

  return formDataToNestedJson(formData) as InvoiceForm;
};

export const cancelUnsavedChangeAlert = () => {
  const cancelEvent = new CustomEvent("hnry:cancel_unsaved_changes", {
    bubbles: true,
  });
  document.body.dispatchEvent(cancelEvent);
};

export const visitUrl = (url: string) => {
  if (!url) {
    return;
  }

  if (window.Turbolinks) {
    window.Turbolinks.visit(urlSanitizer(url).toString(), {
      action: "replace",
    });
  } else {
    window.location.assign(urlSanitizer(url));
  }
};

export const saveOrUpdateInvoice = async (
  formObject: InvoiceForm,
  invoiceId: number | null,
): Promise<InvoiceSuccessResponse | ApiErrorResponse> => {
  if (invoiceId) {
    return updateInvoice(formObject);
  }
  return createInvoice(formObject);
};
