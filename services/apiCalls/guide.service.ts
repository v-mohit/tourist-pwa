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

export const GetAllGuides = (
    pageNumber: number,
    totalRecords: number,
    search: string,
    placeId:any,
    zoneId:any,
    shiftId:any,
    date:any
  ) => {
    let page = (pageNumber || 1) - 1;
    return useQuery(
      [queryKeys.getAllGuides, page, totalRecords, search, placeId, zoneId, shiftId, date],
      async () => {
        const { data } = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getAllGuides(
            page,
            totalRecords,
            search,
            placeId,
            zoneId,
            shiftId,
            date
          )}`
        );
        return data;
      },
      {
        onError: (error: any) => {
          showErrorToastMessage(error?.response?.data?.message);
        },
      }
    );
  };
