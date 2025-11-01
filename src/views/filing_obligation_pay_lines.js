document.addEventListener("turbolinks:load", () => {
  document.querySelectorAll(".client-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      document.querySelectorAll(`.pay-line-checkbox[data-client-id="${event.target.dataset.clientId}"]`).forEach((checkbox) => {
        checkbox.checked = event.target.checked;
      });

      recalculateIncomeTotal();
    });
  });

  document.querySelectorAll(".pay-line-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const allChecked = [...document.querySelectorAll(`.pay-line-checkbox[data-client-id="${event.target.dataset.clientId}"]`)].every(
        (payLineCheckbox) => payLineCheckbox.checked,
      );

      const noneChecked = [...document.querySelectorAll(`.pay-line-checkbox[data-client-id="${event.target.dataset.clientId}"]`)].some(
        (payLineCheckbox) => !payLineCheckbox.checked,
      );

      if (allChecked) {
        document.querySelector(`#client-${event.target.dataset.clientId}`).checked = true;
      }

      if (noneChecked) {
        document.querySelector(`#client-${event.target.dataset.clientId}`).checked = false;
      }

      recalculateIncomeTotal();
    });
  });

  const recalculateIncomeTotal = () => {
    const total = [...document.querySelectorAll(".pay-line-checkbox:checked")].reduce((sum, checkbox) => sum + Number(checkbox.dataset.income), 0);
    document.querySelector("#total").innerHTML = `$${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };
});
