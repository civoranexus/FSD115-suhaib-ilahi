import Joi from "joi";

const createTransactionSchema = Joi.object({
  bidId: Joi.string().required(),
  paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'bank_transfer', 'wallet').required(),
  deliveryAddress: Joi.object({
    address: Joi.string().required().max(255),
    city: Joi.string().required().max(50),
    state: Joi.string().required().max(50),
    zipCode: Joi.string().pattern(/^[0-9]{5,6}$/).required(),
    country: Joi.string().required().max(50),
    phoneNumber: Joi.string().pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).required()
  }).required(),
  additionalNotes: Joi.string().max(500)
});

const updateTransactionStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'in_transit', 'completed', 'cancelled', 'disputed').required(),
  notes: Joi.string().max(500)
});

export  {
  createTransactionSchema,
  updateTransactionStatusSchema
};
