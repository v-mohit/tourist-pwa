import { AUTHENTICATION_TOKEN, SSO_CURRENT_ENV_URL, SSO_TOKEN } from "@/utils/constants/common.constants";
import { deleteCookie } from "cookies-next";

export const openPostPage = (url: string, data: any) => {
  var form = document.createElement("form");
  document.body.appendChild(form);
  form.method = "post";
  form.action = url;
  for (var name in data) {
    var input = document.createElement("input");
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
