const areOptionsDifferent = (
  optionsToBeSaved,
  currentOptions
) => {
  const firstOptions = optionsToBeSaved.map(
    (optionToBeSaved) => optionToBeSaved.checked
  );
  const secondOptions = currentOptions.map(
    (currentOption) => currentOption.checked
  );
  if (
    !Array.isArray(firstOptions) ||
    !Array.isArray(secondOptions) ||
    firstOptions.length !== secondOptions.length
  ) {
    return true;
  }

  for (let i = 0; i < firstOptions.length; i++) {
    if (firstOptions[i] !== secondOptions[i]) {
      return true;
    }
  }

  return false;
};

export default areOptionsDifferent;