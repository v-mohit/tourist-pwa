import moment from 'moment-timezone';
import QRCode from 'qrcode-generator';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// ════════════════════════════════════════════════════════════════════════════
//  Local helpers (kept self-contained so the share path doesn't depend on the
//  my-bookings page closure).
// ════════════════════════════════════════════════════════════════════════════

function toNum(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function getPath(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  if (!path.includes('.')) return obj?.[path];
  return path.split('.').reduce((acc: any, key: string) => acc?.[key], obj);
}

function pickNum(obj: any, ...paths: string[]): number {
  for (const p of paths) {
    const v = getPath(obj, p);
    if (v === undefined || v === null || v === '') continue;
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function normChargeName(v: any): string {
  return String(v || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
}

function resolveChargeLabel(row: any): string {
  return row?.category ?? row?.chargeName ?? row?.chargeHead ?? row?.head ?? row?.name ?? row?.ticketName ?? row?.type ?? '';
}

function classifyChargeRow(row: any) {
  const direct = {
    entryFeeVisitor: pickNum(row, 'entryFeeVisitor', 'entryFeesVisitor', 'visitorEntryFee', 'entryFee'),
    entryFeeVehicle: pickNum(row, 'entryFeeVehicle', 'vehicleEntryFee'),
    ecoDevVisitor:   pickNum(row, 'ecoDevVisitor', 'ecoDev', 'vfpmcCharges'),
    ecoDevVehicle:   pickNum(row, 'ecoDevVehicle', 'vfpmcVehicle'),
    tigerReserveFund: pickNum(row, 'tigerReserveFund', 'tigerFund', 'trdf'),
    vehicleRent:     pickNum(row, 'vehicleRent', 'vehicleRentAmount', 'vehicleCharges'),
    guideFee:        pickNum(row, 'guideFee', 'guideFees', 'guideAmount'),
    gst:             pickNum(row, 'gst', 'gstAmount', 'tax'),
  };
  const hasDirect = direct.entryFeeVisitor || direct.entryFeeVehicle || direct.ecoDevVisitor ||
    direct.ecoDevVehicle || direct.tigerReserveFund || direct.vehicleRent || direct.guideFee || direct.gst;
  if (hasDirect) return direct;
  const amount = pickNum(row, 'amount', 'chargeAmount', 'totalAmount', 'value');
  if (!amount) return direct;
  const label = normChargeName(resolveChargeLabel(row));
  const isEntry = label.includes('entry');
  const isVehicle = label.includes('vehicle');
  const isVisitor = label.includes('visitor') || label.includes('tourist');
  if (isEntry && isVehicle) return { ...direct, entryFeeVehicle: amount };
  if (isEntry && isVisitor) return { ...direct, entryFeeVisitor: amount };
  if (label.includes('eco')) {
    if (isVehicle) return { ...direct, ecoDevVehicle: amount };
    if (isVisitor) return { ...direct, ecoDevVisitor: amount };
  }
  if (label.includes('rent')) return { ...direct, vehicleRent: amount };
  if (label.includes('guide')) return { ...direct, guideFee: amount };
  if (label.includes('gst') || label.includes('tax')) return { ...direct, gst: amount };
  if (label.includes('tiger') || label.includes('trdf')) return { ...direct, tigerReserveFund: amount };
  return direct;
}

function computeInventoryChargeSummary(b: any) {
  const out = {
    entryFeeVisitor: 0, entryFeeVehicle: 0, ecoDevVisitor: 0, ecoDevVehicle: 0,
    vehicleRent: 0, gst: 0, rislCharge: 0, surcharge: 0,
  };
  const rows: any[] = Array.isArray(b?.ticketUserDto) ? b.ticketUserDto : [];
  for (const t of rows) {
    const qty = Number(t?.qty) || 0;
    const charges: any[] = Array.isArray(t?.fixCharges)
      ? t.fixCharges
      : Array.isArray(t?.ticketTypeConfigValue?.ticketTypeConfigList)
        ? t.ticketTypeConfigValue.ticketTypeConfigList
        : [];
    for (const c of charges) {
      const amount = pickNum(c, 'amount', 'chargeAmount', 'totalAmount', 'value');
      if (!amount) continue;
      const label = normChargeName(c?.name ?? c?.chargeName ?? c?.category ?? '');
      if (label.includes('risl')) out.rislCharge += amount * qty;
      else if (label.includes('entry fee')) out.entryFeeVisitor += amount * qty;
      else if (label.includes('eco')) out.ecoDevVisitor += amount * qty;
      else if (label.includes('gst') || label.includes('tax')) out.gst += amount * qty;
    }
  }
  const inv = b?.inventory;
  const invQty = Number(inv?.qty ?? b?.totalUsers) || 0;
  const cfgs: any[] = Array.isArray(inv?.ticketTypeConfigList) ? inv.ticketTypeConfigList : [];
  for (const cfg of cfgs) {
    const amount = pickNum(cfg, 'amount', 'chargeAmount', 'totalAmount', 'value');
    if (!amount) continue;
    const label = normChargeName(cfg?.name ?? cfg?.chargeName ?? cfg?.category ?? '');
    if (label.includes('risl')) out.rislCharge += amount * invQty;
    else if (label.includes('vehicle entry')) out.entryFeeVehicle += amount * invQty;
    else if (label.includes('vehicle rent')) out.vehicleRent += amount * invQty;
    else if (label.includes('eco') && label.includes('development')) out.ecoDevVehicle += amount * invQty;
    else if (label.includes('gst') || label.includes('tax')) out.gst += amount * invQty;
    else if (label.includes('rpacs') || label.includes('surcharge')) out.surcharge += amount * invQty;
  }
  return out;
}

function maskId(s: any): string {
  if (!s) return '—';
  const str = String(s);
  return str.length <= 4 ? str : '*'.repeat(str.length - 4) + str.slice(-4);
}

function checkNationality(n: any): string {
  const v = String(n || '').toLowerCase();
  return (v === 'foreigner' || v === 'foreign' || v === 'fn') ? 'Foreigner' : 'Indian';
}

function generateQrDataUrl(value: string): string {
  if (!value) return '';
  try {
    const qr = QRCode(0, 'M');
    qr.addData(value);
    qr.make();
    return qr.createDataURL(8, 0);
  } catch { return ''; }
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] || '';
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function wrapLines(text: string, maxChars: number): string[] {
  const cleaned = String(text || '').replace(/\s+/g, ' ').trim();
  if (!cleaned) return [];
  const words = cleaned.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxChars) cur = next;
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function fileFromPdf(bytes: Uint8Array, name: string): File {
  const buf = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buf).set(bytes);
  return new File([buf], name, { type: 'application/pdf' });
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
  const invTotals = computeInventoryChargeSummary(ticket);
  const qrValue = ticket.qrDetail
    || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: ticket.id || ticket.bookingId } });

  const totalRow = (() => {
    const cls = classifyChargeRow(ticket ?? {});
    return {
      entryFeeVisitor:  cls.entryFeeVisitor || invTotals.entryFeeVisitor,
      entryFeeVehicle:  cls.entryFeeVehicle || invTotals.entryFeeVehicle,
      ecoDevVisitor:    cls.ecoDevVisitor   || invTotals.ecoDevVisitor,
      ecoDevVehicle:    cls.ecoDevVehicle   || invTotals.ecoDevVehicle,
      tigerReserveFund: cls.tigerReserveFund,
      vehicleRent:      cls.vehicleRent || invTotals.vehicleRent,
      guideFee:         cls.guideFee,
      gst:              cls.gst || invTotals.gst,
    };
  })();
  const rpacsTotal = toNum(ticket.rpacsCharges ?? ticket.rpacs ?? ticket.surcharge ?? ticket.surCharge) || invTotals.surcharge;
  const addonTotal = pickNum(ticket, 'addonTotal', 'addonCharges', 'addOnCharges') ||
    visitors.reduce((sum: number, t: any) => sum + (Array.isArray(t?.addonItems)
      ? t.addonItems.reduce((s: number, a: any) => s + toNum(a?.totalAmount ?? a?.amount), 0) : 0), 0);
  const rislTotal  = toNum(ticket.rislCharges ?? ticket.rislCharge ?? ticket.platformCharges) || invTotals.rislCharge;

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
    drawRow('Total', [totalRow.entryFeeVisitor, totalRow.entryFeeVehicle, totalRow.ecoDevVisitor, totalRow.ecoDevVehicle, totalRow.tigerReserveFund, totalRow.vehicleRent, totalRow.guideFee, totalRow.gst]);

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

// ════════════════════════════════════════════════════════════════════════════
//  SANDSTONE / NON-INVENTORY share PDF
//  Mirrors the "Single Entry Pass" download with gold strip + 3 visit cells
//  + ticket breakdown list + booking-reference band.
// ════════════════════════════════════════════════════════════════════════════

export async function buildSandstoneShareFile(ticket: any): Promise<File> {
  const bookingId = String(ticket.bookingId || ticket.id || '');
  const placeName = (ticket.placeDetailDto?.name || ticket.placeName || 'Booking') as string;
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
  // "1 Indian Citizen, 1 Indian Student" line + "Indian Citizen × 1" breakdown
  const ticketBreakdown: Array<{ name: string; qty: number }> = visitors.map((v) => ({
    name: String(v?.ticketName || 'Visitor'),
    qty:  Number(v?.qty) || (Array.isArray(v?.ticketUserDocs) ? v.ticketUserDocs.length : 0) || 1,
  })).filter((r) => r.qty > 0);
  const visitorSummary = ticketBreakdown.length
    ? ticketBreakdown.map((r) => `${r.qty} ${r.name}`).join(', ')
    : `${totalUsers} Visitor${totalUsers === 1 ? '' : 's'}`;

  const perTicket = (() => {
    const charge = ticket?.specificCharges?.[0];
    const direct = toNum(charge?.totalAmount ?? charge?.amount);
    if (direct > 0) return direct;
    if (totalUsers > 0 && totalAmt > 0) return Math.round(totalAmt / totalUsers);
    return totalAmt;
  })();

  const qrValue = ticket.qrDetail
    || JSON.stringify({ type: 'BOOKING', data: { ticketBookingId: ticket.id || ticket.bookingId } });

  const pdfDoc = await PDFDocument.create();
  const fSans  = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fSansB = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fSerif = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fMonoB = await pdfDoc.embedFont(StandardFonts.CourierBold);

  const PW = 595.28, PH = 841.89, M = 28;
  const orange     = rgb(0.722, 0.290, 0.055);
  const orangeDark = rgb(0.420, 0.137, 0.035);
  const dark       = rgb(0.176, 0.078, 0.000);
  const muted      = rgb(0.608, 0.333, 0.125);
  const cream      = rgb(0.969, 0.929, 0.847);
  const cellBg     = rgb(0.965, 0.918, 0.836);
  const gold       = rgb(0.831, 0.627, 0.090);
  const goldStrip  = rgb(0.875, 0.741, 0.137);
  const ruleSoft   = rgb(0.85, 0.70, 0.50);
  const white      = rgb(1, 1, 1);

  const page = pdfDoc.addPage([PW, PH]);
  page.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: cream });
  const drawText = (text: string, x: number, y: number, opts: any) => page.drawText(text, { x, y, ...opts });
  const truncate = (s: string, max: number) => s.length > max ? s.slice(0, Math.max(0, max - 1)) + '…' : s;

  // ── Header band (brown→orange) ──────────────────────────────────────────
  page.drawRectangle({ x: 0, y: PH - 100, width: PW, height: 100, color: orangeDark });
  page.drawRectangle({ x: 0, y: PH - 200, width: PW, height: 100, color: orange });

  drawText('GOVERNMENT OF RAJASTHAN', M + 50, PH - 30, { size: 8, font: fSansB, color: rgb(1, 1, 1) });
  drawText('Department of Tourism', M + 50, PH - 46, { size: 12, font: fSansB, color: white });
  page.drawCircle({ x: M + 25, y: PH - 42, size: 19, color: rgb(0.30, 0.10, 0.03), borderColor: rgb(1,1,1), borderWidth: 1 });
  drawText('III', M + 18, PH - 48, { size: 12, font: fSerif, color: white });

  drawText(truncate(placeName, 36), M, PH - 110, { size: 26, font: fSerif, color: white });
  const locParts = [district, 'Rajasthan', 'India'].filter(Boolean).join(', ');
  if (locParts) drawText(truncate(locParts.toUpperCase(), 70), M, PH - 132, { size: 9, font: fSans, color: rgb(0.95, 0.88, 0.82) });

  // QR — large card top-right
  const qrDataUrl = generateQrDataUrl(qrValue);
  if (qrDataUrl) {
    try {
      const qrImg = await pdfDoc.embedPng(dataUrlToBytes(qrDataUrl));
      page.drawRectangle({ x: PW - 152, y: PH - 152, width: 132, height: 132, color: white });
      page.drawImage(qrImg, { x: PW - 148, y: PH - 148, width: 124, height: 124 });
    } catch {}
  }

  // ── Gold "Single Entry Pass" strip ──────────────────────────────────────
  page.drawRectangle({ x: 0, y: PH - 232, width: PW, height: 32, color: goldStrip });
  drawText('---  Single Entry Pass  ---', M, PH - 220, { size: 11, font: fSerif, color: dark });
  const priceText = `Rs. ${perTicket.toFixed(0)} / Ticket`;
  drawText(priceText, PW - M - priceText.length * 7, PH - 220, { size: 11, font: fSansB, color: dark });

  let y = PH - 260;

  // ── 3 visit-info cells: Visit Date / Visitors / Time Slot ───────────────
  {
    const cells: Array<{ label: string; main: string; sub: string }> = [
      { label: 'Visit Date',  main: visitDateMonth, sub: visitDateYear },
      { label: 'Visitors',    main: `${totalUsers || ticketBreakdown.reduce((s, r) => s + r.qty, 0)} Visitor${(totalUsers || 1) === 1 ? '' : 's'}`, sub: visitorSummary },
      { label: 'Time Slot',   main: shiftName,      sub: shiftSub || '—' },
    ];
    const cellW = (PW - M * 2 - 16) / 3;
    const cellH = 90;
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      const cx = M + i * (cellW + 8);
      page.drawRectangle({ x: cx, y: y - cellH, width: cellW, height: cellH, color: cellBg, borderColor: rgb(0.90, 0.62, 0.30), borderWidth: 0.4 });
      // label
      drawText(c.label.toUpperCase(), cx + cellW / 2 - (c.label.length * 2.4), y - 30, { size: 8, font: fSansB, color: muted });
      // main value (large serif)
      const mainTrim = truncate(c.main, Math.floor((cellW - 8) / 7));
      drawText(mainTrim, cx + cellW / 2 - (mainTrim.length * 4.4), y - 52, { size: 14, font: fSerif, color: dark });
      // sub
      const subTrim = truncate(c.sub || '', Math.floor((cellW - 8) / 4.6));
      drawText(subTrim, cx + cellW / 2 - (subTrim.length * 2.4), y - 70, { size: 8, font: fSans, color: muted });
    }
    y -= cellH + 18;
  }

  // ── Dashed divider ──────────────────────────────────────────────────────
  {
    const dashLen = 4, gap = 4;
    let dx = M;
    while (dx < PW - M) {
      page.drawLine({ start: { x: dx, y }, end: { x: Math.min(dx + dashLen, PW - M), y }, thickness: 0.6, color: ruleSoft });
      dx += dashLen + gap;
    }
    y -= 20;
  }

  // ── TICKET BREAKDOWN heading + 2-column list ────────────────────────────
  drawText('TICKET BREAKDOWN', M, y, { size: 8, font: fSansB, color: muted });
  y -= 16;

  {
    // First N items: ticket types; rest: rules
    const RULES = [
      'Carry valid ID proof for verification',
      'Entry on booked date and time only',
      'Non-transferable and non-refundable',
      'Photography restricted in some areas',
      'Arrive 15 mins before your time slot',
      'Follow museum guidelines and staff',
    ];
    const items: string[] = [
      ...ticketBreakdown.map((r) => `${r.name} x ${r.qty}`),
      ...RULES,
    ];
    // If we have an odd count, balance: pair items by index modulo 2
    const colGap = 24;
    const colW = (PW - M * 2 - colGap) / 2;
    const half = Math.ceil(items.length / 2);
    const left = items.slice(0, half);
    const right = items.slice(half);
    const drawColumn = (list: string[], xStart: number) => {
      let ty = y;
      for (const it of list) {
        drawText('+', xStart, ty, { size: 10, font: fSansB, color: orange });
        drawText(truncate(it, 50), xStart + 12, ty, { size: 9.5, font: fSans, color: dark });
        ty -= 22;
      }
      return ty;
    };
    const yL = drawColumn(left, M);
    const yR = drawColumn(right, M + colW + colGap);
    y = Math.min(yL, yR) - 8;
  }

  // ── Booking Reference dark band ─────────────────────────────────────────
  if (y < 110) y = 110;
  {
    const bandH = 36;
    page.drawRectangle({ x: M, y: y - bandH, width: PW - M * 2, height: bandH, color: rgb(0.40, 0.20, 0.08) });
    drawText('BOOKING REFERENCE', M + 14, y - 22, { size: 9, font: fSansB, color: rgb(0.85, 0.70, 0.50) });
    const idText = bookingId;
    drawText(idText, PW - M - 14 - idText.length * 7.2, y - 22, { size: 11, font: fMonoB, color: gold });
    y -= bandH + 14;
  }

  // ── Footer band ─────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width: PW, height: 64, color: dark });
  drawText('Phone:  141-220-0234', M, 44, { size: 9, font: fSans, color: rgb(0.78, 0.74, 0.68) });
  drawText('Email:  support@rajasthantourism.gov.in', M, 30, { size: 9, font: fSans, color: rgb(0.78, 0.74, 0.68) });
  drawText('Web:    obms-tourist.rajasthan.gov.in', M, 16, { size: 9, font: fSans, color: rgb(0.78, 0.74, 0.68) });
  drawText('OBMS', PW - M - 36, 42, { size: 14, font: fSerif, color: gold });
  drawText('RAJASTHAN TOURISM', PW - M - 110, 24, { size: 7, font: fSansB, color: rgb(0.55, 0.50, 0.42) });

  void ruleSoft;
  return fileFromPdf(await pdfDoc.save(), `ticket_${bookingId}.pdf`);
}

// ════════════════════════════════════════════════════════════════════════════
//  JKK share PDF — pink/rose theme to match the JKK download identity
// ════════════════════════════════════════════════════════════════════════════

export async function buildJkkShareFile(ticket: any): Promise<File> {
  const bookingId   = String(ticket.bookingId || ticket.id || '');
  const placeName   = (ticket.placeName || ticket.placeDetailDto?.name || 'Jawahar Kala Kendra') as string;
  const createdDate = ticket.createdDate ? moment(ticket.createdDate).format('DD MMM YYYY') : '—';
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
