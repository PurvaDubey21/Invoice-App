// cyzo@mailinator.com
import { useState } from "react";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Header } from "../../components/layout/Header";

import { loginApi } from "../../services/auth.api";
import { isValidEmail, isValidPassword, isEmptyPassword } from "../../utils/validators";
import { Footer } from "../../components/layout/Footer";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
  setError("");

  if (!isValidEmail(email)) {
    setError("Enter a valid email.");
    return;
  }
  if(isEmptyPassword(password)){
    setError("Enter your password.");
    return;
  }
  if (!isValidPassword(password)) {
    setError("Password must be 8–20 characters.");
    return;
  }

  try {
    setLoading(true);

    // 🔹 1️⃣ Call login API
    const res = await loginApi({
      email: email.trim(),
      password,
      rememberMe,
    });

    // 🔑 2️⃣ SAVE TOKEN (MOST IMPORTANT FIX)
    localStorage.setItem("token", res.token);

    // (optional but recommended)
    localStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("company", JSON.stringify(res.company));

    // 🚀 3️⃣ Redirect after successful login
    navigate("/invoices", { replace: true });

  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data || "Email or password is wrong.");
    } else {
      setError("Unexpected error occurred");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      bgcolor="#f5f6f7"
    >
      <Header />

      <Typography
        variant="h4"
        fontWeight={600}
        textAlign="center"
        sx={{ color: "#525355", mt: 4, mb: 1 }}
      >
        Welcome Back
      </Typography>

      <Typography textAlign="center" color="text.secondary">
        Log in to your account.
      </Typography>
      <Box 
     
      display="flex" 
      flexDirection="column" 
      justifyContent="center"
      alignItems="center"
      p={4}>
        <Card elevation={4} sx={{ width: 400, p: 4 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Typography sx={{ color: "#525355" }}>
            Email Address *
          </Typography>
            <TextField
              label="Email Address "
              name="login_email"
              autoComplete="off"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              
            />
          

          <Typography sx={{ color: "#525355" }}>
            Password *
             </Typography>
          <TextField
              label="Password "
              name="login_password"
              autoComplete="new-password" // 🔥 KEY LINE
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
         

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                />
            }
            label="Remember Me"
            color="text.secondary"
          />
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={"end"}
            alignItems={"end"}
          >
            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "#525355",
                "&:hover": { bgcolor: "#424244" },
              }}
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? <CircularProgress size={22} /> : "Login"}
            </Button>
          </Box>
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <Typography
              textAlign="center"
              mt={3}
              sx={{ color: "text.secondary" }}
            >
            <Link  
            to="/signup"
            className="hover:underline font-medium">
              Create account
              </Link>
            </Typography>
          </Box>
        </Card>
        
      </Box>
      <Footer 
      message=" © 2025 InvoiceApp. All rights reserved."
      showLinks />
    </Box>
  );
};

export default LoginPage;
