export interface AuthApiResponse {
  email: string
  fullName?: string
  phone?: string
}

export async function loginApi(email: string, password: string): Promise<AuthApiResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { email }
}

export async function signupApi(
  fullName: string,
  email: string,
  phone: string,
  password: string
): Promise<AuthApiResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { email, fullName, phone }
}
