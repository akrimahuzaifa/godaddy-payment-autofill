console.log("[GoDaddy Autofill] content-terminal.js loaded");
console.log("chrome:", chrome);


(function () {
  if (!chrome || !chrome.storage || !chrome.storage.local) {
    console.log("[GoDaddy Autofill] Chrome storage API is NOT available.");
    const godaddy_amount = 1.09; // Default amount for testing
    console.log("[GoDaddy Autofill] Using default amount:", godaddy_amount);
    const waitForInput = setInterval(() => {
      const amountInput = document.querySelector("input#vt-form-amount");
      console.log(`[GoDaddy Autofill] Current amount input value: ${amountInput ? amountInput.value : "null"} at offsetParent:`, amountInput ? amountInput.offsetParent : "null");
      if (amountInput && amountInput.offsetParent !== null) {
        console.log(`[GoDaddy Autofill] Setting amount input value from ${amountInput.value} to: ${godaddy_amount}`);
        amountInput.value = godaddy_amount;
        // Dispatch input and change events to trigger any listeners
        amountInput.dispatchEvent(new Event("input", { bubbles: true }));
        amountInput.dispatchEvent(new Event("change", { bubbles: true }));
        console.log("[GoDaddy Autofill] Amount input value set successfully.");
        clearInterval(waitForInput);
      }
    }, 500);
  } else {
    console.log("[GoDaddy Autofill] Chrome storage API is available.");
    chrome.storage.local.get(["godaddy_amount"], ({ godaddy_amount }) => {
      if (godaddy_amount === undefined) {
        console.warn("[GoDaddy Autofill] No amount found in storage. Please complete a checkout first.");
        godaddy_amount = 1.09; // Default amount for testing
        console.log("[GoDaddy Autofill] Using default amount:", godaddy_amount);
      }
      if (!godaddy_amount) return;

      const waitForInput = setInterval(() => {
        const amountInput = document.querySelector("input#vt-form-amount");
        if (amountInput && amountInput.offsetParent !== null) {
          amountInput.value = godaddy_amount;
          amountInput.dispatchEvent(new Event("input", { bubbles: true }));
          amountInput.dispatchEvent(new Event("change", { bubbles: true }));
          clearInterval(waitForInput);
        }
      }, 500);
    });
  }
})();
