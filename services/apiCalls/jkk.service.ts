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


export const GetAllJkkCategory = () => {
  return useQuery({
    queryKey: [queryKeys.getAllJkkCategory],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllJkkCategory}`
      );
      return data;
    },
  });
};

export const GetAllJkkSubCategory = (
	categoryId: any
) => {
	// let page = (pageNumber || 1) - 1;
	return useQuery({
		queryKey: [queryKeys.getAllJkkSubCategory,categoryId],
		queryFn: async () => {
			const { data } = await axiosInstance.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getAllJkkSubCategory(
					categoryId
				)}`
			);
			return data;
		},
	});
};

export const GetAllJkkShift = (
  bookingStartDate: any,
  bookingEndDate: any,
  categoryId: any,
	subCategoryId: any
) => {
	// let page = (pageNumber || 1) - 1;
	return useQuery({
		queryKey: [queryKeys.getAllJkkShift,bookingStartDate,bookingEndDate,categoryId,subCategoryId],
		queryFn: async () => {
			const { data } = await axiosInstance.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getAllJkkShift(
          bookingStartDate,
          bookingEndDate,
          categoryId,
          subCategoryId
				)}`
			);
			return data;
		},
	});
};

export const GetAllJkkPlaceType = (
	subCategoryId: any
) => {
	// let page = (pageNumber || 1) - 1;
	return useQuery({
		queryKey: [queryKeys.getAllJkkPlaceType,subCategoryId],
		queryFn: async () => {
			const { data } = await axiosInstance.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getAllJkkPlaceType(
					subCategoryId
				)}`
			);
			return data;
		},
	});
};

export const GetJkkTicketTypeConfig = (
	typeId: any
) => {
	// let page = (pageNumber || 1) - 1;
	return useQuery({
		queryKey: [queryKeys.getJkkTicketTypeConfig,typeId],
		queryFn: async () => {
			const { data } = await axiosInstance.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getJkkTicketTypeConfig(
					typeId
				)}`
			);
			return data;
		},
	});
};

export const CreateJkkBooking = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.createJkkBookig],
    mutationFn: async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.createJkkBookig}`,
        booking,
      );
      return data;
    },
    onSuccess: (response: any) => {
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      //@ts-ignore
      showErrorToastMessage(error.response.data.message === "Invalid Data" ? "Server is busy.Please try again." : error.response.data.message);
      failureCallback(error);
    },
  });
};

export const ConfirmJkkBookingById = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.confirmJkkBookingById],
    mutationFn: async ({ bookingId }: { bookingId: string }) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.confirmJkkBookingById}?bookingId=${bookingId}`,
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

export const GetJkkTicketDetails = (
 	startDay?: any,
	endDay?: any,
  dateType?: any,
	bookingId?: string
) => {
	// let page = (pageNumber || 1) - 1;
	const safeBookingId = bookingId ?? "";
	return useQuery({
		queryKey: [queryKeys.getJkkTicketDetails,startDay,endDay,dateType,safeBookingId],
		queryFn: async () => {
			const { data } = await axiosInstance.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getJkkTicketDetails(
					startDay,
					endDay,
          dateType,
					safeBookingId
				)}`
			);
			return data;
		},
		// enabled: !!startDay && !!endDay,
	});
};

export const CheckJkkAvailability = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.checkJkkAvailability],
    mutationFn: async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.checkJkkAvailability}`,
        booking,
      );
      return data;
    },
    onSuccess: (response: any) => {
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      //@ts-ignore
      // showErrorToastMessage(error.response.data.message === "Invalid Data" ? "Server is busy.Please try again." : error.response.data.message);
      failureCallback(error);
    },
  });
};

export const CalenderAvailability = () => {
  return useMutation({
    mutationKey: [queryKeys.calenderAvilability],
    mutationFn: async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.calenderAvilability}`,
        booking,
      );
      return data;
    },
  });
};

export const JkkAdvanceAvailability = () => {
  return useMutation({
    mutationKey: [queryKeys.advanceAvailability],
    mutationFn: async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.advanceAvailability}`,
        booking,
      );
      return data;
    },
  });
};

export const JkkAvailabilityWithCategory = () => {
  return useMutation({
    mutationKey: [queryKeys.advanceAvailabilityWithCategory],
    mutationFn: async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.advanceAvailabilityWithCategory}`,
        booking,
      );
      return data;
    },
  });
};


export const GetAllJkkDetails = () => {
  return useQuery({
    queryKey: [queryKeys.getAllJkkDetails],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllJkkDetails}`
      );
      return data.result;
    },
  });
};


export const GetAllIgprsDetails = () => {
  return useQuery({
    queryKey: [queryKeys.getAllIgprsDetails],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllIgrpsCategory}`
      );
      return data.result;
    },
  });
};

export const JkkAddBankDetails = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.jkkAddBankDetails],
    mutationFn: async (bankDetails: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.jkkAddBankDetails}`,
        bankDetails,
      );
      return data;
    },
    onSuccess: (response: any) => {
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      failureCallback(error);
    },
  });
};

export const JkkPriceCalculation = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.jkkPriceCalculation],
    mutationFn: async (details: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.jkkPriceCalculation}`,
        details,
      );
      return data;
    },
    onSuccess: (response: any) => {
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      failureCallback(error);
    },
  });
};



export const CreateIgprsBooking = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.createIgprsBookig],
    mutationFn: async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.createIgprsBookig}`,
        booking,
      );
      return data;
    },
    onSuccess: (response: any) => {
      successCallback(response?.result);
    },
    onError: (error: any, context) => {
      //@ts-ignore
      showErrorToastMessage(error.response.data.message === "Invalid Data" ? "Server is busy.Please try again." : error.response.data.message);
      failureCallback(error);
    },
  });
};


export const JkkProgramDetailOnAvailability = () => {
  return useMutation({
    mutationKey: [queryKeys.jkkProgramDetailOnAvailability],
    mutationFn: async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.jkkProgramDetailOnAvailability}`,
        booking,
      );
      return data?.result;
    },
  });
};