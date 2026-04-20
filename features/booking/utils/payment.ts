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
) {
  console.log('redirectToPaymentGateway - action:', action);
  console.log('redirectToPaymentGateway - params:', JSON.stringify(params));

  // Match old project's openPostPage exactly
  const form = document.createElement('form');
  document.body.appendChild(form);
  form.method = 'post';
  form.action = action;

  for (const name in params) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = (params as any)[name];
    form.appendChild(input);
  }

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
export function handlePaymentRedirect(confirmResult: any) {
  if (!confirmResult) {
    console.error('Payment redirect: confirmResult is null/undefined');
    return;
  }

  console.log('Payment redirect - raw confirmResult:', JSON.stringify(confirmResult));
  console.log('Payment redirect - EMITRA URL:', CURRENT_EMITRA_ENV_URL);

  // Check at the top level first (hook already unwraps data.result)
  if (
    typeof confirmResult === 'object' &&
    !Array.isArray(confirmResult) &&
    confirmResult.ENCDATA &&
    confirmResult.MERCHANTCODE &&
    confirmResult.SERVICEID
  ) {
    console.log('Payment redirect: Found ENCDATA at top level, redirecting via form POST');
    redirectToPaymentGateway(CURRENT_EMITRA_ENV_URL, { ...confirmResult });
    return;
  }

  // Check nested .result (in case hook didn't unwrap)
  const nested = confirmResult?.result;
  if (
    nested &&
    typeof nested === 'object' &&
    nested.ENCDATA &&
    nested.MERCHANTCODE &&
    nested.SERVICEID
  ) {
    console.log('Payment redirect: Found ENCDATA in .result, redirecting via form POST');
    redirectToPaymentGateway(CURRENT_EMITRA_ENV_URL, { ...nested });
    return;
  }

  // Some APIs return a paymentUrl or url field
  const url = confirmResult?.paymentUrl ?? confirmResult?.url ?? nested?.paymentUrl ?? nested?.url;
  if (typeof url === 'string' && url.startsWith('http')) {
    console.log('Payment redirect: Found paymentUrl, opening:', url);
    window.location.href = url;
    return;
  }

  if (typeof confirmResult === 'string' && confirmResult.startsWith('http')) {
    console.log('Payment redirect: confirmResult is URL string, opening:', confirmResult);
    window.location.href = confirmResult;
    return;
  }

  console.error('Payment redirect: Could not determine payment method from:', confirmResult);
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
