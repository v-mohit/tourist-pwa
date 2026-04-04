import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/configs/axios.config";
import { apiendpoints } from "@/utils/constants/api-endpoints.constants";
import { queryKeys } from "@/utils/constants/react-query-keys.constants";

type IgCategory = {
  id: string;
  name: string;
};

type IgAvailabilityPayload = {
  capacity: number;
  categoryId?: string;
  bookingStartDate: number;
  bookingEndDate: number | null;
};

export const CheckIgAvailability = () => {
  return useMutation(async (payload: IgAvailabilityPayload) => {
    const path =
      (apiendpoints as any)?.checkIgAvailability;
    const { data } = await axiosInstance.post(path, payload);
    return data;
  });
};

export const GetIgCategories = () => {
  return useMutation(async () => {
    const path =
      (apiendpoints as any)?.getAllIgrpsCategory;
    const { data } = await axiosInstance.get(path);
    return data as { result?: IgCategory[] };
  });
};

type IgPriceCalculationPayload = {
  capacity: number;
  categoryId?: string;
  bookingStartDate: number;
  bookingEndDate: number | null;
  bookingType?: string;
};

export const IgprsPriceCalculation = () => {
  return useMutation(
    [queryKeys.igprsPriceCalculation],
    async (payload: IgPriceCalculationPayload) => {
      const path =
        (apiendpoints as any)?.igprsPriceCalculation;
      const { data } = await axiosInstance.post(path, payload);
      return data;
    }
  );
};

export const GetIgprsReport = (
  startDay?: any,
  endDay?: any,
  userId?: any
) => {
  return useQuery(
    [queryKeys.getIgprsReport, startDay, endDay, userId],
    async () => {
      const { data } = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getIgprsReport(
          startDay,
          endDay,
          userId
        )}`
      );
      return data;
    },
    {
      enabled: !!startDay && !!endDay,
    }
  );
};
