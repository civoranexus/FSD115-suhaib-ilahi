import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  loading: false,
  error: null,
  unreadCount: 0,
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload
    },
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    addConversation: (state, action) => {
      const exists = state.conversations.find(conv => conv._id === action.payload._id)
      if (!exists) {
        state.conversations.unshift(action.payload)
      }
    },
    updateConversation: (state, action) => {
      const index = state.conversations.findIndex(conv => conv._id === action.payload._id)
      if (index !== -1) {
        state.conversations[index] = action.payload
      }
    },
    markAsRead: (state, action) => {
      const conversation = state.conversations.find(conv => conv._id === action.payload)
      if (conversation) {
        conversation.unread = 0
      }
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  setConversations,
  setActiveConversation,
  setMessages,
  addMessage,
  addConversation,
  updateConversation,
  markAsRead,
  setUnreadCount,
  setLoading,
  setError,
  clearError,
} = messagesSlice.actions

export default messagesSlice.reducer
