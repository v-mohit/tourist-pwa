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
  const bookingId = String(ticket.bookingId || ticket.id || 'ticket');
  const html = buildJkkTicketHtml(ticket); // ← reuse the EXACT same HTML

  return new Promise<File>((resolve, reject) => {
    // Create a hidden iframe to host the HTML
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1100px;height:1200px;visibility:hidden;';
    document.body.appendChild(iframe);

    const cleanup = () => {
      try { document.body.removeChild(iframe); } catch {}
    };

    iframe.onload = () => {
      try {
        const iDoc = iframe.contentDocument!;
        // Remove the auto-print script so it doesn't fire
        iDoc.querySelectorAll('script').forEach(s => s.remove());

        // Use the iframe's window.print via Blob trick — but for sharing
        // we need a File, so we use html2canvas → canvas → blob approach,
        // OR the cleanest: serialize the HTML as a self-contained blob PDF
        // via the browser's built-in print-to-PDF (not available in JS directly).
        //
        // Best cross-browser approach: convert to image via html2canvas,
        // then wrap in a minimal PDF using your existing pdf-lib pattern.
        import('html2canvas').then(({ default: html2canvas }) => {
          html2canvas(iDoc.body, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: 1100,
            windowWidth: 1100,
          }).then(canvas => {
            canvas.toBlob(async (blob) => {
              if (!blob) { cleanup(); reject(new Error('Canvas to blob failed')); return; }

              try {
                const { PDFDocument } = await import('pdf-lib');
                const imgBytes = new Uint8Array(await blob.arrayBuffer());
                const pdfDoc = await PDFDocument.create();

                // A4 proportional — scale canvas to A4 width
                const A4_W = 595.28;
                const scale = A4_W / canvas.width;
                const A4_H = canvas.height * scale;

                const page = pdfDoc.addPage([A4_W, A4_H]);
                const pngImage = await pdfDoc.embedPng(imgBytes);
                page.drawImage(pngImage, { x: 0, y: 0, width: A4_W, height: A4_H });

                const pdfBytes = await pdfDoc.save();
const file = new File([pdfBytes.buffer as ArrayBuffer], `jkk_ticket_${bookingId}.pdf`, { type: 'application/pdf' });                cleanup();
                resolve(file);
              } catch (err) {
                cleanup();
                reject(err);
              }
            }, 'image/png');
          }).catch(err => { cleanup(); reject(err); });
        }).catch(err => { cleanup(); reject(err); });
      } catch (err) {
        cleanup();
        reject(err);
      }
    };

    iframe.onerror = () => { cleanup(); reject(new Error('iframe load failed')); };

    // Write the HTML (with print script removed)
    const cleanHtml = html.replace(/<script>[\s\S]*?<\/script>/gi, '');
    iframe.contentDocument?.open();
    iframe.contentDocument?.write(cleanHtml);
    iframe.contentDocument?.close();
  });
}
