import Joi from 'joi';

const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().max(50),
  lastName: Joi.string().trim().max(50),
  phoneNumber: Joi.string().pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
  address: Joi.string().max(255),
  city: Joi.string().max(50),
  state: Joi.string().max(50),
  zipCode: Joi.string().pattern(/^[0-9]{5,6}$/),
  country: Joi.string().max(50),
  businessName: Joi.string().max(100),
  businessRegistration: Joi.string().max(50),
  bankAccountNumber: Joi.string().max(50),
  bankRoutingNumber: Joi.string().max(20)
});

const submitKYCSchema = Joi.object({
  idType: Joi.string().valid('aadhar', 'pancard', 'driving_license', 'passport').required(),
  idNumber: Joi.string().required().max(50),
  documentUrls: Joi.array().items(Joi.string().uri()).required(),
  dateOfBirth: Joi.date().required(),
  address: Joi.string().max(255).required(),
  city: Joi.string().max(50).required(),
  state: Joi.string().max(50).required(),
  zipCode: Joi.string().pattern(/^[0-9]{5,6}$/).required()
});

const updateWalletSchema = Joi.object({
  bankAccountNumber: Joi.string().max(50),
  bankRoutingNumber: Joi.string().max(20),
  bankName: Joi.string().max(100)
});

export  {
  updateProfileSchema,
  submitKYCSchema,
  updateWalletSchema
};
