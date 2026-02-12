// import { Joi.object, Joi.string, number, array, date, boolean } from 'joi';
import Joi from "joi";

const createListingSchema = Joi.object({
  title: Joi.string().required().trim().max(100),
  description: Joi.string().required().max(2000),
  animalType: Joi.string().valid('cattle', 'buffalo', 'goat', 'sheep').required(),
  breed: Joi.string().required().max(50),
  age: Joi.number().required().min(0),
  weight: Joi.number().required().min(0),
  healthStatus: Joi.string().valid('healthy', 'good', 'average', 'needs_care').required(),
  vaccinations: Joi.array().items(Joi.object({
    vaccineName: Joi.string().max(100),
    vaccinationDate: Joi.date()
  })),
  medicalHistory: Joi.string().max(1000),
  location: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    address: Joi.string().required().max(255),
    city: Joi.string().required().max(50),
    state: Joi.string().required().max(50)
  }).required(),
  price: Joi.number().required().min(0),
  auctionStartPrice: Joi.number().min(0),
  auctionEndTime: Joi.date(),
  auctionType: Joi.string().valid('sealed_bid', 'open_bid', 'direct_purchase'),
  isPremium: Joi.boolean().default(false),
  imageUrls: Joi.array().items(Joi.string().uri()),
  videoUrl: Joi.string().uri()
});

const updateListingSchema = Joi.object({
  title: Joi.string().trim().max(100),
  description: Joi.string().max(2000),
  breed: Joi.string().max(50),
  age: Joi.number().min(0),
  weight: Joi.number().min(0),
  healthStatus: Joi.string().valid('healthy', 'good', 'average', 'needs_care'),
  vaccinations: Joi.array().items(Joi.object({
    vaccineName: Joi.string().max(100),
    vaccinationDate: Joi.date()
  })),
  medicalHistory: Joi.string().max(1000),
  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number(),
    address: Joi.string().max(255),
    city: Joi.string().max(50),
    state: Joi.string().max(50)
  }),
  price: Joi.number().min(0),
  isPremium: Joi.boolean(),
  imageUrls: Joi.array().items(Joi.string().uri())
});

const searchListingsSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  animalType: Joi.string().valid('cattle', 'buffalo', 'goat', 'sheep'),
  breed: Joi.string().max(50),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  healthStatus: Joi.string().valid('healthy', 'good', 'average', 'needs_care'),
  city: Joi.string().max(50),
  state: Joi.string().max(50),
  sortBy: Joi.string().valid('price', 'createdAt', 'age'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  isPremium: Joi.boolean()
});

export  {
  createListingSchema,
  updateListingSchema,
  searchListingsSchema
};
