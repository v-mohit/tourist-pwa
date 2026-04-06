import {
  AUTHENTICATION_TOKEN,
  EXTERNAL_LINK_REDIRECTION_MES,
  LOGGEDIN_USER_DATA,
  SSO_TOKEN,
  TIMEZONES,
} from "./constants/common.constants";
import { deleteCookie, getCookie } from "cookies-next";
import moment from "moment-timezone";
import { useAuthStore } from "@/store/useAuthStore";

// utils/common.utils.ts


export const handleLogout = async () => {
  console.clear();
  console.log("Logging out...");

  // Clear cookies
  await deleteCookie(AUTHENTICATION_TOKEN);
  await deleteCookie(SSO_TOKEN);
  await deleteCookie(LOGGEDIN_USER_DATA);

  // Clear localStorage
  localStorage.clear();

  // Reset Zustand store
  useAuthStore.getState().reset();

  // Redirect to login or home
   window.location.href = "/";
  location.reload();
};

export const redirectToExternalLink = (
  e: any,
  href: string,
  openInNewTab: boolean,
) => {
  e.stopPropagation();
  e.preventDefault();
  if (!openInNewTab) return window.location.href = href;
  const shouldRedirect = window.confirm(EXTERNAL_LINK_REDIRECTION_MES);
  if (shouldRedirect) {
    window.open(href, "_blank");
  }
};

export const getAccessToken = async () => {
  const accessToken = await getCookie(AUTHENTICATION_TOKEN);
  return accessToken;
};

export const convertDateIST = (date: Date | number) =>
  moment(date).tz(TIMEZONES.india).format("Do MMMM, YYYY");

export const convertTimeIST = (date: Date | number) =>
  moment(date).tz(TIMEZONES.india).format("hh:mm A");

export const formatPriceInDisplayFormat = (amount: any) => {
  return amount
    ? new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
    : 0;
};

function getGroupKey(name: string) {
  if (name.toLowerCase().includes('risl fee')) return 'Risl Fee';
  if (name.toLowerCase().includes('tiger reserve development fee')) return 'TRDF';
  return name;
}

export const totalFormattedPriceWithIndiaForeignCurrency = (safeMergedCharges: any) => {
  const newObj = safeMergedCharges.map((citizen: any) => {
    const groupTotals: Record<string, number> = {};
    (citizen.ticketTypeConfigValue || []).forEach((charge: any) => {
      const group = getGroupKey(charge.name);
      groupTotals[group] = (groupTotals[group] || 0) + (typeof charge.amount === 'number' ? charge.amount : 0);
    });
    return { qty: citizen.qty, groupTotals };
  });

  // Sum all groupTotals for each object, then multiply by qty, then sum all
  let total = 0;
  newObj.forEach((item: any) => {
    const groupSum = Object.values(item.groupTotals).reduce((acc: number, val: any) => acc + Number(val), 0);
    total += groupSum * (item.qty || 1);
  });
  return total.toFixed(2);
}


export function maskIdentityNumber(identityNumber: string) {
  const lastFourDigits = identityNumber.slice(-4);
  const maskedPart = identityNumber.slice(0, -4).replace(/./g, '*');

  return maskedPart + lastFourDigits;
}

export const getIpAddress = async () => {
  try {
    const response = await fetch('https://api64.ipify.org?format=json');
    const data = await response.json();
    const ip = data.ip;
    localStorage.setItem("ipaddress", ip);
    return ip;
  } catch (error) {
    console.error('Error fetching the IP address:', error);
    return null;
  }
};

export const generateCaptcha = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars[Math.floor(Math.random() * chars.length)];
  }
  return captcha;
};

