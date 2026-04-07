import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import {
  AUTHENTICATION_TOKEN,
  LOGGEDIN_USER_DATA,
  SSO_TOKEN,
} from '@/utils/constants/common.constants';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get('token');
  const ssoToken = searchParams.get('ssoToken');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  if (!token || !ssoToken) {
    return NextResponse.redirect(`${appUrl}/`);
  }

  let userData: any;
  try {
    userData = jwtDecode(token);
  } catch {
    return NextResponse.redirect(`${appUrl}/`);
  }

  const response = NextResponse.redirect(`${appUrl}/?sso_login_success=1`);

  response.cookies.set(AUTHENTICATION_TOKEN, token, { path: '/', sameSite: 'lax' });
  response.cookies.set(SSO_TOKEN, ssoToken, { path: '/', sameSite: 'lax' });
  response.cookies.set(LOGGEDIN_USER_DATA, JSON.stringify(userData), { path: '/', sameSite: 'lax' });

  return response;
}
