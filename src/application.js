// Main application entry point - wires all components together

// 1. Import Turbolinks for page navigation
import Turbolinks from "turbolinks";
Turbolinks.start();

// 2. Import and setup Stimulus controllers
import { Application } from "@hotwired/stimulus";
import { definitionsFromContext } from "@hotwired/stimulus-webpack-helpers";

const stimulusApp = Application.start();
const context = require.context("./controllers", true, /\.js$/);
stimulusApp.load(definitionsFromContext(context));

// 3. Import Alpine.js and plugins
import "./libraries";

// 4. Import all view controllers
import "./views";

// 5. Import all WebSocket channels
import "./channels";

// 6. Import utilities and global helpers
import "./utilities";

// 7. Import ES utilities (provides window.initializeFormDisabledButtons and others)
import "./es_utilities";

// 8. Initialize Datadog monitoring
import "./datadog";

// 9. Import Bootstrap JavaScript and CSS
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./stylesheets/application.scss";

// 10. Setup global Hnry object for legacy code
if (typeof window !== "undefined") {
  window.Hnry = window.Hnry || {
    Config: {
      environment: process.env.NODE_ENV || "development",
      datadog_client_token: null,
      datadog_application_id: null,
      version: "1.0.0",
    },
    User: {
      id: null,
      email: null,
      full_name: null,
      jurisdiction: "NZ",
    },
  };

  // Routes object for API endpoints (used by views)
  window.Routes = window.Routes || {
    page_loaded_event_home_index_path: () => "/home/index",
    // Add more routes as needed
  };

  console.log("✅ Application initialized successfully");
}
