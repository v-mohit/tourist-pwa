import { queryClient } from "@/components/common/ReactQueryProvider";
import axiosInstance from "@/configs/axios.config";
import { apiendpoints } from "@/utils/constants/api-endpoints.constants";
import { queryKeys } from "@/utils/constants/react-query-keys.constants";
import { showErrorToastMessage, showSuccessToastMessage } from "@/utils/toast.utils";
import { useMutation, useQuery } from "@tanstack/react-query";



  
export const GetVendorTypeAllStatus = (
    pageNumber: any,
    searchKey: any,
    size: any,
    status: any,
    userId:any,
    vendorDetailId:any,
    verifiedUser:any
  ) => {
    let page = (pageNumber || 1) - 1;
    return useQuery(
      [
        queryKeys.getVendorTypeAllStatus,,
        page,
        searchKey,
        size,
        status,
        userId,
        vendorDetailId,
        verifiedUser
      ],
      async () => {
        const { data } = await axiosInstance.get(
          `${apiendpoints.getVendorTypeAllStatus}?offSet=${page}&searchKey=${searchKey}&size=${size}&status=${status}&userId=${userId}&vendorDetailId=${vendorDetailId}&verifiedUser=${verifiedUser}`
        );
        return data;
      },
      {
        enabled: !!userId ,
        onSuccess: (response: any) => {
          // showSuccessToastMessage(response?.message);
        },
        onError: (error: any) => {
          showErrorToastMessage(error.response.data.message);
        },
  
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        // keepPreviousData: true,
      }
    );
  };
  
  
export const GetVendorTypeById = (id: string) => {
    return useQuery(
      [queryKeys.getVendorTypeById, id],
      async () => {
        try {
          const { data } = await axiosInstance.get(
            `${apiendpoints.getVendorTypeById}/${id}`
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
        retry: false
      }
    );
  };
  
export const CreateNewVendor = (
    successCallback: () => void,
    failureCallback: () => void
  ) => {
    return useMutation(
      [queryKeys.createNewVendor],
      async (detail: object) => {
        const { data } = await axiosInstance.post(
          `${apiendpoints.createNewVendor}`,
          detail
        );
        return data;
      },
      {
        onSuccess: (response: any) => {
            queryClient.invalidateQueries([queryKeys.getVendorTypeAllStatus]);
          //  queryClient.invalidateQueries([queryKeys.contentCreate]);
          showSuccessToastMessage(response.message);
          successCallback();
        },
        onError: (error: any) => {
          showErrorToastMessage(error.response.data.message);
          failureCallback();
        },
       
      }
    );
  };
  
   
export const GetMasterVendorType = (
    bookingType: any,
    pageNumber: any,
    pagination: any,
    searchKey: any,
    size: any,
    status: any
  ) => {
    let page = (pageNumber || 1) - 1;
    return useQuery(
      [
        queryKeys.getMasterVendorType,
        bookingType,
        page,
        pagination,
        searchKey,
        size,
        status,
      ],
      async () => {
        const { data } = await axiosInstance.get(
          `${apiendpoints.getMasterVendorType}?bookingType=${bookingType}&offSet=${pageNumber}&pagination=${pagination}&searchKey=${searchKey}&size=${size}&status=${status}`
        );
        return data;
      },
      {
        onSuccess: (response: any) => {
          // showSuccessToastMessage(response?.message);
        },
        onError: (error: any) => {
          showErrorToastMessage(error.response.data.message);
        },
  
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        // keepPreviousData: true,
      }
    );
  };
  
   
export const ApproveRejectVendor = (
    successCallback: () => void,
    failureCallback: () => void
  ) => {
    return useMutation(
      [queryKeys.approveRejectVendor],
      async (detail: object) => {
        const { data } = await axiosInstance.post(
          `${apiendpoints.approveRejectVendor}`,
          detail
        );
        return data;
      },
      {
        onSuccess: (response: any) => {
          queryClient.invalidateQueries([queryKeys.getVendorTypeAllStatus]);
          //  queryClient.invalidateQueries([queryKeys.contentCreate]);
          showSuccessToastMessage(response.message);
          successCallback();
        },
        onError: (error: any) => {
          showErrorToastMessage(error.response.data.message);
          failureCallback();
        },
       
      }
    );
  };
  