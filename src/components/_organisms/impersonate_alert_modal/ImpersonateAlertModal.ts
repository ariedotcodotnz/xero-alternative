const heading: string = "Impersonation session expired";
const content: string =
  "You can start a new impersonation session from the Admin App. Otherwise, please close this tab.";

class ImpersonateModal extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["open", "xData"];
  }

  xData: string = "{ open: false }";

  connectedCallback() {
    this.setAttribute("x-data", "{ open: false }");
    this.setAttribute("x-show", "open");
    this.setAttribute("x-on:open", "open = true");
    this.setAttribute("x-on:close", "open = false");
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="tw-relative tw-z-[1100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">

      <div class="tw-fixed tw-inset-0 tw-bg-gray-500/75 tw-transition-opacity" aria-hidden="true"
        x-show="open"
        x-trap.noscroll="open"
        x-transition:enter="tw-transition tw-ease-out tw-duration-300"
        x-transition:enter-start="tw-opacity-0"
        x-transition:enter-end="tw-opacity-100"
        x-transition:leave="tw-transition tw-ease-in tw-duration-300"
        x-transition:leave-start="tw-opacity-100"
        x-transition:leave-end="tw-opacity-0"></div>

        <div class="tw-fixed tw-inset-0 tw-z-10 tw-w-screen tw-overflow-y-auto" x-show="open">
          <div class="tw-flex tw-min-h-full tw-items-end tw-justify-center tw-p-4 tw-text-center sm:tw-items-center sm:tw-p-0">
            <div class="tw-relative tw-transform tw-overflow-hidden tw-rounded-lg tw-bg-white tw-px-4 tw-pt-5 tw-pb-4 tw-text-left tw-shadow-xl tw-transition-all sm:tw-my-8 sm:tw-w-full sm:tw-max-w-sm sm:tw-p-6"
              x-show="open"
              x-transition:enter="tw-transition tw-ease-out tw-duration-300"
              x-transition:enter-start="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95"
              x-transition:enter-end="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
              x-transition:leave="tw-transition tw-ease-in tw-duration-200"
              x-transition:leave-start="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
              x-transition:leave-end="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95"
         >
              <div>
                <div class="tw-mx-auto tw-flex tw-size-12 tw-items-center tw-justify-center tw-rounded-full tw-bg-red-100">
                  <svg class="tw-size-6 tw-text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"></path>
                  </svg>
                </div>
                <div class="tw-mt-3 tw-text-center sm:tw-mt-5">
                  <h3 class="tw-text-base tw-font-semibold tw-text-gray-900" id="modal-title">${heading}</h3>
                  <div class="tw-mt-2">
                    <p class="tw-text-sm tw-text-gray-500">${content}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
  }
}

customElements.define("impersonate-modal", ImpersonateModal);
