import { queryClient } from '@/components/common/ReactQueryProvider';
import axiosInstance from '@/configs/axios.config';
import { apiendpoints } from '@/utils/constants/api-endpoints.constants';
import { queryKeys } from '@/utils/constants/react-query-keys.constants';
import { showErrorToastMessage, showSuccessToastMessage } from '@/utils/toast.utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react'


export const GetAllBookingIds = (searchBookingIdValue: any,userId:any,successCallbackbookingId:() => void,failureCallbackbooikgId:() => void) => {
  //let page = (pageNumber || 1) - 1;
  return useQuery(
    [queryKeys.getAllBookingId, searchBookingIdValue,userId],
    async () => {
      //  let page = (offSet || 1) - 1;
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllBookingIds(
          searchBookingIdValue,
          userId
        )}`
      );
      return data;
    },
    {
      enabled:  !!userId,
      // refetchOnMount: true,
      onSuccess: (response: any) => {
        // console.log(response);
        //queryClient.invalidateQueries([queryKeys.getCancellationPolicyListKey]);
        successCallbackbookingId()
       // showSuccessToastMessage(response.message);
      },
      onError: (error: any) => {
        failureCallbackbooikgId()
       // showErrorToastMessage(error.response.data.message);
      },
    }
  );
};

export const GetFilterPlace = ({ districtId, searchKey, departmentId }: any) => {
  return useQuery(
    [queryKeys.getAllPlace, { districtId, searchKey: searchKey || "" }, departmentId],
    async () => {
        const { data } = await axiosInstance.get(
        `${apiendpoints.getPlaceList(
          districtId,
          searchKey,
          departmentId
        )}`
      );
      return data;
    },
    {
      //enabled: !isEmpty(districtId),
      retry: false,
      onSuccess: () => {
        //queryClient.invalidateQueries([queryKeys.getAllUser]);
      },
      onError: (error: any) => {
        showErrorToastMessage(error?.response?.data?.message);
      },

    }
  );
};
export const GetFilterBookingId = ({ placeId, issueType, size , offset , pagination }: any) => {
  return useQuery(
    [queryKeys.getAllBookingId, { placeId, issueType, size, offset, pagination }],
    async () => {
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
    {
      //enabled: !isEmpty(districtId),
      retry: false,
      onSuccess: () => {
        //queryClient.invalidateQueries([queryKeys.getAllUser]);
      },
      onError: (error: any) => {
     //   showErrorToastMessage(error?.response?.data?.message);
      },

    }
  );
};
export const GetUserIssueResult = ({ bookingId, issueType }: any) => {
  return useQuery(
    [queryKeys.getUserIssueResult, { bookingId, issueType }],
    async () => {
        const { data } = await axiosInstance.get(
        `${apiendpoints.getUserIssueResult(
          bookingId,
          issueType,
      
        )}`
      );
      return data;
    },
    {
      //enabled: !isEmpty(districtId),
      retry: false,
      onSuccess: () => {
        //queryClient.invalidateQueries([queryKeys.getAllUser]);
      },
      onError: (error: any) => {
      //  showErrorToastMessage(error?.response?.data?.message);
      },

    }
  );
};

export const GetDownloadTicketById= (id: string,callApi: boolean) => { 
  return useQuery(
    [queryKeys.getTicketDownloadById, { id }],
    async () => {
        const { data } = await axiosInstance.get(
        `${apiendpoints.getDownloadTicketById(id)}`
      );
      return data;
    },
    {
      //enabled: !isEmpty(districtId),
      retry: false,
      onSuccess: () => {
        //queryClient.invalidateQueries([queryKeys.getAllUser]);
      },
      onError: (error: any) => {
      //  showErrorToastMessage(error?.response?.data?.message);
      },

    }
  );
};

export const GetAllHelpDeskListing = (
  search: string,
  statusList: string[]
) => {
  return useQuery(
    [
      queryKeys.getAllHelpDeskListing,
      search,
      statusList,
    ],
    async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllHelpDeskListing(
          search,
          statusList
        )}`
      );
      return data;
    },
    {
      //  enabled: !!seasonId,
      staleTime: 0,
      // refetchOnMount: true,
    }
  );
};

export const GetAllHelpDeskNotificationUpdate = (
  search: string,
  statusList: string
) => {
  return useQuery(
    [
      queryKeys.GetAllHelpDeskNotificationCountes,
      search,
      statusList,
    ],
    async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getAllHelpDeskNotificationCountes(
          search,
          statusList
        )}`
      );
      return data;
    },
    {
      //  enabled: !!seasonId,
      staleTime: 0,
      // refetchOnMount: true,
    }
  );
};


export const HelpdeskAttachment = () => {
  return useMutation(
    [queryKeys.helpdeskAttachment],
    async (detail: object) => {
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
    {
      onSuccess: (response: any) => {
        console.log(response);
        //queryClient.invalidateQueries([queryKeys.getCancellationPolicyListKey]);
        showSuccessToastMessage(response.message);
      },
      onError: (error: any) => {
        showErrorToastMessage(error.response.data.message);
      },
    }
  );
};


export const CreateNewHelpTicket = (
  successCallback: () => void,
  failureCallback: () => void
) => {
  return useMutation(
    [queryKeys.createNewHelpTicket],
    async (detail: object) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.createHelpDesk}`,
        detail
      );
      return data;
    },
    {
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
     
    }
  );
};

export const GetHelpDeskDetailById = (id: string) => {
  return useQuery(
    [queryKeys.getHelpDeskDetailById, id],
    async () => {
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
    {
      enabled: !!id,
      onSuccess: (response: any) => {
        console.log(response);
        // queryClient.invalidateQueries([queryKeys.getContentManagmentList]);
        // showSuccessToastMessage(response.message);
      },
    }
  );
};

export const GetHelpDeskChatById = (id: string) => {
  return useQuery(
    [queryKeys.getHelpDeskChatById, id],
    async () => {
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
    {
      enabled: !!id,
      onSuccess: (response: any) => {
        console.log(response);
        // queryClient.invalidateQueries([queryKeys.getContentManagmentList]);
        // showSuccessToastMessage(response.message);
      },
    }
  );
};
export const GetHelpDeskChatSeen = (id: string) => {
  return useQuery(
    [queryKeys.getHelpDeskChatBySeen, id],
    async () => {
      try {
        const { data } = await axiosInstance.post(
          `${apiendpoints.getHelpDeskChatSeen(
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
    {
      enabled: !!id,
      onSuccess: (response: any) => {
        console.log(response);
        queryClient.invalidateQueries([queryKeys.GetAllHelpDeskNotificationCountes]);
        // showSuccessToastMessage(response.message);
      },
    }
  );
};

export const CreateMessage = () => {
  return useMutation(
    [queryKeys.createMessage],
    async (detail: object) => {
      const { data } = await axiosInstance.put(
        `${apiendpoints.createMessage}`,
        detail
      );
      return data;
    },
    {
      onSuccess: (response: any) => {
        queryClient.invalidateQueries([queryKeys.getHelpDeskChatById]);
        showSuccessToastMessage(response.message);
      },
      onError: (error: any) => {
        showErrorToastMessage(error.response.data.message);
      },
    }
  );
};



export const GetUserDetailsByMobileNo = (searchMobileIdValue:any,successCallbackbookingId:() => void,failureCallbackbooikgId:() => void) => {
  //let page = (pageNumber || 1) - 1;
  return useQuery(
    [queryKeys.getUserDetailsByMobileNo, searchMobileIdValue],
    async () => {
      //  let page = (offSet || 1) - 1;
      const { data } = await axiosInstance.get(
        `${apiendpoints.getUserDetailsByMobileNo(
          searchMobileIdValue
        )}`
      );
      return data;
    },
    {
      onSuccess: (response: any) => {
        successCallbackbookingId()
      },
      onError: (error: any) => {
        failureCallbackbooikgId()
       // showErrorToastMessage(`${error.response.data.message} please enter the Registored Mobile Number` );
      },
      retry: false,
      enabled: searchMobileIdValue?.length === 10,
      staleTime: 0,
      // refetchOnMount: true,
    }
  );
};


export const GetAllBookings = ({ userId }: any) => {
  return useQuery(
    [queryKeys.getAllBookings, userId],
    async () => {
        const { data } = await axiosInstance.get(
        `${apiendpoints.getAllBookings(
          userId
        )}`
      );
      return data;
    },
    {
      //enabled: !isEmpty(districtId),
      retry: false,
      onSuccess: () => {
        //queryClient.invalidateQueries([queryKeys.getAllUser]);
      },
      onError: (error: any) => {
        showErrorToastMessage(error?.response?.data?.message);
      },

    }
  );
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
  return useQuery(
    [queryKeys.getIssueType],
    async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getIssueType(placeId)}`
      );
      return data;
    },
    {
      enabled: !!callApi,
    }
  );
};


export const GetSubIssueType = (id:any,callApi:boolean) => {
  return useQuery(
    [queryKeys.getSubIssueType],
    async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getSubIssueType(id)}`
      );
      return data;
    },
    {
      enabled: !!callApi,
    }
  );
};
