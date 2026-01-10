import { object, string, array, date } from 'joi';

const updateProfileSchema = object({
  firstName: string().trim().max(50),
  lastName: string().trim().max(50),
  phoneNumber: string().pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
  address: string().max(255),
  city: string().max(50),
  state: string().max(50),
  zipCode: string().pattern(/^[0-9]{5,6}$/),
  country: string().max(50),
  businessName: string().max(100),
  businessRegistration: string().max(50),
  bankAccountNumber: string().max(50),
  bankRoutingNumber: string().max(20)
});

const submitKYCSchema = object({
  idType: string().valid('aadhar', 'pancard', 'driving_license', 'passport').required(),
  idNumber: string().required().max(50),
  documentUrls: array().items(string().uri()).required(),
  dateOfBirth: date().required(),
  address: string().max(255).required(),
  city: string().max(50).required(),
  state: string().max(50).required(),
  zipCode: string().pattern(/^[0-9]{5,6}$/).required()
});

const updateWalletSchema = object({
  bankAccountNumber: string().max(50),
  bankRoutingNumber: string().max(20),
  bankName: string().max(100)
});

export default {
  updateProfileSchema,
  submitKYCSchema,
  updateWalletSchema
};
