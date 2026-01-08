export interface SignupFormValues {
  firstName: string;
  lastName?: string | null;   // ✅ optional + nullable

  email: string;
  password: string;

  companyName: string;
  address?: string | null;
  city?: string | null;
  zip?: string | null;
  industry?: string | null;

  currencySymbol: string;
  logo?: File | null;
}
