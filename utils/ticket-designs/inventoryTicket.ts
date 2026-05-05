import moment from 'moment-timezone';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { showErrorToastMessage } from '@/utils/toast.utils';
import { 
  toNum, 
  checkNationality, 
  maskId, 
  generateQrSvgRects, 
  computeAddonTotal, 
  computeRislTotal, 
  renderChargesDetailSummary,
  generateQrDataUrl,
  dataUrlToBytes,
  wrapLines,
  fileFromPdf,
  classifyChargeRowExtended,
  pickNum,
  ClassifiedCharges
} from './ticketUtils';

export function buildInventoryTicketHtml(ticket: any): string {
  const bookingId    = String(ticket.bookingId || ticket.id || '');
  const placeName    = ticket.placeDetailDto?.name || ticket.placeName || 'Reserve';
  const districtName = ticket.placeDetailDto?.districtName || '';
  const zoneName     = ticket.zoneName || '';
  const location     = [zoneName, districtName, 'Rajasthan', 'India'].filter(Boolean).join(' · ');

  const bookedDateShort = ticket.createdDate
    ? moment(ticket.createdDate).format('DD-MM-YYYY') + '  ·  ' + moment(ticket.createdDate).format('HH:mm:ss') + '  ·  ONLINE'
    : '—';

  const visitDate  = ticket.bookingDate ? moment(ticket.bookingDate).format('DD MMM YYYY') : '—';
  const visitDay   = ticket.bookingDate ? moment(ticket.bookingDate).format('dddd') : '';
  const shiftName  = ticket.shiftDto?.name || ticket.shiftName || '';
  const shiftStart = ticket.shiftDto?.startTime ? moment(ticket.shiftDto.startTime).format('hh:mm A') : '';
  const shiftEnd   = ticket.shiftDto?.endTime   ? moment(ticket.shiftDto.endTime).format('hh:mm A')   : '';
  const shiftSub   = shiftStart ? `${shiftStart} – ${shiftEnd}` : '';

  const vehicleType = ticket.vehicleType || ticket.vendorInventoryDetails?.vehicleType || '';
  const vehicleNum  = ticket.vendorInventoryDetails?.vehicleNumber || '';
  const quotaName   = ticket.quotaName || 'Advance';
  const totalAmount = ticket.totalAmount || 0;
  const zoneAddress = ticket.zoneAddress || '';
  const mapLink     = ticket.zoneMapLink  || '';

  const visitors: any[]  = ticket.ticketUserDto || [];
  const visitorDocs: any[] = visitors.flatMap((t: any) => (Array.isArray(t?.ticketUserDocs) ? t.ticketUserDocs : []));
  const totalVisitors = (visitorDocs.length || visitors.reduce((s, t) => s + (Number(t.qty) || 0), 0)) || 0;

  let srCounter = 0;
  const visitorRows = visitors.flatMap((t: any) => {
    const docs: any[] = t.ticketUserDocs || [];
    if (docs.length === 0) {
      srCounter++;
      const addonsText = (t.addonItems || []).filter((a: any) => a?.name).map((a: any) => a.name).join(', ') || '— None —';
      return [`<div class="visitor-row-data">
        <div class="vr-num">${srCounter}</div>
        <div class="vr-name">—</div>
        <div class="vr-id">—</div>
        <div class="vr-nat">${checkNationality(t.nationality)}</div>
        <div class="vr-addon">${addonsText}</div>
      </div>`];
    }
    return docs.map((doc: any) => {
      srCounter++;
      const name   = doc.name || doc.fullName || doc.visitorName || t.ticketName || '—';
      const idType = doc.identityType || doc.docType || '';
      const idNo   = maskId(doc.identityNo || doc.documentNo || doc.identity || '');
      const nat    = checkNationality(doc.nationality || t.nationality);
      const addons = (t.addonItems || []).filter((a: any) => a?.name).map((a: any) => a.name).join(', ') || '— None —';
      return `<div class="visitor-row-data">
        <div class="vr-num">${srCounter}</div>
        <div class="vr-name">${name}</div>
        <div class="vr-id">${idType ? `${idType} / ${idNo}` : idNo || '—'}</div>
        <div class="vr-nat">${nat}</div>
        <div class="vr-addon">${addons}</div>
      </div>`;
    });
  }).join('');

  const addonTotal = computeAddonTotal(ticket);
  const rislTotal  = computeRislTotal(ticket);

  const qrValue = ticket.qrDetail || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: ticket.id || ticket.bookingId } });
  const { rects: qrRects, count: qrCount } = generateQrSvgRects(qrValue, 96);
  const shiftIcon = (shiftName || '').toLowerCase().includes('morning') ? '🌅'
    : (shiftName || '').toLowerCase().includes('afternoon') ? '🌇'
    : (shiftName || '').toLowerCase().includes('evening')   ? '🌆' : '🌿';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Ticket #${bookingId} — ${placeName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Rajdhani:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#1a0e06;background-image:radial-gradient(ellipse at 20% 20%,rgba(180,60,10,.15) 0%,transparent 60%),radial-gradient(ellipse at 80% 80%,rgba(120,30,5,.1) 0%,transparent 60%);font-family:'Rajdhani',sans-serif;padding:36px 20px;min-height:100vh;}
.ticket-wrap{max-width:680px;margin:0 auto;}
.ticket{background:#F7EDD8;border-radius:6px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.7),0 0 0 1px rgba(184,74,14,.25),inset 0 1px 0 rgba(255,255,255,.6);}
.t-top{background:linear-gradient(140deg,#6B2309 0%,#A63A08 40%,#C9580F 70%,#D4691A 100%);padding:28px 36px 44px;position:relative;overflow:hidden;}
.t-top::before{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.045'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");}
.t-top::after{content:'';position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);width:115%;height:36px;background:#F7EDD8;border-radius:60% 60% 0 0;}
.t-header-row{display:flex;justify-content:space-between;align-items:flex-start;position:relative;z-index:2;gap:16px;}
.t-header-left{display:flex;flex-direction:column;gap:0;flex:1;min-width:0;}
.t-gov{display:flex;align-items:center;gap:14px;margin-bottom:16px;}
.t-emblem{width:50px;height:50px;background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 2px 12px rgba(0,0,0,.2);flex-shrink:0;}
.t-gov-text .g1{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:2px;}
.t-gov-text .g2{font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:700;color:#fff;letter-spacing:.5px;line-height:1.1;}
.t-gov-text .g3{font-size:9px;letter-spacing:1.5px;color:rgba(255,255,255,.4);margin-top:2px;}
.t-title-block{position:relative;z-index:2;}
.t-title-block h1{font-family:'Cinzel',serif;font-size:24px;font-weight:700;color:#fff;letter-spacing:1.5px;line-height:1.2;text-shadow:0 2px 12px rgba(0,0,0,.25);margin-bottom:6px;}
.t-title-block .t-loc{font-size:11px;color:rgba(255,255,255,.68);letter-spacing:2px;text-transform:uppercase;}
.t-qr-wrap{background:#fff;border-radius:7px;padding:2px;box-shadow:0 6px 20px rgba(0,0,0,.35);position:relative;z-index:2;flex-shrink:0;align-self:flex-start;margin-left:auto;width:120px;height:120px;display:flex;align-items:center;justify-content:center;}
.t-qr-wrap svg{display:block;width:100%;height:100%;}
.t-body{padding:26px 36px;}
.sec-head{font-family:'Cinzel',serif;font-size:10px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:#9B4A1A;border-bottom:1px solid rgba(155,74,26,.2);padding-bottom:6px;margin-bottom:14px;display:flex;align-items:center;gap:8px;}
.sec-head::before{content:'';display:block;width:16px;height:2px;background:#B84A0E;border-radius:1px;}
.meta-row{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px;}
.meta-cell{text-align:center;padding:13px 8px;border:1px solid rgba(184,74,14,.2);border-radius:5px;background:rgba(184,74,14,.04);}
.meta-cell .mc-icon{font-size:20px;margin-bottom:6px;display:block;}
.meta-cell .mc-lbl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B5520;margin-bottom:3px;}
.meta-cell .mc-val{font-family:'Cinzel',serif;font-size:14px;font-weight:600;color:#2D1400;line-height:1.1;}
.meta-cell .mc-sub{font-size:10px;color:#9B5520;margin-top:1px;}
.booking-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:22px;}
.booking-cell{padding:10px 14px;border:1px solid rgba(184,74,14,.18);border-radius:4px;background:rgba(184,74,14,.03);}
.booking-cell .bl{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B5520;margin-bottom:3px;}
.booking-cell .bv{font-family:'Space Mono',monospace;font-size:12px;color:#2D1400;line-height:1.3;}
.location-table{width:100%;border-collapse:collapse;margin-bottom:22px;border:1px solid rgba(184,74,14,.22);overflow:hidden;}
.location-table tr{border-bottom:1px solid rgba(184,74,14,.15);}
.location-table tr:last-child{border-bottom:none;}
.location-table td{padding:10px 14px;font-size:13px;vertical-align:middle;}
.location-table td.loc-label{font-family:'Cinzel',serif;font-size:12px;font-weight:700;color:#2D1400;letter-spacing:.5px;width:200px;background:rgba(184,74,14,.05);border-right:1px solid rgba(184,74,14,.15);}
.location-table td.loc-value{font-family:'Rajdhani',sans-serif;font-size:13.5px;font-weight:500;color:#3D1F00;}
.location-table td.loc-value a{color:#B84A0E;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:5px;}
.visitor-block{border:1.5px solid rgba(184,74,14,.25);border-radius:5px;overflow:hidden;margin-bottom:22px;}
.visitor-header{background:rgba(184,74,14,.08);padding:7px 16px;display:grid;grid-template-columns:40px 1fr 1fr 1fr 1fr;gap:8px;align-items:center;border-bottom:1px solid rgba(184,74,14,.15);}
.visitor-header span{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B5520;}
.visitor-row-data{padding:11px 16px;display:grid;grid-template-columns:40px 1fr 1fr 1fr 1fr;gap:8px;align-items:center;border-bottom:1px solid rgba(184,74,14,.06);}
.visitor-row-data:last-child{border-bottom:none;}
.visitor-row-data .vr-num{font-family:'Space Mono',monospace;font-size:12px;color:#B84A0E;font-weight:700;}
.visitor-row-data .vr-name{font-family:'Cinzel',serif;font-size:13px;color:#2D1400;font-weight:600;}
.visitor-row-data .vr-id{font-family:'Space Mono',monospace;font-size:11px;color:#6B3A1F;}
.visitor-row-data .vr-nat{font-size:12px;color:#6B3A1F;font-weight:600;}
.visitor-row-data .vr-addon{font-size:11px;color:#aaa;font-style:italic;}

.t-divider{border:none;border-top:1px dashed rgba(184,74,14,.28);margin:4px -8px 22px;position:relative;}
.t-divider::before,.t-divider::after{content:'';position:absolute;top:-10px;width:19px;height:19px;background:#1a0e06;border-radius:50%;}
.t-divider::before{left:-28px;}.t-divider::after{right:-28px;}
.terms-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px 20px;margin-bottom:22px;}
.term-item{display:flex;gap:8px;align-items:flex-start;font-size:11.5px;color:#5A2D10;line-height:1.55;}
.term-item .tick{color:#B84A0E;font-weight:700;flex-shrink:0;margin-top:1px;}
.note-box{background:rgba(184,74,14,.06);border:1px solid rgba(184,74,14,.2);border-left:3px solid #B84A0E;border-radius:3px;padding:10px 14px;margin-bottom:22px;font-size:11.5px;color:#5A2D10;line-height:1.6;}
.note-box strong{color:#B84A0E;}
.refund-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:22px;}
.refund-cell{text-align:center;padding:10px 8px;border:1px solid rgba(184,74,14,.18);border-radius:4px;background:rgba(184,74,14,.03);}
.refund-cell .rf-pct{font-family:'Cinzel',serif;font-size:22px;font-weight:700;color:#B84A0E;line-height:1;margin-bottom:4px;}
.refund-cell .rf-lbl{font-size:10px;letter-spacing:1px;color:#9B5520;text-transform:uppercase;margin-bottom:2px;}
.refund-cell .rf-cond{font-family:'Space Mono',monospace;font-size:9px;color:#6B3A1F;line-height:1.4;}
.t-footer{background:#2D1400;border-top:1px solid rgba(255,255,255,.05);padding:16px 36px;display:flex;justify-content:space-between;align-items:center;}
.t-footer .fc{font-size:11px;color:rgba(255,255,255,.45);line-height:1.9;}
.t-footer .fb .bname{font-family:'Cinzel',serif;font-size:13px;color:#D4A017;letter-spacing:1.5px;text-align:right;}
.t-footer .fb .bsub{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,.25);text-align:right;margin-top:2px;}
.action-bar{display:flex;gap:10px;justify-content:center;margin-top:22px;}
.btn-print{background:linear-gradient(135deg,#6B2309,#B84A0E);color:#fff;font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;border-radius:4px;padding:13px 36px;cursor:pointer;box-shadow:0 4px 16px rgba(184,74,14,.4);transition:opacity .15s;}
.btn-print:hover{opacity:.88;}
.btn-close{background:transparent;color:rgba(255,255,255,.45);font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:600;letter-spacing:1px;border:1px solid rgba(255,255,255,.15);border-radius:4px;padding:13px 24px;cursor:pointer;}
@media print{body{background:#fff;padding:0;display:block;}.action-bar{display:none!important;}.ticket{box-shadow:none;border-radius:0;}.ticket-wrap{max-width:100%;}.t-top,.t-footer{-webkit-print-color-adjust:exact;print-color-adjust:exact;}.t-divider::before,.t-divider::after{background:#fff;}}
</style>
</head>
<body>
<div class="ticket-wrap">
<div class="ticket">
  <div class="t-top">
    <div class="t-header-row">
      <div class="t-header-left">
        <div class="t-gov">
          <div class="t-emblem">🏛</div>
          <div class="t-gov-text">
            <div class="g1">Government of Rajasthan</div>
            <div class="g2">Online Booking Management System</div>
            <div class="g3">obms-tourist.rajasthan.gov.in</div>
          </div>
        </div>
        <div class="t-title-block">
          <h1>${placeName}</h1>
          ${location ? `<div class="t-loc">📍 ${location}</div>` : ''}
        </div>
      </div>
      <div class="t-qr-wrap">
        <svg viewBox="0 0 ${qrCount} ${qrCount}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" shape-rendering="crispEdges">${qrRects}</svg>
      </div>
    </div>
  </div>
  <div class="t-body">
    <div class="sec-head">Booking Details</div>
    <div class="booking-row">
      <div class="booking-cell"><div class="bl">Booking ID</div><div class="bv">${bookingId}</div></div>
      <div class="booking-cell"><div class="bl">Booking Date &amp; Time</div><div class="bv">${bookedDateShort}</div></div>
      <div class="booking-cell"><div class="bl">Mode of Booking</div><div class="bv">ONLINE</div></div>
      ${zoneName  ? `<div class="booking-cell"><div class="bl">Route / Zone</div><div class="bv">${zoneName}</div></div>`  : ''}
      ${quotaName ? `<div class="booking-cell"><div class="bl">Quota Name</div><div class="bv">${quotaName}</div></div>` : ''}
      <div class="booking-cell"><div class="bl">Ticket Amount</div><div class="bv">₹ ${toNum(totalAmount).toFixed(2)}</div></div>
    </div>
    ${(zoneAddress || mapLink) ? `
    <table class="location-table">
      ${zoneAddress ? `<tr><td class="loc-label">Address</td><td class="loc-value">${zoneAddress}</td></tr>` : ''}
      ${mapLink     ? `<tr><td class="loc-label">Boarding Point Location</td><td class="loc-value"><a href="${mapLink}" target="_blank"><span>📍</span> Click here to view on map</a></td></tr>` : ''}
    </table>` : ''}
    <div class="sec-head">Visit Details</div>
    <div class="meta-row">
      <div class="meta-cell"><span class="mc-icon">📅</span><div class="mc-lbl">Visit Date</div><div class="mc-val">${visitDate}</div><div class="mc-sub">${visitDay}</div></div>
      <div class="meta-cell"><span class="mc-icon">${shiftIcon}</span><div class="mc-lbl">Shift</div><div class="mc-val">${shiftName || 'Full Day'}</div><div class="mc-sub">${shiftSub}</div></div>
      ${vehicleType ? `<div class="meta-cell"><span class="mc-icon">🚌</span><div class="mc-lbl">Vehicle</div><div class="mc-val">${vehicleType}</div><div class="mc-sub">${vehicleNum || quotaName}</div></div>` : ''}
      <div class="meta-cell"><span class="mc-icon">👥</span><div class="mc-lbl">Total Visitors</div><div class="mc-val">${totalVisitors}</div></div>
    </div>
    <div class="sec-head">Visitor Information</div>
    <div class="visitor-block">
      <div class="visitor-header"><span>Sr.</span><span>Visitor Name</span><span>Identity Type / No.</span><span>Nationality</span><span>Add Ons</span></div>
      ${visitorRows || `<div class="visitor-row-data"><div class="vr-num">—</div><div class="vr-name">—</div><div class="vr-id">—</div><div class="vr-nat">—</div><div class="vr-addon">—</div></div>`}
    </div>
    ${renderChargesDetailSummary(ticket, addonTotal, rislTotal, totalAmount)}
    <hr class="t-divider"/>
    <div class="sec-head">Terms &amp; Conditions for Visitors</div>
    <div class="terms-grid">
      <div class="term-item"><span class="tick">✓</span><span>The visitor must reach the Forest permit counter to collect the boarding pass at least <strong>45 minutes prior</strong> to entry time.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>First visitor whose photo ID was uploaded is <strong>mandatory to visit</strong> so that ID can be verified at the gate.</span></div>
      <div class="term-item"><span class="tick">✓</span><span><strong>Mobile phone use</strong> within the tourism zone of the core habitat is <strong>not permitted</strong>.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>ID proof at boarding pass collection must match booking ID; otherwise the permit will be deemed <strong>fake and liable to be cancelled</strong>.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>Carry <strong>original ID / DigiLocker ID</strong> during visit — must be the same ID used at the time of booking.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>The visitor must bring <strong>two printed copies</strong> of this slip at the time of collecting the boarding pass.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>Seats <strong>vacant due to non-turn up</strong> may be filled by park management at the booking window.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>Boarding pass collection begins <strong>two hours before</strong> the park entry time.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>Maximum <strong>6 seats per transaction</strong> to avoid fake bookings.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>For <strong>group bookings</strong>, park authorities will try to accommodate the group subject to space availability.</span></div>
      <div class="term-item"><span class="tick">✓</span><span><strong>Visitors under the influence</strong> of alcohol or intoxicating substances will be denied entry.</span></div>
      <div class="term-item"><span class="tick">✓</span><span>If passenger count is less than vehicle capacity, <strong>difference in vehicle rent &amp; guide fee</strong> will be charged extra.</span></div>
    </div>
    <div class="note-box">
      <strong>⚠ Indemnity Bond:</strong> By booking this permit the visitor acknowledges risks of visiting this reserve, enters at own risk and accepts full liability. The protected area management shall not be responsible in any manner. Any litigation shall be in a court of law in Rajasthan.<br/><br/>
      <strong>Please Note:</strong> We will not be responsible for costs arising out of unforeseen circumstances like landslides, road blocks, or bad weather.
    </div>
    <div class="sec-head">Cancellation &amp; Refund Policy</div>
    <div class="refund-row">
      <div class="refund-cell"><div class="rf-pct">75%</div><div class="rf-lbl">Refund</div><div class="rf-cond">If cancelled<br/>31+ days before<br/>visit date</div></div>
      <div class="refund-cell"><div class="rf-pct">50%</div><div class="rf-lbl">Refund</div><div class="rf-cond">If cancelled<br/>4–30 days before<br/>visit date</div></div>
      <div class="refund-cell"><div class="rf-pct">0%</div><div class="rf-lbl">Refund</div><div class="rf-cond">If cancelled<br/>within 3 days of<br/>visit date</div></div>
    </div>
  </div>
  <div class="t-footer">
    <div class="fc">📞 &nbsp;0141-282-0384<br/>✉ &nbsp;helpdesk[dot]tourist[at]rajasthan[dot]gov[dot]in<br/>🌐 &nbsp;obms-tourist.rajasthan.gov.in</div>
    <div class="fb"><div class="bname">OBMS</div><div class="bsub">Rajasthan Tourism</div></div>
  </div>
</div>
</div>
<div class="action-bar">
  <button class="btn-print" onclick="window.print()">🖨 &nbsp;Print / Save as PDF</button>
  <button class="btn-close" onclick="window.close()">✕ Close</button>
</div>
<script>document.fonts.ready.then(() => setTimeout(() => window.print(), 600));</script>
</body>
</html>`;
}

export function openInventoryTicket(ticket: any) {
  const w = window.open('', '_blank', 'width=860,height=1000');
  if (!w) {
    showErrorToastMessage('Please allow popups to print / download the ticket');
    return;
  }
  w.document.write(buildInventoryTicketHtml(ticket));
  w.document.close();
}

// ════════════════════════════════════════════════════════════════════════════
//  INVENTORY share PDF (Sariska-style: brown / cream / orange palette)
// ════════════════════════════════════════════════════════════════════════════

export async function buildInventoryShareFile(ticket: any): Promise<File> {
  const bookingId  = String(ticket.bookingId || ticket.id || '');
  const placeName  = (ticket.placeDetailDto?.name || ticket.placeName || 'Booking') as string;
  const district   = ticket.placeDetailDto?.districtName || '';
  const visitDate  = ticket.bookingDate ? moment(ticket.bookingDate).format('DD MMM YYYY') : '—';
  const visitDay   = ticket.bookingDate ? moment(ticket.bookingDate).format('dddd') : '';
  const bookedDateShort = ticket.createdDate
    ? `${moment(ticket.createdDate).format('DD-MM-YYYY')}  ${moment(ticket.createdDate).format('HH:mm:ss')}  ONLINE`
    : '—';
  const totalAmt   = toNum(ticket.totalAmount).toFixed(2);
  const zoneName   = ticket.zoneName || '';
  const zoneAddr   = ticket.zoneAddress || '';
  const quotaName  = ticket.quotaName || 'Advance';
  const shiftName  = ticket.shiftDto?.name || ticket.shiftName || '';
  const shiftStart = ticket.shiftDto?.startTime ? moment(ticket.shiftDto.startTime).format('hh:mm A') : '';
  const shiftEnd   = ticket.shiftDto?.endTime   ? moment(ticket.shiftDto.endTime).format('hh:mm A')   : '';
  const shiftSub   = shiftStart ? `${shiftStart} - ${shiftEnd}` : '';
  const vehicleType = ticket.vehicleType || ticket.vendorInventoryDetails?.vehicleType || '';
  const vehicleNo  = ticket.vendorInventoryDetails?.vehicleNumber || '';
  const visitors: any[] = Array.isArray(ticket.ticketUserDto) ? ticket.ticketUserDto : [];
  const visitorDocs: any[] = visitors.flatMap((t) => Array.isArray(t?.ticketUserDocs) ? t.ticketUserDocs : []);
  const totalVisitors = visitorDocs.length || visitors.reduce((s, t) => s + (Number(t.qty) || 0), 0);
  
  const charges: any[] = ticket.ticketCharges || ticket.chargeDetails || ticket.charges || [];
  const invShared: any[] = Array.isArray(ticket?.inventory?.ticketTypeConfigList) ? ticket.inventory.ticketTypeConfigList : [];
  
  const visitorSummaryRows: Array<{ name: string; qty: number; sums: ClassifiedCharges }> = [];
  if (visitors.length > 0) {
    const groups = new Map<string, { qty: number; sums: ClassifiedCharges }>();
    for (const v of visitors) {
      const name = String(v.ticketName || 'Visitor');
      const qty = toNum(v.qty) || 1;
      const cfgList = Array.isArray(v?.ticketTypeConfigValue?.ticketTypeConfigList)
        ? v.ticketTypeConfigValue.ticketTypeConfigList
        : Array.isArray(v?.fixCharges) ? v.fixCharges : [];
      const allLines = [...cfgList, ...invShared];
      const s: ClassifiedCharges = {
        entryFeeVisitor: 0, entryFeeVehicle: 0, ecoDevVisitor: 0, ecoDevVehicle: 0,
        tigerReserveFund: 0, vehicleRent: 0, vehicleGst: 0, guideFee: 0, guideGst: 0
      };
      for (const line of allLines) {
        const p = classifyChargeRowExtended(line);
        s.entryFeeVisitor += p.entryFeeVisitor;
        s.entryFeeVehicle += p.entryFeeVehicle;
        s.ecoDevVisitor += p.ecoDevVisitor;
        s.ecoDevVehicle += p.ecoDevVehicle;
        s.tigerReserveFund += (pickNum(line, 'tigerReserveFund', 'tigerFund', 'trdf') || p.tigerReserveFund);
        s.vehicleRent += p.vehicleRent;
        s.vehicleGst += p.vehicleGst;
        s.guideFee += p.guideFee;
        s.guideGst += p.guideGst;
      }
      if (!groups.has(name)) groups.set(name, { qty: 0, sums: s });
      groups.get(name)!.qty += qty;
    }
    groups.forEach((data, name) => visitorSummaryRows.push({ name, ...data }));
  }

  const totalRow = visitorSummaryRows.length > 0
    ? visitorSummaryRows.reduce((acc, row) => {
        acc.entryFeeVisitor += row.sums.entryFeeVisitor * row.qty;
        acc.entryFeeVehicle += row.sums.entryFeeVehicle * row.qty;
        acc.ecoDevVisitor += row.sums.ecoDevVisitor * row.qty;
        acc.ecoDevVehicle += row.sums.ecoDevVehicle * row.qty;
        acc.tigerReserveFund += row.sums.tigerReserveFund * row.qty;
        acc.vehicleRent += row.sums.vehicleRent * row.qty;
        acc.vehicleGst += row.sums.vehicleGst * row.qty;
        acc.guideFee += row.sums.guideFee * row.qty;
        acc.guideGst += row.sums.guideGst * row.qty;
        return acc;
      }, { entryFeeVisitor: 0, entryFeeVehicle: 0, ecoDevVisitor: 0, ecoDevVehicle: 0, tigerReserveFund: 0, vehicleRent: 0, vehicleGst: 0, guideFee: 0, guideGst: 0 })
    : charges.reduce((acc: any, c: any) => {
        const p = classifyChargeRowExtended(c);
        acc.entryFeeVisitor += p.entryFeeVisitor;
        acc.entryFeeVehicle += p.entryFeeVehicle;
        acc.ecoDevVisitor += p.ecoDevVisitor;
        acc.ecoDevVehicle += p.ecoDevVehicle;
        acc.tigerReserveFund += (pickNum(c, 'tigerReserveFund', 'tigerFund', 'trdf') || p.tigerReserveFund);
        acc.vehicleRent += p.vehicleRent;
        acc.vehicleGst += p.vehicleGst;
        acc.guideFee += p.guideFee;
        acc.guideGst += p.guideGst;
        return acc;
      }, { entryFeeVisitor: 0, entryFeeVehicle: 0, ecoDevVisitor: 0, ecoDevVehicle: 0, tigerReserveFund: 0, vehicleRent: 0, vehicleGst: 0, guideFee: 0, guideGst: 0 });

  const addonTotal = computeAddonTotal(ticket);
  const rislTotal  = computeRislTotal(ticket);
  const rpacsTotal = toNum(ticket.rpacsCharges ?? ticket.rpacs ?? ticket.surcharge ?? ticket.surCharge ?? ticket.surchargeCharges);

  const qrValue = ticket.qrDetail
    || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: ticket.id || ticket.bookingId } });

  const pdfDoc = await PDFDocument.create();
  const fSans  = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fSansB = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fSerif = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fMono  = await pdfDoc.embedFont(StandardFonts.Courier);
  const fMonoB = await pdfDoc.embedFont(StandardFonts.CourierBold);

  const PW = 595.28, PH = 841.89, M = 28;
  const orange     = rgb(0.722, 0.290, 0.055);
  const orangeDark = rgb(0.420, 0.137, 0.035);
  const dark       = rgb(0.176, 0.078, 0.000);
  const muted      = rgb(0.608, 0.333, 0.125);
  const cream      = rgb(0.969, 0.929, 0.847);
  const cellBg     = rgb(0.965, 0.918, 0.836);
  const headerBg   = rgb(0.965, 0.890, 0.804);
  const ruleSoft   = rgb(0.85, 0.70, 0.50);
  const white      = rgb(1, 1, 1);

  let page = pdfDoc.addPage([PW, PH]);
  page.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: cream });

  function newPage(): number {
    page = pdfDoc.addPage([PW, PH]);
    page.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: cream });
    return PH - 36;
  }

  const truncate = (s: string, max: number) => s.length > max ? s.slice(0, Math.max(0, max - 1)) + '…' : s;
  const drawText = (text: string, x: number, y: number, opts: any) => page.drawText(text, { x, y, ...opts });

  // Header
  page.drawRectangle({ x: 0, y: PH - 88,  width: PW, height: 88, color: orangeDark });
  page.drawRectangle({ x: 0, y: PH - 160, width: PW, height: 72, color: orange });
  drawText('GOVERNMENT OF RAJASTHAN', M + 50, PH - 28, { size: 8, font: fSansB, color: rgb(1, 1, 1) });
  drawText('Online Booking Management System', M + 50, PH - 44, { size: 12, font: fSansB, color: white });
  drawText('obms-tourist.rajasthan.gov.in', M + 50, PH - 58, { size: 8, font: fSans, color: rgb(0.85, 0.78, 0.70) });
  page.drawCircle({ x: M + 25, y: PH - 44, size: 19, color: rgb(0.30, 0.10, 0.03), borderColor: rgb(1,1,1), borderWidth: 1 });
  drawText('III', M + 18, PH - 50, { size: 12, font: fSerif, color: white });
  drawText(truncate(placeName, 40), M, PH - 110, { size: 22, font: fSerif, color: white });
  const locParts = [zoneName, district, 'Rajasthan', 'India'].filter(Boolean).join(' . ');
  if (locParts) drawText(truncate(locParts.toUpperCase(), 70), M, PH - 130, { size: 9, font: fSans, color: rgb(0.95, 0.88, 0.82) });

  const qrDataUrl = generateQrDataUrl(qrValue);
  if (qrDataUrl) {
    try {
      const qrImg = await pdfDoc.embedPng(dataUrlToBytes(qrDataUrl));
      page.drawRectangle({ x: PW - 96, y: PH - 92, width: 76, height: 76, color: white });
      page.drawImage(qrImg, { x: PW - 92, y: PH - 88, width: 68, height: 68 });
    } catch {}
  }

  let y = PH - 188;

  const sectionHead = (label: string) => {
    page.drawRectangle({ x: M, y: y - 2, width: 14, height: 2, color: orange });
    drawText(label.toUpperCase(), M + 22, y - 6, { size: 9, font: fSerif, color: muted });
    page.drawLine({ start: { x: M, y: y - 12 }, end: { x: PW - M, y: y - 12 }, thickness: 0.5, color: ruleSoft });
    y -= 24;
  };

  // Booking Details
  sectionHead('Booking Details');
  const bookingCells: Array<[string, string]> = [
    ['Booking ID', bookingId],
    ['Booking Date & Time', bookedDateShort],
    ['Mode of Booking', 'ONLINE'],
  ];
  if (zoneName)  bookingCells.push(['Route / Zone', zoneName]);
  if (quotaName) bookingCells.push(['Quota Name', quotaName]);
  bookingCells.push(['Ticket Amount', `Rs. ${totalAmt}`]);
  {
    const cellW = (PW - M * 2 - 12) / 3;
    const cellH = 38;
    for (let i = 0; i < bookingCells.length; i++) {
      const [lbl, val] = bookingCells[i];
      const gx = M + (i % 3) * (cellW + 6);
      const gy = y - Math.floor(i / 3) * (cellH + 6);
      page.drawRectangle({ x: gx, y: gy - cellH, width: cellW, height: cellH, color: cellBg, borderColor: rgb(0.90, 0.62, 0.30), borderWidth: 0.4 });
      drawText(lbl.toUpperCase(), gx + 8, gy - 12, { size: 7, font: fSansB, color: muted });
      const maxChars = Math.floor((cellW - 16) / 5.4);
      drawText(truncate(val, maxChars), gx + 8, gy - 28, { size: 9.5, font: fMonoB, color: dark });
    }
    y -= Math.ceil(bookingCells.length / 3) * (cellH + 6) + 4;
  }

  // Address
  if (zoneAddr) {
    const labelW = 110;
    const lines = wrapLines(zoneAddr, 78).slice(0, 2);
    const rowH = Math.max(38, lines.length * 12 + 18);
    page.drawRectangle({ x: M, y: y - rowH, width: labelW, height: rowH, color: cellBg, borderColor: rgb(0.90, 0.62, 0.30), borderWidth: 0.4 });
    page.drawRectangle({ x: M + labelW, y: y - rowH, width: PW - M * 2 - labelW, height: rowH, color: white, borderColor: rgb(0.90, 0.62, 0.30), borderWidth: 0.4 });
    drawText('ADDRESS', M + 12, y - rowH / 2 + 3, { size: 9, font: fSerif, color: dark });
    let ay = y - 16;
    for (const line of lines) { drawText(line, M + labelW + 10, ay, { size: 9.5, font: fSans, color: dark }); ay -= 12; }
    y -= rowH + 8;
  }

  // Visit Details
  sectionHead('Visit Details');
  {
    const meta: Array<[string, string, string]> = [
      ['Visit Date', visitDate.toUpperCase(), visitDay],
      ['Shift', shiftName || 'Full Day', shiftSub],
    ];
    if (vehicleType) meta.push(['Vehicle', vehicleType, vehicleNo || quotaName]);
    meta.push(['Total Visitors', String(totalVisitors || ticket.totalUsers || 0), '']);
    const cellW = (PW - M * 2 - (meta.length - 1) * 6) / meta.length;
    const cellH = 60;
    for (let i = 0; i < meta.length; i++) {
      const [lbl, val, sub] = meta[i];
      const cx = M + i * (cellW + 6);
      page.drawRectangle({ x: cx, y: y - cellH, width: cellW, height: cellH, color: cellBg, borderColor: rgb(0.90, 0.62, 0.30), borderWidth: 0.4 });
      drawText(lbl.toUpperCase(), cx + cellW / 2 - (lbl.length * 2.2), y - 18, { size: 7, font: fSansB, color: muted });
      const valTrim = truncate(val, Math.floor((cellW - 8) / 6.5));
      drawText(valTrim, cx + cellW / 2 - (valTrim.length * 3.4), y - 36, { size: 11, font: fSerif, color: dark });
      if (sub) {
        const subTrim = truncate(sub, Math.floor((cellW - 8) / 5.0));
        drawText(subTrim, cx + cellW / 2 - (subTrim.length * 2.6), y - 50, { size: 8, font: fSans, color: muted });
      }
    }
    y -= cellH + 14;
  }

  // Visitor table
  if (y < 240) y = newPage();
  sectionHead('Visitor Information');
  {
    const cols = [
      { lbl: 'Sr.', w: 28 },
      { lbl: 'Visitor Name', w: 110 },
      { lbl: 'Identity Type / No.', w: 145 },
      { lbl: 'Nationality', w: 70 },
      { lbl: 'Add Ons', w: PW - M * 2 - (28 + 110 + 145 + 70) },
    ];
    const headerH = 18;
    const drawTblHeader = () => {
      page.drawRectangle({ x: M, y: y - headerH, width: PW - M * 2, height: headerH, color: headerBg, borderColor: rgb(0.90, 0.62, 0.30), borderWidth: 0.4 });
      let cx = M + 6;
      for (const c of cols) { drawText(c.lbl.toUpperCase(), cx, y - 12, { size: 7, font: fSansB, color: muted }); cx += c.w; }
      y -= headerH;
    };
    drawTblHeader();

    const rows: string[][] = [];
    let sr = 0;
    if (visitors.length === 0) rows.push(['—', '—', '—', '—', '—']);
    else for (const v of visitors) {
      const docs: any[] = Array.isArray(v.ticketUserDocs) ? v.ticketUserDocs : [];
      const addons = (v.addonItems || []).filter((a: any) => a?.name).map((a: any) => a.name).join(', ') || '— None —';
      if (docs.length === 0) { sr++; rows.push([String(sr), v.ticketName || 'Visitor', '—', checkNationality(v.nationality), addons]); }
      else for (const d of docs) {
        sr++;
        const idType = d.identityType || d.docType || '';
        const idNo = maskId(d.identityNo || d.documentNo || d.identity || '');
        rows.push([String(sr), d.name || d.fullName || d.visitorName || v.ticketName || '—', idType ? `${idType} / ${idNo}` : (idNo || '—'), checkNationality(d.nationality || v.nationality), addons]);
      }
    }
    const rowH = 30;
    for (let r = 0; r < rows.length; r++) {
      if (y - rowH < 80) { y = newPage(); drawTblHeader(); }
      page.drawRectangle({ x: M, y: y - rowH, width: PW - M * 2, height: rowH, color: white, borderColor: rgb(0.90, 0.62, 0.30), borderWidth: 0.4 });
      let xx = M + 6;
      for (let i = 0; i < cols.length; i++) {
        const text = rows[r][i] ?? '';
        const isSr = i === 0;
        const isAdd = i === cols.length - 1;
        const font = isSr ? fMonoB : (isAdd ? fSans : fSansB);
        const size = isAdd ? 8 : 9;
        const color = isAdd ? muted : dark;
        const maxC = Math.floor((cols[i].w - 6) / 5.4);
        drawText(truncate(text, maxC), xx, y - 18, { size, font, color });
        xx += cols[i].w;
      }
      y -= rowH;
    }
    y -= 14;
  }

  // Charges
  if (y < 240) y = newPage();
  sectionHead('Charges Detail Summary');
  {
    const labelColW = 88;
    const numHeads = [
      { top: 'Entry Fee', sub: 'Visitor' }, { top: 'Entry Fee', sub: 'Vehicle' },
      { top: 'Eco-Dev', sub: 'Visitor' }, { top: 'Eco-Dev', sub: 'Vehicle' },
      { top: 'Tiger Reserve', sub: 'Vis+Veh+Guide' }, { top: 'Vehicle Rent', sub: '' },
      { top: 'Guide Fee', sub: '' }, { top: 'GST', sub: '' },
    ];
    const colW = (PW - M * 2 - labelColW) / numHeads.length;
    const headerH = 28;
    page.drawRectangle({ x: M, y: y - headerH, width: PW - M * 2, height: headerH, color: headerBg, borderColor: rgb(0.90, 0.62, 0.30), borderWidth: 0.4 });
    drawText('CATEGORY', M + 8, y - 18, { size: 7, font: fSansB, color: muted });
    for (let i = 0; i < numHeads.length; i++) {
      const cx = M + labelColW + i * colW;
      drawText(numHeads[i].top, cx + 3, y - 11, { size: 6.5, font: fSansB, color: muted });
      if (numHeads[i].sub) drawText(numHeads[i].sub, cx + 3, y - 22, { size: 5.5, font: fSans, color: muted });
    }
    y -= headerH;

    const drawRow = (label: string, vals: number[]) => {
      const rowH = 22;
      page.drawRectangle({ x: M, y: y - rowH, width: PW - M * 2, height: rowH, color: white, borderColor: rgb(0.90, 0.62, 0.30), borderWidth: 0.4 });
      drawText(label, M + 8, y - 14, { size: 9, font: fSansB, color: dark });
      for (let i = 0; i < vals.length; i++) {
        const cx = M + labelColW + i * colW;
        drawText(`Rs.${vals[i].toFixed(2)}`, cx + 3, y - 14, { size: 7.5, font: fMono, color: dark });
      }
      y -= rowH;
    };
    drawRow('Total', [totalRow.entryFeeVisitor, totalRow.entryFeeVehicle, totalRow.ecoDevVisitor, totalRow.ecoDevVehicle, totalRow.tigerReserveFund, totalRow.vehicleRent, totalRow.guideFee, totalRow.vehicleGst + totalRow.guideGst]);

    const drawSpanRow = (label: string, val: number, italic = false) => {
      const rowH = 20;
      page.drawRectangle({ x: M, y: y - rowH, width: PW - M * 2, height: rowH, color: white, borderColor: rgb(0.90, 0.62, 0.30), borderWidth: 0.4 });
      drawText(label, M + 8, y - 13, { size: 8.5, font: italic ? fSans : fSansB, color: italic ? muted : dark });
      drawText(`Rs. ${val.toFixed(2)}`, M + labelColW + 8, y - 13, { size: 9, font: fMono, color: italic ? muted : dark });
      y -= rowH;
    };
    drawSpanRow('Surcharge (RPACS)', rpacsTotal);
    drawSpanRow('Add-on Charges', addonTotal, true);
    drawSpanRow('RISL Charges', rislTotal);

    const rowH = 26;
    page.drawRectangle({ x: M, y: y - rowH, width: PW - M * 2, height: rowH, color: headerBg, borderColor: rgb(0.85, 0.50, 0.20), borderWidth: 0.6 });
    drawText('GRAND TOTAL', M + 8, y - 17, { size: 11, font: fSerif, color: dark });
    const v = `Rs. ${totalAmt}`;
    drawText(v, PW - M - 8 - v.length * 7, y - 17, { size: 13, font: fMonoB, color: orange });
    y -= rowH + 14;
  }

  // Terms
  if (y < 220) y = newPage();
  sectionHead('Terms & Conditions for Visitors');
  {
    const TERMS = [
      'The visitor must reach the Forest permit counter to collect the boarding pass at least 45 minutes prior to entry time.',
      'First visitor whose photo ID was uploaded is mandatory to visit so that ID can be verified at the gate.',
      'Mobile phone use within the tourism zone of the core habitat is not permitted.',
      'ID proof at boarding pass collection must match booking ID; otherwise the permit will be deemed fake and liable to be cancelled.',
      'Carry original ID / DigiLocker ID during visit — must be the same ID used at the time of booking.',
      'The visitor must bring two printed copies of this slip at the time of collecting the boarding pass.',
      'Seats vacant due to non-turn up may be filled by park management at the booking window.',
      'Boarding pass collection begins two hours before the park entry time.',
      'Maximum 6 seats per transaction to avoid fake bookings.',
      'For group bookings, park authorities will try to accommodate the group subject to space availability.',
      'Visitors under the influence of alcohol or intoxicating substances will be denied entry.',
      'If passenger count is less than vehicle capacity, difference in vehicle rent & guide fee will be charged extra.',
    ];
    const colGap = 14;
    const colW = (PW - M * 2 - colGap) / 2;
    const half = Math.ceil(TERMS.length / 2);
    const left = TERMS.slice(0, half);
    const right = TERMS.slice(half);
    const drawColumn = (items: string[], xStart: number) => {
      let ty = y;
      for (const it of items) {
        if (ty < 90) ty = newPage();
        drawText('+', xStart, ty - 9, { size: 9, font: fSansB, color: orange });
        const lines = wrapLines(it, 64);
        for (const line of lines) { drawText(line, xStart + 10, ty - 9, { size: 8.5, font: fSans, color: dark }); ty -= 11; }
        ty -= 6;
      }
      return ty;
    };
    const yL = drawColumn(left, M);
    const yR = drawColumn(right, M + colW + colGap);
    y = Math.min(yL, yR) - 6;
  }

  // Indemnity
  if (y < 140) y = newPage();
  {
    const boxH = 80;
    page.drawRectangle({ x: M, y: y - boxH, width: PW - M * 2, height: boxH, color: rgb(0.985, 0.93, 0.85), borderColor: orange, borderWidth: 0.4 });
    page.drawRectangle({ x: M, y: y - boxH, width: 3, height: boxH, color: orange });
    drawText('Indemnity Bond:', M + 12, y - 14, { size: 9, font: fSansB, color: orange });
    const indem = wrapLines('By booking this permit the visitor acknowledges risks of visiting this reserve, enters at own risk and accepts full liability. The protected area management shall not be responsible in any manner. Any litigation shall be in a court of law in Rajasthan.', 92);
    let iy = y - 26;
    for (const line of indem) { drawText(line, M + 12, iy, { size: 8, font: fSans, color: dark }); iy -= 11; }
    drawText('Please Note:', M + 12, iy - 4, { size: 9, font: fSansB, color: orange });
    const note = wrapLines('We will not be responsible for costs arising out of unforeseen circumstances like landslides, road blocks, or bad weather.', 92);
    let ny = iy - 16;
    for (const line of note) { drawText(line, M + 12, ny, { size: 8, font: fSans, color: dark }); ny -= 11; }
    y -= boxH + 12;
  }

  // Refund policy
  if (y < 130) y = newPage();
  sectionHead('Cancellation & Refund Policy');
  {
    const refunds: Array<[string, string]> = [
      ['75%', 'If cancelled\n31+ days before\nvisit date'],
      ['50%', 'If cancelled\n4-30 days before\nvisit date'],
      ['0%', 'If cancelled\nwithin 3 days of\nvisit date'],
    ];
    const cellW = (PW - M * 2 - 12) / 3;
    const cellH = 76;
    for (let i = 0; i < refunds.length; i++) {
      const [pct, desc] = refunds[i];
      const cx = M + i * (cellW + 6);
      page.drawRectangle({ x: cx, y: y - cellH, width: cellW, height: cellH, color: cellBg, borderColor: rgb(0.90, 0.62, 0.30), borderWidth: 0.4 });
      drawText(pct, cx + cellW / 2 - (pct.length * 8), y - 28, { size: 22, font: fSerif, color: orange });
      drawText('REFUND', cx + cellW / 2 - 18, y - 42, { size: 8, font: fSansB, color: muted });
      const lines = desc.split('\n');
      let dy = y - 54;
      for (const line of lines) { drawText(line, cx + cellW / 2 - (line.length * 2.3), dy, { size: 7.5, font: fMono, color: muted }); dy -= 9; }
    }
    y -= cellH + 14;
  }

  // Footer
  page.drawRectangle({ x: 0, y: 0, width: PW, height: 56, color: dark });
  drawText('Phone:  0141-282-0384', M, 38, { size: 9, font: fSans, color: rgb(0.78, 0.74, 0.68) });
  drawText('Email:  helpdesk[dot]tourist[at]rajasthan[dot]gov[dot]in', M, 24, { size: 9, font: fSans, color: rgb(0.78, 0.74, 0.68) });
  drawText('Web:    obms-tourist.rajasthan.gov.in', M, 10, { size: 9, font: fSans, color: rgb(0.78, 0.74, 0.68) });
  drawText('OBMS', PW - M - 36, 36, { size: 14, font: fSerif, color: rgb(0.831, 0.627, 0.090) });
  drawText('RAJASTHAN TOURISM', PW - M - 110, 18, { size: 7, font: fSansB, color: rgb(0.55, 0.50, 0.42) });

  return fileFromPdf(await pdfDoc.save(), `ticket_${bookingId}.pdf`);
}
