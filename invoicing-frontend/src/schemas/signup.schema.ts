import * as yup from "yup";
import type { SignupFormValues } from "../types/signup.types";

export const SignupSchema: yup.ObjectSchema<SignupFormValues> = yup.object({
  firstName: yup.string().trim().max(50).required("First name is required"),

  lastName: yup.string().trim().max(50).nullable().notRequired(),

  email: yup
    .string()
    .email("Enter a valid email address.")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Enter a valid email address.")
    .required("Email is required."),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(20)
    .matches(/[a-zA-Z]/, "Must contain letters")
    .matches(/[0-9]/, "Must contain numbers")
    .required(),
// /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  companyName: yup
    .string()
    .trim()
    .max(100)
    .required("Please enter your company name."),

  address: yup.string().trim().max(500).required("Please enter company address."),
  city: yup.string().trim().max(50).required("Please enter city."),
  zip: yup
    .string()
    .matches(/^\d{6}$/, "Zip must be exactly 6 digits.")
    .nullable()
    .required(),

  industry: yup.string().trim().max(50).nullable().notRequired(),

  currencySymbol: yup.string().max(5).required("Currency symbol is required"),

  // ✅ IMPORTANT FIX
  logo: yup
    .mixed<File>()
    .nullable()
    .notRequired(),
});
