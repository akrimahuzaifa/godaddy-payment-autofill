// inject-checkout.js
const script = document.createElement('script');
script.src = chrome.runtime.getURL('content-checkout.js');
script.onload = function () {
  this.remove(); // Clean up after injection
};
(document.head || document.documentElement).appendChild(script);
