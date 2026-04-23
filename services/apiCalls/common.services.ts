import { AUTHENTICATION_TOKEN, SSO_CURRENT_ENV_URL, SSO_TOKEN } from "@/utils/constants/common.constants";
import { deleteCookie } from "cookies-next";
import { apiendpoints } from "@/utils/constants/api-endpoints.constants";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/constants/react-query-keys.constants";
import axiosInstance from "@/configs/axios.config";

export const openPostPage = (url: string, data: any) => {
  const form = document.createElement("form");
  document.body.appendChild(form);
  form.method = "post";
  form.action = url;
  for (const name in data) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = data[name];
    form.appendChild(input);
  }
  form.submit();
  document.body.removeChild(form);
};

export const backToSSOAPI = async (token: string | undefined) => {
  if (token){
    return openPostPage(`${SSO_CURRENT_ENV_URL}/sso`, { userdetails: token });
  } 
};

export const signOutFromSSOAPI = async (token?: string | undefined) => {
  if (token) {
    deleteCookie(AUTHENTICATION_TOKEN)
    deleteCookie(SSO_TOKEN)
    return openPostPage(`${SSO_CURRENT_ENV_URL}/signout?ru=obmsadmin`, { userdetails: token });
  } 
    else return openPostPage(`${SSO_CURRENT_ENV_URL}/signout?ru=obmsadmin`, { userdetails: "" });
};
// /home/district-report

export const GetTouristStats = () => {
	// let page = (pageNumber || 1) - 1;
	return useQuery({
		queryKey: [queryKeys.getTouristStats],
		queryFn: async () => {
			const { data } = await axiosInstance.get(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}${apiendpoints.getTouristStats}`,
			);
			return data;
		},
	});
};