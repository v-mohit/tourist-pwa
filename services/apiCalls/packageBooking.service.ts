import axiosInstance from "@/configs/axios.config";
import { apiendpoints } from "@/utils/constants/api-endpoints.constants";
import { SOMETHING_WENT_WRONG_MES } from "@/utils/constants/common.constants";
import { queryKeys } from "@/utils/constants/react-query-keys.constants";
import { showErrorToastMessage } from "@/utils/toast.utils";
import { useMutation, useQuery } from "@tanstack/react-query";
interface GetTicketTypesByPackageId {
    packageId: string;
    date: number | false;
    specificChargeId: string;
    callApi: boolean;
  }
export const GetOBMSIdForBooking = (
    packageId: string | number,
    successCallback: (res: any) => void,
  ) => {
    return useQuery({
      queryKey: [queryKeys.getOBMSIdForPackageBooking, { packageId }],
      queryFn: async () => {
        const { data } = await axiosInstance.get(
          `${apiendpoints.getPackageForBooking}?locationId=${packageId}`,
        );
        successCallback(data?.result);
        return data;
      },
      enabled: false,
      retry: false,
    });
  };


  export const GetOBMSIdBooking = (
  successCallback: (res: any) => void
) => {
  return useMutation({
    mutationFn: async (placeId: string | number) => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getPackageForBooking}?locationId=${placeId}`
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


  export const GetTicketTypesByPackage = ({
    packageId,
    date,
    callApi,
    specificChargeId
  }: GetTicketTypesByPackageId) => {
    return useQuery({
      queryKey: [queryKeys.getTicketTypesByPackage, { packageId, date, specificChargeId }],
      queryFn: async () => {
        const { data } = await axiosInstance.get(
          `${apiendpoints.getTicketTypesByPackageId}?placeId=${packageId}&date=${date}&specificChargesId=${specificChargeId}`,
        );
        return data;
      },
      enabled: !!callApi,
      retry: false,
    });
  };

  export const CreatePackageBooking = (
    successCallback: (res: any) => void,
    failureCallback: (res: any) => void,
  ) => {
    return useMutation({
      mutationKey: [queryKeys.createTicketPackageBooking],
      mutationFn: async (booking: any) => {
        const { data } = await axiosInstance.post(
          `${apiendpoints.createPackageBooking}?onSite=${false}`,
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

  export const ConfirmPackageBookingById = (
    successCallback: (res: any) => void,
    failureCallback: (res: any) => void,
  ) => {
    return useMutation({
      mutationKey: [queryKeys.confirmPackageBookingById],
      mutationFn: async ({ bookingId }: { bookingId: string }) => {
        const { data } = await axiosInstance.post(
          `${apiendpoints.confirmPackageBookingById}?bookingId=${bookingId}&isComposite=true`,
        );
        return data;
      },
      onSuccess: (response: any, context) => {
        console.log("context", context);
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
  