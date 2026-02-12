import { z } from 'zod'

export const emailValidator = z.string().email('Invalid email address')

export const passwordValidator = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const phoneValidator = z
  .string()
  .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Invalid phone number')

export const loginSchema = z.object({
  email: emailValidator,
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: emailValidator,
  password: passwordValidator,
  confirmPassword: z.string(),
  phoneNumber: phoneValidator,
  role: z.enum(['buyer', 'seller'], { errorMap: () => ({ message: 'Please select buyer or seller' }) }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Category is required'),
  condition: z.enum(['new', 'like-new', 'good', 'fair', 'poor'], 'Invalid condition'),
  startingPrice: z.number().positive('Starting price must be positive'),
  images: z.array(z.instanceof(File)).min(1, 'At least one image is required'),
  endDate: z.string().datetime('Invalid end date'),
})

export const bidSchema = z.object({
  amount: z.number().positive('Bid amount must be positive'),
})

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: phoneValidator.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
})

export const validateForm = async (schema, data) => {
  try {
    const validated = await schema.parseAsync(data)
    return { valid: true, data: validated, errors: {} }
  } catch (error) {
    const errors = {}
    if (error.errors) {
      error.errors.forEach(err => {
        errors[err.path[0]] = err.message
      })
    }
    return { valid: false, data: null, errors }
  }
}
