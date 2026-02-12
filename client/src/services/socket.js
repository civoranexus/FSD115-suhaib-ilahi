import io from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

let socket = null

export const initializeSocket = (token) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })
  }
  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const socketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  NEW_BID: 'new_bid',
  BID_PLACED: 'bid_placed',
  AUCTION_ENDED: 'auction_ended',

  NEW_MESSAGE: 'new_message',
  MESSAGE_SENT: 'message_sent',
  TYPING: 'typing',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',

  LISTING_UPDATED: 'listing_updated',
  LISTING_ENDED: 'listing_ended',

  NOTIFICATION: 'notification',
  ALERT: 'alert',

  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',
}

export const socketEmit = (event, data = {}) => {
  if (socket) {
    socket.emit(event, data)
  }
}

export const socketOn = (event, callback) => {
  if (socket) {
    socket.on(event, callback)
  }
}

export const socketOff = (event) => {
  if (socket) {
    socket.off(event)
  }
}

export const socketOnce = (event, callback) => {
  if (socket) {
    socket.once(event, callback)
  }
}
