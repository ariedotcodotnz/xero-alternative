export const toastFlashMessages = () => {
  document.querySelectorAll("#flash-messages .notice").forEach((element) => {
    // eslint-disable-next-line xss/no-mixed-html
    toastr.success(element.innerHTML);
  });

  document.querySelectorAll("#flash-messages .error").forEach((element) => {
    // eslint-disable-next-line xss/no-mixed-html
    toastr.error(element.innerHTML);
  });

  document.querySelectorAll("#flash-messages .info").forEach((element) => {
    // eslint-disable-next-line xss/no-mixed-html
    toastr.info(element.innerHTML);
  });

  document.querySelectorAll("#flash-messages .warning").forEach((element) => {
    // eslint-disable-next-line xss/no-mixed-html
    toastr.warning(element.innerHTML);
  });
};

const bindToastFlashMessages = () => {
  document.addEventListener("turbolinks:load", () => {
    toastFlashMessages();
  });
};

export default bindToastFlashMessages;
