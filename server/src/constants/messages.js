export const MESSAGES = {
  // Auth Messages
  AUTH_SUCCESS: 'Authentication successful',
  LOGIN_SUCCESS: 'Login successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  LOGOUT_SUCCESS: 'Logout successful',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_ALREADY_EXISTS: 'User with this email already exists',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden: insufficient permissions',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',

  // User Messages
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent',
  KYC_SUBMITTED: 'KYC documents submitted successfully',
  KYC_APPROVED: 'KYC approved successfully',
  KYC_REJECTED: 'KYC rejected',

  // Listing Messages
  LISTING_CREATED: 'Listing created successfully',
  LISTING_UPDATED: 'Listing updated successfully',
  LISTING_DELETED: 'Listing deleted successfully',
  LISTING_NOT_FOUND: 'Listing not found',
  LISTINGS_RETRIEVED: 'Listings retrieved successfully',
  LISTING_STATUS_UPDATED: 'Listing status updated successfully',

  // Bidding Messages
  BID_PLACED: 'Bid placed successfully',
  BID_UPDATED: 'Bid updated successfully',
  BID_CANCELLED: 'Bid cancelled successfully',
  BID_NOT_FOUND: 'Bid not found',
  BID_ACCEPTED: 'Bid accepted successfully',
  BID_REJECTED: 'Bid rejected successfully',
  BID_AMOUNT_INVALID: 'Bid amount must be higher than current bid',
  BID_EXPIRED: 'Bid has expired',

  // Transaction Messages
  TRANSACTION_CREATED: 'Transaction created successfully',
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  TRANSACTION_STATUS_UPDATED: 'Transaction status updated successfully',
  TRANSACTION_COMPLETED: 'Transaction completed successfully',
  TRANSACTION_CANCELLED: 'Transaction cancelled successfully',

  // Payment Messages
  PAYMENT_INITIATED: 'Payment initiated successfully',
  PAYMENT_COMPLETED: 'Payment completed successfully',
  PAYMENT_FAILED: 'Payment failed',
  PAYMENT_NOT_FOUND: 'Payment not found',
  PAYMENT_REFUNDED: 'Payment refunded successfully',
  INSUFFICIENT_BALANCE: 'Insufficient balance in wallet',
  INVALID_PAYMENT_METHOD: 'Invalid payment method',

  // Message Messages
  MESSAGE_SENT: 'Message sent successfully',
  MESSAGE_NOT_FOUND: 'Message not found',
  CONVERSATION_NOT_FOUND: 'Conversation not found',
  MESSAGES_RETRIEVED: 'Messages retrieved successfully',

  // Notification Messages
  NOTIFICATION_RETRIEVED: 'Notifications retrieved successfully',
  NOTIFICATION_MARKED_READ: 'Notification marked as read',
  NOTIFICATION_DELETED: 'Notification deleted successfully',

  // Admin Messages
  ADMIN_ACTION_SUCCESSFUL: 'Admin action completed successfully',
  USER_SUSPENDED: 'User suspended successfully',
  USER_ACTIVATED: 'User activated successfully',
  LISTING_SUSPENDED: 'Listing suspended successfully',
  REPORT_GENERATED: 'Report generated successfully',

  // Error Messages
  INTERNAL_SERVER_ERROR: 'Internal server error',
  BAD_REQUEST: 'Bad request',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  FILE_UPLOAD_ERROR: 'File upload failed',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_SIZE_EXCEEDED: 'File size exceeded maximum limit',
  RATE_LIMIT_EXCEEDED: 'Too many requests, please try again later',
  DATABASE_ERROR: 'Database error occurred',
  EXTERNAL_SERVICE_ERROR: 'External service error'
};

