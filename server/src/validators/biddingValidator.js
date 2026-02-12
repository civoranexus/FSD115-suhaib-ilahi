import Joi from "joi";

const placeBidSchema = Joi.object({
  listingId: Joi.string().required(),
  bidAmount: Joi.number().required().min(0),
  bidType: Joi.string().valid('direct', 'auction').required()
});

const updateBidSchema = Joi.object({
  bidAmount: Joi.number().required().min(0)
});

const acceptBidSchema = Joi.object({
  bidId: Joi.string().required()
});

const rejectBidSchema = Joi.object({
  bidId: Joi.string().required(),
  reason: Joi.string().max(500)
});

export  {
  placeBidSchema,
  updateBidSchema,
  acceptBidSchema,
  rejectBidSchema
};
