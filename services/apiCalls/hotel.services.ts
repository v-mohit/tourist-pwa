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
import { useRouter } from "next/navigation";;

export const GetHotelAvlibilityById = (
  id: string,
  startDate: any,
  endDate: any,
  room: any,
  callApi: boolean
) => {
  return useQuery(
    [queryKeys.getHotelAvlibilityById, id, startDate, endDate, room],
    async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getHotelAvlibilityById}?id=${id}&startDate=${startDate}&endDate=${endDate}&room=${room}`,
      );
      return data;
    },
    {
      enabled: callApi,
      retry: false,
      onSuccess: () => {

      },
      onError: (error: any) => {
        showErrorToastMessage(error.response.data.message);
      },
    },
  );
};