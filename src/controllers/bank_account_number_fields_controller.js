import { Controller } from "@hotwired/stimulus";
import IMask from "imask";

class BankAccountNumberFieldsController extends Controller {
  static targets = ["bankBranchCode"];

  static values = { mask: String };

  connect() {
    this.maskBankBranchCode();
  }

  maskBankBranchCode(){
    if (!this.hasBankBranchCodeTarget) return;

    this.mask = IMask(this.bankBranchCodeTarget, {
      mask: this.maskValue,
      eager: true,
    });
  }
}

export default BankAccountNumberFieldsController;
