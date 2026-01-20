import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
     console.log("BODY:", req.body);
    console.log("FILE:", req.file); // 🔥
    //  THIS

    console.log("cookies:", req.cookies);
console.log("user:", req.user);
console.log("companyID:", req.user?.companyID);
    const {
      FirstName,
      LastName,
      Email,
      Password,
      CompanyName,
      Address,
      City,
      ZipCode,
      Industry,
      CurrencySymbol,
    } = req.body;

    const exists = await User.findOne({ email: Email });
    if (exists) {
      return res.status(409).send("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    

    // 🔥 Generate companyID ONCE at signup
    const companyID = Math.floor(Date.now() / 1000);

    const user = await User.create({
      firstName: FirstName,
      lastName: LastName ?? null,
      email: Email,
      password: hashedPassword,
      companyID, // ✅ STORED
      companyName: CompanyName,
      address: Address,
      city: City,
      zip: ZipCode,
      industry: Industry ?? null,
      currencySymbol: CurrencySymbol,
      logoUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      },
      company: {
        companyID: user.companyID,
        companyName: user.companyName,
        currencySymbol: user.currencySymbol,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).send("Signup failed");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // 🔐 JWT with useful claims
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        companyID: user.companyID, // 🔥 MUST
        companyName: user.companyName,
        currencySymbol: user.currencySymbol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: rememberMe ? "30d" : "8h",
      }
    );

    // 🍪 HTTP-ONLY COOKIE
    res.cookie("authToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: rememberMe
        ? 30 * 24 * 60 * 60 * 1000 // 30 days
        : 8 * 60 * 60 * 1000,      // 8 hours
    });

    return res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      },
      company: {
        companyID: user.companyID,
        companyName: user.companyName,
        currencySymbol: user.currencySymbol,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};


export const getCompanyLogoUrl = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("logoUrl");

    if (!user) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.json({
      logoUrl: user.logoUrl, // string | null
    });
  } catch (error) {
    console.error("GetCompanyLogoUrl error:", error);
    res.status(500).json({
      message: "Failed to fetch company logo",
    });
  }
};

export const me = async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "firstName email companyID companyName currencySymbol"
    );

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    return res.json({
      userID: user._id,
      email: user.email,
      firstName: user.firstName,
      companyID: user.companyID,
      companyName: user.companyName,
      currencySymbol: user.currencySymbol,
    });
  } catch (err) {
    console.error("Auth Me error:", err);
    return res.status(401).json({ error: "Invalid session" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.json({ ok: true });
};
