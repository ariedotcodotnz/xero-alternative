const updateRate = () => {
  const input = document.getElementById("earners-rate-pretty");
  const hiddenInput = document.getElementById("decimal-rate");
  hiddenInput.value = parseFloat(input.value.replace(/[^0-9-.]/g, "")) / 100;
};

document.addEventListener("turbolinks:load", () => {
  document.querySelectorAll("#earners-rate-pretty").forEach((earnersRateInput) => {
    earnersRateInput.addEventListener("input", updateRate);
  });
});
