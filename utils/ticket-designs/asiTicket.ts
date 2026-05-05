import moment from 'moment-timezone';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { showErrorToastMessage } from '@/utils/toast.utils';
import { 
  toNum, 
  generateQrSvgRects, 
  computeAddonTotal, 
  computeRislTotal,
  generateQrDataUrl,
  dataUrlToBytes,
  fileFromPdf
} from './ticketUtils';

export function buildAsiTicketHtml(ticket: any): string {
  const bookingId  = String(ticket.bookingId || ticket.id || '');
  const placeName  = ticket.placeDetailDto?.name || ticket.placeName || 'ASI Monument';
  const district   = ticket.placeDetailDto?.districtName || '';
  const location   = [district, 'Rajasthan', 'India'].filter(Boolean).join(', ');
  const bookedDate = ticket.createdDate  ? moment(ticket.createdDate).format('DD MMM YYYY')  : '—';
  const visitDay   = ticket.bookingDate  ? moment(ticket.bookingDate).format('DD MMM')        : '—';
  const visitYear  = ticket.bookingDate  ? moment(ticket.bookingDate).format('YYYY')          : '';
  
  const asiDto = ticket.asiTicketDto || {};
  const shiftName  = ticket.shiftDto?.name || ticket.shiftName || asiDto.slot || '';
  const shiftStart = ticket.shiftDto?.startTime ? moment(ticket.shiftDto.startTime).format('hh:mm A') : '';
  const shiftEnd   = ticket.shiftDto?.endTime   ? moment(ticket.shiftDto.endTime).format('hh:mm A')   : '';
  const totalAmt   = ticket.totalAmount || 0;

  const adultCount = asiDto.adultCount ?? ticket.adultCount ?? 0;
  const childCount = asiDto.childCount ?? ticket.childCount ?? 0;
  const totalQty   = adultCount + childCount || (Array.isArray(ticket.ticketUserDto) ? ticket.ticketUserDto.reduce((s: number, t: any) => s + (t.qty || 0), 0) : 0);

  const visitorVal = totalQty > 0 ? `${totalQty} Visitor${totalQty === 1 ? '' : 's'}` : '—';
  const visitorSub = adultCount > 0 ? `${adultCount} Adult${adultCount === 1 ? '' : 's'}${childCount > 0 ? `, ${childCount} Child${childCount === 1 ? '' : 'ren'}` : ''}` : '';

  const timeVal    = shiftName || (shiftStart ? 'Slot' : 'Full Day');
  const timeSub    = shiftStart ? `${shiftStart} – ${shiftEnd}` : '';
  const priceBadge = totalAmt > 0 ? `₹ ${totalAmt} / Ticket` : 'Entry Pass';

  const qrValue = ticket.qrDetail || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: ticket.id || ticket.bookingId } });
  const { rects: qrRects, count: qrCount } = generateQrSvgRects(qrValue, 100);

  const addonTotal = computeAddonTotal(ticket);
  const rislTotal  = computeRislTotal(ticket);

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
body{font-family:'Rajdhani',sans-serif;background:#111;min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:36px 16px;}
.wrap{max-width:600px;width:100%}
.top-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;}
.valid-pill{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.06);border:1px solid rgba(212,160,23,.35);border-radius:20px;padding:5px 14px;}
.valid-dot{width:7px;height:7px;background:#4ade80;border-radius:50%;box-shadow:0 0 6px #4ade80;}
.valid-lbl{font-family:'Space Mono',monospace;font-size:9px;color:rgba(255,255,255,.7);letter-spacing:1px;text-transform:uppercase;}
.booked-on{font-family:'Rajdhani',sans-serif;font-size:11px;color:rgba(255,255,255,.35);letter-spacing:.5px;}
.d1{background:#F5ECD7;border-radius:4px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 0 1px rgba(184,74,14,.2);}
.d1-top{background:linear-gradient(135deg,#7C2D12 0%,#B84A0E 45%,#D4691A 100%);padding:26px 32px 22px;position:relative;overflow:hidden;}
.d1-top::before{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");}
.d1-header-row{display:flex;justify-content:space-between;align-items:flex-start;position:relative;z-index:2;gap:16px;}
.d1-header-left{display:flex;flex-direction:column;gap:0;flex:1;min-width:0;}
.d1-gov{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.d1-emblem{width:44px;height:44px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.d1-gov-text .sub{font-family:'Rajdhani',sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.6);}
.d1-gov-text .main{font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;color:#fff;letter-spacing:.5px;}
.d1-title-block{position:relative;z-index:2;}
.d1-title-block h1{font-family:'Cinzel',serif;font-size:24px;font-weight:700;color:#fff;letter-spacing:1px;line-height:1.2;margin-bottom:6px;}
.d1-title-block .loc{font-family:'Rajdhani',sans-serif;font-size:12px;color:rgba(255,255,255,.7);letter-spacing:2px;text-transform:uppercase;}
.d1-qr-wrap{background:#fff;border-radius:8px;padding:6px;box-shadow:0 4px 16px rgba(0,0,0,.3);flex-shrink:0;margin:0 auto;width:140px;height:140px;display:flex;align-items:center;justify-content:center;}
.d1-qr-wrap svg{display:block;width:100%;height:100%;}
.d1-pass-strip{background:#D4A017;padding:8px 32px;display:flex;justify-content:space-between;align-items:center;}
.d1-pass-strip .badge{font-family:'Cinzel',serif;font-size:11px;font-weight:600;color:#3D1F00;letter-spacing:2px;}
.d1-pass-strip .price{font-family:'Space Mono',monospace;font-size:11px;color:#3D1F00;font-weight:700;}
.d1-body{padding:28px 32px;}
.d1-meta-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;}
.d1-meta-cell{text-align:center;padding:14px 8px;border:1px solid rgba(184,74,14,.2);border-radius:4px;background:rgba(184,74,14,.04);}
.d1-meta-cell .icon{font-size:20px;margin-bottom:6px;display:block;}
.d1-meta-cell .lbl{font-family:'Rajdhani',sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#9B5520;margin-bottom:3px;}
.d1-meta-cell .val{font-family:'Cinzel',serif;font-size:15px;font-weight:600;color:#3D1F00;line-height:1.1;}
.d1-meta-cell .sub2{font-family:'Rajdhani',sans-serif;font-size:11px;color:#7A6A58;}
.d1-divider{border:none;border-top:1px dashed rgba(184,74,14,.25);margin:0 -8px 20px;position:relative;}
.d1-divider::before,.d1-divider::after{content:'';position:absolute;top:-10px;width:18px;height:18px;background:#F5ECD7;border-radius:50%;border:1px dashed rgba(184,74,14,.25);}
.d1-divider::before{left:-24px;}.d1-divider::after{right:-24px;}
.d1-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-bottom:20px;}
.d1-info-item{font-family:'Rajdhani',sans-serif;font-size:12px;color:#6B3A1F;display:flex;gap:6px;align-items:flex-start;line-height:1.5;}
.d1-check{color:#B84A0E;font-weight:700;}

.d1-ref{background:#3D1F00;border-radius:4px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;}
.d1-ref .rl{font-family:'Rajdhani',sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.4);}
.d1-ref .rv{font-family:'Space Mono',monospace;font-size:13px;color:#D4A017;letter-spacing:1.5px;}
.d1-footer{background:#3D1F00;padding:14px 32px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.05);}
.d1-footer .contact{font-family:'Rajdhani',sans-serif;font-size:11px;color:rgba(255,255,255,.5);line-height:1.8;}
.d1-footer .brand{text-align:right;}
.d1-footer .brand .bname{font-family:'Cinzel',serif;font-size:12px;color:#D4A017;letter-spacing:1px;}
.d1-footer .brand .bsub{font-family:'Rajdhani',sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.3);margin-top:2px;}
.action-bar{display:flex;gap:10px;justify-content:center;margin-top:22px;}
.btn-print{background:linear-gradient(135deg,#7C2D12,#B84A0E);color:#fff;font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border:none;border-radius:4px;padding:13px 36px;cursor:pointer;box-shadow:0 4px 16px rgba(184,74,14,.4);transition:opacity .15s;}
.btn-print:hover{opacity:.88;}
.btn-close{background:transparent;color:rgba(255,255,255,.45);font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:600;letter-spacing:1px;border:1px solid rgba(255,255,255,.15);border-radius:4px;padding:13px 24px;cursor:pointer;}
@media print{body{background:#fff;padding:0;display:block;}.action-bar,.top-row{display:none!important;}.d1{box-shadow:none;border-radius:0;}.wrap{max-width:100%;}.d1-top,.d1-pass-strip,.d1-ref,.d1-footer{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
</style>
</head>
<body>
<div class="wrap">
  <div class="top-row">
    <div class="valid-pill"><span class="valid-dot"></span><span class="valid-lbl">Valid ASI Ticket</span></div>
    <span class="booked-on">Booked on ${bookedDate}</span>
  </div>
  <div class="d1">
    <div class="d1-top">
      <div class="d1-header-row">
        <div class="d1-header-left">
          <div class="d1-gov">
            <div class="d1-emblem">🏛</div>
            <div class="d1-gov-text">
              <div class="sub">Archaeological Survey of India</div>
              <div class="main">Government of India</div>
            </div>
          </div>
          <div class="d1-title-block">
            <h1>${placeName}</h1>
            <div class="loc">📍 ${location}</div>
          </div>
        </div>
        <div class="d1-qr-wrap">
          <svg viewBox="0 0 ${qrCount} ${qrCount}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" shape-rendering="crispEdges">${qrRects}</svg>
        </div>
      </div>
    </div>
    <div class="d1-pass-strip">
      <span class="badge">✦ Monument Entry Pass ✦</span>
      <span class="price">${priceBadge}</span>
    </div>
    <div class="d1-body">
      <div class="d1-meta-row">
        <div class="d1-meta-cell"><span class="icon">📅</span><div class="lbl">Visit Date</div><div class="val">${visitDay}</div><div class="sub2">${visitYear}</div></div>
        <div class="d1-meta-cell"><span class="icon">🎟</span><div class="lbl">Visitors</div><div class="val">${visitorVal}</div><div class="sub2">${visitorSub}</div></div>
        <div class="d1-meta-cell"><span class="icon">🕐</span><div class="lbl">Time Slot</div><div class="val">${timeVal}</div><div class="sub2">${timeSub}</div></div>
      </div>
      <hr class="d1-divider"/>
      
      <div class="d1-info-grid">
        <div class="d1-info-item"><span class="d1-check">✓</span><span>Carry valid ID proof for verification</span></div>
        <div class="d1-info-item"><span class="d1-check">✓</span><span>Entry on booked date and time only</span></div>
        <div class="d1-info-item"><span class="d1-check">✓</span><span>Non-transferable and non-refundable</span></div>
        <div class="d1-info-item"><span class="d1-check">✓</span><span>Photography restricted in some areas</span></div>
        <div class="d1-info-item"><span class="d1-check">✓</span><span>Arrive 15 mins before your time slot</span></div>
        <div class="d1-info-item"><span class="d1-check">✓</span><span>Follow monument guidelines and staff</span></div>
      </div>
      <div class="d1-ref"><span class="rl">ASI Booking Ref</span><span class="rv">${bookingId}</span></div>
    </div>
    <div class="d1-footer">
      <div class="contact">📞 ASI Helpdesk &nbsp;|&nbsp; ✉ asi@gov.in<br/>🌐 asi.nic.in</div>
      <div class="brand"><div class="bname">OBMS</div><div class="bsub">Rajasthan Tourism</div></div>
    </div>
  </div>
  <div class="action-bar">
    <button class="btn-print" onclick="window.print()">🖨 &nbsp;Print / Save as PDF</button>
    <button class="btn-close" onclick="window.close()">✕ Close</button>
  </div>
</div>
<script>document.fonts.ready.then(() => setTimeout(() => window.print(), 500));</script>
</body>
</html>`;
}

export function openAsiTicket(ticket: any) {
  const w = window.open('', '_blank', 'width=820,height=960');
  if (!w) {
    showErrorToastMessage('Please allow popups to print / download the ticket');
    return;
  }
  w.document.write(buildAsiTicketHtml(ticket));
  w.document.close();
}

// ════════════════════════════════════════════════════════════════════════════
//  ASI share PDF — blue/navy theme to match ASI identity
// ════════════════════════════════════════════════════════════════════════════

export async function buildAsiShareFile(ticket: any): Promise<File> {
  const bookingId = String(ticket.bookingId || ticket.id || '');
  const placeName = (ticket.placeDetailDto?.name || ticket.placeName || 'ASI Monument') as string;
  const district  = ticket.placeDetailDto?.districtName || '';
  const totalUsers = Number(ticket.totalUsers) || 0;
  const totalAmt   = toNum(ticket.totalAmount);
  const visitDateRaw = ticket.bookingDate ? moment(ticket.bookingDate) : null;
  const visitDateMonth = visitDateRaw ? visitDateRaw.format('DD MMM') : '—';
  const visitDateYear  = visitDateRaw ? visitDateRaw.format('YYYY')   : '';
  const shiftName  = ticket.shiftDto?.name || ticket.shiftName || 'Full Day';
  const shiftStart = ticket.shiftDto?.startTime ? moment(ticket.shiftDto.startTime).format('hh:mm A') : '';
  const shiftEnd   = ticket.shiftDto?.endTime   ? moment(ticket.shiftDto.endTime).format('hh:mm A')   : '';
  const shiftSub   = shiftStart ? `${shiftStart} - ${shiftEnd}` : '';

  const visitors: any[] = Array.isArray(ticket.ticketUserDto) ? ticket.ticketUserDto : [];
  const ticketBreakdown: Array<{ name: string; qty: number }> = visitors.map((v) => ({
    name: String(v?.ticketName || 'Visitor'),
    qty:  Number(v?.qty) || (Array.isArray(v?.ticketUserDocs) ? v.ticketUserDocs.length : 0) || 1,
  })).filter((r) => r.qty > 0);
  const visitorSummary = ticketBreakdown.length
    ? ticketBreakdown.map((r) => `${r.qty} ${r.name}`).join(', ')
    : `${totalUsers} Visitor${totalUsers === 1 ? '' : 's'}`;

  const qrValue = ticket.qrDetail
    || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: ticket.id || ticket.bookingId } });

  const pdfDoc = await PDFDocument.create();
  const fSans  = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fSansB = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fSerif = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fMonoB = await pdfDoc.embedFont(StandardFonts.CourierBold);

  const PW = 595.28, PH = 841.89, M = 28;
  const navy       = rgb(0.12, 0.23, 0.35); // ASI Navy
  const blue       = rgb(0.20, 0.40, 0.60);
  const lightBlue  = rgb(0.94, 0.96, 0.98);
  const dark       = rgb(0.15, 0.15, 0.15);
  const muted      = rgb(0.40, 0.45, 0.50);
  const white      = rgb(1, 1, 1);

  const page = pdfDoc.addPage([PW, PH]);
  page.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: lightBlue });
  const drawText = (text: string, x: number, y: number, opts: any) => page.drawText(text, { x, y, ...opts });
  const truncate = (s: string, max: number) => s.length > max ? s.slice(0, Math.max(0, max - 1)) + '…' : s;

  // Header
  page.drawRectangle({ x: 0, y: PH - 100, width: PW, height: 100, color: navy });
  page.drawRectangle({ x: 0, y: PH - 180, width: PW, height: 80, color: blue });

  drawText('GOVERNMENT OF INDIA', M + 50, PH - 30, { size: 8, font: fSansB, color: white });
  drawText('Archaeological Survey of India', M + 50, PH - 46, { size: 12, font: fSansB, color: white });
  page.drawCircle({ x: M + 25, y: PH - 42, size: 19, color: white, borderColor: navy, borderWidth: 1 });
  drawText('🏛', M + 18, PH - 48, { size: 11, font: fSerif, color: navy });

  drawText(truncate(placeName, 36), M, PH - 110, { size: 24, font: fSerif, color: white });
  const locParts = [district, 'India'].filter(Boolean).join(', ');
  drawText(truncate(locParts.toUpperCase(), 70), M, PH - 130, { size: 9, font: fSans, color: rgb(0.9, 0.9, 0.95) });

  // QR
  const qrDataUrl = generateQrDataUrl(qrValue);
  if (qrDataUrl) {
    try {
      const qrImg = await pdfDoc.embedPng(dataUrlToBytes(qrDataUrl));
      page.drawRectangle({ x: PW - 140, y: PH - 140, width: 120, height: 120, color: white });
      page.drawImage(qrImg, { x: PW - 136, y: PH - 136, width: 112, height: 112 });
    } catch {}
  }

  // Sub-strip
  page.drawRectangle({ x: 0, y: PH - 212, width: PW, height: 32, color: navy });
  drawText('---  Monument Entry Pass  ---', M, PH - 200, { size: 10, font: fSerif, color: white });
  const refText = `Ref: ${bookingId}`;
  drawText(refText, PW - M - refText.length * 6, PH - 200, { size: 10, font: fSansB, color: white });

  let y = PH - 240;

  // Visit Details
  {
    const cells = [
      { label: 'Visit Date',  main: visitDateMonth, sub: visitDateYear },
      { label: 'Visitors',    main: `${totalUsers} Person${totalUsers === 1 ? '' : 's'}`, sub: visitorSummary },
      { label: 'Time Slot',   main: shiftName,      sub: shiftSub || '—' },
    ];
    const cellW = (PW - M * 2 - 16) / 3;
    const cellH = 80;
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      const cx = M + i * (cellW + 8);
      page.drawRectangle({ x: cx, y: y - cellH, width: cellW, height: cellH, color: white, borderColor: blue, borderWidth: 0.5 });
      drawText(c.label.toUpperCase(), cx + 8, y - 20, { size: 7, font: fSansB, color: blue });
      drawText(truncate(c.main, 14), cx + 8, y - 40, { size: 13, font: fSerif, color: dark });
      drawText(truncate(c.sub, 20), cx + 8, y - 56, { size: 8, font: fSans, color: muted });
    }
    y -= cellH + 20;
  }

  // Summary table
  const addonTotal = computeAddonTotal(ticket);
  const rislTotal  = computeRislTotal(ticket);
  const rpacsTotal = toNum(ticket.rpacsCharges ?? ticket.rpacs ?? ticket.surcharge ?? ticket.surCharge ?? ticket.surchargeCharges);
  
  const rowH = 20;
  const drawRow = (lbl: string, val: number, isB = false) => {
    page.drawRectangle({ x: M, y: y - rowH, width: PW - M * 2, height: rowH, color: isB ? navy : white, borderColor: blue, borderWidth: 0.4 });
    drawText(lbl, M + 10, y - 13, { size: 9, font: isB ? fSansB : fSans, color: isB ? white : dark });
    drawText(`Rs. ${val.toFixed(2)}`, PW - M - 70, y - 13, { size: 9, font: fMonoB, color: isB ? white : dark });
    y -= rowH;
  };

  drawRow('Entry Fees', totalAmt - addonTotal - rislTotal - rpacsTotal);
  drawRow('Surcharge', rpacsTotal);
  drawRow('Add-ons', addonTotal);
  drawRow('RISL Charges', rislTotal);
  drawRow('GRAND TOTAL', totalAmt, true);

  y -= 20;

  // Instructions
  drawText('INSTRUCTIONS:', M, y, { size: 9, font: fSansB, color: navy });
  y -= 15;
  const rules = [
    'Valid for one-time entry only.',
    'Original ID proof is mandatory for verification.',
    'Non-transferable and non-refundable.',
    'Consumption of food/alcohol inside is prohibited.',
  ];
  for (const r of rules) {
    drawText('•', M, y, { size: 10, color: blue });
    drawText(r, M + 12, y, { size: 9, font: fSans, color: dark });
    y -= 14;
  }

  // Footer
  page.drawRectangle({ x: 0, y: 0, width: PW, height: 40, color: navy });
  drawText('Archaeological Survey of India', M, 15, { size: 9, font: fSans, color: white });
  drawText('asi.nic.in', PW - M - 50, 15, { size: 9, font: fSans, color: white });

  return fileFromPdf(await pdfDoc.save(), `ticket_${bookingId}.pdf`);
}
