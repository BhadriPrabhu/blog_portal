const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // 1. Get token from the headers (Authorization: Bearer <token>)
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // If no token, we still call next() but req.user remains undefined
    // This allows "Guest" viewing of profiles
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach the user data to the request object
    req.user = decoded; // This usually contains { id: "...", username: "..." }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyToken;