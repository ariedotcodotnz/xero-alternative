import { addClientViewEventListeners } from "./clients";
import addHomeViewEventListeners from "./home";

addClientViewEventListeners();
addHomeViewEventListeners();

require("./activity_statements");
require("./clients");
require("./expense_creation");
require("./onboardings");
require("./remediations");
require("./transaction_reconciliations");
require("./filing_result");
require("./filing_obligation");
require("./invoices");
require("./tour");
require("./jurisdiction_selection");
