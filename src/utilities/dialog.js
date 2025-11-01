import disableFormSubmitUntilValid from "../es_utilities/disableFormSubmitUntilValid";

const dialogId = "#dialog";

/**
 * Reveals a modal with provided title and content.
 *
 * Usage:
 * - The title:
 *   - This is the title of the modal, ideally keep it short as it looks better when it fits on a single line.
 * - The content:
 *   - Add a div with class "modal-body" for the main content
 *   - Add a div with class "modal-footer" for the footer content
 *   - For a form in a modal you probably want to wrap both the modal-body and modal-footer in the form
 *
 * @param {Object} options - options
 * @param {string} options.title - the modal title
 * @param {string} options.content - the modal content
 * @param {boolean} options.focus - set focus to first form input
 * @param {"modal-lg" | "modal-md" | "modal-sm"} options.size - the modal width, depends a bit on device, options: modal-lg, modal-md, modal-sm
 * @param {(boolean | "reload")} options.header_close - truthy value enables the modal close X, value of "reload" will reload the page vs simply closing the modal
 * @param {string} options.virtual_page_url - records a virtual page view of this dialog
 * @param {boolean} options.centered - vertically centre the modal, for tall modals you may prefer aligned to top
 * @param {boolean} options.scrollable - lets the body of the modal be scrollable. Usually a modal-body should grow to fit the content, but for very lnog text-only modals you may choose for it to be scrollable so it's not a huge wall of text
 * @param {boolean} options.hideHeader - hide the hidder from the modal
 * @param {string} options.customiseClasses - set customise classes
 */
function showDialog({
  title,
  content,
  focus = false,
  size = "modal-md",
  header_close = false,
  virtual_page_url = window.location.pathname + title.replace(/\s/g, ""),
  centered = true,
  scrollable = false,
  hideHeader,
  customiseClasses,
}) {
  const $dialog = $(dialogId);
  $dialog
    .find(".modal-dialog")
    .removeClass("modal-lg modal-md modal-sm")
    .addClass(size);

  if (customiseClasses) {
    $dialog.find(".modal-dialog").addClass(customiseClasses);
    if (!hideHeader) {
      $dialog.find(".modal-header").addClass(`${customiseClasses}__header`);
    }
  }

  // Remove centered class if required.
  // Usually for tall modals
  if (!centered) {
    $dialog
      .find(".modal-dialog")
      .removeClass("centered");
  }

  // When a remote form in a dialog leads to another remote form in the same
  // dialog, e.g. in the tour, then for the ajax success event to fire
  // correctly the form that triggered the request must remain on the page.
  if (content) {
    $dialog.find(".modal-dialog form").addClass("hidden");
  }
  // Add the dialog title
  $dialog.find(".modal-header p.heading").html(title);
  // Add the cross
  $dialog.find(".close").remove();
  /* eslint-disable xss/no-mixed-html */
  if (header_close) {
    let $cross;
    if (header_close === "reload") {
      $cross = '<button type="button" class="close reload" aria-label="close"><span aria-hidden="true" class="white-text">&times;</span></button>';
    } else {
      $cross = `<button type="button" class="close" data-toggle="modal" data-target="${dialogId}" aria-label="close"><span aria-hidden="true" class="white-text">&times;</span></button>`;
    }

    $dialog.find(".modal-header p.heading").after($cross);
  }
  /* eslint-enable xss/no-mixed-html */
  if (hideHeader) {
    $dialog.find(".modal-header").addClass("hidden");
  } else {
    $dialog.find(".modal-header").removeClass("hidden");
  }

  // Render the edit form
  if (content) {
    // else assume it's pre-loaded
    $dialog.find(".modal-footer").remove();
    $dialog.find(".modal-body").remove();
    $dialog.find(".modal-dialog .modal-content").append(content);

    // Add hook for transitions in multi-page modals
    $dialog.trigger("next.bs.modal");
  }

  disableFormSubmitUntilValid();

  // Show the dynamic dialog
  $dialog.modal("show");

  disableFormSubmitUntilValid();

  if (focus) {
    // Set focus to the first element
    $dialog.on("shown.bs.modal", function () {
      $dialog.find("input, textarea").first().focus();
    });
  }

  // record a virtual page view of this dialog
  if (typeof (dataLayer) !== "undefined") {
    dataLayer.push({
      event: "VirtualPageview",
      virtualPageURL: virtual_page_url,
      virtualPageTitle: `Dialog: ${title}`,
    });
  }

  $('.modal-dialog [data-toggle="tooltip"]').tooltip({
    html: true,
    trigger: "focus",
  });

  // Apply the scrollable class if required
  // This should be used if you need the modal-body to be scrollable rather than
  // growing to fit the content
  if (scrollable) {
    $dialog
      .find(".modal-body")
      .addClass("scrollable");
  }

  initializeComponents();
  ReactRailsUJS.mountComponents(dialogId);

  return $dialog;
}

function dismissDialog() {
  const $dialog = $(".modal.show");
  $dialog.modal("hide");
  Materialize.updateTextFields();
}

document.addEventListener("turbolinks:load", function () {
  // If the page is rendered with content in the dialog then show it
  // Only needs to run on first page load
  if (typeof show_dialog !== "undefined") {
    $(dialogId).modal("show");
    show_dialog = undefined;
  }
});

$(document).on("turbolinks:load", function () {
  if (!document.querySelector("body").classList.contains("modal-open")) {
    unfreezePageScrolling();
  }
});

$(document).on("click", ".modal .close.reload", () => window.location.reload());

$(document).on("shown.bs.modal", function () {
  freezePageScrolling();
});

$(document).on("hidden.bs.modal", function () {
  unfreezePageScrolling();
});

function unfreezePageScrolling() {
  // eslint-disable-next-line xss/no-mixed-html
  const htmlElement = document.querySelector("html");
  if (htmlElement.classList.contains("overflow-hidden")) {
    htmlElement.classList.remove("overflow-hidden");
  }
}

function freezePageScrolling() {
  // eslint-disable-next-line xss/no-mixed-html
  const htmlElement = document.querySelector("html");
  if (!htmlElement.classList.contains("overflow-hidden")) {
    htmlElement.classList.add("overflow-hidden");
  }
}

window.showDialog = showDialog;
window.dismissDialog = dismissDialog;
