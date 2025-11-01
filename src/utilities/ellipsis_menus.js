const toggleMobileActionMenu = function () {
  const tableRowWithEllipsisMenu = $(".table-row-with-ellipsis-menu");
  const width = $("body").width();
  const td = tableRowWithEllipsisMenu.find(".mobile-only");
  if (width <= 989) {
    if (td) {
      td.removeClass("hidden");
    }
  } else {
    td.addClass("hidden");
  }
};
export { toggleMobileActionMenu };
