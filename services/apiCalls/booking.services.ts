"use client";
import { apiendpoints } from "@/utils/constants/api-endpoints.constants";
import { useQuery, useQueries, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/utils/constants/react-query-keys.constants";
import axiosInstance from "@/configs/axios.config";
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from "@/utils/toast.utils";
import { queryClient } from "@/components/common/ReactQueryProvider";
import { SOMETHING_WENT_WRONG_MES } from "@/utils/constants/common.constants";
import { useRouter } from "next/navigation";



interface GetShiftsAndTicketTypesByPlace {
  placeId: string;
  date: number | false;
  specificChargeId: string;
}
interface GetPlaceQuickLinks {
  placeId: string;
}

interface GetBookingDetails {
  isOld: any;
}

interface GetUserBookingIdDetails {
  id: any;
}

export const GetSpecificCharges = () => {
  return useQuery({
    queryKey: [queryKeys.getAllSpecificCharges],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllSpecificCharges}`,
      );
      return data;
    },
    enabled: false,
    retry: false,
  });
};

export const GetShiftsAndTicketTypesByPlace = () => {
  return useMutation({
    mutationKey: [queryKeys.getShiftsAndTicketTypesByPlace],
    mutationFn: async ({
      placeId,
      date,
      specificChargeId,
    }: GetShiftsAndTicketTypesByPlace) => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getShiftsAndTicketTypesByPlace}?placeId=${placeId}&date=${date}&specificChargesId=${specificChargeId}`,
      );
      return data;
    },
    retry: false,
    onSuccess: () => {
      // queryClient.invalidateQueries([queryKeys.getAllUser]);
    },
    onError: (error: any) => {
      showErrorToastMessage(error.response.data.message);
    },
  });
};


export const GetPlaceWithQuickLinks = () => {
  return useMutation({
    mutationKey: [queryKeys.getPlaceQuickeLinks],
    mutationFn: async ({
      placeId,
    }: GetPlaceQuickLinks) => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getPlaceQuickLinks}?id=${placeId}`,
      );
      return data;
    },
    retry: false,
    onSuccess: () => {
      // queryClient.invalidateQueries([queryKeys.getAllUser]);
    },
    onError: (error: any) => {
      console.log("log error--",error);

    },
  });
};

export const GetBookingDetails = ({
  dateFilter,
  isOld,
  isRefund,
  bookingId,
  callApi,
  searchKey,
  setLoading,
  isPublic,
  status,
  size,
  startDay,
  endDay,
  
}: {
  dateFilter?: string;
  isOld: boolean;
  isRefund?: boolean;
  bookingId?: string;
  searchKey?: string;
  callApi: boolean;
  setLoading: (flag: boolean) => void;
  isPublic?:boolean;
  status? : string;
  size? : number;
  startDay?: any;
  endDay?: any;
}) => {
  return useQuery({
    queryKey: [queryKeys.GetBookingDetails, {dateFilter, isOld, bookingId, isRefund, searchKey,isPublic,status,size,startDay,endDay }],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(
          `${apiendpoints.GetBookingDetails}/get-ticket-v1`,
          {
            params: {
              dateFilter,
              searchKey: searchKey,
              isOld,
              isRefund,
              bookingId,
              isPublic,
              status,
              size,
              startDay,
              endDay,
            },
          },
        );
        setLoading(false);
        return data;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    enabled: !!callApi,
    retry: false,
  });
};

export const GetUserBookingIdDetail = ({ id }: GetUserBookingIdDetails) => {
  return useQuery({
    queryKey: [queryKeys.GetUserBookingIdDetails, { id }],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.GetUserBookingIdDetails}?bookingId=${id}`,
      );
      return data;
    },
    enabled: !!id,
    retry: false,
  });
};

export const CreateBookingByPlace = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.getShiftsAndTicketTypesByPlace],
    mutationFn: async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.createBookigByPlace}?onSite=${false}`,
        booking,
      );
      return data;
    },
    onSuccess: (response: any) => {
      // queryClient.invalidateQueries([queryKeys.getTicketType]);
      // showSuccessToastMessage("Ticket Type deleted successfully");
      // showSuccessToastMessage(response.message);
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      //@ts-ignore
      showErrorToastMessage(error.response.data.message === "Invalid Data" ? "Server is busy.Please try again." : error.response.data.message);
      failureCallback(error);
    },
  });
};

export const CreateBookingByPlaceV1 = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.getShiftsAndTicketTypesByPlace],
    mutationFn: async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.createBookigByPlaceV1}?onSite=${false}`,
        booking,
      );
      return data;
    },
    onSuccess: (response: any) => {
      // queryClient.invalidateQueries([queryKeys.getTicketType]);
      // showSuccessToastMessage("Ticket Type deleted successfully");
      // showSuccessToastMessage(response.message);
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback(error);
    },
  });
};

export const CreateBookingPreference = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.getPreferenceChoice],
    mutationFn: async (preferenceData: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.getPreferenceChoice}?onSite=${false}`,
        preferenceData,
      );
      return data;
    },
    onSuccess: (response: any) => {
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback(error);
    },
  });
};

export const ConfirmBookingById = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.confirmBookingById],
    mutationFn: async ({ bookingId }: { bookingId: string }) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.confirmBookingById}?bookingId=${bookingId}`,
      );
      return data;
    },
    onSuccess: (response: any, context) => {
      // queryClient.invalidateQueries([queryKeys.getTicketType]);
      // showSuccessToastMessage("Ticket Type deleted successfully");
      // showSuccessToastMessage(response.message);
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback(error);
    },
  });
};

export const ConfirmBookingByIdV1 = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.confirmBookingById],
    mutationFn: async ({ bookingId }: { bookingId: string }) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.confirmBookingByIdV1}?bookingId=${bookingId}`,
      );
      return data;
    },
    onSuccess: (response: any, context) => {
      // queryClient.invalidateQueries([queryKeys.getTicketType]);
      // showSuccessToastMessage("Ticket Type deleted successfully");
      // showSuccessToastMessage(response.message);
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback(error);
    },
  });
};

export const ConfirmBookingPreference = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.confirmBookingById],
    mutationFn: async ({ addOnId }: { addOnId: string }) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.confirmBookingPreference}?addOnId=${addOnId}`,
      );
      return data;
    },
    onSuccess: (response: any, context) => {
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback(error);
    },
  });
};

export const GetBookingStatus = (
  callApi: boolean,
  bookingId: string,
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useQuery({
    queryKey: [queryKeys.GetUserBookingIdDetails, { bookingId }],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.GetBookingStatus}?bookingId=${bookingId}`,
      );
      successCallback(data?.result);
      return data;
    },
    enabled: !!callApi,
    retry: false,
  });
};

export const fetchGetAddonItemsByTicketId = async (
  ticketTypeId: string,
  date: string,
) => {
  const { data } = await axiosInstance.get(
    `${apiendpoints.getAddonItemsByTicketId}?ticketTypeId=${ticketTypeId}&date=${date}`,
  );
  return data;
};

export const fetchTicketTypeConfigDataByTicketId = async (
  ticketTypeId: string,
) => {
  const { data } = await axiosInstance.get(
    `${apiendpoints.getTicketTypeConfigDataByTicketId}?ticketTypeId=${ticketTypeId}`,
  );
  return data;
};

export const GetAddonItemsByTicketId = (ticketTypes: any[]) => {
  return useQueries({
    queries: ticketTypes?.map((ticketType: any) => {
      return {
        queryKey: [
          queryKeys.getAddonItemsByTicketType,
          ticketType?.id,
          ticketType?.date,
        ],
        queryFn: () =>
          fetchGetAddonItemsByTicketId(ticketType?.id, ticketType?.date),
      };
    }),
  });
};

// export const GetAddonItemsByTicketId = ({
//   ticketTypeId,
// }: {
//   ticketTypeId: string;
// }) => {
//   return useQuery(
//     [queryKeys.getShiftsAndTicketTypesByPlace, { ticketTypeId }],
//     () => fetchGetAddonItemsByTicketId,
//     {
//       enabled: !!ticketTypeId,
//       retry: false,
//       onSuccess: () => {
//         // queryClient.invalidateQueries([queryKeys.getAllUser]);
//       },
//       onError: (error: any) => {
//         showErrorToastMessage(error.response.data.message);
//       },
//     },
//   );
// };

// export const CancelBookingById = (
//   successCallback: (res: any) => void,
//   failureCallback: (res: any) => void,
// ) => {
//   return useMutation(
//     [queryKeys.cancelBookingById],
//     async ({ bookingId }: { bookingId: any }) => {
//       const { data } = await axiosInstance.post(
//         `${apiendpoints.cancelBookingById}?bookingId=${bookingId}`,
//         bookingId,
//       );
//       return data;
//     },
//     {
//       onSuccess: (response: any, context) => {
//         // queryClient.invalidateQueries([queryKeys.getTicketType]);
//         // showSuccessToastMessage("Ticket Type deleted successfully");
//         showSuccessToastMessage(response.message);
//         successCallback(response?.result);
//       },
//       onError: (error: any, context) => {
//         showErrorToastMessage(error.response.data.message);
//         failureCallback(error);
//       },
//     },
//   );
// };

// export const CancelBookingById = (
//   successCallback: (res: any) => void,
//   failureCallback: (res: any) => void,
// ) => {
//   return useMutation(
//     [queryKeys.cancelBookingById],
//     async (bookingId, refundReason) => {
//       const { data } = await axiosInstance.post(
//         `${apiendpoints.cancelBookingById}?bookingId=${bookingId}&refundReason${refundReason}`,
//       );
//       return data;
//     },
//     {
//       onSuccess: (response: any) => {
//         // queryClient.invalidateQueries([queryKeys.getTicketType]);
//         // showSuccessToastMessage("Ticket Type deleted successfully");
//         showSuccessToastMessage(response.message);
//         successCallback(response?.result);
//       },
//       onError: (error: any, context) => {
//         showErrorToastMessage(error.response.data.message);
//         failureCallback(error);
//       },
//     },
//   );
// };

export const CancelBookingById = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.cancelBookingById],
    mutationFn: async (
      cancelBookingData:any
    ) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.cancelBookingById}`,cancelBookingData
      );
      return data;
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.GetBookingDetails] });
      showSuccessToastMessage(response.message);
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback(error);
    },
  });
};

export const GetInvoiceForBooking = (
  bookingId: string | number,
  successCallback: (res: any, isComposite: boolean) => void,
) => {
  return useQuery({
    queryKey: [queryKeys.getInvoiceDataForBooking, { bookingId }],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getInvoiceDataForBooking}?bookingId=${bookingId}`,
      );
      successCallback(data?.result, false);
      return data;
    },
    enabled: false,
    retry: false,
  });
};

export const GetCompositeInvoiceForBooking = (
  bookingId: string | number,
  successCallback: (res: any, isComposite: boolean) => void,
) => {
  return useQuery({
    queryKey: [queryKeys.getCompositeInvoiceForBooking, { bookingId }],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getCompositeInvoiceForBooking}?bookingId=${bookingId}`,
      );
      successCallback(data?.result, true);
      return data;
    },
    enabled: false,
    retry: false,
  });
};

export const GetInvoiceForChoiceBooking = (
  bookingId: string | number,
  successCallback: (res: any, choice: boolean) => void,
) => {
  return useQuery({
    queryKey: [queryKeys.getInvoiceForChoiceBooking, { bookingId }],
    queryFn: async () => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.getInvoiceForChoiceBooking}?bookingId=${bookingId}`,
      );
      successCallback(data?.result, false);
      return data;
    },
    enabled: false,
    retry: false,
  });
};




export const GetInvoiceForDifferenceAmount = (
  bookingId: string | number,
  successCallback: (res: any, choice: boolean) => void,
) => {
  return useQuery({
    queryKey: [queryKeys.getInvoiceForDifferenceAmount, { bookingId }],
    queryFn: async () => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.getInvoiceForDifferentAmount}?bookingId=${bookingId}`,
      );
      successCallback(data?.result, false);
      return data;
    },
    enabled: false,
    retry: false,
  });
};




export const SaveUserLogs = () => {
  return useMutation({
    mutationKey: [queryKeys.saveUserLogs],
    mutationFn: async (logData: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.userSaveUserLogs}`,
        logData,
      );
      return data;
    },
    retry:false,
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
    },
  });
};


export const GetChatBotTranstactionData= (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.chatBotTransactionData],
    mutationFn: async ({ userId }: { userId: string }) => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getChatBotTransactionData}?userId=${userId}`,
      );
      return data;
    },
    onSuccess: (response: any, context) => {
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback(error);
    },
  });
};
export const GetChatBotCancelledData= (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.chatBotCancelledData],
    mutationFn: async ({ userId }: { userId: string }) => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getChatBotCancelledData}?userId=${userId}`,
      );
      return data;
    },
    onSuccess: (response: any, context) => {
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback(error);
    },
  });
};
export const ChatBotBookingAction= (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.chatBotAction],
    mutationFn: async ({ userId,action,bookingId }: { userId: string ,action : string, bookingId : string}) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.getChatBotBookingAction}?userId=${userId}&action=${action}&bookingId=${bookingId}`,
      );
      return data;
    },
    onSuccess: (response: any, context) => {
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback(error);
    },
  });
};

export const SaveUserSteps = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: [queryKeys.saveUserSteps],
    mutationFn: async (stepData: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.userSaveUserSteps}`,
        stepData,
      );
      return data;
    },
    retry:false,
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      router.push(`/booking-failed?message=Something Went Wrong. Please Try Again.`);
    },
  });
};

export const GetOBMSIdBooking = (
  successCallback: (res: any) => void
) => {
  return useMutation({
    mutationFn: async (placeId: string | number) => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getOBMSIdForBooking}?locationId=${placeId}`
      );
      return data;
    },
    onSuccess: (res: any) => {
      successCallback(res?.result);
    },
    onError: (error: any) => {
      if (error?.response?.data?.message) {
        showErrorToastMessage(error?.response?.data?.message);
      } else showErrorToastMessage(SOMETHING_WENT_WRONG_MES);
    },
  });
};


export const GetOBMSIdForBooking = (
  placeId: string | number,
  successCallback: (res: any) => void,
) => {
  return useQuery({
    queryKey: [queryKeys.getOBMSIdForBooking, { placeId }],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getOBMSIdForBooking}?locationId=${placeId}`,
      );
      successCallback(data?.result);
      return data;
    },
    enabled: false,
    retry: false,
  });
};

export const GetInventoryTypesByPlace = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.getInventoryDataByPlace],
    mutationFn: async ({
      seasonId,
      zoneId,
      date,
    }: {
      seasonId: string;
      zoneId: string;
      date: string;
    }) => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getInventoryDataByPlace}?seasonId=${seasonId}&zoneId=${zoneId}&date=${date}`,
      );
      return data;
    },
    retry: false,
    onSuccess: (response: any) => {
      successCallback(response?.result);
    },
    onError: (error: any) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback(error);
    },
  });
};

export const GetQuotaByInventory = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.getQuotaDataByInventory],
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
        `${apiendpoints.getQuotaDataByInventory}?seasonId=${seasonId}&zoneId=${zoneId}&date=${date}&inventoryId=${inventoryId}`,
      );
      return data;
    },
    retry: false,
    onSuccess: (response: any) => {
      successCallback(response?.result);
    },
    onError: (error: any) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback(error);
    },
  });
};

export const CheckRefundable = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.checkRefundable],
    mutationFn: async ({ bookingId }: { bookingId: string }) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.checkRefundable}?bookingId=${bookingId}`,
      );
      return data;
    },
    onSuccess: (response: any, context) => {
      // queryClient.invalidateQueries({ queryKey: [queryKeys.getTicketType] });
      // showSuccessToastMessage("Ticket Type deleted successfully");
      // showSuccessToastMessage(response.message);
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback(error);
    },
  });
};

export const GetQuoteList = (
  seasonId:any,
  uniqueId:any,
  startDay: any,
  endDay: any,
) => {
  return useQuery({
    queryKey: [
      queryKeys.getAllInventoryQuoteByPlaceId,
      seasonId,
      uniqueId,
      startDay,
      endDay
    ],
    queryFn: async () => {
      //let page = (offSet || 1) - 1;
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllInventoryQuoteByPlaceId}?seasonId=${seasonId}&uniqueId=${uniqueId}&startDay=${startDay}&endDay=${endDay}`,
      );
      return data;
    },
    refetchOnMount: true,
    enabled: !!seasonId && !!uniqueId,
  });
};

export const GetInventoryDataList = (
  bookingDto: any,
  placeId: any,
  quotaId: any,
) => {
  return useQuery({
    queryKey: [queryKeys.getQuota, bookingDto, placeId, quotaId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getInventoryDataList}?bookingDate=${bookingDto}&placeId=${placeId}&quotaId=${quotaId}`,
      );
      return data;
    },
    refetchOnMount: true,
    enabled: !!bookingDto && !!quotaId && !!placeId,
  });
};

export const uploadIdAttachment = (attachment: FormData) => {
  return axiosInstance.post(`${apiendpoints.profileAttachment}`, attachment, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadUserLogsAttachment = (attachment: FormData) => {
  return axiosInstance.post(`${apiendpoints.userLogsAttachmentApi}`, attachment, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const GetPriceDetail = (bookingId:any,selectiontype:any) => {
  return useQuery({
    queryKey: [queryKeys.getPriceDetails,bookingId,selectiontype],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getPriceDetails}?bookingId=${bookingId}&type=${selectiontype}`,
        // {
        //   params:{
        //     bookingId:bookingId,
        //     type:selectiontype
        //   }
        // }
      );
      return data;
    },
    enabled: !!bookingId && !!selectiontype,
  });
};

export const GetVehicleDetail = ( 
  inventoryId: string,
  detail: boolean = false,
  getAll: boolean = false,
  zoneId: string,
  shiftId: string,
  date: any,
) => {
  return useQuery({
    queryKey: [queryKeys.getVehicleDetail, inventoryId, detail, zoneId, shiftId, date],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getVehicleDetail(
          inventoryId,
          detail,
          getAll,
          zoneId,
          shiftId,
          date,
        )}`
      );
      return data;
    },
    enabled: !!inventoryId && !!zoneId && !!shiftId,
    retry:false,
  });
};

export const GetAllBoardingPassBookings2 = (
  bookingId: string,
  boardingPassId: string,
  callApi: boolean,
  successCallback: (res: any) => void,
) => {
  return useQuery({
    queryKey: [queryKeys.getAllBoardingPassBookingPdf, bookingId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getBoardingPdf(
          bookingId,
          boardingPassId,
        )}`,
      );
      successCallback(data?.result?.boardingPassDetailDtos[0]);
      return data;
    },
    enabled: !!callApi,
  });
};

export const WebCheckIn = () => {
  return useMutation({
    mutationKey: [queryKeys.webCheckIn],
    mutationFn: async ({ ticketBookingId }: { ticketBookingId: string }) => {
      const { data } = await axiosInstance.put(
        `${apiendpoints.webCheckIn}?ticketBookingId=${ticketBookingId}`,
      );
      return data;
    },
    onSuccess: (response: any, context) => {

      queryClient.invalidateQueries({ queryKey: [queryKeys.GetBookingDetails] });
      // showSuccessToastMessage("Ticket Type deleted successfully");
      showSuccessToastMessage(response.message);
      //successCallback(response?.result);
    },
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      //failureCallback(error);
    },
  });
};

export const BookingReverified = () => {
  return useMutation({
    mutationKey: [queryKeys.bookingReverified],
    mutationFn: async ({ bookingId }: { bookingId: string }) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.bookingReverified}?bookingId=${bookingId}`,
      );
      return data;
    },
    onSuccess: (response: any, context) => {

     // queryClient.invalidateQueries({ queryKey: [queryKeys.GetBookingDetails] });
      // showSuccessToastMessage("Ticket Type deleted successfully");
      showSuccessToastMessage(response.message);
      //successCallback(response?.result);
    },
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      //failureCallback(error);
    },
  });
};



/*New Booking Flow Work */

export const GetZoneList = (
  //offSet: any,
  //pagination: any,
  placeId: any,
  quotaId:any,
  uniqueId:any,
  selectedStartDate:any,
  selectedEndDate:any,
  shiftId:any
  //size: any,
) => {
  return useQuery({
    queryKey: [
      queryKeys.getAllZoneByPlaceId,
      //offSet,
      //pagination,
      placeId,
      quotaId,
      uniqueId,
      selectedStartDate,
      selectedEndDate,
      shiftId
      //size,
    ],
    queryFn: async () => {
      //let page = (offSet || 1) - 1;
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllZoneByPlaceId}?placeId=${placeId}&quotaId=${quotaId}&uniqueId=${uniqueId}&startDay=${selectedStartDate}&endDay=${selectedEndDate}&shiftId=${shiftId}`,
      );
      return data;
    },
    refetchOnMount: true,
  });
};

export const GetShiftList = (
  //offSet: any,
  //pagination: any,
  placeId: any,
  quotaId:any,
  uniqueId:any,
  selectedStartDate:any,
  selectedEndDate:any
  //size: any,
) => {
  return useQuery({
    queryKey: [
      queryKeys.getAllShiftByPlaceId,
      //offSet,
      //pagination,
      placeId,
      quotaId,
      selectedStartDate,
      selectedEndDate
      //size,
    ],
    queryFn: async () => {
      //let page = (offSet || 1) - 1;
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllShiftByPlaceId}?placeId=${placeId}&uniqueId=${uniqueId}&quotaId=${quotaId}&startDay=${selectedStartDate}&endDay=${selectedEndDate}`,
      );
      return data;
    },
    refetchOnMount: true,
  });
};

export const GetInventoryList = (
  bookingDate:any,
  placeId: any,
  uniqueId:any,
  quotaId:any,
  zoneId:any,
  shiftId:any,
  seasonId:any
  //size: any,
) => {
  return useQuery({
    queryKey: [
      queryKeys.getAllInventoryByPlaceId,
      bookingDate,
      placeId,
      uniqueId,
      quotaId,
      zoneId,
      shiftId,
      seasonId
    ],
    queryFn: async () => {
      //let page = (offSet || 1) - 1;
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllInventoryByPlaceId}?bookingDate=${bookingDate}&placeId=${placeId}&uniqueId=${uniqueId}&quotaId=${quotaId}&zoneId=${zoneId}&shiftId=${shiftId}&seasonId=${seasonId}`,
      );
      return data;
    },
    refetchOnMount: true,
  });
};

export const GetTicketList = (
  placeId: any,
  seasonId: any,
  inventoryId: any,
  inventory: any
) => {
  return useQuery({
    queryKey: [
      queryKeys.getAllTicketList,
      placeId,
      seasonId,
      inventoryId,
      inventory
    ],
    queryFn: async () => {
      //let page = (offSet || 1) - 1;
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllTicketList}?placeId=${placeId}&seasonId=${seasonId}&inventoryId=${inventoryId}&inventory=${inventory}`,
      );
      return data;
    },
    refetchOnMount: true,
  });
};

export const GetSeasonList = (
  placeId: any,
  selectedStartDate:any,
  selectedEndDate:any
) => {
  return useQuery({
    queryKey: [
      queryKeys.getAllSeasonList,
      placeId,
    ],
    queryFn: async () => {
      //let page = (offSet || 1) - 1;
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllSeasonByPlaceId}?placeId=${placeId}&startDay=${selectedStartDate}&endDay=${selectedEndDate}`,
      );
      return data;
    },
    refetchOnMount: true,
  });
};




export const GetDownloadTicket = (bookingId: any,identification:any,shouldCallApi:any) => {
  return useQuery({
    queryKey: [queryKeys.getAllBookingId, bookingId,identification],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getBoardingPassData(
          bookingId,
          identification
        )}`
      );
      return data;
    },
    enabled:!!shouldCallApi,
  });
};


export const confirmPayDiffAmount = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.confirmBookingById],
    mutationFn: async ({ requestId }: { requestId: string }) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.confirmPayDiffAmount}?requestId=${requestId}`,
      );
      return data;
    },
    onSuccess: (response: any, context) => {
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback(error);
    },
  });
};

export const GetTicketPaymentStatus = (
  callApi: boolean,
  bookingId: string,
  successCallback: (res: any) => void,
  // failureCallback: (res: any) => void,
) => {
  return useQuery({
    queryKey: [queryKeys.ticketPaymentStatus, { bookingId }],
    queryFn: async () => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.ticketPaymentStatus}?bookingId=${bookingId}`,
      );
      successCallback(data?.result);
      return data;
    },
    enabled: !!callApi,
    retry: false,
  });
};

export const GetBookingEmitraStatus = (
  callApi: boolean,
  bookingId: string,
  successCallback: (res: any) => void,
  // failureCallback: (res: any) => void,
) => {
  return useQuery({
    queryKey: [queryKeys.ticketPaymentCheck, { bookingId }],
    queryFn: async () => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.ticketPaymentCheck}?bookingId=${bookingId}`,
      );
      successCallback(data?.result);
      return data;
    },
    enabled: !!callApi,
    retry: false,
  });
};

export const GetJkkBookingEmitraStatus = (
  callApi: boolean,
  bookingId: string,
  successCallback: (res: any) => void,
  // failureCallback: (res: any) => void,
) => {
  return useQuery({
    queryKey: [queryKeys.getJkkTicketPaymentCheck, { bookingId }],
    queryFn: async () => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.getJkkTicketPaymentCheck}?bookingId=${bookingId}`,
      );
      successCallback(data?.result);
      return data;
    },
    enabled: !!callApi,
    retry: false,
  });
};



export const GetChangeStatus = (
  callApi: boolean,
  bookingId: string,
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useQuery({
    queryKey: [queryKeys.changeBookingStatus],
    queryFn: async () => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.changeBookingStatus}?bookingId=${bookingId}`,
      );
      successCallback(data?.result);
      return data;
    },
    enabled: !!callApi,
    retry: false,
  });
};

export const GetCancelledSeats = (
  placeId: any,
  selectedDate:any,
  shiftId:any,
  callApi: boolean,
  cancelledSeatsSuccessCallback: (res: any) => void,
  cancelledSeatsFailureCallback: (res: any) => void,
) => {
  return useQuery({
    queryKey: [
      queryKeys.getCancelledSeat,
      placeId,
      selectedDate,
      shiftId
    ],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getCancelledSeat}?placeId=${placeId}&bookingDate=${selectedDate}&shiftId=${shiftId}`,
      );
      cancelledSeatsSuccessCallback(data?.result);
      return data;
    },
    enabled: !!callApi,
    // refetchOnMount: true,
  });
};

export const UpdateBankDetailsByTicketId = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.updateBankDetailsByTicketId],
    mutationFn: async (bankDetails: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.updateBankDetailsByTicketId}`,
        bankDetails,
      );
      return data;
    },
    retry:false,
    onSuccess: (response: any) => {
      successCallback(response?.result);
      showSuccessToastMessage("Bank details updated successfully");
    },
    onError: (error: any, context) => {
      failureCallback(error);
      showErrorToastMessage(error.response.data.message);
    },
  });
};

export const GetUserTicketListInLastTenMin = (
  userId: any,
  callApi: boolean,
  cancelledSeatsSuccessCallback: (res: any) => void,
  cancelledSeatsFailureCallback: (res: any) => void,
) => {
  return useQuery({
    queryKey: [
      queryKeys.getUserTicketListInLastTenMin,
      userId,
    ],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getUserTicketListInLastTenMin}?userId=${userId}`,
      );
      cancelledSeatsSuccessCallback(data?.result);
      return data;
    },
    enabled: !!callApi,
    // refetchOnMount: true,
  });
};

export const PlaceAvailabilityMothWise = (
  placeId: any,
  callApi: boolean,
  selectedMonth:any,
  selectedYear:any,
  // getPlaceAvailabilityMothWise: (res: any) => void,
  // bookingDate?: any,
) => {
  return useQuery({
    queryKey: [
      queryKeys.placeAvailabilityMothWise, placeId, selectedMonth, selectedYear
    ],
    queryFn: async () => {
      let url = `${apiendpoints.placeAvailabilityMothWise}?placeId=${placeId}&month=${selectedMonth}&year=${selectedYear}`;
      // if(bookingDate) {
      //   url += `&bookingDate=${bookingDate}`
      // }
      const { data } = await axiosInstance.get(url);
      return data;
    },
    enabled: !!callApi,
    retry: false,
  });
}