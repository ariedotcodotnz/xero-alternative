window.toggleInvoicePreview = ({ title, content, previewAfterInvoiceSent }) => {
  if (previewAfterInvoiceSent == "true") {
    showDialog({ title, content, header_close: true });
  } else {
    const invoicePreviewSection = document.querySelector("#invoice-preview");
    const payslipPreviewSection = document.querySelector("#payslip-preview");
    const payslipPreviewTargetNode = document.querySelector("#payslip-target");
    // eslint-disable-next-line xss/no-mixed-html
    payslipPreviewTargetNode.innerHTML = content;

    if (invoicePreviewSection.classList.contains("hidden")) {
      invoicePreviewSection.classList.remove("hidden");
      payslipPreviewSection.classList.add("hidden");
    } else {
      invoicePreviewSection.classList.add("hidden");
      payslipPreviewSection.classList.remove("hidden");
    }
  }
};

document.addEventListener("turbolinks:load", () => {
  const actionButtons = document.querySelectorAll(".invoice-quote-more-actions-btn");
  const dropdownMenuItems = document.querySelectorAll(".hnry-icon-dropdown__menu-item");

  // remove tooltip after button is clicked
  actionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const popover = document.querySelector(".popover");
      popover && popover.remove();
    });
  });

  dropdownMenuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", () => {
      const dropdownMenu = document.querySelector(".dropdown-menu.hnry-icon-dropdown__menu");
      dropdownMenu && dropdownMenu.classList.remove("show");
    });
  });
});
