import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type PageProps = {
  params: Promise<{ placeName: string }>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Data helpers — extracted from TermsAndConditions.tsx
// ─────────────────────────────────────────────────────────────────────────────

function formatSlug(raw: string): string {
  return decodeURIComponent(raw)
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function matchesAny(name: string, keywords: string[]): boolean {
  const lower = name.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    style={{
      fontSize: "clamp(16px, 2.5vw, 20px)",
      fontWeight: 800,
      color: "#18120E",
      margin: "0 0 16px",
      textTransform: "uppercase",
      fontFamily: "playfair-display, serif",
      letterSpacing: "0.4px",
    }}
  >
    {children}
  </h2>
);

const TermsList: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
    {items.map((item, i) => (
      <li
        key={i}
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
          background: i % 2 === 0 ? "#FFF0F7" : "#fff",
          border: "1px solid #FFD6E8",
          borderRadius: "10px",
          padding: "12px 14px",
          fontSize: "13px",
          color: "#3A2E26",
          lineHeight: 1.75,
        }}
      >
        {/* Bullet dot */}
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#E8631A,#FF69B4)",
            flexShrink: 0,
            marginTop: "6px",
          }}
        />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

interface SafariRow {
  period: string;
  morning: string;
  afternoon: string;
}

const SafariTable: React.FC<{
  note?: string;
  headers?: [string, string, string];
  rows: SafariRow[];
}> = ({
  note,
  headers = ["Period", "Morning Trip", "Afternoon Trip"],
  rows,
}) => (
  <div style={{ overflowX: "auto", marginBottom: "24px" }}>
    {note && (
      <div
        style={{
          background: "#FFF9EC",
          border: "1px solid #F0C842",
          borderRadius: "10px 10px 0 0",
          padding: "10px 16px",
          fontSize: "12px",
          color: "#2C2017",
          lineHeight: 1.6,
        }}
      >
        {note}
      </div>
    )}
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th
              key={i}
              style={{
                background: "linear-gradient(135deg,#E8631A,#FF69B4)",
                color: "#fff",
                padding: "10px 14px",
                fontSize: "12px",
                fontWeight: 700,
                textAlign: "left",
                letterSpacing: "0.3px",
                borderRadius: i === 0 ? (note ? "0" : "10px 0 0 0") : i === headers.length - 1 ? (note ? "0" : "0 10px 0 0") : "0",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "#FFF0F7" : "#fff" }}>
            <td style={{ padding: "10px 14px", fontSize: "12px", color: "#2C2017", border: "1px solid #FFD6E8", fontWeight: 600 }}>{row.period}</td>
            <td style={{ padding: "10px 14px", fontSize: "12px", color: "#3A2E26", border: "1px solid #FFD6E8" }}>{row.morning}</td>
            <td style={{ padding: "10px 14px", fontSize: "12px", color: "#3A2E26", border: "1px solid #FFD6E8" }}>{row.afternoon}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Note: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      background: "#FFF9EC",
      border: "1px solid #F0C842",
      borderRadius: "10px",
      padding: "12px 16px",
      fontSize: "13px",
      color: "#2C2017",
      lineHeight: 1.75,
      marginBottom: "16px",
    }}
  >
    <span style={{ fontWeight: 700, color: "#E8631A" }}>Please Note: </span>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Content variants
// ─────────────────────────────────────────────────────────────────────────────

const SariskaRanthamboreTC = () => (
  <>
    <SectionTitle>Terms And Conditions For Visitors</SectionTitle>
    <TermsList items={[
      "The visitor or his/her representative must reach to the Forest permit booking counter to collect the boarding pass, at least 45 minutes prior to the entry time.",
      "First visitor whose photo ID is uploaded, is mandatory to visit the park so that ID of that tourist can be checked.",
      "Use of mobile phone within tourism zone of core habitat of Sariska Tiger Reserve is not permitted.",
      "The ID proof of visitor produced at the time of collecting boarding pass should be the ID used while booking online permit, failing which the permit will be deemed fake and liable to be cancelled. The visitors must carry original ID / Digi Locker ID during visit.",
      "The charges deposited during online booking include tourist entry fee, tiger reserve development fund, vehicle entry fee, vehicle rent, guide fees and online booking charges and applicable taxes.",
      "The visitor must bring two copies of confirmation slip at the time of collecting boarding pass. One copy will be deposited in the office and the other copy will be carried by the visitor.",
      "Seats remaining vacant due to non-turn up of any visitors would be filled by the park management at the booking window.",
      "The time to receive the boarding pass will start two hours before the park entry time.",
      "In order to avoid fake bookings, a restriction of booking maximum 6 seats in single transaction has been made.",
      "In case of group booking, park authorities will try to adjust the group together in vehicles subject to space availability at the time of entry.",
      <React.Fragment key="cancellation-policy">
        If visitor cancel a permit then —<br />
        a. 75% refund of booking amount if cancellation is made 31 or more days before the date of visit.<br />
        b. 50% refund of booking amount if cancellation is made 4–30 days before the date of visit.<br />
        c. 0% refund of booking amount if cancellation is made within 3 days of the date of visit.
      </React.Fragment>,
      "In case of any changes in applicable Fees & Tax Rates, the difference amount shall be collected at the time of Boarding/entry of the park.",
      "In case the passengers are less than the capacity of the vehicle then the difference of vehicle rent and guide fee applicable uniformly per person will be charged extra.",
      "The visitors stated that he/she/they is/are aware of the risks involved in visiting the Ranthambhore/Sariska Tiger Reserve. Visitors enter the area at their own risk and shall be fully liable if any accident occurs. The protected area/forest area management shall not be responsible in any manner whatsoever. Any litigation will be enabled only in a court of law in the state of Rajasthan.",
      "The visitors should produce all documents required as per COVID-19 guidelines issued from time to time like valid RTPCR Test report, proof of 2 doses of vaccination, etc.",
      "Visitors under the influence of alcohol or intoxicating substances will be denied entry to the park, and may face legal consequences as per Forest Department regulations.",
      "For more information, visit https://obms-tourist.rajasthan.gov.in/",
    ]} />
    <Note>We will not be responsible for any costs arising out of unforeseen circumstances like landslides, road blocks, bad weather, etc.</Note>
    <SafariTable
      note="Safari timings for Sariska/Ranthambore:"
      rows={[
        { period: "1 October to 31 October",   morning: "6:30 to 10:00 AM", afternoon: "2:30 to 6:00 PM" },
        { period: "1 November to 31 January",  morning: "7:00 to 10:30 AM", afternoon: "2:00 to 5:35 PM" },
        { period: "1 February to 31 March",    morning: "6:30 to 10:00 AM", afternoon: "2:30 to 6:00 PM" },
        { period: "1 April to 15 May",         morning: "6:00 to 9:30 AM",  afternoon: "3:00 to 6:30 PM" },
        { period: "16 May to 30 June",         morning: "6:00 to 09:30 AM", afternoon: "3:30 to 7:00 PM" },
        { period: "1 July to 30 September",    morning: "6:00 to 09:30 AM", afternoon: "3:30 to 7:00 PM" },
      ]}
    />
  </>
);

const JawharKalaKendraTC = () => (
  <>
    <SectionTitle>सामान्य शर्तें/दिशा निर्देश</SectionTitle>
    <TermsList items={[
      "केंद्र के रंगायन (बैठक क्षमता - 213), कृष्णायन (बैठक क्षमता - 150) व मध्यवर्ती सभागार (बैठक क्षमता - 1000) की बैठक क्षमता का 15 प्रतिशत स्थान/सीट केन्द्र के लिए आरक्षित रखना होगा।",
      "आवंटन के पश्चात् आवेदककर्ता द्वारा आरक्षण निरस्त किये जाने पर — 15 दिन पूर्व तक 30%, 15 दिन से 05 दिन पूर्व तक 50%, तत्पश्चात् 90% कटौती की जानी प्रस्तावित है। जी.एस.टी. राशि वापस नहीं की जाएगी।",
      "कला दीर्घा प्रदर्शनी आयोजन तिथियों में वृद्धि के लिए आवेदक/संस्था द्वारा पुनः ऑनलाइन माध्यम से ही कला दीर्घा आरक्षित की जानी प्रस्तावित है।",
      "कला दीर्घा की दीवारों पर गोंद/टेप चिपकाना, कील आदि ठोकना सर्वथा वर्जित है। पोस्टर/बैनर निर्धारित स्थल पर ही लगाएं।",
      "विशेष परिस्थिति में केन्द्र द्वारा दीर्घा आवंटन निरस्त या समय में परिवर्तन किया जा सकता है।",
      "प्रदर्शनी के अंतिम दिन गेट पास कार्यालय समय में ही प्राप्त करना अनिवार्य है। गेट पास न होने की स्थिति में सामान ले जाने की अनुमति नहीं होगी।",
      "केन्द्र की संपत्ति को नुकसान होने पर क्षतिपूर्ति की पूर्ण जिम्मेदारी संस्था की होगी एवं जमा धरोहर राशि जब्त कर ली जायेगी।",
      "केन्द्र परिसर में प्लास्टिक निर्मित कैरी बैग/थैलियाँ/कप-ग्लास का उपयोग वर्जित है। उल्लंघन पर जुर्माना एवं आयोजक को Blacklisted किया जायेगा।",
      "आरक्षित स्थल पर व्यवस्था व अनुशासन की जिम्मेदारी स्वयं आयोजनकर्ता की होगी।",
      "जाति, लिंग, अश्लीलता, भेद-भाव, धार्मिक भावनाओं को आहत करने वाले कार्यक्रम/भाषण का प्रदर्शन नहीं किया जायेगा। विवाद की स्थिति में आयोजक पूर्ण रूप से उत्तरदायी होंगे।",
      "कला दीर्घाओं में कलाकृतियों का प्रदर्शन कार्यक्रम अधिकारी (दृश्यकला) की सहमति के उपरान्त ही किया जायेगा।",
      "रंगायन सभागार में अतिरिक्त कुर्सियाँ लगाने की अनुमति नहीं होगी। बैठक क्षमता 213 से अधिक दर्शकों का प्रवेश वर्जित है।",
      "परिसर में कील ठोकना, टेप चिपकाना, पटाखा, आग, रंगोली सजाना मना है। सभागार में खाद्य पदार्थ ले जाने की अनुमति नहीं होगी।",
      "बैनर्स/पोस्टर/स्टेंडी (6×3) निर्धारित स्थान पर ही लगाएं। जवाहर कला केन्द्र प्रशासन से अनुमति आवश्यक है।",
      "किसी भी शर्त का उल्लंघन किये जाने पर आवंटन तत्काल प्रभाव से निरस्त कर दिया जायेगा।",
      "आयोजक संस्था को विशिष्ट अतिथियों की सूचना यथोचित समय पर केन्द्र को देनी होगी।",
      "केन्द्र परिसर में अग्नि प्रयोग एवं प्लास्टिक कैरी बैग, प्लास्टिक निर्मित कप-ग्लास पर पूर्ण प्रतिबन्ध है।",
      "सभागार में फिटिड साउण्ड सिस्टम के साथ वायर वाले माइक्रोफोन उपलब्ध कराये जायेंगे। अन्य उपकरणों की व्यवस्था आयोजक संस्था द्वारा की जायेगी।",
    ]} />

    <SectionTitle>दक्षिण परिसर के लिए वर्तमान नियम व शर्तें</SectionTitle>
    <TermsList items={[
      "दक्षिण परिसर के आरक्षण हेतु कम से कम 01 माह पूर्व विन्डो ओपन कर दी जायेगी।",
      "आवंटन के पश्चात् निरस्त किये जाने पर — 15 दिन पूर्व तक 30%, 15 से 05 दिन पूर्व तक 50%, तत्पश्चात् 90% कटौती। जी.एस.टी. राशि वापस नहीं होगी।",
      "निर्धारित स्थान पर ही बैनर्स/पोस्टर लगाने की अनुमति होगी। केन्द्र की दीवारों पर बैनर्स/फ्लैक्स लगाने की अनुमति नहीं होगी।",
      "केन्द्र की संपत्ति को नुकसान होने पर क्षतिपूर्ति की पूर्ण जिम्मेदारी संस्था की होगी।",
      "प्रदर्शनी तिथियों में वृद्धि के लिए पुनः ऑनलाईन माध्यम से आरक्षण किया जाना प्रस्तावित है।",
      "कार्यक्रम के दौरान सफाई कर्मी केन्द्र की अनुमोदित फर्म द्वारा उपलब्ध कराये जायेंगे।",
      "आमंत्रित अतिविशिष्ट अतिथियों की सूचना एक दिवस पूर्व केन्द्र को देनी होगी।",
      "प्लास्टिक निर्मित कैरी बैग/थैलियाँ/कप/ग्लास का उपयोग वर्जित है। उल्लंघन पर Blacklisted किया जायेगा।",
      "ऑनलाइन पोर्टल लॉग इन के माध्यम से रजिस्ट्रेशन एवं भुगतान किया जाना प्रस्तावित है।",
      "वरियता क्रम तोड़ने के आशय से दबाव डालने पर संस्था/व्यक्ति को 5 वर्षों के लिए BLACKLISTED कर दिया जायेगा।",
      "कार्यक्रम अवधि में आयोजक संस्था का अधिकृत प्रतिनिधि मौजूद रहना आवश्यक है।",
      "मेले/प्रदर्शनीयों की समाप्ति उपरान्त अगले आयोजन के आरंभ से पूर्व 04 दिवस का अंतराल रखा जाएगा।",
      "केन्द्र का कार्यक्रम होने की स्थिति में आरक्षण निरस्त/तिथि में परिवर्तन केन्द्र स्तर पर किया जा सकेगा।",
      "आरक्षण हेतु ओबीएमएस पोर्टल ऑनलाइन माध्यम से विन्डो ओपन कर आवेदन लिए जायेंगे।",
    ]} />
  </>
);

const ChambalKumbhalTC = () => (
  <>
    <SectionTitle>Terms And Conditions For Visitors</SectionTitle>
    <TermsList items={[
      "Early morning and late afternoon are best times for Wildlife Viewing. Remember Wildlife is not just a Tiger/Panther — hyenas, Birds, Insects, and Plants also offer plenty to observe.",
      "Do not sound the Vehicle's Horn or talk loudly. Do not bring transistors or cassette players. Maintain a serene and tranquil atmosphere.",
      "Animals can locate their own natural food. Do not feed them yours — it may cause physiological disorders in them.",
      "Do not litter the Sanctuary area with garbage. Use garbage bins provided in the area, or carry it back out for safe disposal.",
      "To avoid disturbing animals in the Sanctuary, wear light colored clothes which blend with the surroundings.",
      "Keep safe distance from the animals. Do not tease them. Teasing can lead to abnormal behavior and is punishable by law.",
      "Travel light and do not carry any valuables, except cameras and binoculars.",
      "Obtain proper entry tickets before making an entry into the Sanctuary.",
    ]} />
  </>
);

const BeedPapadTC = () => (
  <>
    <SectionTitle>Terms And Conditions For Visitors</SectionTitle>
    <TermsList items={[
      "The visitor or his/her representative must reach the forest permit booking counter to collect the boarding pass at least 45 minutes prior to the entry time.",
      "The ID proof of the visitor produced at the time of collecting the boarding pass should be the same ID used while booking the online permit, failing which the permit will be deemed fake and liable to be canceled.",
      "The first visitor whose photo ID is uploaded is required to visit the park so that the ID of that tourist can be verified.",
      "The charges deposited during online booking include the tourist entry fee, VFPMC charges, vehicle entry fee, vehicle rent, guide fees, and online booking charges with applicable taxes.",
      <strong key="seats-required">In the case of online booking, all 6 seats are required to be filled; otherwise, the customer has to pay the difference amount for entering the park.</strong>,
      "The visitor must bring two copies of the confirmation slip at the time of collecting the boarding pass. One copy will be deposited at the office, and the other copy must be carried by the visitor.",
      "Seats remaining vacant due to the non-turn-up of any visitors will be filled by the park management at the booking window.",
      "In case of group booking, park authorities will try to adjust the group together in vehicles, subject to space availability at the time of entry.",
      "Boarding Pass will be issued at: Beed Papad Leopard Safari, Jaipur.",
      "In case of any changes in applicable fees and tax rates, the difference amount shall be collected at the time of boarding/entry into the park.",
      "There are no charges for a child below the age of 5 years (as of the booking date). However, full charges are applicable for children above 5 years.",
      "For more information, visit https://obms-tourist.rajasthan.gov.in/",
    ]} />
    <Note>We will not be responsible for any costs arising out of unforeseen circumstances like landslides, road blocks, bad weather, etc.</Note>
    <SafariTable
      note="There are no charges for a child below the age of 5 years (as age on booking date); however full charges are applicable for children above 5 years."
      rows={[
        { period: "1 August to 31 October",   morning: "6:15 to 08:45 AM", afternoon: "3:30 to 6:00 PM" },
        { period: "1 November to 31 January",  morning: "6:30 to 09:00 AM", afternoon: "3:15 to 5:45 PM" },
        { period: "1 February to 31 March",    morning: "6:15 to 08:45 AM", afternoon: "3:45 to 6:15 PM" },
        { period: "1 April to 31 May",         morning: "5:30 to 08:00 AM", afternoon: "5:00 to 7:30 PM" },
        { period: "1 June to 31 July",         morning: "5:45 to 08:15 AM", afternoon: "4:45 to 7:15 PM" },
      ]}
    />
  </>
);

const JhalanaTC = () => (
  <>
    <SectionTitle>Terms And Conditions For Visitors</SectionTitle>
    <TermsList items={[
      "The visitor or his/her representative must reach the forest permit booking counter to collect the boarding pass at least 45 minutes prior to the entry time.",
      "The ID proof of the visitor produced at the time of collecting the boarding pass should be the same ID used while booking the online permit, failing which the permit will be deemed fake and liable to be canceled. The visitor must also carry a copy of such ID while visiting the park.",
      "The first visitor whose photo ID is uploaded is required to visit the park so that the ID of that tourist can be checked.",
      "The charges deposited during online booking include the tourist entry fee, VFPMC charges, vehicle entry fee, vehicle rent, guide fees, and online booking charges with applicable taxes.",
      <strong key="seats-required">In the case of online booking, all 6 seats are required to be filled, or else the customer has to pay the difference amount for going inside the park.</strong>,
      "The visitor must bring two copies of the confirmation slip at the time of collecting the boarding pass. One copy will be deposited in the office, and the other copy will be carried by the visitor.",
      "Seats remaining vacant due to the non-turn-up of any visitors will be filled by the park management at the booking window.",
      "In case of group booking, park authorities will try to adjust the group together in vehicles subject to space availability at the time of entry.",
      "Boarding Pass will be issued at: Jhalana Safari / Amagarh Safari, Jaipur.",
      "In case of any changes in applicable fees and tax rates, the difference amount shall be collected at the time of boarding/entry of the park.",
      "There are no charges for a child below the age of 5 years (as of age on the booking date). However, full charges are applicable for children above 5 years.",
      "Safari time for Jhalana Safari / Amagarh Safari during different durations of the safari session.",
      "For more information, visit https://obms-tourist.rajasthan.gov.in/",
    ]} />
    <Note>We will not be responsible for any costs arising out of unforeseen circumstances like landslides, road blocks, bad weather, etc.</Note>
    <SafariTable
      note="There are no charges for a child below the age of 5 years (as age on booking date); however full charges are applicable for children above 5 years."
      rows={[
        { period: "1 August to 31 October",   morning: "6:15 to 08:45 AM", afternoon: "3:30 to 6:00 PM" },
        { period: "1 November to 31 January",  morning: "7:00 to 09:30 AM", afternoon: "3:15 to 5:45 PM" },
        { period: "1 February to 31 March",    morning: "6:30 to 03:00 AM", afternoon: "4:15 to 6:45 PM" },
        { period: "1 April to 31 May",         morning: "6:00 to 08:30 AM", afternoon: "4:30 to 7:00 PM" },
        { period: "1 June to 31 July",         morning: "5:45 to 08:15 AM", afternoon: "4:45 to 7:15 PM" },
      ]}
    />
  </>
);

const DefaultTC = () => (
  <>
    <SectionTitle>Terms And Conditions For Visitors</SectionTitle>
    <TermsList items={[
      "The e-ticket is not transferable.",
      "Entry Fee is not refundable.",
      "E-ticket cancellations are not permitted.",
      "The Monument/Museum is open for visitors between sunrise and sunset.",
      "Visitor shall be required to show photo identity proof in original at the entry to the monument/Museum.",
      "Edibles are not allowed inside the monument/Museum.",
      "Inflammable/dangerous/explosive articles are not allowed.",
      "This monument/Museum is a Non Smoking zone.",
    ]} />
  </>
);

function resolveContent(placeName: string): React.ReactNode {
  let n = placeName;
  try { n = decodeURIComponent(n); } catch { /* already decoded */ }
  n = n.toLowerCase().trim();

  // Most-specific checks first to avoid substring false-positives
  if (n.includes("sariska")) return <SariskaRanthamboreTC />;
  if (n.includes("jawahar") || n.includes("jawaharlal") || n.includes("jkk")) return <JawharKalaKendraTC />;
  if (n.includes("chambal") || n.includes("kumbhal")) return <ChambalKumbhalTC />;
  if (n.includes("beed") && n.includes("papad")) return <BeedPapadTC />;
  if (n.includes("jhalana") || n.includes("amagarh")) return <JhalanaTC />;
  return <DefaultTC />;
}


export default async function Page({ params }: PageProps) {
  const { placeName } = await params;
  const rawName = decodeURIComponent(placeName);
  const displayName = formatSlug(rawName);
  const content = resolveContent(rawName);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#FAFAFA", minHeight: "100vh" }}>

      <div style={{ background: "linear-gradient(135deg,#E8631A,#FF69B4)", padding: "36px 24px 32px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.75)",
              fontWeight: 700,
              letterSpacing: "0.9px",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}
          >
            {displayName}
          </p>
          <h1
            style={{
              fontSize: "clamp(20px, 4vw, 30px)",
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              fontFamily: "playfair-display, serif",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Terms &amp; Conditions
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 24px 64px" }}>
        {content}
      </div>
    </div>
  );
}