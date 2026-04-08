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

  if (data.logo instanceof File) {
  const cleanFile = new File(
    [data.logo],
    data.logo.name.replace(/\s+/g, "_"),
    { type: data.logo.type }
  );

  formData.append("Logo", cleanFile);
}


  
  
 

  const res = await axiosInstance.post(
    "/Auth/Signup",
    formData,
   
  );

  return res.data;
};

export const getCompanyLogoApi = async( companyId: string) => {
  const res = await axiosInstance.get(
    `/Auth/GetCompanyLogoUrl/${companyId}`,
    {
      responseType: "blob", // important for file downloads
    }
  );

  return res.data as { logoUrl: string | null };
}

export const getCompanyLogoThumbnailApi = async (companyId: string) => {
  const res = await axiosInstance.get(
    `/Auth/GetCompanyLogoThumbnailUrl/${companyId}`
  );

  return res.data; // ye SAS URL string return karega
};

export const loginApi = async (payload: LoginFormValues) =>{
  const res = await axiosInstance.post(
    `/Auth/Login`,
    payload,
  );

  return res.data;
} 