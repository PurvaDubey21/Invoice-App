import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupSchema } from "../../schemas/signup.schema";
import type { SignupFormValues } from "../../types/signup.types";
import { signupApi } from "../../services/auth.api";

import { TextField, Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { Divider } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";


import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { PasswordField } from "../../components/signup/PasswordField";
import { LogoUpload } from "../../components/signup/LogoUpload";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupFormValues>({
    resolver: yupResolver(SignupSchema),
  });

 const navigate = useNavigate();

const onSubmit = async (data: SignupFormValues) => {
  try {
    await signupApi(data);
    toast.success("Signup successful");
    navigate("/login");
  } catch (error) {
  const err = error as AxiosError<{ message?: string }>;

  const message =
    typeof err.response?.data === "string"
      ? err.response.data
      : err.response?.data?.message ?? "Signup failed";

  toast.error(message);
}

};

 


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col ">
      {/* ================= COMMON HEADER ================= */}
      <Header />

      {/* ================= PAGE TITLE ================= */}
    <div className="flex-1 flex flex-col items-center px-4 overflow-hidden ">
      <div className="text-center mt-2">
        <Typography variant="h4" fontWeight={600} sx={{ color: "#525355" }}>
          Create Your Account
        </Typography>
        <Typography color="text.secondary" className="mt-1">
          Set up your company and start invoicing in minutes.
        </Typography>
      </div>

      {/* ================= CARD CONTAINER ================= */}
      <div className="flex justify-center px-4 mt-2 w-full">
        <Paper className="w-full max-w-6xl px-4 md:px-6 py-4 " elevation={5} 
        sx={{maxHeight: "calc(100vh - 200px)",
           overflowY:"auto"
        }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ================= TWO COLUMNS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ===== LEFT: USER INFO ===== */}
              <div>
                <Typography variant="h6" fontWeight={600}  sx={{ color: "#525355" }}>
                  User Information
                </Typography>

                <div className="flex flex-col gap-6 mt-2">
                  <TextField
                    label="First Name *"
                    size="small"
                    {...register("firstName")}
                     error={!!errors.firstName}
                     helperText={errors.firstName?.message}
                  />

                  <TextField
                    label="Last Name"
                    size="small"
                    {...register("lastName")}
                  />

                  <TextField
                    label="Email Address *"
                    size="small"
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />

                  <PasswordField
                    field={register("password")}
                    error={errors.password}
                    value={watch("password")}
                  />
                </div>
              </div>

              {/* ===== RIGHT: COMPANY INFO ===== */}
              <div>
                <Typography variant="h6" fontWeight={600} sx={{ color: "#525355" }}>
                  Company Information
                </Typography>

                <div className="flex flex-col gap-3 mt-2">
                  <TextField
                    label="Company Name *"
                    size="small"
                    {...register("companyName")}
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message}
                  />

                  <LogoUpload onChange={(file) => setValue("logo", file,{
                    shouldValidate: true,
                  })} />

                  <TextField
                    label="Company Address *"
                    size="small"
                    multiline
                    minRows={2}
                    {...register("address")}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <TextField
                      label="City *"
                      size="small"
                      {...register("city")}
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />

                    <TextField
                      label="Zip Code *"
                      size="small"
                      {...register("zip")}
                      error={!!errors.zip}
                      helperText={errors.zip?.message}
                      inputProps={{ maxLength: 6 }}
                    />
                  </div>

                  <TextField
                    label="Industry"
                    size="small"
                    {...register("industry")}
                  />

                  <TextField
                    label="Currency Symbol *"
                    size="small"
                    {...register("currencySymbol")}
                    error={!!errors.currencySymbol}
                    helperText={errors.currencySymbol?.message}
                    placeholder="₹, $, €, AED"
                    sx={{mb:2}}
                  />
                </div>
              </div>
            </div>
          <Divider className="my-6" />
            {/* ================= ACTIONS ================= */}
            <div className="mt-2 flex justify-end">
              <Button
                type="submit"
                variant="contained"
                size="medium"
                className="px-8"
                sx={{ bgcolor: "#525355" }}

              >
                Sign Up
              </Button>
            </div>
            {/* ===== LOGIN LINK ===== */}
            <div className="flex justify-center ">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login
                </Link>
              </Typography>
            </div>
          </form>
        </Paper>
      </div>

      </div>
      
      

      {/* ================= COMMON FOOTER ================= */}
      <Footer 
      message=" © 2025 InvoiceApp. All rights reserved."/>
    
    </div>
  );
}
