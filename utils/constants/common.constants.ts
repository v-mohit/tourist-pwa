import { NEXT_PUBLIC_ENVIRONMENT } from "@/configs/env.config";

export const AUTHENTICATION_TOKEN = "auth_token";
export const PRE_TICKET_BOOKING_DATA = "PRE_TICKET_BOOKING_DATA";

export const SSO_TOKEN = "sso_token";
export const LOGGEDIN_USER_DATA = "LOGGEDIN_USER_DATA";
export const EXTERNAL_LINK_REDIRECTION_MES = `You are being redirected to an external site.
Are you sure you want to proceed with this redirection?`;
export const SOMETHING_WENT_WRONG_MES = `Something went wrong! please try after sometime.`;

export const SSO_STAGE_URL = process.env.NEXT_PUBLIC_SSO_STAGE_URL as string;
export const SSO_PROD_URL = process.env.NEXT_PUBLIC_SSO_PROD_URL as string;
export const EMITRA_STAGE_URL =
  process.env.NEXT_PUBLIC_EMITRA_STAGE_URL as string;
export const EMITRA_PROD_URL =
  process.env.NEXT_PUBLIC_EMITRA_PROD_URL as string;

export const KIOSK_STAGE_URL = process.env.NEXT_PUBLIC_KIOSK_STAGE_URL as string;
export const KIOSK_PROD_URL = process.env.NEXT_PUBLIC_KIOSK_PROD_URL as string;

export const SSO_CURRENT_ENV_URL =
  NEXT_PUBLIC_ENVIRONMENT === "prod" ? SSO_PROD_URL : SSO_STAGE_URL;

export const CURRENT_EMITRA_ENV_URL =
  NEXT_PUBLIC_ENVIRONMENT === "prod" ? EMITRA_PROD_URL : EMITRA_STAGE_URL;

export const CURRENT_KIOSK_URL =
  NEXT_PUBLIC_ENVIRONMENT === "prod" ? KIOSK_PROD_URL : KIOSK_STAGE_URL

export const LOGIN_TYPES = {
  MOBILE: "MOBILE",
  EMAIL: "EMAIL",
  RAJSSO: "RAJSSO",
};

export const PLACE_TYPES = {
  INVENTORY: "INVENTORY",
  NON_INVENTORY: "NON_INVENTORY",
};

export const TICKET_TYPES = {
  NORMAL: "NORMAL",
  COMPOSITE: "COMPOSITE",
};

export const SPECIFIC_CHARGES = {
  ONLINE: "Online",
  OFFLINE: "Offline",
};

export const CANCELLED_BOOKING_STATUS = {
  PENDING: "PENDING",
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  FAIL: "FAIL",
  SUCCESS: "SUCCESS",
};

export const TIMEZONES = {
  india: "Asia/Kolkata",
  utc: "UTC",
};

export const LAST_ROUTE = "LAST_ROUTE";
