import { object, string, ref } from "joi";

const registerSchema = object({
  firstName: string().required().trim().max(50),
  lastName: string().required().trim().max(50),
  email: string().email().required().lowercase().trim(),
  password: string()
    .required()
    .min(8)
    .max(50)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  confirmPassword: string().required().valid(ref("password")),
  phoneNumber: string()
    .required()
    .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
  role: string().valid("buyer", "seller").required(),
  address: string().max(255),
  city: string().max(50),
  state: string().max(50),
  zipCode: string().pattern(/^[0-9]{5,6}$/),
  country: string().max(50),
});

const loginSchema = object({
  email: string().email().required().lowercase().trim(),
  password: string().required(),
});

const refreshTokenSchema = object({
  refreshToken: string().required(),
});

const changePasswordSchema = object({
  currentPassword: string().required(),
  newPassword: string()
    .required()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  confirmPassword: string().required().valid(ref("newPassword")),
});

const forgotPasswordSchema = object({
  email: string().email().required().lowercase().trim(),
});

const resetPasswordSchema = object({
  token: string().required(),
  newPassword: string()
    .required()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  confirmPassword: string().required().valid(ref("newPassword")),
});

export default {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
