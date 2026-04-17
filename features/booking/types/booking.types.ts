// ─── Booking Category ──────────────────────────────────────────────────────────
// Determines which flow/steps the modal uses
export type BookingCategory =
  | 'standard'    // Non-inventory monuments, archaeology, museums
  | 'inventory'   // Safari/wildlife - needs zone, shift, vehicle, quota
  | 'package'     // Composite package bookings
  | 'jkk'         // JKK (Jawahar Kala Kendra & similar) - category hierarchy
  | 'igprs'       // IGPRS guest houses - room/capacity based
  | 'asi';        // ASI sites - uses /booking/asiTickets with type param

// ─── Place Config passed to openBookingModal ──────────────────────────────────
export interface PlaceBookingConfig {
  placeId: string | number;
  placeName: string;
  category: BookingCategory;
  /** For ASI - the type param sent to /booking/asiTickets */
  asiType?: string;
  /** Strapi/graphql location ID if different from OBMS placeId */
  locationId?: string | number;
}

// ─── Specific Charges ─────────────────────────────────────────────────────────
export interface SpecificCharge {
  id: string;
  name: string; // "Online" | "Offline"
}

// ─── Shift ────────────────────────────────────────────────────────────────────
export interface Shift {
  id: string;
  name: string;
  startTime?: string;
  endTime?: string;
  availability?: number;
}

// ─── Ticket Charge Head ───────────────────────────────────────────────────────
export interface ChargeHead {
  id: string;
  name: string | null;
  amount: number;
  percentage: number;
  emitraId?: string | null;
}

export interface TicketTypeConfigItem {
  id: string;
  name: string;
  amount: number;
  totalAmount?: number;
  refundable?: boolean;
  taxable?: boolean;
  specificCharges?: boolean;
  specificChargesIds?: string[];
  ticketTypeId?: string;
  taxation?: TicketTypeConfigItem[];
}

// ─── Ticket Type Config value ─────────────────────────────────────────────────
export interface TicketTypeConfigValue {
  id: string;
  name: string;
  amount: number;
  heads?: ChargeHead[];
}

// ─── Specific Charge on a ticket type ────────────────────────────────────────
export interface TicketSpecificCharge {
  id: string;
  name: string;
  amount: number;
  taxPercentage: number;
  totalAmount: number;
  ticketTypeConfigValue?: TicketTypeConfigValue[];
  heads?: ChargeHead[];
  specificCharges?: boolean;
  headPercentage?: boolean;
  addon?: boolean;
  taxable?: boolean;
  refundable?: boolean;
}

// ─── Addon Item ───────────────────────────────────────────────────────────────
export interface AddonItem {
  id: string;
  name: string;
  amount: number;
  totalAmount: number;
  taxPercentage?: number;
  remarkable?: boolean;
  remarkFieldValue?: string;
  refundable?: boolean;
  specialAddOn?: boolean;
  choiceAddOnVehicle?: boolean;
  choiceAddOnGuide?: boolean;
}

export interface ChoiceAddonSelection {
  addonItemId: string;
  type: 'vehicle' | 'guide';
  id: string;
  label: string;
  rosterId?: string;
}

// ─── Ticket Type (from /booking/tickets or /booking/asiTickets) ───────────────
export interface TicketType {
  id: string;
  masterTicketTypeId: string;
  masterTicketTypeName: string;
  note?: string;
  amount?: number;
  seasonId?: string;
  cancellationPolicyId?: string;
  specificCharges?: TicketSpecificCharge[];
  addOnList?: AddonItem[];
  /** resolved addons from /booking/addon */
  addonItems?: AddonItem[];
  date?: string | number;
}

// ─── Visitor Form (one per ticket) ────────────────────────────────────────────
export interface VisitorForm {
  /** corresponds to TicketType.id */
  ticketTypeId: string;
  ticketTypeName: string;
  fullName: string;
  idProof: string;
  idNo: string;
  gender: string;
  nationality: string;
  mobileNo?: string;
  /** selected addon item IDs */
  addonItemIds: string[];
  /** for remarkable addons */
  addonItemsWithRemark: { addonItemId: string; remark: string }[];
  choiceAddonSelections?: ChoiceAddonSelection[];
}

// ─── Zone (Inventory/Safari) ──────────────────────────────────────────────────
export interface Zone {
  id: string;
  name: string;
  availability?: number;
}

// ─── Inventory Type (vehicle/cart) ────────────────────────────────────────────
export interface InventoryType {
  id: string;
  name: string;
  capacity?: number;
  availability?: number;
  inventoryAmount?: number;
  quotaAmount?: number;
  inventoryName?: string;
  inventoryQuotaName?: string;
}

// ─── Quota ────────────────────────────────────────────────────────────────────
export interface Quota {
  id: string;
  name: string;
  availability?: number;
  inventoryQuotaId?: string;
  inventoryQuotaName?: string;
  masterTicketTypeName?: string;
}

// ─── Season ───────────────────────────────────────────────────────────────────
export interface Season {
  id: string;
  name: string;
}

// ─── JKK Category hierarchy ───────────────────────────────────────────────────
export interface JkkCategory {
  id: string;
  name: string;
}
export interface JkkSubCategory {
  id: string;
  name: string;
}
export interface JkkPlaceType {
  id: string;
  name: string;
  ticketTypes?: TicketType[];
}
export interface JkkBankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

// ─── IGPRS ────────────────────────────────────────────────────────────────────
export interface IgprsCategory {
  id: string;
  name: string;
}

// ─── Booking State (the full accumulated state across all steps) ───────────────
export interface BookingState {
  config: PlaceBookingConfig;

  // ── Step 1: Date + Shift ──
  selectedDate: string;         // "YYYY-MM-DD"
  selectedDateMs: number;       // epoch ms
  selectedShift: Shift | null;
  allShiftIds: string;          // comma-joined shift IDs from API (sent as shiftId in payload)
  specificChargeId: string;     // Online specific charge id
  season: Season | null;
  userStepsId: string;          // ID returned from saveUserSteps (analytics recovery)

  // ── Ticket Types ──
  ticketTypes: TicketType[];    // full list from API
  selectedTickets: { ticketType: TicketType; quantity: number }[];

  // ── Visitor Forms ──
  visitorForms: VisitorForm[];  // one per selected ticket * quantity

  // ── Addons resolved per ticket type ──
  addonsMap: Record<string, AddonItem[]>; // ticketTypeId → addons
  choiceAddonSelections: Record<string, ChoiceAddonSelection[]>;

  // ── Inventory Flow (category === 'inventory') ──
  zones: Zone[];
  selectedZone: Zone | null;
  inventoryTypes: InventoryType[];
  selectedInventory: InventoryType | null;
  quotas: Quota[];
  selectedQuota: Quota | null;
  inventoryBookingTypes: Quota[];
  selectedBookingType: Quota | null;

  // ── JKK Flow ──
  jkk: {
    categories: JkkCategory[];
    selectedCategory: JkkCategory | null;
    subCategories: JkkSubCategory[];
    selectedSubCategory: JkkSubCategory | null;
    shifts: Shift[];
    selectedShift: Shift | null;
    placeTypes: JkkPlaceType[];
    selectedPlaceType: JkkPlaceType | null;
    ticketConfigs: any[];
    bankDetails: JkkBankDetails | null;
    calculatedPrice: number | null;
    bookingStartDate: string;
    bookingEndDate: string;
  };

  // ── IGPRS Flow ──
  igprs: {
    categories: IgprsCategory[];
    selectedCategory: IgprsCategory | null;
    checkInDate: string;
    checkOutDate: string;
    capacity: number;
    calculatedPrice: number | null;
    priceData: any;
  };

  // ── Booking result ──
  bookingId: string | null;
  paymentData: any | null;
}

// ─── Initial booking state factory ────────────────────────────────────────────
export function createInitialBookingState(config: PlaceBookingConfig): BookingState {
  const today = new Date().toISOString().split('T')[0];
  return {
    config,
    selectedDate: '',
    selectedDateMs: 0,
    selectedShift: null,
    allShiftIds: '',
    specificChargeId: '',
    season: null,
    userStepsId: '',
    ticketTypes: [],
    selectedTickets: [],
    visitorForms: [],
    addonsMap: {},
    choiceAddonSelections: {},
    zones: [],
    selectedZone: null,
    inventoryTypes: [],
    selectedInventory: null,
    quotas: [],
    selectedQuota: null,
    inventoryBookingTypes: [],
    selectedBookingType: null,
    jkk: {
      categories: [],
      selectedCategory: null,
      subCategories: [],
      selectedSubCategory: null,
      shifts: [],
      selectedShift: null,
      placeTypes: [],
      selectedPlaceType: null,
      ticketConfigs: [],
      bankDetails: null,
      calculatedPrice: null,
      bookingStartDate: '',
      bookingEndDate: '',
    },
    igprs: {
      categories: [],
      selectedCategory: null,
      checkInDate: today,
      checkOutDate: today,
      capacity: 1,
      calculatedPrice: null,
      priceData: null,
    },
    bookingId: null,
    paymentData: null,
  };
}

// ─── Step definitions per category ────────────────────────────────────────────
export const BOOKING_STEPS: Record<BookingCategory, string[]> = {
  standard: ['Date & Shift', 'Select Tickets', 'Review & Pay'],
  inventory: ['Date & Zone', 'Vehicle & Shift', 'Visitor Details', 'Review & Pay'],
  package:   ['Date', 'Select Tickets', 'Review & Pay'],
  asi:       ['Date', 'Select Tickets', 'Visitor Details', 'Review & Pay'],
  jkk:       ['Category & Date', 'Booking Details', 'Review & Pay'],
  igprs:     ['Room & Dates', 'Price Summary', 'Review & Pay'],
};

// ─── ID Proof options ─────────────────────────────────────────────────────────
export const ID_PROOF_OPTIONS = [
  { value: 'AADHAAR', label: 'Aadhaar Card' },
  { value: 'PASSPORT', label: 'Passport' },
  { value: 'DRIVING_LICENSE', label: 'Driving License' },
  { value: 'VOTER_ID', label: 'Voter ID' },
  { value: 'PAN_CARD', label: 'PAN Card' },
];

export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export const NATIONALITY_OPTIONS = [
  { value: 'INDIAN', label: 'Indian' },
  { value: 'FOREIGNER', label: 'Foreigner' },
];
