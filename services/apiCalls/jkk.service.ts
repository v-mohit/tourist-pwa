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
import Booking from "@/components/my-booking/Booking";

export const GetAllJkkCategory = () => {
  return useQuery(
    [queryKeys.getAllJkkCategory],
    async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllJkkCategory}`
      );
      return data;
    },
    // {
    //   enabled: !!callApi,
     
    // }
  );
};

export const GetAllJkkSubCategory = (
	categoryId: any
) => {
	// let page = (pageNumber || 1) - 1;
	return useQuery(
		[queryKeys.getAllJkkSubCategory,categoryId],
		async () => {
			const { data } = await axiosInstance.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getAllJkkSubCategory(
					categoryId
				)}`
			);
			return data;
		},
		{
			onError: (error: any) => {
				// showErrorToastMessage(error?.response?.data?.message);
			},
		}
	);
};

export const GetAllJkkShift = (
  bookingStartDate: any,
  bookingEndDate: any,
  categoryId: any,
	subCategoryId: any
) => {
	// let page = (pageNumber || 1) - 1;
	return useQuery(
		[queryKeys.getAllJkkShift,bookingStartDate,bookingEndDate,categoryId,subCategoryId],
		async () => {
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
		{
			onError: (error: any) => {
				showErrorToastMessage(error?.response?.data?.message);
			},
		}
	);
};

export const GetAllJkkPlaceType = (
	subCategoryId: any
) => {
	// let page = (pageNumber || 1) - 1;
	return useQuery(
		[queryKeys.getAllJkkPlaceType,subCategoryId],
		async () => {
			const { data } = await axiosInstance.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getAllJkkPlaceType(
					subCategoryId
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

export const GetJkkTicketTypeConfig = (
	typeId: any
) => {
	// let page = (pageNumber || 1) - 1;
	return useQuery(
		[queryKeys.getJkkTicketTypeConfig,typeId],
		async () => {
			const { data } = await axiosInstance.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getJkkTicketTypeConfig(
					typeId
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

export const CreateJkkBooking = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation(
    [queryKeys.createJkkBookig],
    async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.createJkkBookig}`,
        booking,
      );
      return data;
    },
    {
      onSuccess: (response: any) => {
        successCallback(response?.result);
      },
      onError: (error: any, context) => {
        //@ts-ignore
        showErrorToastMessage(error.response.data.message === "Invalid Data" ? "Server is busy.Please try again." : error.response.data.message);
        failureCallback(error);
      },
    },
  );
};

export const ConfirmJkkBookingById = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation(
    [queryKeys.confirmJkkBookingById],
    async ({ bookingId }: { bookingId: string }) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.confirmJkkBookingById}?bookingId=${bookingId}`,
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

export const GetJkkTicketDetails = (
 	startDay?: any,
	endDay?: any,
  dateType?: any,
	bookingId?: string
) => {
	// let page = (pageNumber || 1) - 1;
	const safeBookingId = bookingId ?? "";
	return useQuery(
		[queryKeys.getJkkTicketDetails,startDay,endDay,dateType,safeBookingId],
		async () => {
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
		{
			// enabled: !!startDay && !!endDay,
			onError: (error: any) => {
				showErrorToastMessage(error?.response?.data?.message);
			},
		}
	);
};

export const CheckJkkAvailability = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation(
    [queryKeys.checkJkkAvailability],
    async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.checkJkkAvailability}`,
        booking,
      );
      return data;
    },
    {
      onSuccess: (response: any) => {
        successCallback(response?.result);
      },
      onError: (error: any, context) => {
        //@ts-ignore
        // showErrorToastMessage(error.response.data.message === "Invalid Data" ? "Server is busy.Please try again." : error.response.data.message);
        failureCallback(error);
      },
    },
  );
};

export const CalenderAvailability = () => {
  return useMutation(
    [queryKeys.calenderAvilability],
    async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.calenderAvilability}`,
        booking,
      );
      return data;
    },
  );
};

export const JkkAdvanceAvailability = () => {
  return useMutation(
    [queryKeys.advanceAvailability],
    async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.advanceAvailability}`,
        booking,
      );
      return data;
    },
  );
};

export const JkkAvailabilityWithCategory = () => {
  return useMutation(
    [queryKeys.advanceAvailabilityWithCategory],
    async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.advanceAvailabilityWithCategory}`,
        booking,
      );
      return data;
    },
  );
};


export const GetAllJkkDetails = () => {
  return useQuery(
    [queryKeys.getAllJkkDetails],
    async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllJkkDetails}`
      );
      return data.result;
    },
    // {
    //   enabled: !!callApi,
     
    // }
  );
};


export const GetAllIgprsDetails = () => {
  return useQuery(
    [queryKeys.getAllIgprsDetails],
    async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllIgrpsCategory}`
      );
      return data.result;
    },
    // {
    //   enabled: !!callApi,
     
    // }
  );
};

export const JkkAddBankDetails = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation(
    [queryKeys.jkkAddBankDetails],
    async (bankDetails: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.jkkAddBankDetails}`,
        bankDetails,
      );
      return data;
    },
    {
      onSuccess: (response: any) => {
        successCallback(response?.result);
      },
      onError: (error: any, context) => {
        failureCallback(error);
      },
    },
  );
};

export const JkkPriceCalculation = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation(
    [queryKeys.jkkPriceCalculation],
    async (details: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.jkkPriceCalculation}`,
        details,
      );
      return data;
    },
    {
      onSuccess: (response: any) => {
        successCallback(response?.result);
      },
      onError: (error: any, context) => {
        failureCallback(error);
      },
    },
  );
};



export const CreateIgprsBooking = (
  successCallback: (res: any) => void,
  failureCallback: (res: any) => void,
) => {
  return useMutation(
    [queryKeys.createIgprsBookig],
    async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.createIgprsBookig}`,
        booking,
      );
      return data;
    },
    {
      onSuccess: (response: any) => {
        successCallback(response?.result);
      },
      onError: (error: any, context) => {
        //@ts-ignore
        showErrorToastMessage(error.response.data.message === "Invalid Data" ? "Server is busy.Please try again." : error.response.data.message);
        failureCallback(error);
      },
    },
  );
};


export const JkkProgramDetailOnAvailability = () => {
  return useMutation(
    [queryKeys.jkkProgramDetailOnAvailability],
    async (booking: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.jkkProgramDetailOnAvailability}`,
        booking,
      );
      return data?.result;
    },
  );
};