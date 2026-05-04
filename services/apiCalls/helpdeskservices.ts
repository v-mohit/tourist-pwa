import { queryClient } from '@/components/common/ReactQueryProvider';
import axiosInstance from '@/configs/axios.config';
import { apiendpoints } from '@/utils/constants/api-endpoints.constants';
import { queryKeys } from '@/utils/constants/react-query-keys.constants';
import { showErrorToastMessage, showSuccessToastMessage } from '@/utils/toast.utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react'


export const GetAllBookingIds = (searchBookingIdValue: any,userId:any,successCallbackbookingId:() => void,failureCallbackbooikgId:() => void) => {
  //let page = (pageNumber || 1) - 1;
  return useQuery({
    queryKey: [queryKeys.getAllBookingId, searchBookingIdValue,userId],
    queryFn: async () => {
      //  let page = (offSet || 1) - 1;
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllBookingIds(
          searchBookingIdValue,
          userId
        )}`
      );
      successCallbackbookingId();
      return data;
    },
    enabled:  !!userId,
    // refetchOnMount: true,
  });
};

export const GetFilterPlace = ({ districtId, searchKey, departmentId }: any) => {
  return useQuery({
    queryKey: [queryKeys.getAllPlace, { districtId, searchKey: searchKey || "" }, departmentId],
    queryFn: async () => {
        const { data } = await axiosInstance.get(
        `${apiendpoints.getPlaceList(
          districtId,
          searchKey,
          departmentId
        )}`
      );
      return data;
    },
    //enabled: !isEmpty(districtId),
    retry: false,
  });
};
export const GetFilterBookingId = ({ placeId, issueType, size , offset , pagination }: any) => {
  return useQuery({
    queryKey: [queryKeys.getAllBookingId, { placeId, issueType, size, offset, pagination }],
    queryFn: async () => {
        const { data } = await axiosInstance.post(
        `${apiendpoints.getBookingId(
          placeId,
          issueType,
          size,
          offset,
          pagination

        )}`
      );
      return data;
    },
    //enabled: !isEmpty(districtId),
    retry: false,
  });
};
export const GetUserIssueResult = ({ bookingId, issueType, enabled = true }: any) => {
  return useQuery({
    queryKey: [queryKeys.getUserIssueResult, { bookingId, issueType }],
    queryFn: async () => {
        const { data } = await axiosInstance.get(
        `${apiendpoints.getUserIssueResult(
          bookingId,
          issueType,

        )}`
      );
      return data;
    },
    enabled: !!enabled && !!bookingId && !!issueType,
    retry: false,
  });
};

export const GetDownloadTicketById = (id: string, callApi = true) => {
  return useQuery({
    queryKey: [queryKeys.getTicketDownloadById, { id }],
    queryFn: async () => {
        const { data } = await axiosInstance.get(
        `${apiendpoints.getDownloadTicketById(id)}`
      );
      return data;
    },
    enabled: !!callApi && !!id,
    retry: false,
  });
};

export const GetAllHelpDeskListing = (
  search: string,
  statusList: string[],
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      queryKeys.getAllHelpDeskListing,
      search,
      statusList,
    ],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllHelpDeskListing(
          search,
          statusList
        )}`
      );
      return data;
    },
    enabled,
    staleTime: 0,
  });
};

export const GetAllHelpDeskNotificationUpdate = (
  search: string,
  statusList: string,
  enabled = true
) => {
  return useQuery({
    queryKey: [
      queryKeys.GetAllHelpDeskNotificationCountes,
      search,
      statusList,
    ],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllHelpDeskNotificationCountes(
          search,
          statusList
        )}`
      );
      return data;
    },
    //  enabled: !!seasonId,
    enabled,
    staleTime: 0,
    // refetchOnMount: true,
  });
};


export const HelpdeskAttachment = () => {
  return useMutation({
    mutationKey: [queryKeys.helpdeskAttachment],
    mutationFn: async (detail: object) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.helpdeskAttachment}`,
        detail,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Avoid setting this header manually
          },
        }
      );
      return data;
    },
    onSuccess: (response: any) => {
      console.log(response);
      //queryClient.invalidateQueries([queryKeys.getCancellationPolicyListKey]);
      showSuccessToastMessage(response.message);
    },
    onError: (error: any) => {
      showErrorToastMessage(error.response.data.message);
    },
  });
};


export const CreateNewHelpTicket = (
  successCallback: () => void,
  failureCallback: () => void
) => {
  return useMutation({
    mutationKey: [queryKeys.createNewHelpTicket],
    mutationFn: async (detail: object) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.createHelpDesk}`,
        detail
      );
      return data;
    },
    onSuccess: (response: any) => {
      //queryClient.invalidateQueries([queryKeys.getAllHelpDeskListing]);
      //  queryClient.invalidateQueries([queryKeys.contentCreate]);
      showSuccessToastMessage("Thank you for submitting your query");
      successCallback();
    },
    onError: (error: any) => {
      showErrorToastMessage(error.response.data.message);
      failureCallback();
    },
  });
};

export const GetHelpDeskDetailById = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.getHelpDeskDetailById, id],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(
          `${apiendpoints.getHelpDeskDetailById(id)}`
        );
        return data;
      } catch (error: any) {
        showErrorToastMessage(
          error.response?.data?.message || "An error occurred"
        );
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const GetHelpDeskChatById = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.getHelpDeskChatById, id],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(
          `${apiendpoints.getHelpDeskChatById(
            id
          )}`
        );
        return data;
      } catch (error: any) {
        showErrorToastMessage(
          error.response?.data?.message || "An error occurred"
        );
        throw error;
      }
    },
    enabled: !!id,
  });
};
export const GetHelpDeskChatSeen = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.getHelpDeskChatBySeen, id],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.post(
          `${apiendpoints.getHelpDeskChatSeen(
            id
          )}`
        );
        queryClient.invalidateQueries({ queryKey: [queryKeys.GetAllHelpDeskNotificationCountes] });
        return data;
      } catch (error: any) {
        showErrorToastMessage(
          error.response?.data?.message || "An error occurred"
        );
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const CreateMessage = () => {
  return useMutation({
    mutationKey: [queryKeys.createMessage],
    mutationFn: async (detail: object) => {
      const { data } = await axiosInstance.put(
        `${apiendpoints.createMessage}`,
        detail
      );
      return data;
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.getHelpDeskChatById] });
      showSuccessToastMessage(response.message);
    },
    onError: (error: any) => {
      showErrorToastMessage(error.response.data.message);
    },
  });
};



export const GetUserDetailsByMobileNo = (searchMobileIdValue:any,successCallbackbookingId:() => void,failureCallbackbooikgId:() => void) => {
  //let page = (pageNumber || 1) - 1;
  return useQuery({
    queryKey: [queryKeys.getUserDetailsByMobileNo, searchMobileIdValue],
    queryFn: async () => {
      //  let page = (offSet || 1) - 1;
      const { data } = await axiosInstance.get(
        `${apiendpoints.getUserDetailsByMobileNo(
          searchMobileIdValue
        )}`
      );
      successCallbackbookingId();
      return data;
    },
    retry: false,
    enabled: searchMobileIdValue?.length === 10,
    staleTime: 0,
    // refetchOnMount: true,
  });
};


export const GetAllBookings = ({ userId }: any) => {
  return useQuery({
    queryKey: [queryKeys.getAllBookings, userId],
    queryFn: async () => {
        const { data } = await axiosInstance.get(
        `${apiendpoints.getAllBookings(
          userId
        )}`
      );
      return data;
    },
    //enabled: !isEmpty(districtId),
    retry: false,
  });
};

// export const GetAllIssueType = (placeId:any,callApi: boolean) => {
//   return useQuery(
//     [queryKeys.getIssueType],
//     async () => {
//         const { data } = await axiosInstance.post(
//         `${apiendpoints.getIssueType(
//           placeId,
//         )}`
//       );
//       return data;
//     },
//     {
//       enabled: !!callApi,
//     }
//   );
// };

export const GetAllIssueType = (placeId:any,callApi:boolean) => {
  return useQuery({
    queryKey: [queryKeys.getIssueType],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getIssueType(placeId)}`
      );
      return data;
    },
    enabled: !!callApi,
  });
};


export const GetSubIssueType = (id:any,callApi:boolean) => {
  return useQuery({
    queryKey: [queryKeys.getSubIssueType],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getSubIssueType(id)}`
      );
      return data;
    },
    enabled: !!callApi,
  });
};
