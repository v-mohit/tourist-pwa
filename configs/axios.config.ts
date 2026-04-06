import { getAccessToken, handleLogout } from "@/utils/common.utils";
import axios from "axios";
import { NEXT_PUBLIC_API_BASE_URL } from "@/configs/env.config";
import store from "@/utils/redux/store";
import { setIsUnauthorized } from "@/utils/redux/slice/globalSlice";

const axiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_API_BASE_URL,
});
axiosInstance.defaults.headers.post["Content-Type"] = "application/json";

axiosInstance.interceptors.request.use(async(config) => {
//   if (config.url !== "/cms-authenticate") {
    const jwt = await getAccessToken();
    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }
  // }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if(error.response.status === 401){
      store.dispatch(setIsUnauthorized(true))
    // showErrorToastMessage("You are not authorised for this operation. Please login to continue.")
    // handleLogout()
    // Router.push("/")
    }
      if (!navigator.onLine) {
        // toast.error("You are currently offline", {
        //   position: toast.POSITION.BOTTOM_RIGHT,
        // });
        return Promise.reject(error);
      } else {
        // toast.error("APIs not working at the moment. Pleas try again later.", {
        //   position: toast.POSITION.BOTTOM_RIGHT,
        // });
        return Promise.reject(error);
      }
    return Promise.reject(error);
  }
);

export default axiosInstance;
