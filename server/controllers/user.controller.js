import * as UserService from "./user.service.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.util.js";

export const register = async (req, res) => {
  const { fullName, email, phone, password, role } = req.body;

  const userId = await UserService.createUser({
    fullName,
    email,
    phone,
    password,
    role
  });

  res.status(201).json({
    message: "User registered successfully",
    userId
  });
};

export const login = async (req, res) => {
  const { identifier, password } = req.body;

  const user = await UserService.findUserByEmailOrPhone(identifier);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      role: user.role,
      email: user.email
    }
  });
};

export const getProfile = async (req, res) => {
  const user = await UserService.getUserById(req.user.id);
  res.json(user);
};
