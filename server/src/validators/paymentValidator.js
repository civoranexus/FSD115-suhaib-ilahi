// import { object, string, number, required, optional } from 'joi';
import Joi from "joi";

const initiatePaymentSchema = Joi.object({
  transactionId: Joi.string().required(),
  amount: Joi.number().required().min(0),
  paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'bank_transfer', 'wallet').required(),
  cardNumber: Joi.string().pattern(/^[0-9]{13,19}$/).when('paymentMethod', {
    is: 'credit_card',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  expiryMonth: Joi.number().min(1).max(12).when('paymentMethod', {
    is: 'credit_card',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  expiryYear: Joi.number().min(new Date().getFullYear()).when('paymentMethod', {
    is: 'credit_card',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  cvv: Joi.string().pattern(/^[0-9]{3,4}$/).when('paymentMethod', {
    is: 'credit_card',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

const refundPaymentSchema = Joi.object({
  paymentId: Joi.string().required(),
  reason: Joi.string().max(500).required()
});

export  {
  initiatePaymentSchema,
  refundPaymentSchema
};
