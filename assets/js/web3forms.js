/*
 * Create an access key at https://web3forms.com/ using
 * Peiqi.Zheng@gmail.com, then replace the placeholder below.
 * Web3Forms documents access keys as safe for client-side use.
 */
const WEB3FORMS_ACCESS_KEY = "9e2a77d8-02bf-44b1-a4d4-0dcf3dee2362";

document.querySelectorAll("form[data-web3forms]").forEach((form) => {
  const status = document.createElement("p");
  status.className = "small mt-3 mb-0";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  form.insertAdjacentElement("afterend", status);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (WEB3FORMS_ACCESS_KEY.startsWith("YOUR_")) {
      status.className = "small mt-3 mb-0 text-danger";
      status.textContent = "This form is not connected yet. Add the Web3Forms access key to assets/js/web3forms.js.";
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sendingâ€¦";
    }
    status.className = "small mt-3 mb-0 text-body-secondary";
    status.textContent = "Sending your submissionâ€¦";

    try {
      const formData = new FormData(form);
      formData.set("access_key", WEB3FORMS_ACCESS_KEY);
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "The form could not be submitted.");
      }

      status.className = "small mt-3 mb-0 text-success";
      status.textContent = "Thank you! Your submission has been sent.";
      form.reset();
    } catch (error) {
      status.className = "small mt-3 mb-0 text-danger";
      status.textContent = error.message || "We couldn't send your submission. Please try again.";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
});
