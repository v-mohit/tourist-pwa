"use client";
import { apiendpoints } from "@/utils/constants/api-endpoints.constants";
import { useQuery, useQueries, useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/utils/constants/react-query-keys.constants";
import axiosInstance from "@/configs/axios.config";
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from "@/utils/toast.utils";
import axios from "axios";


export const GuestLogin = () => {
    // return console.log('I am here')
    return useMutation({
      mutationKey: [queryKeys.guestLogin],
      mutationFn: async ({formData, isEmail}: {formData: any, isEmail: boolean}) => {
        console.log('formDataformData', formData)
        const { data } = await axiosInstance.post(
          `${apiendpoints.guestLogin}?isEmailVerify=${isEmail}`,
          formData,
          {
          headers: {
            'Content-Type': 'multipart/form-data',
          }}
        );
        return data;
      },
      onSuccess: (response: any) => {
        // queryClient.invalidateQueries([queryKeys.getTicketType]);
        // showSuccessToastMessage("Ticket Type deleted successfully");
        showSuccessToastMessage(response.message);
      },
      onError: (error: any, context) => {
        showErrorToastMessage(error.response.data.message);
      },
    });
  };


    export const GuestUpdateMobileNumber = (
    successCallback: (res: any) => void,
    failureCallback: (res: any) => void,
  ) => {
    
    // return console.log('I am here')
    return useMutation({
      mutationKey: [queryKeys.GuestUpdateMobileNumber],
      mutationFn: async ({mobile}: {formData: any, mobile: string}) => {
        const { data } = await axiosInstance.put(
          `${apiendpoints.GuestUpdateMobileNumber}?mobile=${mobile}`,
          {
          headers: {
            'Content-Type': 'multipart/form-data',
          }}
        );
        return data;
      },
      onSuccess: (response: any) => {
        // queryClient.invalidateQueries([queryKeys.getTicketType]);
        // showSuccessToastMessage("Ticket Type deleted successfully");
        showSuccessToastMessage(response.message);
        successCallback(response?.result);
      },
      onError: (error: any, context) => {
        showErrorToastMessage(error.response.data.message);
        failureCallback(error);
      },
    });
  };

  

  export const GuestVerifyOtp = (
    successCallback: (res: any) => void,
    failureCallback: (res: any) => void,
  ) => {
    
    // return console.log('I am here')
    return useMutation({
      mutationKey: [queryKeys.guestVerifyOtp],
      mutationFn: async ({formData, isEmail}: {formData: any, isEmail: boolean}) => {
        console.log('formDataformData', formData)
        const { data } = await axiosInstance.post(
          `${apiendpoints.guestVerifyOtp}?isEmailVerify=${isEmail}`,
          formData,
          {
          headers: {
            'Content-Type': 'multipart/form-data',
          }}
        );
        return data;
      },
      onSuccess: (response: any) => {
        // queryClient.invalidateQueries([queryKeys.getTicketType]);
        // showSuccessToastMessage("Ticket Type deleted successfully");
        showSuccessToastMessage(response.message);
        successCallback(response?.result);
      },
      onError: (error: any, context) => {
        showErrorToastMessage(error.response.data.message);
        failureCallback(error);
      },
    });
  };

  export const GuestSignUp = (
    successCallback: (res: any) => void,
    failureCallback: (res: any) => void,
  ) => {
    // return console.log('I am here')
    return useMutation({
      mutationKey: [queryKeys.guestSignUp],
      mutationFn: async (formData: any) => {
        console.log('formDataformData', formData)
        const { data } = await axiosInstance.post(
          `${apiendpoints.guestSignUp}`,
          formData,
          // {
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // }}
        );
        return data;
      },
      onSuccess: (response: any) => {
        // queryClient.invalidateQueries([queryKeys.getTicketType]);
        // showSuccessToastMessage("Ticket Type deleted successfully");
        showSuccessToastMessage(response.message);
        successCallback(response?.result);
      },
      onError: (error: any, context) => {
        showErrorToastMessage(error.response.data.message);
        failureCallback(error);
      },
    });
  };


    export const CheckMobileNo = (
    successCallback: (res: any) => void,
    failureCallback: (res: any) => void,
  ) => {
    // return console.log('I am here')
    return useMutation({
      mutationKey: [queryKeys.checkMobileNo],
      mutationFn: async (formData: any) => {

        const { data } = await axiosInstance.get(
          `${apiendpoints.checkMobileNo}`,
          {
            params: formData,
          }
        );
        return data;
      },
      onSuccess: (response: any) => {
        // queryClient.invalidateQueries([queryKeys.getTicketType]);
        // showSuccessToastMessage("Ticket Type deleted successfully");
        showSuccessToastMessage(response.message);
        successCallback(response?.result);
      },
      onError: (error: any, context) => {
        showErrorToastMessage(error.response.data.message);
        failureCallback(error);
      },
    });
  };

  export const GetUserDetails = (id: any) => {
    return useQuery({
      queryKey: [queryKeys.getUserDetails, id],
      queryFn: async () => {
        const { data } = await axiosInstance.get(
          `${apiendpoints.getUserDetail(id)}`
        );
        return data;
      },
      enabled: !!id,
    });
  };

export const GetEmitraKioskPaymentStatus = (callApi: boolean,
  successCallback: (res: any) => void,
) => {
  return useQuery({
    queryKey: [queryKeys.getEmitraKioskPaymentStatus],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getEmitraKioskPaymentStatus}`
      );
      successCallback(data?.result);
      return data;
    },
    enabled: !!callApi,
  });
};


export const GetSsoStatus = (callApi: boolean,
  successCallback: (res: any) => void,
) => {
  return useQuery({
    queryKey: [queryKeys.getssoStatus],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `${apiendpoints.getSsoStatus}`
      );
      successCallback(data?.result);
      return data;
    },
    enabled: !!callApi,
  });
};



