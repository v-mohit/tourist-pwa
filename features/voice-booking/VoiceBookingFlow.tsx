'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { graphqlClient } from '@/services/client';
import { FetchHomeSearchDocument } from '@/generated/graphql';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useBooking } from '@/features/booking/context/BookingContext';
import {
  useObmsPlaceId,
  useSpecificCharges,
  useShiftsAndTicketTypes,
} from '@/features/booking/hooks/useBookingApi';
import { SPECIFIC_CHARGES } from '@/utils/constants/common.constants';
import { getBookingDateEpochIST } from '@/utils/common.utils';
import { formatRupees } from '@/features/booking/utils/payment';
import { parseVoiceInput } from './utils/voiceParser';

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface Props {
  open: boolean;
  onClose: () => void;
}

type ConvoStep =
  | 'idle'
  | 'ask_place'        // listening for place name
  | 'search_place'     // searching API
  | 'pick_place'       // multiple results — ask user to pick
  | 'ask_date'         // speak "what date?" then listen
  | 'fetch_tickets'    // loading tickets
  | 'ask_ticket'       // ask about each ticket type one by one
  | 'summary'          // speak summary, then navigate to payment
  | 'done';

interface PlaceResult {
  name: string;
  slug: string;
  city: string;
  entityId: string;
  citySlug: string;
}

interface TicketRow {
  id: string;
  name: string;
  amount: number;
  qty: number;
  raw: any; // full ticket type object from API
}

interface ChatMsg {
  role: 'assistant' | 'user';
  text: string;
}

/* ─── Speech helpers ────────────────────────────────────────────────────────── */

function speak(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-IN';
    u.rate = 1;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

function listen(): Promise<string> {
  return new Promise((resolve, reject) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { reject(new Error('Speech recognition not supported')); return; }

    const rec = new SR();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onresult = (e: any) => {
      const text = e.results[0]?.[0]?.transcript || '';
      resolve(text);
    };
    rec.onerror = (e: any) => reject(new Error(e.error));
    rec.onend = () => {}; // handled by onresult/onerror
    rec.start();
  });
}

/* ─── Date parser (from voiceParser) ────────────────────────────────────────── */

function parseDateFromText(text: string): string | null {
  const parsed = parseVoiceInput(text);
  return parsed.date;
}

/* ─── Number parser ─────────────────────────────────────────────────────────── */

const WORD_NUMS: Record<string, number> = {
  zero: 0, no: 0, none: 0, skip: 0,
  one: 1, a: 1, an: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

function parseNumber(text: string): number {
  const lower = text.toLowerCase().trim();
  if (WORD_NUMS[lower] !== undefined) return WORD_NUMS[lower];
  const m = lower.match(/(\d+)/);
  return m ? parseInt(m[1]) : -1; // -1 = not understood
}

/* ═══════════════════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function VoiceBookingFlow({ open, onClose }: Props) {
  const router = useRouter();
  const { user, openLoginModal, setPostLoginAction } = useAuth();
  const { openBookingModal } = useBooking();

  const [step, setStep] = useState<ConvoStep>('idle');
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Data
  const [places, setPlaces] = useState<PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [ticketAskIndex, setTicketAskIndex] = useState(0);
  const [obmsId, _setObmsId] = useState('');
  function setObmsId(v: string) { obmsIdRef.current = v; _setObmsId(v); }
  const [shiftInfo, setShiftInfo] = useState('');
  const [allShiftIds, _setAllShiftIds] = useState('');
  const allShiftIdsRef = useRef('');
  const [specificChargeId, _setSpecificChargeId] = useState('');
  const specificChargeIdRef = useRef('');
  const obmsIdRef = useRef('');

  function setAllShiftIds(v: string) { allShiftIdsRef.current = v; _setAllShiftIds(v); }
  function setSpecificChargeId(v: string) { specificChargeIdRef.current = v; _setSpecificChargeId(v); }

  const obmsPlaceMutation = useObmsPlaceId();
  const { data: specificCharges = [] } = useSpecificCharges();
  const shiftsMutation = useShiftsAndTicketTypes();

  const chatEndRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  // Start conversation when modal opens
  useEffect(() => {
    if (open && step === 'idle') {
      startConversation();
    }
    if (!open) {
      window.speechSynthesis?.cancel();
      setStep('idle');
      setChat([]);
      setPlaces([]);
      setSelectedPlace(null);
      setSelectedDate('');
      setTickets([]);
      setTicketAskIndex(0);
      runningRef.current = false;
    }
  }, [open]);

  function addMsg(role: ChatMsg['role'], text: string) {
    setChat((prev) => [...prev, { role, text }]);
  }

  async function speakAndAdd(text: string) {
    addMsg('assistant', text);
    setIsSpeaking(true);
    await speak(text);
    setIsSpeaking(false);
  }

  async function listenAndAdd(): Promise<string> {
    setIsListening(true);
    try {
      const text = await listen();
      addMsg('user', text);
      setIsListening(false);
      return text;
    } catch (err: any) {
      setIsListening(false);
      if (err.message === 'not-allowed') {
        addMsg('assistant', 'Microphone permission denied. Please allow microphone access.');
      }
      return '';
    }
  }

  /* ── Main conversation flow ────────────────────────────────────────────────── */

  async function startConversation() {
    if (runningRef.current) return;
    runningRef.current = true;

    // Step 1: Ask for place
    setStep('ask_place');
    await speakAndAdd('Which place would you like to visit? Say the name.');
    const placeText = await listenAndAdd();
    if (!placeText || !runningRef.current) return;

    // Step 2: Search place
    setStep('search_place');
    addMsg('assistant', `Searching for "${placeText}"...`);
    const results = await searchPlace(placeText);

    if (!runningRef.current) return;

    if (results.length === 0) {
      await speakAndAdd(`Sorry, I could not find any place matching "${placeText}". Please try again.`);
      runningRef.current = false;
      setStep('idle');
      setTimeout(() => startConversation(), 500);
      return;
    }

    let place: PlaceResult;
    if (results.length === 1) {
      place = results[0];
      await speakAndAdd(`Found ${place.name} in ${place.city}. Great!`);
    } else {
      // Multiple results — ask user to pick by number
      setStep('pick_place');
      const listText = results.map((p, i) => `${i + 1}. ${p.name}, ${p.city}`).join('. ');
      await speakAndAdd(`I found multiple places. ${listText}. Say the number of the place you want.`);
      const pickText = await listenAndAdd();
      if (!pickText || !runningRef.current) return;
      const pickNum = parseNumber(pickText);
      if (pickNum >= 1 && pickNum <= results.length) {
        place = results[pickNum - 1];
        await speakAndAdd(`Selected ${place.name}. Got it!`);
      } else {
        place = results[0];
        await speakAndAdd(`I'll go with ${place.name}.`);
      }
    }

    setSelectedPlace(place);

    // Step 2b: Resolve place type — voice booking only for NON_INVENTORY
    addMsg('assistant', 'Checking place details...');
    let resolvedPlaceType = '';
    try {
      const obmsData = await obmsPlaceMutation.mutateAsync(place.entityId);
      if (obmsData?.id) {
        setObmsId(obmsData.id);
        resolvedPlaceType = obmsData.placeType ?? '';
      }
    } catch {}

    if (!runningRef.current) return;

    // If not NON_INVENTORY, navigate to the place detail page
    if (resolvedPlaceType && resolvedPlaceType !== 'NON_INVENTORY') {
      if (place.slug) {
        await speakAndAdd(`${place.name} requires a special booking process. Navigating you to the booking page.`);
        runningRef.current = false;
        onClose();
        router.push(`/place-detail/${place.slug}`);
      } else {
        await speakAndAdd(`${place.name} is not available for voice booking. Please use the regular booking flow.`);
        runningRef.current = false;
        setStep('idle');
      }
      return;
    }

    // Step 3: Ask for date
    setStep('ask_date');
    await speakAndAdd('What date would you like to visit? You can say tomorrow, next Friday, or a specific date like April 25.');
    const dateText = await listenAndAdd();
    if (!dateText || !runningRef.current) return;

    const parsedDate = parseDateFromText(dateText);
    if (!parsedDate) {
      await speakAndAdd('I could not understand the date. Let me try once more.');
      const dateText2 = await listenAndAdd();
      if (!dateText2 || !runningRef.current) return;
      const parsedDate2 = parseDateFromText(dateText2);
      if (!parsedDate2) {
        await speakAndAdd('Sorry, I still could not understand. Please use the manual booking.');
        runningRef.current = false;
        setStep('idle');
        return;
      }
      setSelectedDate(parsedDate2);
      await speakAndAdd(`Date set to ${formatDateSpoken(parsedDate2)}.`);
    } else {
      setSelectedDate(parsedDate);
      await speakAndAdd(`Date set to ${formatDateSpoken(parsedDate)}.`);
    }

    const finalDate = parsedDate || '';
    if (!finalDate) return;

    // Step 4: Fetch tickets (OBMS ID already resolved above)
    setStep('fetch_tickets');
    addMsg('assistant', 'Fetching available tickets...');
    const ticketData = await fetchTicketsWithObmsId(finalDate);

    if (!runningRef.current) return;

    if (!ticketData || ticketData.length === 0) {
      await speakAndAdd('Sorry, no tickets are available for this date. Please try a different date.');
      runningRef.current = false;
      setStep('idle');
      return;
    }

    setTickets(ticketData);

    // Step 5: Ask about each ticket type
    setStep('ask_ticket');
    const updatedTickets = [...ticketData];

    for (let i = 0; i < updatedTickets.length; i++) {
      if (!runningRef.current) return;
      setTicketAskIndex(i);
      const t = updatedTickets[i];
      await speakAndAdd(`${t.name}, price ${t.amount} rupees each. How many do you want? Say zero or skip if none.`);
      const qtyText = await listenAndAdd();
      if (!qtyText || !runningRef.current) return;

      const qty = parseNumber(qtyText);
      if (qty >= 0) {
        updatedTickets[i] = { ...t, qty };
        if (qty > 0) {
          addMsg('assistant', `${qty} ${t.name} added.`);
        }
      } else {
        addMsg('assistant', `Skipping ${t.name}.`);
      }
    }

    setTickets(updatedTickets);

    const totalTickets = updatedTickets.reduce((s, t) => s + t.qty, 0);
    const totalAmount = updatedTickets.reduce((s, t) => s + t.qty * t.amount, 0);

    if (totalTickets === 0) {
      await speakAndAdd('You did not select any tickets. Please try again.');
      runningRef.current = false;
      setStep('idle');
      return;
    }

    // Step 6: Summary
    setStep('summary');
    const ticketSummary = updatedTickets.filter((t) => t.qty > 0).map((t) => `${t.qty} ${t.name}`).join(', ');
    await speakAndAdd(
      `Here is your booking summary. ${place.name} on ${formatDateSpoken(finalDate)}. ${ticketSummary}. Total amount ${totalAmount} rupees. Proceeding to payment now.`
    );

    // Navigate to payment
    setStep('done');
    proceedToBooking(place, finalDate, updatedTickets);
  }

  /* ── API calls ─────────────────────────────────────────────────────────────── */

  async function searchPlace(query: string): Promise<PlaceResult[]> {
    try {
      const res: any = await graphqlClient.request(FetchHomeSearchDocument, {
        searchKey: query, page: 1, pageSize: 5,
      });
      const results = (res?.places?.data || []).map((p: any) => ({
        name: p.attributes.name,
        slug: p.attributes.placeDetail?.data?.attributes?.slug || '',
        city: p.attributes.city?.data?.attributes?.name || '',
        entityId: p.id,
        citySlug: p.attributes.city?.data?.attributes?.cityDetail?.data?.attributes?.slug || '',
      }));
      setPlaces(results);
      return results;
    } catch {
      return [];
    }
  }

  async function fetchTickets(place: PlaceResult, date: string): Promise<TicketRow[] | null> {
    try {
      // 1. Resolve OBMS ID
      const obmsData = await obmsPlaceMutation.mutateAsync(place.entityId);
      if (!obmsData?.id) return null;
      setObmsId(obmsData.id);

      // 2. Get specific charge
      const onlineCharge = (specificCharges as any[]).find(
        (c) => c.name?.toLowerCase() === SPECIFIC_CHARGES.ONLINE.toLowerCase(),
      );
      if (!onlineCharge) return null;
      setSpecificChargeId(onlineCharge.id);

      // 3. Fetch shifts + tickets
      const dateMs = getBookingDateEpochIST(date);
      const result = await shiftsMutation.mutateAsync({
        placeId: obmsData.id, date: dateMs, specificChargeId: onlineCharge.id,
      });

      const payload = result?.result ?? result;
      const shifts = payload?.shiftDtos ?? payload?.shifts ?? [];
      const ticketTypes = payload?.ticketTypeDtos ?? payload?.ticketTypes ?? [];

      if (shifts.length > 0) {
        setShiftInfo(shifts[0].name);
        setAllShiftIds(shifts.map((s: any) => s.id).join(','));
      }

      return ticketTypes.map((t: any) => {
        const charge = t.specificCharges?.[0];
        return {
          id: t.id,
          name: t.masterTicketTypeName || t.name || 'Ticket',
          amount: charge?.totalAmount ?? charge?.amount ?? t.amount ?? t.totalAmount ?? 0,
          qty: 0,
          raw: t,
        };
      });
    } catch {
      return null;
    }
  }

  async function fetchTicketsWithObmsId(date: string): Promise<TicketRow[] | null> {
    const currentObmsId = obmsIdRef.current;
    if (!currentObmsId) return null;
    try {
      const onlineCharge = (specificCharges as any[]).find(
        (c) => c.name?.toLowerCase() === SPECIFIC_CHARGES.ONLINE.toLowerCase(),
      );
      if (!onlineCharge) return null;
      setSpecificChargeId(onlineCharge.id);

      const dateMs = getBookingDateEpochIST(date);
      const result = await shiftsMutation.mutateAsync({
        placeId: currentObmsId, date: dateMs, specificChargeId: onlineCharge.id,
      });

      const payload = result?.result ?? result;
      const shifts = payload?.shiftDtos ?? payload?.shifts ?? [];
      const ticketTypes = payload?.ticketTypeDtos ?? payload?.ticketTypes ?? [];

      if (shifts.length > 0) {
        setShiftInfo(shifts[0].name);
        setAllShiftIds(shifts.map((s: any) => s.id).join(','));
      }

      return ticketTypes.map((t: any) => {
        const charge = t.specificCharges?.[0];
        return {
          id: t.id,
          name: t.masterTicketTypeName || t.name || 'Ticket',
          amount: charge?.totalAmount ?? charge?.amount ?? t.amount ?? t.totalAmount ?? 0,
          qty: 0,
          raw: t,
        };
      });
    } catch {
      return null;
    }
  }

  function proceedToBooking(place: PlaceResult, date: string, ticketData: TicketRow[]) {
    if (!user) {
      setPostLoginAction(() => proceedToBooking(place, date, ticketData));
      openLoginModal();
      return;
    }

    const dateMs = getBookingDateEpochIST(date);

    // Build selectedTickets from voice-selected quantities using raw API objects
    const selectedTickets = ticketData
      .filter((t) => t.qty > 0)
      .map((t) => ({
        ticketType: t.raw, // use the full ticket type object from API
        quantity: t.qty,
      }));

    // Get seasonId from the first ticket type (API returns it on each ticket)
    const seasonId = ticketData[0]?.raw?.seasonId ?? '';

    // Read from refs to get the latest values (state may not be updated yet)
    const currentObmsId = obmsIdRef.current;
    const currentAllShiftIds = allShiftIdsRef.current;
    const currentSpecificChargeId = specificChargeIdRef.current;

    console.log('Voice booking - proceedToBooking:', { currentObmsId, currentAllShiftIds, currentSpecificChargeId, seasonId });

    // Open booking modal pre-filled at Review & Pay step (step 2 for standard)
    openBookingModal({
      placeId: currentObmsId,
      placeName: place.name,
      category: 'standard',
      locationId: place.entityId,
      startAtStep: 2, // Review & Pay
      prefilled: {
        selectedDate: date,
        selectedDateMs: dateMs,
        specificChargeId: currentSpecificChargeId,
        allShiftIds: currentAllShiftIds,
        selectedShift: shiftInfo ? { id: currentAllShiftIds.split(',')[0], name: shiftInfo } as any : null,
        selectedTickets,
        season: seasonId ? { id: seasonId, name: '' } : null,
        ticketTypes: ticketData.map((t) => t.raw),
      },
    });
    onClose();
  }

  /* ── Helpers ───────────────────────────────────────────────────────────────── */

  function formatDateSpoken(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  const totalAmount = tickets.reduce((s, t) => s + t.qty * t.amount, 0);
  const totalTickets = tickets.reduce((s, t) => s + t.qty, 0);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[rgba(24,18,14,0.72)] backdrop-blur-[6px] z-[9990]" onClick={() => { runningRef.current = false; onClose(); }} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9991] w-full max-w-md px-4">
        <div className="bg-white rounded-[22px] shadow-[0_12px_48px_rgba(24,18,14,0.18)] relative max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="px-6 pt-5 pb-3 flex-shrink-0 border-b border-[#E8DAC5]">
            <button onClick={() => { runningRef.current = false; onClose(); }}
              className="absolute top-4 right-4 w-8 h-8 bg-[#F5E8CC] rounded-full flex items-center justify-center text-[#7A6A58] hover:bg-[#E8DAC5] text-sm z-10">
              ✕
            </button>
            <div className="text-center">
              <div className="text-[10px] font-semibold tracking-[1px] uppercase text-[#E8631A]">Voice Booking</div>
              <h2 className="font-['Playfair_Display',serif] text-base font-bold text-[#2C2017] mt-0.5">
                Book by Speaking
              </h2>
            </div>
          </div>

          {/* Chat area */}
          <div className="px-5 py-4 overflow-y-auto flex-1 space-y-3 min-h-[300px]">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#E8631A] text-white rounded-br-md'
                    : 'bg-[#F5E8CC] text-[#2C2017] rounded-bl-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Listening indicator */}
            {isListening && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#FFF5EE] rounded-full text-xs text-[#E8631A] font-medium">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#E8631A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[#E8631A] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[#E8631A] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  Listening...
                </div>
              </div>
            )}

            {/* Speaking indicator */}
            {isSpeaking && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#F5E8CC] rounded-full text-xs text-[#7A6A58] font-medium">
                  <div className="w-3 h-3 border-2 border-[#E8631A]/30 border-t-[#E8631A] rounded-full animate-spin" />
                  Speaking...
                </div>
              </div>
            )}

            {/* Summary card */}
            {step === 'summary' && totalTickets > 0 && (
              <div className="bg-[#F5E8CC] rounded-[12px] p-4 space-y-2">
                <div className="font-bold text-sm text-[#2C2017]">{selectedPlace?.name}</div>
                <div className="text-xs text-[#7A6A58]">{selectedPlace?.city} · {formatDateSpoken(selectedDate)}</div>
                {shiftInfo && <div className="text-xs text-[#7A6A58]">{shiftInfo}</div>}
                <div className="border-t border-[#E8DAC5] my-1" />
                {tickets.filter((t) => t.qty > 0).map((t) => (
                  <div key={t.id} className="flex justify-between text-xs text-[#2C2017]">
                    <span>{t.name} x{t.qty}</span>
                    <span className="font-semibold">{formatRupees(t.qty * t.amount)}</span>
                  </div>
                ))}
                <div className="border-t border-[#E8DAC5] my-1" />
                <div className="flex justify-between">
                  <span className="font-bold text-sm text-[#2C2017]">Total</span>
                  <span className="font-bold text-lg text-[#E8631A]">{formatRupees(totalAmount)}</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 pt-2 flex-shrink-0 border-t border-[#E8DAC5]">
            {step === 'idle' ? (
              <button onClick={startConversation}
                className="w-full py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] transition-all text-sm flex items-center justify-center gap-2">
                <span className="text-lg">🎤</span> Start Voice Booking
              </button>
            ) : step === 'done' ? (
              <button onClick={() => { if (selectedPlace) proceedToBooking(selectedPlace, selectedDate, tickets); }}
                className="w-full py-3 bg-[#E8631A] text-white font-bold rounded-full hover:bg-[#C04E0A] transition-all text-sm">
                Proceed to Payment →
              </button>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                  isListening
                    ? 'bg-[#E8631A] text-white shadow-lg shadow-[#E8631A]/30 animate-pulse'
                    : isSpeaking
                      ? 'bg-[#F5E8CC] text-[#E8631A]'
                      : 'bg-[#F5E8CC] text-[#7A6A58]'
                }`}>
                  {isListening ? '🎤' : isSpeaking ? '🔊' : '⏳'}
                </div>
                <span className="text-xs text-[#7A6A58]">
                  {isListening ? 'Speak now...' : isSpeaking ? 'Listening to response...' : 'Processing...'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
