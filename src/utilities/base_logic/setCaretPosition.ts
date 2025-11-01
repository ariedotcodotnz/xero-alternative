const setCaretPosition = (elemId: string, caretPos: number) => {
  // eslint-disable-next-line xss/no-mixed-html
  const elem = <HTMLInputElement>document.getElementById(elemId);

  if (elem !== null) {
    if (elem.selectionStart) {
      elem.focus();
      elem.setSelectionRange(caretPos, caretPos);
    } else elem.focus();
  }
};

export default setCaretPosition;
