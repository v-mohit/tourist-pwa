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

export const UploadImageAPI = (
  uploadImageSuccessCallback: (res: any) => void,
  uploadImageFailureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.uploadImage],
    mutationFn: async (reviewData: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.uploadReviewRating}`,
        reviewData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
    onSuccess: (response: any) => {
      showSuccessToastMessage('Image uploaded successfully');
      uploadImageSuccessCallback(response.result)
    },
    onError: (error: any) => {
      console.log("upload err-",error);
      showErrorToastMessage(SOMETHING_WENT_WRONG_MES);
      uploadImageFailureCallback(error);
    },
  });
};

export const UploadVideoAPI = (
  uploadVideoSuccessCallback: (res: any) => void,
  uploadVideoFailureCallback: (res: any) => void,
) => {
  return useMutation({
    mutationKey: [queryKeys.uploadVideo],
    mutationFn: async (reviewData: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.uploadVideo}`,
        reviewData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
    onSuccess: (response: any) => {
      showSuccessToastMessage('Video uploaded successfully');
      uploadVideoSuccessCallback(response.result)
    },
    onError: (error: any) => {
      console.log("upload err-",error);
      showErrorToastMessage(SOMETHING_WENT_WRONG_MES);
      uploadVideoFailureCallback(error)
    },
  });
};

export const AddEditReviewRating = () => {
  return useMutation({
    mutationKey: [queryKeys.addEditReviewRating],
    mutationFn: async (reviewData: any) => {
      const { data } = await axiosInstance.post(
        `${apiendpoints.addEditReviewRating}`,
        reviewData,
      );
      return data;
    },
    onSuccess: (response: any) => {
      showSuccessToastMessage('Rating & Review added successfully');
    },
    onError: (error: any) => {
      showErrorToastMessage(SOMETHING_WENT_WRONG_MES);
    },
  });
};

export const DeleteReviewRating = () => {
  return useMutation({
    mutationKey: [queryKeys.deleteReviewRating],
    mutationFn: async ({ ticketBookingId }: { ticketBookingId: string }) => {
      const { data } = await axiosInstance.put(
        `${apiendpoints.deleteReviewRating}?id=${ticketBookingId}`,
      );
      return data;
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.GetBookingDetails] });
      showSuccessToastMessage(response.message);
    },
    onError: (error: any) => {
      showErrorToastMessage(error.response.data.message);
    },
  });
};
