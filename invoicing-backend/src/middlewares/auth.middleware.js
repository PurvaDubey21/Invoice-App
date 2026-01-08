import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.authToken; 

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userID: decoded.userId || decoded.userID,
      companyID: decoded.companyID,   // 🔥 REQUIRED
      email: decoded.email,
    }; 
    console.log("Decoded token:", decoded);
    if (!req.user.companyID) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid session" });
  }
};
