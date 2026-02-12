import jwt from "jsonwebtoken"
import logger from "../utils/logger.js";

const generateAccessToken = (userId, role) => {
  try {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "24h",
    });
    return token;
  } catch (error) {
    logger.error("Access token generation failed:", error);
    throw error;
  }
};

const generateRefreshToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d",
    });
    return token;
  } catch (error) {
    logger.error("Refresh token generation failed:", error);
    throw error;
  }
};

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    logger.error("Access token verification failed:", error.message);
    throw error;
  }
};

const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return decoded;
  } catch (error) {
    logger.error("Refresh token verification failed:", error.message);
    throw error;
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
