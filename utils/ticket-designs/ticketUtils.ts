import moment from 'moment-timezone';
import QRCode from 'qrcode-generator';

export function toNum(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function getPath(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  if (!path.includes('.')) return obj?.[path];
  return path.split('.').reduce((acc: any, key: string) => acc?.[key], obj);
}

export function pickNum(obj: any, ...paths: string[]): number {
  for (const p of paths) {
    const v = getPath(obj, p);
    if (v === undefined || v === null || v === '') continue;
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

export function maskId(s: any): string {
  if (!s) return '—';
  const str = String(s);
  return str.length <= 4 ? str : '*'.repeat(str.length - 4) + str.slice(-4);
}

export function checkNationality(n: any): string {
  const v = String(n || '').toLowerCase();
  return (v === 'foreigner' || v === 'foreign' || v === 'fn') ? 'Foreigner' : 'Indian';
}

export function normChargeName(v: any): string {
  return String(v || '').trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
}

export function resolveChargeLabel(row: any): string {
  return row?.category ?? row?.chargeName ?? row?.chargeHead ?? row?.head ?? row?.name ?? row?.ticketName ?? row?.type ?? '';
}

export interface ClassifiedCharges {
  entryFeeVisitor: number;
  entryFeeVehicle: number;
  ecoDevVisitor: number;
  ecoDevVehicle: number;
  tigerReserveFund: number;
  vehicleRent: number;
  vehicleGst: number;
  guideFee: number;
  guideGst: number;
}

export function classifyChargeRowExtended(row: any): ClassifiedCharges {
  // Prefer 'amount' over 'totalAmount' because in many API responses, 
  // totalAmount is 0.0 while 'amount' holds the actual unit price.
  const amount = pickNum(row, 'amount') || pickNum(row, 'totalAmount', 'chargeAmount', 'value');
  const label = normChargeName(resolveChargeLabel(row));
  
  const direct = {
    entryFeeVisitor: pickNum(row, 'entryFeeVisitor', 'entryFeesVisitor', 'visitorEntryFee', 'visitorEntryFees', 'touristEntryFee', 'touristEntryFees'),
    entryFeeVehicle: pickNum(row, 'entryFeeVehicle', 'entryFeesVehicle', 'vehicleEntryFee', 'vehicleEntryFees'),
    ecoDevVisitor: pickNum(row, 'ecoDevVisitor', 'ecoDevelopmentVisitor', 'ecodevVisitor', 'vfpmcVisitor'),
    ecoDevVehicle: pickNum(row, 'ecoDevVehicle', 'ecoDevelopmentVehicle', 'ecodevVehicle', 'vfpmcVehicle'),
    tigerReserveFund: pickNum(row, 'tigerReserveFund', 'tigerFund', 'tigerReserve', 'trdf', 'developmentFund'),
    vehicleRent: pickNum(row, 'vehicleRent', 'vehicleRentAmount', 'vehicleRentCharges', 'vehicleCharge', 'vehicleCharges'),
    guideFee: pickNum(row, 'guideFee', 'guideFees', 'guideAmount', 'guideCharge', 'guideCharges'),
    vehicleGst: 0,
    guideGst: 0,
  };

  const hasDirect = Object.values(direct).some(v => typeof v === 'number' && v > 0);
  if (hasDirect) {
    const isGst = label.includes('gst') || label.includes('tax');
    if (isGst && amount) {
      if (label.includes('guide')) direct.guideGst = amount;
      else if (label.includes('vehicle') || label.includes('rent') || label.includes('gypsy') || label.includes('canter')) direct.vehicleGst = amount;
      else direct.guideGst = amount;
    }
    return direct;
  }

  const out: ClassifiedCharges = {
    entryFeeVisitor: 0, entryFeeVehicle: 0, ecoDevVisitor: 0, ecoDevVehicle: 0,
    tigerReserveFund: 0, vehicleRent: 0, vehicleGst: 0, guideFee: 0, guideGst: 0
  };

  if (!amount) return out;

  const isVehicle = label.includes('vehicle') || label.includes('gypsy') || label.includes('canter') || label.includes('bus');
  const isGst = label.includes('gst') || label.includes('tax');

  if (isGst) {
    if (label.includes('guide')) out.guideGst = amount;
    else if (isVehicle || label.includes('rent')) out.vehicleGst = amount;
    else out.guideGst = amount;
  } else if (label.includes('entry fee') || label === 'entry') {
    if (isVehicle) out.entryFeeVehicle = amount;
    else out.entryFeeVisitor = amount;
  } else if (label.includes('eco') || label.includes('vfpmc') || label.includes('surcharge')) {
    // Check if it's explicitly "Surcharge-rpacs" (which is booking level)
    if (label.includes('rpacs')) return out; 
    
    if (isVehicle || label.includes('development')) out.ecoDevVehicle = amount;
    else out.ecoDevVisitor = amount;
  } else if (label.includes('tiger') || label.includes('trdf') || label.includes('tiger reserve development')) {
    out.tigerReserveFund = amount;
  } else if (label.includes('vehicle rent') || label.includes('rent') || label.includes('hire') || label.includes('gypsy') || label.includes('canter')) {
    out.vehicleRent = amount;
  } else if (label.includes('guide')) {
    out.guideFee = amount;
  }

  return out;
}

export function generateQrSvgRects(data: string, scale = 96): { rects: string; count: number } {
  const qr = QRCode(0, 'L');
  qr.addData(data || '');
  qr.make();
  const count = qr.getModuleCount();
  const size = scale;
  const cell = size / count;
  let rects = '';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) rects += `<rect x="${c}" y="${r}" width="1" height="1" />`;
    }
  }
  return { rects, count };
}

export function computeAddonTotal(ticket: any): number {
  const visitors: any[] = Array.isArray(ticket?.ticketUserDto) ? ticket.ticketUserDto : [];
  const seen = new Set<string>();
  let sum = 0;
  for (const t of visitors) {
    const items = Array.isArray(t?.addonItems) ? t.addonItems : [];
    for (const a of items) {
      const name = normChargeName(a?.name || a?.ticketName || a?.addonName);
      const qty = toNum(a?.qty) || 1;
      const total = toNum(a?.totalAmount) || (toNum(a?.amount) * qty);
      if (!total) continue;
      const key = `${name}|${qty}|${total}`;
      if (seen.has(key)) continue;
      seen.add(key);
      sum += total;
    }
  }
  return sum || pickNum(ticket, 'addonTotal', 'addonCharges', 'addOnSurcharge', 'addonSurcharge', 'addOnCharge', 'addOnCharges');
}

export function computeRislTotal(ticket: any): number {
  const charges: any[] = ticket.ticketCharges || ticket.chargeDetails || ticket.charges || [];
  return (
    toNum(ticket.rislCharges ?? ticket.rislCharge ?? ticket.platformCharges ?? ticket.platformCharge) ||
    (Array.isArray(charges) ? charges.reduce((s: number, c: any) => s + toNum(c?.rislCharges ?? c?.platformCharges), 0) : 0)
  );
}

export function generateQrDataUrl(data: string): string {
  const qr = QRCode(0, 'L');
  qr.addData(data || '');
  qr.make();
  return qr.createDataURL(4);
}

export function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] || '';
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function wrapLines(text: string, maxChars: number): string[] {
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

export function fileFromPdf(bytes: Uint8Array, name: string): File {
  const buf = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buf).set(bytes);
  return new File([buf], name, { type: 'application/pdf' });
}

export function buildChargesRowsHtml(ticket: any): string {
  const visitors: any[] = Array.isArray(ticket?.ticketUserDto) ? ticket.ticketUserDto : [];
  const invShared: any[] = Array.isArray(ticket?.inventory?.ticketTypeConfigList) ? ticket.inventory.ticketTypeConfigList : [];
  const totalUsers = toNum(ticket.totalUsers) || visitors.reduce((s, t) => s + (toNum(t.qty) || 1), 0) || 1;
  
  if (visitors.length > 0) {
    const groups = new Map<string, { qty: number; sums: ClassifiedCharges }>();
    
    for (const v of visitors) {
      const name = String(v.ticketName || 'Visitor');
      const qty = toNum(v.qty) || 1;
      
      const visitorSums: ClassifiedCharges = {
        entryFeeVisitor: 0, entryFeeVehicle: 0, ecoDevVisitor: 0, ecoDevVehicle: 0,
        tigerReserveFund: 0, vehicleRent: 0, vehicleGst: 0, guideFee: 0, guideGst: 0
      };

      // 1. Visitor-specific charges (from ticketTypeConfigList OR fixCharges)
      const cfgList = Array.isArray(v?.ticketTypeConfigValue?.ticketTypeConfigList)
        ? v.ticketTypeConfigValue.ticketTypeConfigList
        : Array.isArray(v?.fixCharges) ? v.fixCharges : [];
      
      for (const line of cfgList) {
        const p = classifyChargeRowExtended(line);
        // Exclude RISL/Platform fees from the summary columns (they go in footer)
        const label = normChargeName(resolveChargeLabel(line));
        if (label.includes('risl') || label.includes('platform')) continue;

        visitorSums.entryFeeVisitor += p.entryFeeVisitor;
        visitorSums.entryFeeVehicle += p.entryFeeVehicle;
        visitorSums.ecoDevVisitor += p.ecoDevVisitor;
        visitorSums.ecoDevVehicle += p.ecoDevVehicle;
        visitorSums.tigerReserveFund += p.tigerReserveFund;
        visitorSums.vehicleRent += p.vehicleRent;
        visitorSums.vehicleGst += p.vehicleGst;
        visitorSums.guideFee += p.guideFee;
        visitorSums.guideGst += p.guideGst;
      }

      // 2. Shared booking-level charges
      for (const line of invShared) {
        const p = classifyChargeRowExtended(line);
        const label = normChargeName(resolveChargeLabel(line));
        if (label.includes('risl') || label.includes('platform') || label.includes('rpacs') || label.includes('surcharge')) continue;

        // Check if the inventory items are unit prices or booking totals
        const invQty = toNum(ticket.inventory?.qty) || totalUsers;
        const invPrice = toNum(ticket.inventory?.price);
        const invTotal = toNum(ticket.inventory?.totalAmount);
        
        // If total equals qty * price, then the line amounts are unit prices
        const isUnitPrice = Math.abs(invTotal - (invQty * invPrice)) < 1;
        const shareFactor = isUnitPrice ? 1 : (1 / totalUsers);

        visitorSums.entryFeeVisitor += p.entryFeeVisitor * shareFactor;
        visitorSums.entryFeeVehicle += p.entryFeeVehicle * shareFactor;
        visitorSums.ecoDevVisitor += p.ecoDevVisitor * shareFactor;
        visitorSums.ecoDevVehicle += p.ecoDevVehicle * shareFactor;
        visitorSums.tigerReserveFund += p.tigerReserveFund * shareFactor;
        visitorSums.vehicleRent += p.vehicleRent * shareFactor;
        visitorSums.vehicleGst += p.vehicleGst * shareFactor;
        visitorSums.guideFee += p.guideFee * shareFactor;
        visitorSums.guideGst += p.guideGst * shareFactor;
      }

      if (!groups.has(name)) {
        groups.set(name, { qty: 0, sums: visitorSums });
      }
      const g = groups.get(name)!;
      g.qty += qty;
    }

    if (groups.size > 0) {
      let html = '';
      groups.forEach((data, name) => {
        const toCell = (n: number) => {
          const val = n * data.qty;
          return val > 0 ? val.toFixed(2) : '0';
        };
        html += `
          <tr>
            <td class="cds-left">${name} x ${data.qty}</td>
            <td>${toCell(data.sums.entryFeeVisitor)}</td>
            <td>${toCell(data.sums.entryFeeVehicle)}</td>
            <td>${toCell(data.sums.ecoDevVisitor)}</td>
            <td>${toCell(data.sums.ecoDevVehicle)}</td>
            <td>${toCell(data.sums.tigerReserveFund)}</td>
            <td>${toCell(data.sums.vehicleRent)}</td>
            <td>${toCell(data.sums.vehicleGst)}</td>
            <td>${toCell(data.sums.guideFee)}</td>
            <td>${toCell(data.sums.guideGst)}</td>
          </tr>`;
      });
      return html;
    }
  }

  // Fallback to booking level charges if no visitors or grouping failed
  const charges: any[] = ticket.ticketCharges || ticket.chargeDetails || ticket.charges || [];
  const rows: any[] = Array.isArray(charges) ? charges : [];
  if (rows.length === 0) return '';

  return rows.map((c: any) => {
    const p = classifyChargeRowExtended(c);
    const name = String(c.category || c.ticketName || c.name || '—');
    const toCell = (n: number) => n > 0 ? n.toFixed(2) : '0';
    const tiger = pickNum(c, 'tigerReserveFund', 'tigerFund', 'trdf') || p.tigerReserveFund;
    return `
      <tr>
        <td class="cds-left">${name}</td>
        <td>${toCell(p.entryFeeVisitor)}</td>
        <td>${toCell(p.entryFeeVehicle)}</td>
        <td>${toCell(p.ecoDevVisitor)}</td>
        <td>${toCell(p.ecoDevVehicle)}</td>
        <td>${toCell(tiger)}</td>
        <td>${toCell(p.vehicleRent)}</td>
        <td>${toCell(p.vehicleGst)}</td>
        <td>${toCell(p.guideFee)}</td>
        <td>${toCell(p.guideGst)}</td>
      </tr>`;
  }).join('');
}

export function renderChargesDetailSummary(ticket: any, addonTotal: number, rislTotal: number, totalAmount: number): string {
  const chargesRowsHtml = buildChargesRowsHtml(ticket) || `<tr><td class="cds-left" colspan="10" style="text-align:center;color:#888;padding:10px">Charge details not available</td></tr>`;

  return `
    <style>
      .cds-box { border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; margin-bottom: 22px; background: transparent; }
      .cds-title { background: rgba(0,0,0,0.05); padding: 12px 16px; font-size: 14px; font-weight: 700; color: #333; border-bottom: 1px solid rgba(0,0,0,0.05); }
      .cds-table { width: 100%; border-collapse: collapse; font-size: 11px; background: transparent; }
      .cds-table thead th { background: rgba(0,0,0,0.03); border-bottom: 1px solid rgba(0,0,0,0.1); border-right: 1px solid rgba(0,0,0,0.1); padding: 8px 4px; color: #333; font-weight: 700; text-align: center; }
       .cds-table thead tr:last-child th { font-size: 10px; background: rgba(0,0,0,0.02); }
       .cds-table td { padding: 8px 4px; border-bottom: 1px solid rgba(0,0,0,0.08); border-right: 1px solid rgba(0,0,0,0.08); text-align: center; font-family: 'Space Mono', monospace; color: #444; }
      .cds-table td:last-child, .cds-table th:last-child { border-right: none; }
      .cds-left { text-align: left !important; font-family: 'Rajdhani', sans-serif !important; font-weight: 700; color: #333 !important; }
      .cds-foot td { background: rgba(0,0,0,0.03); font-family: 'Rajdhani', sans-serif; font-weight: 700; color: #333; }
      .cds-foot .amt { font-family: 'Space Mono', monospace; font-weight: 800; text-align: left !important; padding-left: 10px; }
    </style>
    <div class="cds-box">
      <div class="cds-title">Charges Detail Summary</div>
      <table class="cds-table">
        <thead>
          <tr>
            <th rowspan="2" style="text-align:left;width:120px;">Visitor</th>
            <th colspan="2">Entry Fee</th>
            <th colspan="2">Eco-Development</th>
            <th rowspan="2" style="width:140px;">Tiger Reserve Development Fund<br/><span style="font-size:9px;font-weight:500;color:#666;">Visitor + Vehicle + Guide</span></th>
            <th colspan="2">Vehicle Fees</th>
            <th colspan="2">Guide Fee</th>
          </tr>
          <tr>
            <th>Visitor</th>
            <th>Vehicle</th>
            <th>Visitor</th>
            <th>Vehicle</th>
            <th>Rent</th>
            <th>GST</th>
            <th>Charge</th>
            <th>GST</th>
          </tr>
        </thead>
        <tbody>
          ${chargesRowsHtml}
          <tr class="cds-foot">
            <td class="cds-left">AddOn Charges</td>
            <td class="amt" colspan="9">${toNum(addonTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr class="cds-foot">
            <td class="cds-left">RISL Charges</td>
            <td class="amt" colspan="9">${toNum(rislTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
          <tr class="cds-foot">
            <td class="cds-left" style="font-size:14px; color:#B84A0E !important;">Grand Total</td>
            <td class="amt" colspan="9" style="font-size:16px; color:#B84A0E;">${toNum(totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}
