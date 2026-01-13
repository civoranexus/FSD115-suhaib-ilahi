import Joi from "joi";

const registerSchema = Joi.object({
  firstName: Joi.string().required().trim().max(50),
  lastName: Joi.string().required().trim().max(50),
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string()
    .required()
    .min(8)
    .max(50)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")),
  phoneNumber: Joi.string()
    .required()
    .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
  role: Joi.string().valid("buyer", "seller").required(),
  address: Joi.string().max(255),
  city: Joi.string().max(50),
  state: Joi.string().max(50),
  zipCode: Joi.string().pattern(/^[0-9]{5,6}$/),
  country: Joi.string().max(50),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .required()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  confirmPassword: Joi.string().required().valid(Joi.ref("newPassword")),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string()
    .required()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number"
    ),
  confirmPassword: Joi.string().required().valid(Joi.ref("newPassword")),
});

export  {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
