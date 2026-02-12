import Joi from 'joi';

const sendMessageSchema = Joi.object({
  recipientId: Joi.string().required(),
  message: Joi.string().required().max(5000),
  attachmentUrls: Joi.array().items(Joi.string().uri())
});

const getMessagesSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  conversationId: Joi.string().required()
});

export  {
  sendMessageSchema,
  getMessagesSchema
};
