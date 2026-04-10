import { CURRENT_EMITRA_ENV_URL } from '@/utils/constants/common.constants';

/**
 * Submits a hidden HTML form via POST to the EMITRA payment gateway.
 * This replicates the openPostPage pattern used across the old project.
 *
 * @param action   - The full EMITRA gateway URL
 * @param params   - Key/value pairs to send as hidden form fields
 */
export function redirectToPaymentGateway(
  action: string,
  params: Record<string, unknown>,
  target?: string,
) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = action;
  if (target) form.target = target;

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

/**
 * Parses the confirm booking response and triggers the EMITRA redirect.
 * The confirm API returns different shapes depending on booking type:
 *   - Standard/ASI/Package: result.url + result.params  (or result.paymentUrl + result.jsonRequest)
 *   - JKK/IGPRS: may return result.paymentUrl directly
 *
 * Falls back to window.open if no POST params found.
 */
export function handlePaymentRedirect(confirmResult: any, target?: string) {
  if (!confirmResult) return;

  if (
    typeof confirmResult === 'object' &&
    !Array.isArray(confirmResult) &&
    confirmResult.ENCDATA &&
    confirmResult.MERCHANTCODE &&
    confirmResult.SERVICEID
  ) {
    redirectToPaymentGateway(CURRENT_EMITRA_ENV_URL, confirmResult as Record<string, unknown>, target);
    return;
  }

  if (typeof confirmResult === 'string' && confirmResult.startsWith('http')) {
    window.open(confirmResult, target || '_blank', 'noopener,noreferrer');
  }
}

/**
 * Calculates the total payable amount from selected tickets.
 * Sums all specificCharges[0].totalAmount × quantity.
 */
export function calculateTotal(
  selectedTickets: { ticketType: any; quantity: number }[],
): number {
  return selectedTickets.reduce((sum, { ticketType, quantity }) => {
    const charge = ticketType?.specificCharges?.[0];
    const amount = charge?.totalAmount ?? charge?.amount ?? ticketType?.amount ?? 0;
    return sum + amount * quantity;
  }, 0);
}

/**
 * Formats a rupee amount for display: ₹1,200.00
 */
export function formatRupees(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}
