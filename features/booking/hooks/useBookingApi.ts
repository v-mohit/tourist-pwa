'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/configs/axios.config';
import { showErrorToastMessage } from '@/utils/toast.utils';
import type { AddonItem, TicketTypeConfigItem } from '../types/booking.types';

// ─────────────────────────────────────────────────────────────────────────────
// Specific charges  /specific-charges
// ─────────────────────────────────────────────────────────────────────────────
export function useSpecificCharges() {
  return useQuery({
    queryKey: ['specificCharges'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/specific-charges');
      const payload = data?.result ?? data;
      const charges = Array.isArray(payload?.specificChargesDtos)
        ? payload.specificChargesDtos
        : Array.isArray(payload)
          ? payload
          : [];
      return charges as { id: string; name: string }[];
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Shifts & Ticket Types   /booking/tickets
// ─────────────────────────────────────────────────────────────────────────────
export function useShiftsAndTicketTypes() {
  return useMutation({
    mutationFn: async ({
      placeId,
      date,
      specificChargeId,
    }: {
      placeId: string | number;
      date: number;
      specificChargeId: string;
    }) => {
      const { data } = await axiosInstance.get(
        `/booking/tickets?placeId=${placeId}&date=${date}&specificChargesId=${specificChargeId}`,
      );
      return data?.result ?? data;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Failed to load tickets'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ASI Ticket Types   /booking/asiTickets
// ─────────────────────────────────────────────────────────────────────────────
export function useAsiTicketTypes() {
  return useMutation({
    mutationFn: async ({
      placeId,
      date,
      specificChargeId,
      type,
    }: {
      placeId: string | number;
      date: number;
      specificChargeId: string;
      type: string;
    }) => {
      const { data } = await axiosInstance.get(
        `/booking/asiTickets?placeId=${placeId}&date=${date}&specificChargesId=${specificChargeId}&type=${type}`,
      );
      return data?.result ?? data;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Failed to load ASI tickets'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Addon Items    /booking/addon
// ─────────────────────────────────────────────────────────────────────────────
export function useAddonItems() {
  return useMutation({
    mutationFn: async ({
      ticketTypeId,
      date,
    }: {
      ticketTypeId: string;
      date: string | number;
    }) => {
      const { data } = await axiosInstance.get(
        `/booking/addon?ticketTypeId=${ticketTypeId}&date=${date}`,
      );
      return (data?.result ?? []) as AddonItem[];
    },
  });
}

export function useChoiceVehicles({
  inventoryId,
  zoneId,
  shiftId,
  date,
}: {
  inventoryId?: string;
  zoneId?: string;
  shiftId?: string;
  date?: string | number;
}) {
  return useQuery({
    queryKey: ['choiceVehicles', inventoryId, zoneId, shiftId, date],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/boardingV2/vehicleV2?inventoryId=${inventoryId}&all=false&getAll=false&zoneId=${zoneId}&shiftId=${shiftId}&date=${date}`,
      );
      return data?.result ?? [];
    },
    enabled: !!inventoryId && !!zoneId && !!shiftId && !!date,
    retry: false,
  });
}

export function useChoiceGuides({
  placeId,
  zoneId,
  shiftId,
  date,
}: {
  placeId?: string | number;
  zoneId?: string;
  shiftId?: string;
  date?: string | number;
}) {
  return useQuery({
    queryKey: ['choiceGuides', placeId, zoneId, shiftId, date],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/guide/getGuideListForChoice?offSet=0&size=100&searchKey=&placeId=${placeId}&zoneId=${zoneId}&shiftId=${shiftId}&date=${date}`,
      );
      return data?.result?.guideDtos ?? data?.result ?? [];
    },
    enabled: !!placeId && !!zoneId && !!shiftId && !!date,
    retry: false,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Ticket Type Config    /booking/ticket-config
// ─────────────────────────────────────────────────────────────────────────────
export function useTicketTypeConfig() {
  return useMutation({
    mutationFn: async ({ ticketTypeId }: { ticketTypeId: string; silent?: boolean }) => {
      const { data } = await axiosInstance.get(
        `/booking/ticket-config?ticketTypeId=${ticketTypeId}`,
      );
      return (data?.result ?? []) as TicketTypeConfigItem[];
    },
    onError: (err: any, variables) => {
      if (variables?.silent) return;
      showErrorToastMessage(err?.response?.data?.message || 'Failed to load ticket details');
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Save User Steps   /user/saveUserSteps  (analytics / booking recovery)
// ─────────────────────────────────────────────────────────────────────────────
export function useSaveUserSteps() {
  return useMutation({
    mutationFn: async (stepData: {
      id?: string;
      placeId?: string | number;
      dateSelect?: boolean;
      quotaSelect?: boolean;
      zoneSelect?: boolean;
      shiftSelect?: boolean;
      seasonId?: string;
      bookingDate?: number;
    }) => {
      const { data } = await axiosInstance.post('/user/saveUserSteps', stepData);
      return data;
    },
    // silent — analytics only, never block the flow
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// OBMS Place ID   /place/get
// ─────────────────────────────────────────────────────────────────────────────
export function useObmsPlaceId() {
  return useMutation({
    mutationFn: async (locationId: string | number) => {
      const { data } = await axiosInstance.get(`/place/get?locationId=${locationId}`);
      return data?.result;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Failed to load place info'),
  });
}

export function usePackageObmsPlaceId() {
  return useMutation({
    mutationFn: async (locationId: string | number) => {
      const { data } = await axiosInstance.get(`/package/get-place?locationId=${locationId}`);
      return data?.result;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Failed to load package info'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Season   /season/getSeasonByDate
// ─────────────────────────────────────────────────────────────────────────────
export function useSeason() {
  return useMutation({
    mutationFn: async ({ placeId, date }: { placeId: string | number; date: string }) => {
      const { data } = await axiosInstance.get(
        `/season/getSeasonByDate?placeId=${placeId}&date=${date}`,
      );
      return data?.result;
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Zone List   /zone/getZonePlaceWise
// ─────────────────────────────────────────────────────────────────────────────
export function useZoneList() {
  return useMutation({
    mutationFn: async ({
      placeId,
      quotaId,
      uniqueId,
      startDay,
      endDay,
      shiftId,
    }: {
      placeId: string | number;
      quotaId: string;
      uniqueId: string;
      startDay: string;
      endDay: string;
      shiftId?: string;
    }) => {
      const { data } = await axiosInstance.get(
        `/zone/getZonePlaceWise?placeId=${placeId}&quotaId=${quotaId}&uniqueId=${uniqueId}&startDay=${startDay}&endDay=${endDay}&shiftId=${shiftId ?? ''}`,
      );
      // API returns { result: { zones: [...] } }
      return (data?.result?.zones ?? data?.result ?? []) as any[];
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Failed to load zones'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Shift List   /shift/getShiftPlaceWise
// ─────────────────────────────────────────────────────────────────────────────
export function useShiftList() {
  return useMutation({
    mutationFn: async ({
      placeId,
      quotaId,
      uniqueId,
      startDay,
      endDay,
    }: {
      placeId: string | number;
      quotaId: string;
      uniqueId: string;
      startDay: string;
      endDay: string;
    }) => {
      const { data } = await axiosInstance.get(
        `/shift/getShiftPlaceWise?placeId=${placeId}&uniqueId=${uniqueId}&quotaId=${quotaId}&startDay=${startDay}&endDay=${endDay}`,
      );
      // API returns { result: { shifts: [...] } }
      return (data?.result?.shifts ?? data?.result ?? []) as any[];
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Failed to load shifts'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Inventory Ticket List   /booking/getTicketList  (safari/wildlife ticket types)
// ─────────────────────────────────────────────────────────────────────────────
export function useInventoryTicketList() {
  return useMutation({
    mutationFn: async ({
      placeId,
      seasonId,
      inventoryId,
      inventoryName,
      quotaId,
      uniqueId,
      zoneId,
    }: {
      placeId: string | number;
      seasonId: string;
      inventoryId: string;
      inventoryName: string;
      quotaId: string;
      uniqueId: string;
      zoneId: string;
    }) => {
      const inventoryParam = inventoryName?.toLowerCase().includes('golf cart') ? 'golf_cart' : inventoryName;
      const { data } = await axiosInstance.get(
        `/booking/getTicketList?placeId=${placeId}&seasonId=${seasonId}&inventoryId=${inventoryId}&inventory=${encodeURIComponent(inventoryParam)}&quotaId=${quotaId}&uniqueId=${uniqueId}&zoneId=${zoneId}&online=true`,
      );
      return (data?.result ?? []) as any[];
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Failed to load ticket types'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Inventory List   /booking/inventoryList
// ─────────────────────────────────────────────────────────────────────────────
export function useInventoryList() {
  return useMutation({
    mutationFn: async ({
      bookingDate,
      placeId,
      uniqueId,
      quotaId,
      zoneId,
      shiftId,
      seasonId,
    }: {
      bookingDate: string;
      placeId: string | number;
      uniqueId: string;
      quotaId: string;
      zoneId: string;
      shiftId: string;
      seasonId: string;
    }) => {
      const { data } = await axiosInstance.get(
        `/booking/inventoryList?bookingDate=${bookingDate}&placeId=${placeId}&uniqueId=${uniqueId}&quotaId=${quotaId}&zoneId=${zoneId}&shiftId=${shiftId}&seasonId=${seasonId}`,
      );
      // API returns { result: [{ zoneData: [{ inventoryId, inventoryName, available, pending, ... }] }] }
      return (data?.result?.[0]?.zoneData ?? data?.result ?? []) as any[];
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Failed to load inventory'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Quota   /booking/quota
// ─────────────────────────────────────────────────────────────────────────────
export function useQuota() {
  return useMutation({
    mutationFn: async ({
      seasonId,
      zoneId,
      date,
      inventoryId,
    }: {
      seasonId: string;
      zoneId: string;
      date: string;
      inventoryId: string;
    }) => {
      const { data } = await axiosInstance.get(
        `/booking/quota?seasonId=${seasonId}&zoneId=${zoneId}&date=${date}&inventoryId=${inventoryId}`,
      );
      return data?.result ?? [];
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Failed to load quota'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Inventory Booking Types   /ticket/config/getQuotaList
// ─────────────────────────────────────────────────────────────────────────────
export function useInventoryBookingTypes() {
  return useMutation({
    mutationFn: async ({
      seasonId,
      uniqueId,
      startDay,
      endDay,
    }: {
      seasonId: string;
      uniqueId: string;
      startDay: string;
      endDay: string;
    }) => {
      const { data } = await axiosInstance.get(
        `/ticket/config/getQuotaList?seasonId=${seasonId}&uniqueId=${uniqueId}&startDay=${startDay}&endDay=${endDay}`,
      );
      return data?.result?.ticketTypeDtos ?? data?.result ?? [];
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Failed to load booking types'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Create Booking    /booking/create/v2
// ─────────────────────────────────────────────────────────────────────────────
export function useCreateBooking() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post(
        `/booking/create/v2?onSite=false`,
        payload,
      );
      return data?.result;
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      showErrorToastMessage(
        msg === 'Invalid Data' ? 'Server is busy. Please try again.' : msg || 'Booking creation failed',
      );
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirm Booking    /booking/confirm/v2
// ─────────────────────────────────────────────────────────────────────────────
export function useConfirmBooking() {
  return useMutation({
    mutationFn: async ({
      bookingId,
      isComposite = false,
    }: {
      bookingId: string;
      isComposite?: boolean;
    }) => {
      const url = isComposite
        ? `/booking/confirm/v2?bookingId=${bookingId}&isComposite=true`
        : `/booking/confirm/v2?bookingId=${bookingId}`;
      const { data } = await axiosInstance.post(url);
      return data?.result;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Booking confirmation failed'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Package Booking    /package/management/create/v2  +  confirm
// ─────────────────────────────────────────────────────────────────────────────
export function useCreatePackageBooking() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post(
        `/package/management/create/v2?onSite=false`,
        payload,
      );
      return data?.result;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Package booking failed'),
  });
}

export function usePackageTicketTypes() {
  return useMutation({
    mutationFn: async ({
      packageId,
      date,
      specificChargeId,
    }: {
      packageId: string | number;
      date: number;
      specificChargeId: string;
    }) => {
      const { data } = await axiosInstance.get(
        `/package/management/tickets?placeId=${packageId}&date=${date}&specificChargesId=${specificChargeId}`,
      );
      return data?.result ?? data;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Failed to load package tickets'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// JKK   category → subcategory → shift → type → ticket config → bank details → price → create → confirm
// ─────────────────────────────────────────────────────────────────────────────
export function useJkkCategories() {
  return useQuery({
    queryKey: ['jkkCategories'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/jkk/allCategory');
      return data?.result ?? [];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useJkkSubCategories(categoryId: string | null) {
  return useQuery({
    queryKey: ['jkkSubCategories', categoryId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/jkk/allSubCategory?categoryId=${categoryId}`);
      return data?.result ?? [];
    },
    enabled: !!categoryId,
  });
}

export function useJkkShifts() {
  return useMutation({
    mutationFn: async ({
      startDate,
      endDate,
      categoryId,
      subCategoryId,
    }: {
      startDate: string;
      endDate: string;
      categoryId: string;
      subCategoryId: string;
    }) => {
      const { data } = await axiosInstance.get(
        `/jkk/getShift?bookingStartDate=${startDate}&bookingEndDate=${endDate}&categoryId=${categoryId}&subCategoryId=${subCategoryId}`,
      );
      return data?.result ?? [];
    },
  });
}

export function useJkkPlaceTypes(subCategoryId: string | null) {
  return useQuery({
    queryKey: ['jkkPlaceTypes', subCategoryId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/jkk/allType?subCategoryId=${subCategoryId}`);
      return data?.result ?? [];
    },
    enabled: !!subCategoryId,
  });
}

export function useJkkTicketConfig(typeId: string | null) {
  return useQuery({
    queryKey: ['jkkTicketConfig', typeId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/jkk/allTicketTypeConfig?ticketTypeId=${typeId}`);
      return data?.result ?? [];
    },
    enabled: !!typeId,
  });
}

export function useJkkPriceCalculation() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post('/jkk/priceCalculation', payload);
      return data?.result;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Price calculation failed'),
  });
}

export function useJkkBankDetails() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post('/jkk/addBankDetails', payload);
      return data?.result;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Failed to save bank details'),
  });
}

export function useJkkCalendarAvailability() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post('/jkk/calender/availability', payload);
      return data?.result;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Availability check failed'),
  });
}

export function useJkkAdvanceAvailability() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post('/jkk/calender/advanceAvailabilityWithCategory', payload);
      return data?.result;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Availability check failed'),
  });
}

export function useJkkCheckAvailability() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post('/jkk/check/availability', payload);
      return data?.result;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Shift availability check failed'),
  });
}

export function useCreateJkkBooking() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post('/jkk/create/booking', payload);
      return data?.result;
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      showErrorToastMessage(
        msg === 'Invalid Data' ? 'Server is busy. Please try again.' : msg || 'JKK booking failed',
      );
    },
  });
}

export function useConfirmJkkBooking() {
  return useMutation({
    mutationFn: async ({ bookingId }: { bookingId: string }) => {
      const { data } = await axiosInstance.post(`/jkk/confirm?bookingId=${bookingId}`);
      return data?.result;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'JKK confirmation failed'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// IGPRS   categories → availability/price → create → confirm
// ─────────────────────────────────────────────────────────────────────────────
export function useIgprsCategories() {
  return useQuery({
    queryKey: ['igprsCategories'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/igprgvs/getAllActiveCategories');
      return data?.result ?? [];
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useIgprsPriceCalculation() {
  return useMutation({
    mutationFn: async (payload: {
      capacity: number;
      categoryId?: string;
      bookingStartDate: number;
      bookingEndDate: number | null;
      bookingType?: string;
    }) => {
      const { data } = await axiosInstance.post('/igprgvs/priceCalculation', payload);
      return data?.result;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'Price calculation failed'),
  });
}

export function useCreateIgprsBooking() {
  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await axiosInstance.post('/igprgvs/createBooking', payload);
      return data?.result;
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message;
      showErrorToastMessage(
        msg === 'Invalid Data' ? 'Server is busy. Please try again.' : msg || 'IGPRS booking failed',
      );
    },
  });
}

export function useConfirmIgprsBooking() {
  return useMutation({
    mutationFn: async ({ bookingId }: { bookingId: string }) => {
      const { data } = await axiosInstance.post(`/igprgvs/confirm?bookingId=${bookingId}`);
      return data?.result;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'IGPRS confirmation failed'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK AVAILABILITY
// ─────────────────────────────────────────────────────────────────────────────

export function usePlaceAvailabilityMonthWise(placeId: string, month: string, year: string, enabled: boolean) {
  return useQuery({
    queryKey: ['placeAvailabilityMonthWise', placeId, month, year],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/booking/placeAvailabilityMothWise?placeId=${placeId}&month=${month}&year=${year}`,
      );
      return data?.result;
    },
    enabled: enabled && !!placeId && !!month && !!year,
  });
}

export function useJkkAvailabilityWithCategory() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post('/jkk/calender/advanceAvailabilityWithCategory', { auth: false });
      return data?.result;
    },
  });
}

export function useJkkProgramDetails() {
  return useMutation({
    mutationFn: async (payload: { startDate: number; endDate: number; subCategoryId: number | string }) => {
      const { data } = await axiosInstance.post('/jkk/programDetails', payload);
      return data?.result ?? data;
    },
  });
}

export function useIgprsAvailabilityWithCategory() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.post('/igprgvs/calender/advanceAvailabilityWithCategory', { auth: false });
      return data?.result;
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FILE UPLOAD
// ─────────────────────────────────────────────────────────────────────────────

export function useFileUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await axiosInstance.post('/file/uploadProfile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data?.result;
    },
    onError: (err: any) => showErrorToastMessage(err?.response?.data?.message || 'File upload failed'),
  });
}
