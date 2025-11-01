const SELECTORS = {
  clientHasRecruiter: "#client_has_recruiter",
  clientInvoiceClientSelected: "#client_invoice_client_selected",
  clientInvoiceRecruiterSelected: "#client_invoice_recruiter_selected",
  clientPaysUntaxedPerDiems: "#client_pays_untaxed_per_diems",
  clientCurrencyCode: "#client_currency_code",
  clientGstType: "#client_gst_type",
  perDiemModal: "#perDiemModal",
  recruiterBlock: ".recruiter-block",
  invoiceRecruiterBlock: ".invoice-recruiter-block",
  sendInvoiceRemindersBlock: ".send-invoice-reminders-block",
  data: "#data",
  userJurisdictionCurrencyCode: "#user-jurisdiction-currency-code",
};

let hasShownPerDiemModal = false;

const getElement = <T extends HTMLElement>(selector: string): T | null => {
  const element = document.querySelector(selector);
  return element instanceof HTMLElement ? (element as T) : null;
};

const toggleVisibility = (blockSelector: string, condition: boolean) => {
  const blockElement = getElement<HTMLElement>(blockSelector);
  if (blockElement) {
    blockElement.style.display = condition ? "block" : "none";
  }
};

const checkVisibility = (blockSelector: string, checkboxSelector: string) => {
  const checkboxElement = getElement<HTMLInputElement>(checkboxSelector);
  if (checkboxElement) {
    toggleVisibility(blockSelector, checkboxElement.checked);
  }
};

const checkCanSendInvoiceReminders = () => {
  const clientSelectedElement = getElement<HTMLInputElement>(
    SELECTORS.clientInvoiceClientSelected,
  );
  const recruiterSelectedElement = getElement<HTMLInputElement>(
    SELECTORS.clientInvoiceRecruiterSelected,
  );
  const condition =
    (clientSelectedElement?.checked || recruiterSelectedElement?.checked) ??
    false;
  toggleVisibility(SELECTORS.sendInvoiceRemindersBlock, condition);
};

const uncheckInvoiceRecruiterSelected = () => {
  const clientHasRecruiter = getElement<HTMLInputElement>(
    SELECTORS.clientHasRecruiter,
  );
  if (clientHasRecruiter && !clientHasRecruiter.checked) {
    const recruiterSelected = getElement<HTMLInputElement>(
      SELECTORS.clientInvoiceRecruiterSelected,
    );
    if (recruiterSelected) {
      recruiterSelected.checked = false;
      recruiterSelected.dispatchEvent(new Event("change"));
    }
  }
};

const recruiterSections = () => {
  checkVisibility(SELECTORS.recruiterBlock, SELECTORS.clientHasRecruiter);
  checkVisibility(
    SELECTORS.invoiceRecruiterBlock,
    SELECTORS.clientHasRecruiter,
  );

  getElement<HTMLInputElement>(SELECTORS.clientHasRecruiter)?.addEventListener(
    "change",
    () => {
      checkVisibility(SELECTORS.recruiterBlock, SELECTORS.clientHasRecruiter);
      checkVisibility(
        SELECTORS.invoiceRecruiterBlock,
        SELECTORS.clientHasRecruiter,
      );
      uncheckInvoiceRecruiterSelected();
    },
  );
};

const invoiceReminderSections = () => {
  checkCanSendInvoiceReminders();
  uncheckInvoiceRecruiterSelected();

  getElement<HTMLInputElement>(
    SELECTORS.clientInvoiceClientSelected,
  )?.addEventListener("change", checkCanSendInvoiceReminders);
  getElement<HTMLInputElement>(
    SELECTORS.clientInvoiceRecruiterSelected,
  )?.addEventListener("change", checkCanSendInvoiceReminders);
};

const showPerDiemModal = () => {
  const perDiemInputElement = getElement<HTMLInputElement>(
    SELECTORS.clientPaysUntaxedPerDiems,
  );
  const perDiemModalElement = getElement<HTMLElement>(SELECTORS.perDiemModal);

  if (perDiemInputElement?.checked && !hasShownPerDiemModal) {
    perDiemModalElement!.style.display = "block";
    hasShownPerDiemModal = true;
  }
};

const gstTypeToggle = (e: Event) => {
  if (!(e.target instanceof HTMLSelectElement)) {
    return;
  }

  const selectedCurrencyCode = e.target.value;
  const localCurrencyCode = getElement<HTMLElement>(SELECTORS.data)?.dataset
    .localCurrencyCode;

  if (selectedCurrencyCode !== localCurrencyCode) {
    const clientGstType = getElement<HTMLInputElement>(SELECTORS.clientGstType);
    if (clientGstType) {
      clientGstType.checked = true;
    }
  }
};

const clientView = () => {
  recruiterSections();
  invoiceReminderSections();

  getElement<HTMLInputElement>(
    SELECTORS.clientPaysUntaxedPerDiems,
  )?.addEventListener("change", showPerDiemModal);

  // These events are emitted by jQuery
  // Until we replace the MDB selects we are stuck with this
  $(SELECTORS.clientCurrencyCode).on("change", gstTypeToggle);
};

export const addClientViewEventListeners = () => {
  document.addEventListener("turbolinks:load", clientView);
};

export default clientView;
