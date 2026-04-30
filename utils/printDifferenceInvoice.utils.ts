import moment from 'moment-timezone';
import { showErrorToastMessage } from '@/utils/toast.utils';

function escapeHtml(input: any): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatRupees(value: any): string {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0.00';
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(ts: any): string {
  if (!ts) return '—';
  const m = moment(Number(ts) || ts);
  return m.isValid() ? m.format('DD MMM YYYY') : '—';
}

export function printDifferenceInvoice(invoice: any) {
  if (!invoice) {
    showErrorToastMessage('Invoice data is not available');
    return;
  }

  const w = window.open('', '_blank', 'width=900,height=1100');
  if (!w) {
    showErrorToastMessage('Please allow popups to view the invoice');
    return;
  }

  const bookingId      = escapeHtml(invoice.bookingId ?? '');
  const transactionId  = escapeHtml(invoice.transactionId ?? '');
  const bookingDate    = formatDate(invoice.bookingDate);
  const placeName      = escapeHtml(invoice.placeDetailDto?.name ?? invoice.placeName ?? '');
  const userName       = escapeHtml(invoice.userDetailDto?.displayName ?? invoice.userDetailDto?.name ?? '');
  const userMobile     = escapeHtml(invoice.userDetailDto?.mobile ?? '');
  const userEmail      = escapeHtml(invoice.userDetailDto?.email ?? '');
  const guideName      = escapeHtml(invoice.guideList?.name ?? '');
  const vehicleNo      = escapeHtml(invoice.vendorInventoryList?.vehicleNumber ?? '');
  const amountRaw      = Number(invoice.amount ?? 0);
  const vehiclePriceRaw = Number(invoice.vehiclePrice ?? 0);
  const totalRaw       = amountRaw + (invoice.vendorInventoryList ? vehiclePriceRaw : 0);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Difference Amount Invoice — ${bookingId}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;}
body{background:#f1f1f1;padding:24px;}
.invoice{background:#fff;padding:32px;margin:0 auto;max-width:800px;border:1px solid #ddd;border-bottom:8px solid #807AED;}
.head{background:#f2f1fb;padding:20px;border-radius:28px;}
.head-row{display:flex;justify-content:space-between;}
.head-row h2{font-size:26px;color:#34383F;font-weight:600;line-height:28px;margin-bottom:10px;}
.head-row .brand{font-size:18px;font-weight:700;color:#5D9DFE;letter-spacing:.5px;}
.head-info-row{display:flex;justify-content:space-between;padding-top:6px;}
.head-info-row .left{padding:10px 10px 20px 10px;}
.label-sm{font-size:10px;color:#34383F;font-weight:600;line-height:12px;}
.label-md{font-size:12px;color:#34383F;font-weight:600;margin-bottom:6px;}
.value-sm{font-size:10px;color:#34383F;font-weight:400;line-height:12px;margin-bottom:6px;}
.value-bold{font-size:12px;color:#34383F;font-weight:600;line-height:12px;margin:5px 0 10px 0;}
.section{margin-top:14px;}
.section .title{font-size:14px;color:#34383F;font-weight:700;line-height:17px;margin-bottom:5px;}
.section .sub{font-size:10px;color:#34383F;font-weight:400;line-height:15px;}
.col-head{display:flex;justify-content:space-between;margin-top:18px;margin-bottom:16px;font-size:12px;color:#5D9DFE;font-weight:600;line-height:12px;}
.col-head .item{flex:0 0 40%;}
.col-head .qty{flex:0 0 25%;text-align:left;padding-left:10px;}
.col-head .price{flex:0 0 20%;text-align:left;padding-left:20px;}
.col-head .total{flex:0 0 15%;text-align:right;}
.row{display:flex;justify-content:space-between;margin-bottom:10px;}
.row .item{flex:0 0 40%;}
.row .item .heading{font-size:10px;color:#34383F;font-weight:600;}
.row .item .value{font-size:10px;color:#87919F;font-weight:400;line-height:15px;list-style:none;}
.row .qty{flex:0 0 25%;font-size:10px;color:#34383F;text-align:left;padding-left:10px;}
.row .price{flex:0 0 20%;font-size:10px;color:#34383F;text-align:left;padding-left:20px;}
.row .total{flex:0 0 15%;font-size:10px;color:#34383F;font-weight:600;text-align:right;}
.total-row{display:flex;justify-content:space-between;margin-top:30px;border-top:1px solid #87919F;padding-top:12px;}
.total-row .lbl{font-size:18px;color:#34383F;font-weight:600;}
.total-row .amt{font-size:18px;color:#5D9DFE;font-weight:600;}
.action-bar{display:flex;gap:10px;justify-content:center;margin-top:24px;}
.action-bar button{font-size:14px;font-weight:700;letter-spacing:.5px;padding:11px 26px;border-radius:6px;cursor:pointer;border:none;}
.btn-print{background:#1d1616;color:#fff;}
.btn-close{background:#fff;color:#323232;border:1px solid #323232;}
@media print{body{background:#fff;padding:0;}.action-bar{display:none !important;}.invoice{border:1px solid #ddd;}}
</style>
</head>
<body>
<div class="invoice">
  <div class="head">
    <div class="head-row">
      <h2>Invoice</h2>
      <div class="brand">OBMS · Rajasthan Tourism</div>
    </div>
    <div class="head-info-row">
      <div class="left">
        <p class="label-sm">Invoice To:</p>
        ${userName ? `<p class="value-bold">${userName}</p>` : ''}
        ${userMobile ? `<p class="value-sm">${userMobile}</p>` : ''}
        ${userEmail ? `<p class="value-sm">${userEmail}</p>` : ''}
      </div>
      <div>
        <h4 class="label-md">Invoice Details:</h4>
        <p class="value-sm">Booking ID: <span style="font-weight:600;margin-left:4px;">#${bookingId}</span></p>
        <p class="value-sm">Booking date: <span style="font-weight:600;margin-left:4px;">${bookingDate}</span></p>
      </div>
    </div>
  </div>

  <div class="section">
    <p class="title">Visitor's Choice Of Ticket: ${placeName}</p>
    <p class="sub">Location: ${placeName}, Rajasthan</p>
  </div>

  <div class="col-head">
    <div class="item">Item</div>
    <div class="qty">Qty</div>
    <div class="price">Price</div>
    <div class="total">Total</div>
  </div>

  <div class="row">
    <div class="item">
      <div class="heading">Difference Amount${transactionId ? ` (${transactionId})` : ''}</div>
      ${guideName ? `<div class="value">${guideName}</div>` : ''}
    </div>
    <div class="qty">1</div>
    <div class="price">₹ ${formatRupees(amountRaw)}</div>
    <div class="total">₹ ${formatRupees(amountRaw)}</div>
  </div>

  ${invoice.vendorInventoryList ? `
  <div class="row">
    <div class="item">
      <div class="heading">Choice Of Vehicle</div>
      ${vehicleNo ? `<div class="value">${vehicleNo}</div>` : ''}
    </div>
    <div class="qty">1</div>
    <div class="price">₹ ${formatRupees(vehiclePriceRaw)}</div>
    <div class="total">₹ ${formatRupees(vehiclePriceRaw)}</div>
  </div>` : ''}

  <div class="total-row">
    <div class="lbl">Total Payment</div>
    <div class="amt">₹ ${formatRupees(totalRaw)}</div>
  </div>
</div>

<div class="action-bar">
  <button class="btn-print" onclick="window.print()">🖨 Print / Save as PDF</button>
  <button class="btn-close" onclick="window.close()">Close</button>
</div>
</body>
</html>`;

  w.document.open();
  w.document.write(html);
  w.document.close();
}
