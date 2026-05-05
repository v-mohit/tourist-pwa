import moment from 'moment-timezone';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { showErrorToastMessage } from '@/utils/toast.utils';
import { 
  toNum, 
  generateQrDataUrl,
  generateQrSvgRects, 
  computeAddonTotal, 
  computeRislTotal,
  dataUrlToBytes,
  wrapLines,
  fileFromPdf
} from './ticketUtils';

export function buildJkkTicketHtml(ticket: any): string {
  const id          = String(ticket.bookingId || ticket.id || '');
  const createdDate = ticket.createdDate
    ? moment(Number(ticket.createdDate)).format('dddd, MMMM Do YYYY, h:mm:ss a')
    : '—';
  const approvedRaw   = (ticket.approved || 'PENDING').toString();
  const approved      = approvedRaw.toLowerCase() === 'reject' ? 'REJECTED' : approvedRaw.toUpperCase();
  const paymentStatus = (String(ticket?.paymentStatus || '').toLowerCase().includes('success')) ? 'SUCCESS' : 'Pending';

  const applicantName       = ticket.applicantName || '—';
  const mobileNo            = ticket.mobileNo || '—';
  const email               = ticket.email || '—';
  const address             = ticket.address || '—';
  const gstNo               = ticket.gstNo || '';
  const societyRegistered   = !!ticket.societyRegistered;
  const societyDocUrl       = ticket.societyRegisteredDocUrl || '';

  const typeName        = ticket.typeName || ticket.exhibitionType || '—';
  const subCategoryName = ticket.subCategoryName || ticket.jkkSubCategory?.name || '—';
  const category        = ticket.category || ticket.categoryName || '—';
  const projector       = ticket.projector ? 'Yes' : 'No';
  const audienceEntry   = ticket.audienceEntryByInvitation
    ? 'By Invitation'
    : ticket.audienceEntryByTicket ? 'By Ticket' : 'N/A';
  const shiftName       = ticket.shiftName
    || (ticket.jkkShiftList || ticket.shiftList || []).map((s: any) => s?.name || s).filter(Boolean).join(', ')
    || '';

  const startMs = Number(ticket.bookingStartDate);
  const endMs   = Number(ticket.bookingEndDate);
  const reservationFor = startMs && endMs
    ? `${moment(startMs).format('dddd, DD MMM')} - ${moment(endMs).format('dddd, DD MMM, YYYY')}`
    : '—';
  const durationDays = startMs && endMs
    ? moment(endMs).startOf('day').diff(moment(startMs).startOf('day'), 'days') + 1
    : 0;

  const preDays = Number(ticket.preDays || 0);
  let prepRange = '';
  if (preDays > 0 && startMs) {
    const prepStart = moment(startMs).subtract(preDays, 'days');
    const prepEnd   = moment(startMs).subtract(1, 'days');
    prepRange = preDays === 1
      ? `(${prepStart.format('DD MMM')})`
      : `(${prepStart.format('DD MMM')} to ${prepEnd.format('DD MMM')})`;
  }

  const isImageUrl = (url: string) =>
    /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|heic|heif|ico|raw|cr2|nef|orf|arw|psd)(\?|$)/i.test(url || '');

  const renderAttachments = (list: any[]) => {
    if (!list || list.length === 0) return '';
    return `<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">${list.map((it: any) => {
      const url = it?.imageUrl || it?.url || '';
      if (!url) return '';
      if (isImageUrl(url)) {
        return `<a href="${url}" target="_blank" rel="noopener"><img src="${url}" alt="attachment" style="width:48px;height:48px;border-radius:6px;border:2px solid #ccc;object-fit:cover" /></a>`;
      }
      return `<a href="${url}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:6px;border:2px solid #ccc;background:#f5f5f5;color:#EB5757;font-weight:700;font-size:11px;text-decoration:none">PDF</a>`;
    }).join('')}</div>`;
  };

  const programDetails      = ticket.detailsOfProgram?.[0];
  const guestDetails        = ticket.guestDetails?.[0];
  const organizationDetails = ticket.organizationDetails?.[0];
  const previousDetails     = ticket.previousDetails?.[0];

  const programDetailsBlock = (programDetails?.description || (programDetails?.imageList?.length ?? 0) > 0) ? `
    <div class="more-cell">
      <div class="more-lbl">Program Details</div>
      <div class="more-val">${programDetails?.description || ''}</div>
      ${renderAttachments(programDetails?.imageList || [])}
    </div>` : '';
  const guestDetailsBlock = (guestDetails?.description || (guestDetails?.imageList?.length ?? 0) > 0) ? `
    <div class="more-cell">
      <div class="more-lbl">Guest Details</div>
      <div class="more-val">${guestDetails?.description || ''}</div>
      ${renderAttachments(guestDetails?.imageList || [])}
    </div>` : '';
  const organizationDetailsBlock = (organizationDetails?.description || (organizationDetails?.imageList?.length ?? 0) > 0) ? `
    <div class="more-cell">
      <div class="more-lbl">Organization Details</div>
      <div class="more-val">${organizationDetails?.description || ''}</div>
      ${renderAttachments(organizationDetails?.imageList || [])}
    </div>` : '';
  const previousDetailsBlock = (previousDetails?.description || (previousDetails?.imageList?.length ?? 0) > 0) ? `
    <div class="more-cell">
      <div class="more-lbl">Previous Details</div>
      <div class="more-val">${previousDetails?.description || ''}</div>
      ${renderAttachments(previousDetails?.imageList || [])}
    </div>` : '';

  const ticketHeads: any[] = ticket.ticketHeads || [];
  const ticketHeadsHtml = ticketHeads.map((th: any) => {
    const labelLc = (th?.name || '').toLowerCase();
    const label = labelLc === 'with ac'
      ? 'Electricity Charges/ With Ac'
      : th?.name === 'Security Charge'
        ? `${th.name} (Refundable)`
        : th?.name || '—';
    const amt = typeof th?.amount === 'number' ? th.amount.toFixed(2) : (th?.amount || '0.00');
    return `<div class="pay-cell">
      <div class="pay-lbl">${label}</div>
      <div class="pay-val">₹ ${amt}</div>
    </div>`;
  }).join('');

  const totalAmount = typeof ticket.totalAmount === 'number'
    ? ticket.totalAmount.toFixed(2)
    : (ticket.totalAmount || '0.00');

  const transactionId   = ticket.transactionId;
  const transactionDate = ticket.transactionDate;
  const hasTransaction  = !!transactionId && transactionId !== 0 && transactionId !== '0';

  const qrValue = ticket.qrDetail || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: ticket.id || ticket.bookingId } });
  const qrUrl   = generateQrDataUrl(qrValue);

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>JKK ${approved === 'APPROVED' ? 'Ticket' : 'Application'} #${id}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;font-family:Arial,sans-serif}
      body{background:#fff;color:#323232;padding:0}
      .wrap{max-width:1100px;margin:0 auto;box-shadow:0 8px 32px rgba(0,0,0,.08);border-bottom-left-radius:12px;border-bottom-right-radius:12px;overflow:hidden}
      .head{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(to right,#db2777,#f43f5e);padding:16px 24px;border-top-left-radius:12px;border-top-right-radius:12px}
      .head img.logo{height:38px;filter:brightness(0) invert(1)}
      .head img.jkk{height:60px}
      .reg{display:flex;justify-content:space-between;align-items:center;background:#fce7f3;border-left:4px solid #db2777;padding:12px 24px;font-size:14px;color:#323232}
      .reg small{font-weight:500}
      hr{border:0;border-top:1px solid #f1d3e1}
      .grid{display:grid;grid-template-columns:2fr 1fr;background:#fff}
      .org-col{padding:14px 24px;background:#eff6ff;border-left:4px solid #1d4ed8}
      .qr-col{padding:14px 24px;background:#eff6ff;border-left:4px solid #1d4ed8}
      .col-hd{font-size:18px;font-weight:600;color:#1e3a8a;border-bottom:2px solid #c7d8f7;padding-bottom:12px;margin-bottom:18px}
      .pair{display:grid;grid-template-columns:1fr 1fr;gap:18px}
      .pair > div{margin-bottom:10px}
      .pair-lbl,.item-lbl{font-size:12px;color:#9ca3af}
      .pair-val,.item-val{font-weight:500;color:#323232;font-size:13px;word-break:break-word}
      .event{padding:14px 24px;background:#fdf2f8;border-left:4px solid #be185d}
      .event-hd{font-size:18px;font-weight:600;color:#831843;border-bottom:2px solid #f9c8d8;padding-bottom:12px;margin-bottom:18px}
      .event-grid{display:flex;flex-wrap:wrap;gap:14px}
      .event-grid > div{flex:1;min-width:240px;margin-bottom:10px}
      .more{padding:14px 24px;background:#eff6ff;border-left:4px solid #1d4ed8}
      .more-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px}
      .more-cell{margin-bottom:14px}
      .more-lbl{font-size:13px;color:#6b7280}
      .more-val{font-weight:500;font-size:14px;line-height:1.3;text-align:justify;color:#323232;word-break:break-word}
      .pay-row{display:grid;grid-template-columns:2fr 1fr;background:#fff}
      .pay-col{padding:14px 24px;background:#fdf2f8;border-left:4px solid #be185d}
      .pay-col-full{padding:14px 24px;background:#fdf2f8;border-left:4px solid #be185d;grid-column:1/-1}
      .pay-hd{display:flex;justify-content:space-between;align-items:center;font-size:18px;font-weight:600;color:#831843;border-bottom:2px solid #f9c8d8;padding-bottom:12px;margin-bottom:18px}
      .pay-hd .pill{padding:4px 12px;border-radius:6px;box-shadow:0 1px 3px rgba(0,0,0,.1);font-size:14px;background:#fff}
      .pay-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
      .pay-cell{margin-bottom:14px}
      .pay-lbl{font-size:13px;color:#6b7280}
      .pay-val{font-weight:500;color:#323232;font-size:14px}
      .txn-col{padding:14px 24px;background:#fdf2f8;border-left:4px solid #d1d5db}
      .footer{text-align:center;padding:20px 20px 60px;font-size:14px;color:#6b7280;background:#f3f4f6;border-top:1px solid #e5e7eb}
      .footer .row2{display:flex;justify-content:center;align-items:center;margin-top:6px}
      .footer .row2 > p{padding:0 18px}
      .footer .row2 > p:first-child{border-right:2px solid #cbd5e1}
      a{color:inherit}
      @media print{body{background:#fff}.wrap{box-shadow:none}}
    </style></head>
    <body>
    <div class="wrap">
      <header class="head">
        <img class="logo" src="/images/main-logo-dark.webp" alt="OBMS" onerror="this.style.display='none'"/>
        <img class="jkk" src="/images/jkk.png" alt="JKK" onerror="this.style.display='none'"/>
      </header>
      <div class="reg">
        <small>Reg Date: ${createdDate}</small>
        <small>Booking Id: ${id}</small>
        <small style="display:flex;align-items:center;gap:8px"><span>Booking Status:</span><span>${approved}</span></small>
      </div>
      <hr/>
      <div class="grid">
        <div class="org-col">
          <div class="col-hd">Organiser Details</div>
          <div class="pair">
            <div><div class="pair-lbl">Full Name</div><div class="pair-val">${applicantName}</div></div>
            <div><div class="pair-lbl">Mobile Number</div><div class="pair-val">${mobileNo}</div></div>
            <div><div class="pair-lbl">Email Address</div><div class="pair-val">${email}</div></div>
            <div><div class="pair-lbl">Address</div><div class="pair-val">${address}</div></div>
            ${gstNo ? `<div><div class="pair-lbl">GST Number</div><div class="pair-val">${gstNo}</div></div>` : ''}
            <div>
              <div class="pair-lbl">Society Registered</div>
              <div class="pair-val">${societyRegistered
                ? (societyDocUrl
                  ? `<a href="${societyDocUrl}" target="_blank" rel="noopener" style="color:#1d4ed8;text-decoration:underline">View</a>`
                  : 'Yes')
                : 'N/A'}</div>
            </div>
          </div>
        </div>
        <div class="qr-col">
          <div class="col-hd">Booking</div>
          ${qrUrl ? `<img src="${qrUrl}" width="100" height="100" alt="QR Image"/>` : ''}
        </div>
      </div>
      <hr/>
      <div class="event">
        <div class="event-hd">Event Details</div>
        <div class="event-grid">
          <div><div class="item-lbl">Applied For</div><div class="item-val">${typeName} - ${subCategoryName}</div></div>
          <div><div class="item-lbl">Category</div><div class="item-val">${category}</div></div>
          <div><div class="item-lbl">Projector Required</div><div class="item-val">${projector}</div></div>
          <div><div class="item-lbl">Audience Entry</div><div class="item-val">${audienceEntry}</div></div>
          <div><div class="item-lbl">Reservation For</div><div class="item-val">${reservationFor}</div></div>
          <div><div class="item-lbl">Duration</div><div class="item-val">${durationDays} Day(s) ${shiftName}</div></div>
          ${preDays > 0 ? `
          <div>
            <div class="item-lbl">Day's for Preparation</div>
            <div class="item-val">${preDays} Day(s) <span style="font-size:12px;color:#6b7280">${prepRange}</span></div>
          </div>` : ''}
        </div>
      </div>
      <hr/>
      ${(programDetailsBlock || guestDetailsBlock || organizationDetailsBlock || previousDetailsBlock) ? `
      <div class="more">
        <div class="col-hd">More Details &amp; Attachments</div>
        <div class="more-grid">
          ${programDetailsBlock}${guestDetailsBlock}${organizationDetailsBlock}${previousDetailsBlock}
        </div>
      </div>
      <hr/>` : ''}
      ${approvedRaw.toLowerCase() !== 'reject' ? `
      <div class="pay-row">
        <div class="${hasTransaction ? 'pay-col' : 'pay-col-full'}">
          <div class="pay-hd">
            <span>Payment Details</span>
            ${approved !== 'REJECTED' ? `<span class="pill">${paymentStatus === 'SUCCESS' ? 'SUCCESS' : 'Pending'}</span>` : ''}
          </div>
          <div class="pay-grid">
            ${ticketHeadsHtml}
            <div class="pay-cell"><div class="pay-lbl">Total Amount</div><div class="pay-val">₹ ${totalAmount}</div></div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:14px"><small>GST is not applicable on the Security Charges.</small></div>
        </div>
        ${hasTransaction ? `
        <div class="txn-col">
          <div class="pay-hd"><span>Transaction Details</span></div>
          <div class="pay-cell"><div class="pay-lbl">Transaction Id</div><div class="pay-val">${transactionId}</div></div>
          ${transactionDate ? `
          <div class="pay-cell">
            <div class="pay-lbl">Transaction Date &amp; Time</div>
            <div class="pay-val">${moment(Number(transactionDate)).format('DD MMM YYYY h:mm:ss A')}</div>
          </div>` : ''}
        </div>` : ''}
      </div>` : ''}
      <footer class="footer">
        <p>For any queries, please contact</p>
        <div class="row2">
          <p>Phone: 01412820384</p>
          <p>Email: helpdesk[dot]tourist[at]rajasthan[dot]gov[dot]in</p>
        </div>
      </footer>
    </div>
    <script>setTimeout(() => window.print(), 800);</script>
    </body></html>`;
}

export function openJkkTicket(ticket: any) {
  const w = window.open('', '_blank', 'width=1100,height=1200');
  if (!w) {
    showErrorToastMessage('Please allow popups to download the ticket');
    return;
  }
  w.document.write(buildJkkTicketHtml(ticket));
  w.document.close();
}

// ════════════════════════════════════════════════════════════════════════════
//  JKK share PDF — pink/rose theme to match the JKK download identity
// ════════════════════════════════════════════════════════════════════════════

export async function buildJkkShareFile(ticket: any): Promise<File> {
  const bookingId   = String(ticket.bookingId || ticket.id || '');
  const placeName   = (ticket.placeName || ticket.placeDetailDto?.name || 'Jawahar Kala Kendra') as string;
  const createdDate = ticket.createdDate ? moment(Number(ticket.createdDate)).format('DD MMM YYYY') : '—';
  const startMs     = Number(ticket.bookingStartDate);
  const endMs       = Number(ticket.bookingEndDate);
  const reservationFor = (startMs && endMs)
    ? `${moment(startMs).format('DD MMM')} - ${moment(endMs).format('DD MMM YYYY')}`
    : '—';
  const approvedRaw = String(ticket.approved || 'PENDING').toUpperCase();
  const approved    = approvedRaw === 'REJECT' ? 'REJECTED' : approvedRaw;
  const paymentSuccess = String(ticket?.paymentStatus || '').toLowerCase().includes('success');
  const paymentLabel = paymentSuccess ? 'PAID' : 'PENDING';

  const applicantName = ticket.applicantName || ticket.fullName || '—';
  const mobileNo      = ticket.mobileNo || '—';
  const email         = ticket.email || '—';
  const typeName      = ticket.typeName || ticket.exhibitionType || '—';
  const subCategory   = ticket.subCategoryName || ticket.jkkSubCategory?.name || '—';
  const category      = ticket.category || ticket.categoryName || '—';
  const shiftName     = ticket.shiftName
    || (ticket.jkkShiftList || ticket.shiftList || []).map((s: any) => s?.name || s).filter(Boolean).join(', ')
    || '—';
  const totalAmount   = toNum(ticket.totalAmount).toFixed(2);
  const transactionId = ticket.transactionId ? String(ticket.transactionId) : '';

  const qrValue = ticket.qrDetail
    || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: ticket.id || ticket.bookingId } });

  const pdfDoc = await PDFDocument.create();
  const fSans  = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fSansB = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fSerif = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fMonoB = await pdfDoc.embedFont(StandardFonts.CourierBold);

  const PW = 595.28, PH = 841.89, M = 28;
  // Pink/rose palette mirrors the JKK download
  const pinkBg     = rgb(0.992, 0.953, 0.961);   // very light pink page
  const pinkDeep   = rgb(0.510, 0.094, 0.263);   // #831843
  const pinkMid    = rgb(0.859, 0.157, 0.467);   // #db2777
  const pinkLight  = rgb(0.988, 0.906, 0.949);   // #fce7f3
  const pinkBorder = rgb(0.953, 0.784, 0.847);   // border accent
  const dark       = rgb(0.196, 0.196, 0.196);   // #323232
  const muted      = rgb(0.420, 0.447, 0.502);   // #6b7280
  const accent     = rgb(0.957, 0.247, 0.369);   // #f43f5e
  const white      = rgb(1, 1, 1);

  const page = pdfDoc.addPage([PW, PH]);
  page.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: pinkBg });
  const drawText = (text: string, x: number, y: number, opts: any) => page.drawText(text, { x, y, ...opts });
  const truncate = (s: string, max: number) => s.length > max ? s.slice(0, Math.max(0, max - 1)) + '…' : s;

  // ── Header (pink gradient: deep + mid stacked) ──────────────────────────
  page.drawRectangle({ x: 0, y: PH - 80,  width: PW, height: 80, color: pinkDeep });
  page.drawRectangle({ x: 0, y: PH - 150, width: PW, height: 70, color: pinkMid });

  drawText('GOVERNMENT OF RAJASTHAN', M + 50, PH - 26, { size: 8, font: fSansB, color: rgb(1, 1, 1) });
  drawText('Jawahar Kala Kendra', M + 50, PH - 42, { size: 12, font: fSansB, color: white });
  drawText('Department of Art & Culture', M + 50, PH - 56, { size: 8, font: fSans, color: rgb(0.95, 0.85, 0.92) });
  page.drawCircle({ x: M + 25, y: PH - 42, size: 19, color: rgb(0.30, 0.05, 0.15), borderColor: rgb(1,1,1), borderWidth: 1 });
  drawText('JKK', M + 14, PH - 48, { size: 11, font: fSerif, color: white });

  drawText(truncate(placeName, 36), M, PH - 100, { size: 22, font: fSerif, color: white });
  drawText(`Booking #${bookingId}  .  Created ${createdDate}`, M, PH - 122, { size: 9, font: fSans, color: rgb(0.98, 0.86, 0.92) });

  // QR
  const qrDataUrl = generateQrDataUrl(qrValue);
  if (qrDataUrl) {
    try {
      const qrImg = await pdfDoc.embedPng(dataUrlToBytes(qrDataUrl));
      page.drawRectangle({ x: PW - 100, y: PH - 102, width: 80, height: 80, color: white });
      page.drawImage(qrImg, { x: PW - 96, y: PH - 98, width: 72, height: 72 });
    } catch {}
  }

  // ── Status pill row (Application Status + Payment Status) ───────────────
  let y = PH - 178;
  {
    const stripH = 38;
    page.drawRectangle({ x: M, y: y - stripH, width: PW - M * 2, height: stripH, color: pinkLight, borderColor: pinkBorder, borderWidth: 0.5 });
    drawText('APPLICATION STATUS', M + 14, y - 14, { size: 7, font: fSansB, color: pinkDeep });
    drawText(approved, M + 14, y - 28, { size: 12, font: fSansB, color: approved === 'APPROVED' ? rgb(0.13, 0.55, 0.13) : approved === 'REJECTED' ? accent : pinkMid });

    drawText('PAYMENT', PW / 2, y - 14, { size: 7, font: fSansB, color: pinkDeep });
    drawText(paymentLabel, PW / 2, y - 28, { size: 12, font: fSansB, color: paymentSuccess ? rgb(0.13, 0.55, 0.13) : pinkMid });

    drawText('TOTAL', PW - M - 90, y - 14, { size: 7, font: fSansB, color: pinkDeep });
    drawText(`Rs. ${totalAmount}`, PW - M - 90, y - 28, { size: 12, font: fSansB, color: pinkMid });
    y -= stripH + 14;
  }

  // ── Section heading helper ──────────────────────────────────────────────
  const sectionHead = (label: string) => {
    page.drawRectangle({ x: M, y: y - 2, width: 14, height: 2, color: pinkMid });
    drawText(label.toUpperCase(), M + 22, y - 6, { size: 9, font: fSerif, color: pinkDeep });
    page.drawLine({ start: { x: M, y: y - 12 }, end: { x: PW - M, y: y - 12 }, thickness: 0.5, color: pinkBorder });
    y -= 24;
  };

  // ── Applicant Details ───────────────────────────────────────────────────
  sectionHead('Applicant Details');
  {
    const cells: Array<[string, string]> = [
      ['Name', applicantName],
      ['Mobile', mobileNo],
      ['Email', email],
    ];
    const cellW = (PW - M * 2 - 12) / 3;
    const cellH = 42;
    for (let i = 0; i < cells.length; i++) {
      const [lbl, val] = cells[i];
      const cx = M + i * (cellW + 6);
      page.drawRectangle({ x: cx, y: y - cellH, width: cellW, height: cellH, color: white, borderColor: pinkBorder, borderWidth: 0.5 });
      drawText(lbl.toUpperCase(), cx + 8, y - 14, { size: 7, font: fSansB, color: pinkDeep });
      drawText(truncate(val, Math.floor((cellW - 16) / 5.4)), cx + 8, y - 30, { size: 10, font: fSansB, color: dark });
    }
    y -= cellH + 14;
  }

  // ── Event Details ───────────────────────────────────────────────────────
  sectionHead('Event Details');
  {
    const cells: Array<[string, string]> = [
      ['Type',         typeName],
      ['Sub-Category', subCategory],
      ['Category',     category],
      ['Shift',        shiftName],
      ['Reservation',  reservationFor],
      ['Booking ID',   bookingId],
    ];
    const cellW = (PW - M * 2 - 12) / 3;
    const cellH = 42;
    for (let i = 0; i < cells.length; i++) {
      const [lbl, val] = cells[i];
      const cx = M + (i % 3) * (cellW + 6);
      const cy = y - Math.floor(i / 3) * (cellH + 6);
      page.drawRectangle({ x: cx, y: cy - cellH, width: cellW, height: cellH, color: white, borderColor: pinkBorder, borderWidth: 0.5 });
      drawText(lbl.toUpperCase(), cx + 8, cy - 14, { size: 7, font: fSansB, color: pinkDeep });
      drawText(truncate(val, Math.floor((cellW - 16) / 5.4)), cx + 8, cy - 30, { size: 10, font: fSansB, color: dark });
    }
    y -= Math.ceil(cells.length / 3) * (cellH + 6) + 8;
  }

  // ── Payment Summary ─────────────────────────────────────────────────────
  if (y < 200) y = PH - 80; // single-page assumption — rare for JKK to overflow
  sectionHead('Payment Summary');
  {
    const ticketHeads: any[] = Array.isArray(ticket.ticketHeads) ? ticket.ticketHeads : [];
    const heads = ticketHeads.length ? ticketHeads : [];
    const rowH = 22;
    const drawHead = (label: string, val: string, italic = false) => {
      page.drawRectangle({ x: M, y: y - rowH, width: PW - M * 2, height: rowH, color: white, borderColor: pinkBorder, borderWidth: 0.4 });
      drawText(label, M + 10, y - 14, { size: 9, font: italic ? fSans : fSansB, color: italic ? muted : dark });
      drawText(val, PW - M - 10 - val.length * 5.4, y - 14, { size: 9, font: fMonoB, color: dark });
      y -= rowH;
    };
    if (heads.length) {
      for (const h of heads) {
        const lbl = String(h?.name || 'Charge');
        const amt = typeof h?.amount === 'number' ? h.amount.toFixed(2) : String(h?.amount || '0.00');
        drawHead(lbl, `Rs. ${amt}`);
      }
    } else {
      drawHead('Application Fee', `Rs. ${totalAmount}`);
    }
    if (transactionId) drawHead('Transaction ID', transactionId, true);

    // Grand total band
    page.drawRectangle({ x: M, y: y - 26, width: PW - M * 2, height: 26, color: pinkLight, borderColor: pinkMid, borderWidth: 0.6 });
    drawText('GRAND TOTAL', M + 10, y - 17, { size: 11, font: fSerif, color: pinkDeep });
    const v = `Rs. ${totalAmount}`;
    drawText(v, PW - M - 10 - v.length * 7, y - 17, { size: 13, font: fMonoB, color: pinkMid });
    y -= 26 + 14;
  }

  // ── Notes / disclaimers ─────────────────────────────────────────────────
  {
    const boxH = 70;
    page.drawRectangle({ x: M, y: y - boxH, width: PW - M * 2, height: boxH, color: pinkLight, borderColor: pinkBorder, borderWidth: 0.4 });
    page.drawRectangle({ x: M, y: y - boxH, width: 3, height: boxH, color: pinkMid });
    drawText('Important:', M + 12, y - 14, { size: 9, font: fSansB, color: pinkDeep });
    const txt = 'Please carry a printed copy of this application or the booking ID. Submit any required attachments before the event start date. JKK reserves the right to amend or cancel allotments under exceptional circumstances.';
    let ny = y - 28;
    for (const line of wrapLines(txt, 92)) {
      drawText(line, M + 12, ny, { size: 8, font: fSans, color: dark });
      ny -= 11;
    }
    y -= boxH + 12;
  }

  // ── Footer ──────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width: PW, height: 56, color: pinkDeep });
  drawText('JKK Helpdesk:  jkk[at]rajasthan.gov.in', M, 38, { size: 9, font: fSans, color: rgb(0.95, 0.85, 0.92) });
  drawText('Address:       JLN Marg, Jaipur, Rajasthan', M, 24, { size: 9, font: fSans, color: rgb(0.95, 0.85, 0.92) });
  drawText('Web:           obms-tourist.rajasthan.gov.in', M, 10, { size: 9, font: fSans, color: rgb(0.95, 0.85, 0.92) });
  drawText('JKK', PW - M - 24, 36, { size: 14, font: fSerif, color: rgb(0.95, 0.85, 0.92) });
  drawText('JAWAHAR KALA KENDRA', PW - M - 130, 18, { size: 7, font: fSansB, color: rgb(0.85, 0.65, 0.78) });

  return fileFromPdf(await pdfDoc.save(), `ticket_${bookingId}.pdf`);
}
