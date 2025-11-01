import { Controller } from "@hotwired/stimulus";

class TransactionStatusFilterController extends Controller {
  static targets = ["bank", "bankBsb", "bankLabel"];

  populateBankFilter(e) {
    const bankLabel = e.target.innerText;
    const bank = e.target.dataset.bank;
    const bankBsb = e.target.dataset.bankBsb || null;


    this.bankLabelTarget.innerText = bankLabel;
    this.bankTarget.value = bank;
    this.bankBsbTarget.value = bankBsb;
  }
}

export default TransactionStatusFilterController;
