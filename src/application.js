/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb
// Support component names relative to this directory:
import ReactRailsUJS from "react_ujs";
import "jquery";

import Turbolinks from "turbolinks";

import "./es_utilities";

import "./stylesheets/application.scss";

import { Application } from "@hotwired/stimulus";
import { definitionsFromContext } from "@hotwired/stimulus-webpack-helpers";

import Dismissive from "./utilities/dismissive";
import AmplitudeAnalyticsForAdmin from "./utilities/admin/amplitude_analytics";

import {
  bindDomChangeEvents,
  bindTurboLink,
} from "./_turbo-links_event_handlers/format_currencies";
import {
  bindNoSymbolCurrencyDomChangeEvents,
  bindNoSymbolCurrencyTurboLink,
} from "./_turbo-links_event_handlers/format_currencies_no_symbol";

import { bindIncomeEstimateEvents, bindIncomeEstimateEventsDomChangeEvents } from "./_turbo-links_event_handlers/validate_income_estimate_field";
import { bindConfirmIncomeEstimateEvents, bindConfirmIncomeEstimateEventsDomChangeEvents } from "./_turbo-links_event_handlers/confirm_income_estimate";

bindDomChangeEvents();
bindTurboLink();

bindNoSymbolCurrencyDomChangeEvents();
bindNoSymbolCurrencyTurboLink();

bindIncomeEstimateEvents();
bindIncomeEstimateEventsDomChangeEvents();

bindConfirmIncomeEstimateEvents();
bindConfirmIncomeEstimateEventsDomChangeEvents();

Dismissive();

// This loads amplitude as the primary analytics provider
// Only loaded if segment is ABSENT (in admin app)
AmplitudeAnalyticsForAdmin();

const componentRequireContext = require.context("components", true);
// eslint-disable-next-line react-hooks/rules-of-hooks
ReactRailsUJS.useContext(componentRequireContext);

Turbolinks.start();

window.Stimulus = Application.start();
const context = require.context("./controllers", true, /\.js$/);
Stimulus.load(definitionsFromContext(context));
