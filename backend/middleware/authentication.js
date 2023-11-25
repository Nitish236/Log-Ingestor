require("dotenv").config();

const jwt = require("jsonwebtoken");
const { UnauthenticatedError, UnauthorizedError } = require("../errors");

const authenticateUser = async (req, res, next) => {
  // Check Token
  const token =
    req.cookies?.token ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.body?.token;

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid, Token not found");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the routes
    req.user = {
      userId: payload.userId,
      name: payload.name,
      role: payload.role,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid, Log in first");
  }
};

const authorizePermissions = (roles) => {
  return (req, res, next) => {
    if (!roles.has(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
