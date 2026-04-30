import moment from 'moment-timezone';
import QRCode from 'qrcode-generator';
import { showErrorToastMessage } from '@/utils/toast.utils';

const TIMEZONE_INDIA = 'Asia/Kolkata';

function maskString(s: any): string {
  const str = String(s ?? '');
  if (!str) return '';
  if (str.length > 4) return '*'.repeat(str.length - 4) + str.slice(-4);
  return str;
}

function checkNationality(text: any): string {
  return String(text ?? '').toLowerCase().includes('foreign') ? 'Foreigner' : 'Indian';
}

function extractAddonNames(addonItems: any): string {
  if (!Array.isArray(addonItems)) return '';
  return addonItems.map((it: any) => it?.name).filter(Boolean).join(', ');
}

function generateQrDataUrl(value: string): string {
  if (!value) return '';
  try {
    const qr = QRCode(0, 'L');
    qr.addData(value);
    qr.make();
    return qr.createDataURL();
  } catch {
    return '';
  }
}

function escapeHtml(input: any): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const TERMS_FOR_VISITORS: string[] = [
  'The visitor must reach the boarding point at least 15 minutes prior to the departure time.',
  'Any violation of rules will be punishable under Wildlife Protection Act 1972.',
  'Any visitors must carry their valid ID cards used for booking.',
  'There are no charges for a child below the age of 5 years (as age on booking date) however full charges are applicable for children above 5 years.',
  "The ID proof of visitor produced at the time of collecting boarding pass should be the ID used while booking online permit, failing which, the permit will be deemed fake and liable to be cancelled. The visitors must carry original ID / DigiLocker ID during visit.",
  'Visitors under the influence of alcohol or intoxicating substances will be denied entry to the park, and may face legal consequences as per Forest Department regulations.',
];

const DOS_JHALANA: string[] = [
  'User must login to OBMS with valid username and password which is registered through SSO.',
  'Avoid multiple login using same username and password and booking for other.',
  'While entering ID do not put space or extra characters, which may lead to ghost entry.',
  'Please book permit related to your travel with valid ID proof number.',
  'While booking please enter all mandatory fields.',
  'Permit is disbursed based on the first come first service basis.',
  'The payment does not guarantee E-Permit. Confirmed permit would be available only as per seat availability.',
  'System checks availability after financial transaction from E-Mitra. If stock of permit is exhausted, system does not allow printing option.',
  'System traces permit booking less than 20 sec. for overall booking activity as suspicious booking activity.',
  'Please logout after every usage of online booking system.',
];

const DOS_DEFAULT: string[] = [
  'Enter the park with a valid ticket.',
  'Take an official guide with you inside the park.',
  'Maximum speed limit is 20 km/hr.',
  'Always carry drinking water.',
  'Maintain silence and discipline during excursions.',
  'Allow the animals to have the right of way.',
  'Wear colors which match with nature.',
  'Please carry maps / guide book for your reference.',
  'If the driver and guide violate the rules, report to the department at the contacts mentioned on this boarding pass.',
];

const DONTS_JHALANA: string[] = [
  'Over booking at particular place, zone, shift liable to cancellation and refund.',
  "The registration with invalid address, email-IDs and mobile numbers are liable to be deactivated.",
  'Do not click on back button and refresh while going to payment page.',
  'Do not use cross-site script to book permit.',
  'Do not use any agent for booking your own permit.',
];

const DONTS_DEFAULT: string[] = [
  "Don't get down, unless told by the guide.",
  "Don't carry arms, explosives or intoxicants inside the park.",
  "Don't blow horn.",
  "Don't litter with cans, bottles, plastic bags etc.",
  "Don't try to feed the animals.",
  "Don't smoke or lit fire.",
  "Don't tease or chase the animals.",
  "Don't leave plastic / polybags.",
];

function listHtml(items: string[]): string {
  return `<ul style="margin-top:10px;padding-left:20px;">${items
    .map(
      (it) =>
        `<li style="color:#323232;font-size:10px;font-weight:500;margin-bottom:8px;">${escapeHtml(it)}</li>`,
    )
    .join('')}</ul>`;
}

export function printBoardingPass(info: any) {
  const w = window.open('', '_blank', 'width=1024,height=1200');
  if (!w) {
    showErrorToastMessage('Please allow popups to print the boarding pass');
    return;
  }

  const placeName    = info?.placeName || '';
  const zoneName     = info?.zoneName || '';
  const bookingNumber = info?.bookingNumber || info?.bookingId || '';
  const reservationDate = info?.reservationDate;
  const modeOfBooking = info?.modeOfBooking || 'ONLINE';
  const subInventoryTypeName = info?.subInventoryTypeName || '';
  const members = info?.members ?? '';
  const boardingDate = info?.boardingDate;
  const ticketAmount = info?.vip === true ? info?.vipTicketAmount : info?.ticketAmount;
  const contactNo = info?.userDetails?.[0]?.mobile || '';
  const shiftName = info?.shiftDto?.name || '';
  const shiftStart = info?.shiftDto?.startTime;
  const shiftEnd = info?.shiftDto?.endTime;
  const guideName = info?.guideName || '';
  const guideMobile = info?.guideMobile || '';
  const vehicleId = info?.vehicleId || '';
  const driverName = info?.driverName || '';
  const driverMobile = info?.driverMobile || '';
  const userDetails: any[] = Array.isArray(info?.userDetails) ? info.userDetails : [];
  const qrDetails = info?.qrDetails || '';

  const qrDataUrl = generateQrDataUrl(qrDetails);
  const fmtDate = (d: any) => (d ? moment(Number(d) || d).format('DD-MM-YYYY') : '—');
  const fmtTime = (d: any) => (d ? moment(Number(d) || d).tz(TIMEZONE_INDIA).format('hh:mm A') : '');
  const fmtDateTime = (d: any) =>
    d
      ? `${moment(Number(d) || d).format('DD-MM-YYYY')} | ${moment(Number(d) || d).tz(TIMEZONE_INDIA).format('hh:mm:ss A')}`
      : '—';

  const isJhalana = String(placeName || '').toLowerCase().includes('jhalana');
  const dos   = isJhalana ? DOS_JHALANA   : DOS_DEFAULT;
  const donts = isJhalana ? DONTS_JHALANA : DONTS_DEFAULT;

  const visitorRowsHtml = userDetails.length
    ? userDetails
        .map((items: any, index: number) => {
          const docNo = items?.documentNo ? maskString(items.documentNo) : '—';
          const docLine = items?.document ? `${escapeHtml(items.document)}/${escapeHtml(docNo)}` : escapeHtml(docNo);
          return `<tr>
            <td style="padding:10px 15px;color:#323232;font-size:12px;font-weight:500;border-bottom:1px solid #3232321c;">${index + 1}</td>
            <td style="padding:10px 15px;color:#323232;font-size:12px;font-weight:500;border-bottom:1px solid #3232321c;">${escapeHtml(items?.fullName || '—')}</td>
            <td style="padding:10px 15px;color:#323232;font-size:12px;font-weight:500;border-bottom:1px solid #3232321c;">${docLine}</td>
            <td style="padding:10px 15px;color:#323232;font-size:12px;font-weight:500;border-bottom:1px solid #3232321c;">${escapeHtml(checkNationality(items?.nationality))}</td>
            <td style="padding:10px 15px;color:#323232;font-size:12px;font-weight:500;border-bottom:1px solid #3232321c;">${escapeHtml(items?.ticketType || '—')}</td>
            <td style="padding:10px 15px;color:#323232;font-size:12px;font-weight:500;border-bottom:1px solid #3232321c;">${escapeHtml(extractAddonNames(items?.addonItems) || '—')}</td>
          </tr>`;
        })
        .join('')
    : `<tr><td colspan="6" style="padding:14px;text-align:center;color:#888;font-size:12px;">No visitor details available</td></tr>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Boarding Pass — ${escapeHtml(bookingNumber)}</title>
<style>
*{box-sizing:border-box;}
body{margin:0;background:#f1f1f1;font-family:Arial,Helvetica,sans-serif;padding:24px;}
.outer-pdf{padding:32px;width:950px;margin:0 auto;border:1px solid rgba(50,50,50,0.30);background:#ffffff;}
table{border-collapse:collapse;}
.action-bar{display:flex;gap:10px;justify-content:center;margin-top:24px;}
.action-bar button{font-size:14px;font-weight:700;letter-spacing:.5px;padding:11px 26px;border-radius:6px;cursor:pointer;border:none;}
.btn-print{background:#1d1616;color:#fff;}
.btn-close{background:#fff;color:#323232;border:1px solid #323232;}
@media print{
  body{background:#fff;padding:0;}
  .outer-pdf{border:1px solid rgba(50,50,50,0.30);}
  .action-bar{display:none !important;}
}
</style>
</head>
<body>
<div class="outer-pdf">
  <div class="top-section" style="background-color:rgba(50,50,50,0.03);border-radius:12px;padding:20px;height:73px;">
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <img src="/images/full-logo.png" style="width:160px;height:57px;padding-bottom:10px;" alt="Logo"/>
      ${qrDataUrl ? `<img src="${qrDataUrl}" alt="QR Code" style="width:120px;height:57px;padding-bottom:10px;"/>` : ''}
    </div>
  </div>

  <div class="block-one" style="border:1px solid rgba(50,50,50,0.30);background:#fff;border-radius:8px;margin-top:15px;">
    <div style="display:flex;justify-content:space-between;background:#f5f5f5;padding:10px 15px;border-radius:8px;">
      <p style="color:#323232;font-size:12px;font-weight:800;margin:0;">Boarding Pass for ${escapeHtml(placeName)}(${escapeHtml(zoneName)})</p>
      <p style="color:#323232;font-size:10px;font-weight:400;margin:0;">Generated On: ${moment().format('DD-MM-YYYY | hh:mm')}</p>
    </div>
    <div style="padding:0 15px 12px;">
      <table style="width:100%;">
        <tr>
          <td style="width:250px;">
            <p style="text-align:left;color:#404040;font-size:10px;margin:0;">Booking Id:</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;word-break:break-all;width:160px;text-align:left;">${escapeHtml(bookingNumber)}</p>
          </td>
          <td style="width:300px;">
            <p style="text-align:left;color:#404040;font-size:10px;margin:0;">Booking Date:</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;">${fmtDateTime(reservationDate)}</p>
          </td>
          <td style="width:300px;">
            <p style="color:#404040;font-size:10px;margin:0;text-align:left;">Mode of Booking:</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;">${escapeHtml(modeOfBooking)}</p>
          </td>
          <td style="width:200px;">
            <p style="text-align:left;color:#404040;font-size:10px;margin:0;">Vehicle Type:</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;">${escapeHtml(subInventoryTypeName)}</p>
          </td>
        </tr>
        <tr>
          <td style="width:400px;">
            <p style="text-align:left;color:#404040;font-size:10px;margin:0;">Route / Zone Name:</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;">${escapeHtml(zoneName)}</p>
          </td>
          <td>
            <p style="text-align:left;color:#404040;font-size:10px;margin:0;">Total Visitor:</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;">${escapeHtml(members)}</p>
          </td>
          <td>
            <p style="text-align:left;color:#404040;font-size:10px;margin:0;">Visit Date:</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;">${fmtDate(boardingDate)}</p>
          </td>
          <td>
            <p style="color:#404040;font-size:10px;margin:0;text-align:left;">Ticket Amount:</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;padding-left:5px;">₹${escapeHtml(ticketAmount ?? '0')}</p>
          </td>
        </tr>
        <tr>
          <td style="width:300px;">
            <p style="color:#404040;font-size:10px;margin:0;text-align:left;">Contact No:</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;padding-left:5px;">${escapeHtml(contactNo)}</p>
          </td>
          <td colspan="3" style="width:600px;">
            <p style="text-align:left;color:#404040;font-size:10px;margin:0;">Shift:</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;">${escapeHtml(shiftName)}${shiftStart ? ` (${escapeHtml(fmtTime(shiftStart))} - ${escapeHtml(fmtTime(shiftEnd))})` : ''}</p>
          </td>
        </tr>
      </table>
    </div>
  </div>

  <div class="block-one" style="border:1px solid rgba(50,50,50,0.30);background:#fff;border-radius:8px;margin-top:15px;">
    <div style="background:#f5f5f5;padding:10px 15px;border-radius:8px;">
      <table style="width:100%;">
        <tr>
          <td style="width:200px;">
            <p style="color:#404040;font-size:10px;margin:0;text-align:left;">Guide Name</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;">${escapeHtml(guideName) || '—'}</p>
          </td>
          <td style="width:200px;">
            <p style="text-align:left;color:#404040;font-size:10px;margin:0;">Guide Contact</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;">${escapeHtml(guideMobile) || '—'}</p>
          </td>
          <td style="width:300px;">
            <p style="text-align:left;color:#404040;font-size:10px;margin:0;">Vehicle No:</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;">${escapeHtml(vehicleId) || '—'}</p>
          </td>
          <td style="width:200px;">
            <p style="text-align:left;color:#404040;font-size:10px;margin:0;">Driver Name</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;">${escapeHtml(driverName) || '—'}</p>
          </td>
          <td style="width:200px;">
            <p style="text-align:left;color:#404040;font-size:10px;margin:0;">Driver Contact</p>
            <p style="font-size:12px;color:#323232;font-weight:800;margin:0;margin-top:6px;text-align:left;">${escapeHtml(driverMobile) || '—'}</p>
          </td>
        </tr>
      </table>
    </div>
  </div>

  <div class="block-two" style="border:1px solid rgba(50,50,50,0.40);background:#fff;margin-top:20px;">
    <table style="width:99.90%;border-collapse:collapse;border-radius:8px;margin-left:1px;">
      <tr style="background:#f5f5f5;border-radius:8px;">
        <th style="text-align:left;color:#323232;font-size:12px;font-weight:800;padding:10px 15px;">Sr.No</th>
        <th style="text-align:left;color:#323232;font-size:12px;font-weight:800;padding:10px 15px;">Visitor Name</th>
        <th style="text-align:left;color:#323232;font-size:12px;font-weight:800;padding:10px 15px;">Identity/Identity No.</th>
        <th style="text-align:left;color:#323232;font-size:12px;font-weight:800;padding:10px 15px;">Nationality</th>
        <th style="text-align:left;color:#323232;font-size:12px;font-weight:800;padding:10px 15px;">Visitor Type</th>
        <th style="text-align:left;color:#323232;font-size:12px;font-weight:800;padding:10px 15px;">Add Ons</th>
      </tr>
      ${visitorRowsHtml}
    </table>
  </div>

  <div class="block-one" style="border:1px solid rgba(50,50,50,0.30);background:#fff;border-radius:8px;margin-top:15px;">
    <div style="background:#f5f5f5;padding:10px 15px;border-radius:8px;">
      <p style="color:#323232;font-size:12px;font-weight:800;margin:0;">Terms and Conditions for Visitors</p>
    </div>
    <div style="padding:10px 15px;">${listHtml(TERMS_FOR_VISITORS)}</div>
  </div>

  <div class="block-one" style="border:1px solid rgba(50,50,50,0.30);background:#fff;border-radius:8px;margin-top:15px;">
    <div style="background:#f5f5f5;padding:10px 15px;border-radius:8px;">
      <p style="color:#323232;font-size:12px;font-weight:800;margin:0;">Abide by the rules of the : ${escapeHtml(placeName)}</p>
    </div>
    <div style="padding:5px 25px;display:flex;margin:5px;justify-content:space-between;">
      <div style="flex:1;">
        <p style="margin:0 0 10px 20px;color:#323232;font-size:12px;font-weight:800;text-align:left;">DO&rsquo;s :</p>
        ${listHtml(dos)}
      </div>
      <div style="flex:1;">
        <p style="margin:0 0 10px 20px;color:#323232;font-size:12px;font-weight:800;text-align:left;">DONT&rsquo;s :</p>
        ${listHtml(donts)}
      </div>
    </div>
  </div>

  <div class="block-one" style="border:1px solid rgba(50,50,50,0.30);background:#fff;border-radius:8px;margin-top:15px;">
    <div style="background:#f5f5f5;padding:10px 15px;border-radius:8px;">
      <p style="color:#323232;font-size:12px;font-weight:800;margin:0;">Any Query Contact Us:</p>
    </div>
    <div style="padding:5px 25px;display:flex;margin:5px;justify-content:space-between;">
      <div>
        <p style="margin:0 0 10px 20px;color:#323232;font-size:12px;font-weight:800;text-align:left;">Mobile : 01412820384</p>
      </div>
      <div>
        <p style="margin:0 0 10px 20px;color:#323232;font-size:12px;font-weight:800;text-align:left;">Email : helpdesk[dot]tourist[at]rajasthan[dot]gov[dot]in</p>
      </div>
    </div>
    <div class="footer-pagination" style="text-align:right;padding:5px 15px;margin-top:0;margin-bottom:5px;">
      <p style="color:#323232;font-size:10px;font-weight:500;">Page: 01</p>
    </div>
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
