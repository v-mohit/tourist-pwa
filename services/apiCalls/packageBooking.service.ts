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
    return useQuery(
      [queryKeys.getOBMSIdForPackageBooking, { packageId }],
      async () => {
        const { data } = await axiosInstance.get(
          `${apiendpoints.getPackageForBooking}?locationId=${packageId}`,
        );
        return data;
      },
      {
        enabled: false,
        retry: false,
        onSuccess: (res: any) => {
          successCallback(res?.result);
          // queryClient.invalidateQueries([queryKeys.getAllUser]);
        },
        onError: (error: any) => {
          console.log(error);
          if (error?.response?.data?.message) {
            showErrorToastMessage(error?.response?.data?.message);
          } else showErrorToastMessage(SOMETHING_WENT_WRONG_MES);
        },
      },
    );
  };


  export const GetOBMSIdBooking = (
  successCallback: (res: any) => void
) => {
  return useMutation(
    async (placeId: string | number) => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getPackageForBooking}?locationId=${placeId}`
      );
      return data;
    },
    {
      onSuccess: (res: any) => {
        successCallback(res?.result);
      },
      onError: (error: any) => {
        if (error?.response?.data?.message) {
          showErrorToastMessage(error?.response?.data?.message);
        } else showErrorToastMessage(SOMETHING_WENT_WRONG_MES);
      },
    }
  );
};


  export const GetTicketTypesByPackage = ({
    packageId,
    date,
    callApi,
    specificChargeId
  }: GetTicketTypesByPackageId) => {
    return useQuery(
      [queryKeys.getTicketTypesByPackage, { packageId, date, specificChargeId }],
      async () => {
        const { data } = await axiosInstance.get(
          `${apiendpoints.getTicketTypesByPackageId}?placeId=${packageId}&date=${date}&specificChargesId=${specificChargeId}`,
        );
        return data;
      },
      {
        enabled: !!callApi,
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

  export const CreatePackageBooking = (
    successCallback: (res: any) => void,
    failureCallback: (res: any) => void,
  ) => {
    return useMutation(
      [queryKeys.createTicketPackageBooking],
      async (booking: any) => {
        const { data } = await axiosInstance.post(
          `${apiendpoints.createPackageBooking}?onSite=${false}`,
          booking,
        );
        return data;
      },
      {
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
      },
    );
  };

  export const ConfirmPackageBookingById = (
    successCallback: (res: any) => void,
    failureCallback: (res: any) => void,
  ) => {
    return useMutation(
      [queryKeys.confirmPackageBookingById],
      async ({ bookingId }: { bookingId: string }) => {
        const { data } = await axiosInstance.post(
          `${apiendpoints.confirmPackageBookingById}?bookingId=${bookingId}&isComposite=true`,
        );
        return data;
      },
      {
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
      },
    );
  };
  