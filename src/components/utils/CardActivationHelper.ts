const getCsrfToken = (): string | undefined => {
  const csrfTokenMeta = document.querySelector("meta[name='csrf-token']");
  return csrfTokenMeta?.getAttribute('content');
};

const getUrl = async (url: string) => fetch(url, {
  method: "POST",
  headers: {
    "X-CSRF-Token": getCsrfToken() || "",
    "Content-Type": "application/json",
  },
  credentials: "same-origin",
});

export const applyForCard = async () => {
  await getUrl(Routes.apply_cards_path());
};

export const activateCard = async () => {
  try {
    await applyForCard();
    window.location.reload();
  } catch (e) {
    if (toastr) {
      toastr.info(e.message);
    }
  }
};
