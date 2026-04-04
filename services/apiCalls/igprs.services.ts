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

export const GetAllIgrpsCategory = () => {
  return useQuery(
    [queryKeys.getAllIgrpsCategory],
    async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllIgrpsCategory}`
      );
      return data;
    },
    // {
    //   enabled: !!callApi,
     
    // }
  );
};


export const CheckAvailablityAcRoom = () => {
  return useMutation(
    [queryKeys.checkAvailablityAcRoom],
     async (bookingDAta:any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.checkAvailablityAcRoom}`,
        bookingDAta
      );
      return data;
    },
    {
      retry: false,
      onSuccess: (response: any) => {
        // queryClient.invalidateQueries([queryKeys.getAllUser]);
      //  showErrorToastMessage(response.data.message);
      },
      onError: (error: any) => {
        showErrorToastMessage(error.response.data.message);
      },
    },
  );
};

export const ConfirmigprsBookingById = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation(
    [queryKeys.confirmIgprsBookingById],
    async ({ bookingId }: { bookingId: string }) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.confirmIgprsBookingById}?bookingId=${bookingId}`,
      );
      return data;
    },
    {
      onSuccess: (response: any, context) => {
        successCallback(response?.result);
      },
      onError: (error: any, context) => {
        showErrorToastMessage(error.response.data.message);
        failureCallback(error);
      },
    },
  );
};

export const IgprsAdvanceAvailability = () => {
  return useMutation(
    [queryKeys.advanceIgprsAvailability],
    async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.advanceIgprsAvailability}`,
        booking,
      );
      return data;
    },
  );
};

export const IgprsAvailabilityWithCategory = () => {
  return useMutation(
    [queryKeys.advanceIgprsAvailabilityWithCategory],
    async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.advanceIgprsAvailabilityWithCategory}`,
        booking,
      );
      return data;
    },
  );
};