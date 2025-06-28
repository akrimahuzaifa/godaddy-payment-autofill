(function () {
  /**
   * Extracts the total order amount from the WooCommerce checkout page.
   * Assumes the total is in: <tr class="order-total"><span class="woocommerce-Price-amount">...</span>
   */
  function getTotalAmount() {
    const el = document.querySelector('.order-total .woocommerce-Price-amount');
    console.log('[GoDaddy Autofill] Element found:', el.outerHTML);
    if (!el) return null;

    const text = el.textContent.trim().replace(/[^\d.]/g, ''); // Removes currency symbol
    console.log('[GoDaddy Autofill] Parsed amount:', parseFloat(text).toFixed(2));
    return parseFloat(text).toFixed(2);
  }

  /**
   * Stores the amount in Chrome's extension storage.
   */
  function storeAmount() {
    const amount = getTotalAmount();
    if (amount) {
      chrome.storage.local.set({ godaddy_amount: amount }, () => {
        console.log('[GoDaddy Autofill] Stored amount:', amount);
      });
    } else {
      console.warn('[GoDaddy Autofill] Could not find total amount.');
    }
  }

  /**
   * Set up event listeners on the checkout form to catch successful order placement.
   * Works with both classic checkout and blocks.
   */
  function init() {
    const form = document.querySelector('form.checkout');
    if (!form) return;

    form.addEventListener('checkout_place_order_success', storeAmount);
    form.addEventListener('checkout_place_order_complete', storeAmount);

    console.log('[GoDaddy Autofill] Event listeners added to WooCommerce checkout.');
    getTotalAmount(); // Initial call to store amount if already present
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
