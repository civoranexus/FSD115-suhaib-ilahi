const USER_ROLES = {
  ADMIN: 'admin',
  SELLER: 'seller',
  BUYER: 'buyer'
};

const LISTING_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold',
  SUSPENDED: 'suspended',
  DRAFT: 'draft'
};

const ANIMAL_TYPES = {
  CATTLE: 'cattle',
  BUFFALO: 'buffalo',
  GOAT: 'goat',
  SHEEP: 'sheep'
};

const BID_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
  EXPIRED: 'expired'
};

const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_TRANSIT: 'in_transit',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed'
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled'
};

const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  WALLET: 'wallet'
};

const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read'
};

const NOTIFICATION_TYPES = {
  BID_PLACED: 'bid_placed',
  BID_ACCEPTED: 'bid_accepted',
  BID_REJECTED: 'bid_rejected',
  AUCTION_WON: 'auction_won',
  AUCTION_LOST: 'auction_lost',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_FAILED: 'payment_failed',
  ORDER_CONFIRMED: 'order_confirmed',
  ORDER_COMPLETED: 'order_completed',
  MESSAGE_RECEIVED: 'message_received',
  LISTING_SOLD: 'listing_sold',
  LISTING_SUSPENDED: 'listing_suspended',
  KYC_APPROVED: 'kyc_approved',
  KYC_REJECTED: 'kyc_rejected'
};

const KYC_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RESUBMIT: 'resubmit'
};

const AUCTION_TYPES = {
  SEALED_BID: 'sealed_bid',
  OPEN_BID: 'open_bid',
  DIRECT_PURCHASE: 'direct_purchase'
};

export {
  USER_ROLES,
  LISTING_STATUS,
  ANIMAL_TYPES,
  BID_STATUS,
  TRANSACTION_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  MESSAGE_STATUS,
  NOTIFICATION_TYPES,
  KYC_STATUS,
  AUCTION_TYPES
};
