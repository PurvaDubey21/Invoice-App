import axiosInstance from "../api/axiosInstance";
import type { SignupFormValues } from "../types/signup.types";
import type { LoginFormValues } from "../types/login.types";

export const signupApi = async (data: SignupFormValues) => {
 const formData = new FormData();

  // ✅ Explicit mapping (MOST IMPORTANT)
  formData.append("FirstName", data.firstName);
  formData.append("LastName", data.lastName ?? "");
  formData.append("Email", data.email);
  formData.append("Password", data.password);
  formData.append("CompanyName", data.companyName);
  formData.append("Address", data.address ?? "");
  formData.append("City", data.city ?? "");
  formData.append("ZipCode", data.zip ?? "");
  formData.append("Industry", data.industry ?? "");
  formData.append("CurrencySymbol", data.currencySymbol);

  if (data.logo) {
    formData.append("logo", data.logo); // File
  }

  
  
 

  const res = await axiosInstance.post(
    `${import.meta.env.VITE_API_BASE_URL}/Auth/Signup`,
    formData,
   
  );

  return res.data;
};

export const getCompanyLogoApi = async( userId: string) => {
  const res = await axiosInstance.get(
    `${import.meta.env.VITE_API_BASE_URL}/Auth/CompanyLogo/${userId}`,
    {
      responseType: "blob", // important for file downloads
    }
  );

  return res.data as { logoUrl: string | null };
}

export const loginApi = async (payload: LoginFormValues) =>{
  const res = await axiosInstance.post(
    `${import.meta.env.VITE_API_BASE_URL}/Auth/Login`,
    payload,
  );

  return res.data;
} 