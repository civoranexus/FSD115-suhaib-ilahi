import { genSalt, hash as _hash, compare } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const hashPassword = async (password) => {
  const salt = await genSalt(10);
  return _hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return compare(password, hash);
};

const generateUUID = () => uuidv4();

const generateTransactionId = () =>
  `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

const generateBidId = () =>
  `BID-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

const generateInvoiceNumber = () =>
  `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

const calculateCommission = (amount, commissionPercentage = 5) => {
  return (amount * commissionPercentage) / 100;
};

const getExpiryDate = (days = 30) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};

const getAgeInYears = (birthDate) => {
  const today = new Date();
  let age = today.getFullYear() - new Date(birthDate).getFullYear();
  const monthDiff = today.getMonth() - new Date(birthDate).getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < new Date(birthDate).getDate())
  ) {
    age--;
  }
  return age;
};

export default {
  hashPassword,
  comparePassword,
  generateUUID,
  generateTransactionId,
  generateBidId,
  generateInvoiceNumber,
  formatPrice,
  calculateCommission,
  getExpiryDate,
  isValidEmail,
  isValidPhoneNumber,
  sanitizeInput,
  getAgeInYears,
};
