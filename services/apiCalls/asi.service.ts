import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/configs/axios.config";
import { apiendpoints } from "@/utils/constants/api-endpoints.constants";
import { queryKeys } from "@/utils/constants/react-query-keys.constants";
import { showErrorToastMessage } from "@/utils/toast.utils";

interface GetShiftsAndTicketTypesByPlace {
  placeId: string;
  date: number | false;
  specificChargeId: string;
  type: string;
}

export const GetAsiBookingDetails = ({
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
  isPublic?: boolean;
  status?: string;
  size?: number;
  startDay?: any;
  endDay?: any;
}) => {
  return useQuery(
    [queryKeys.getAsiBookingDetails, { dateFilter, isOld, bookingId, isRefund, searchKey, isPublic, status, size, startDay, endDay }],
    async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAsiBookingDetails}`,
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
      return data;
    },
    {
      enabled: !!callApi,
      retry: false,

      onSuccess: () => {
        setLoading(false);
        // queryClient.invalidateQueries([queryKeys.getAllUser]);
      },
      onError: () => {
        setLoading(false);
      },
    },
  );
};

export const GetAsiPalceAvail = (
  placeId?: any,
  startDay?: any
) => {
  return useQuery(
    [queryKeys.getAsiPalceAvail, startDay, placeId],
    async () => {
      const { data } = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getAsiPalceAvail(
          placeId,
          startDay
        )}`
      );
      return data;
    },
    {
      enabled: !!startDay && !!placeId,
    }
  );
};

export const GetAsiTicketDetailByPlace = () => {
  return useMutation(
    [queryKeys.getAsiTicketDetailByPlace],
    async ({
      placeId,
      date,
      specificChargeId,
      type,
    }: GetShiftsAndTicketTypesByPlace) => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAsiTicketDetailByPlace}?placeId=${placeId}&date=${date}&specificChargesId=${specificChargeId}&type=${type}`,
      );
      return data;
    },
    {
      retry: false,
      onSuccess: () => {
        // queryClient.invalidateQueries([queryKeys.getAllUser]);
      },
      onError: (error: any) => {
        showErrorToastMessage(error.response.data.message);
      },
    },
  );
};

export const GetAsiBookingPdf = (
  bookingId:any
) => {
  return useQuery(
    [queryKeys.getAsiBookingPdf, bookingId],
    async () => {
      const { data } = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getAsiBookingPdf(
          bookingId
        )}`
      );
      return data;
    },
    {
      enabled: !!bookingId,
    }
  );
};

export const GenerateTicketPDF = () => {
  return useMutation(
    ["generateTicketPDF"],
    async (html: string) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.generateTicketPDF}`,
        { html },
        {
          responseType: "blob", // VERY IMPORTANT
        }
      );

      return data;
    },
    {
      retry: false,
      onError: (error: any) => {
        showErrorToastMessage(error.response?.data?.message || "PDF generation failed");
      },
    }
  );
};