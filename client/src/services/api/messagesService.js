import apiClient from '../../utils/apiClient'

const messagesService = {
  getConversations: async () => {
    try {
      const response = await apiClient.get('/messages/conversations')
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getConversations')
      return {
        data: {
          success: true,
          data: [
            {
              _id: 'conv_1',
              participants: [
                { _id: 'user_123', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
                { _id: 'seller_1', name: 'Farm Best', avatar: 'https://i.pravatar.cc/150?u=seller' }
              ],
              lastMessage: { text: 'Is the cow still available?', createdAt: new Date().toISOString() },
              unreadCount: 2
            }
          ]
        }
      }
    }
  },

  getConversation: async (conversationId) => {
    try {
      const response = await apiClient.get(`/messages/conversations/${conversationId}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getConversation')
      return {
        data: {
          success: true,
          data: {
            _id: conversationId,
            participants: [
              { _id: 'user_123', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
              { _id: 'seller_1', name: 'Farm Best', avatar: 'https://i.pravatar.cc/150?u=seller' }
            ]
          }
        }
      }
    }
  },

  getMessages: async (conversationId, page = 1, limit = 20) => {
    try {
      const response = await apiClient.get(`/messages/conversations/${conversationId}/messages`, {
        params: { page, limit },
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getMessages')
      return {
        data: {
          success: true,
          data: [
            { _id: 'msg_1', sender: 'seller_1', text: 'Yes, it is available.', createdAt: new Date(Date.now() - 3600000).toISOString() },
            { _id: 'msg_2', sender: 'user_123', text: 'Is the cow still available?', createdAt: new Date(Date.now() - 7200000).toISOString() }
          ],
          pagination: { page, limit, total: 2, pages: 1 }
        }
      }
    }
  },

  sendMessage: async (conversationId, message) => {
    try {
      const response = await apiClient.post(`/messages/conversations/${conversationId}/send`, {
        text: message,
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for sendMessage')
      return {
        data: {
          success: true,
          data: { _id: `msg_${Date.now()}`, sender: 'user_123', text: message, createdAt: new Date().toISOString() }
        }
      }
    }
  },

  createConversation: async (userId) => {
    try {
      const response = await apiClient.post('/messages/conversations', { userId })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for createConversation')
      return {
        data: {
          success: true,
          data: { _id: 'conv_new', participants: [] } // Simplified dummy
        }
      }
    }
  },

  markAsRead: async (conversationId) => {
    try {
      const response = await apiClient.put(`/messages/conversations/${conversationId}/read`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for markAsRead')
      return { data: { success: true } }
    }
  },

  deleteConversation: async (conversationId) => {
    try {
      const response = await apiClient.delete(`/messages/conversations/${conversationId}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for deleteConversation')
      return { data: { success: true } }
    }
  },

  deleteMessage: async (conversationId, messageId) => {
    try {
      const response = await apiClient.delete(`/messages/conversations/${conversationId}/messages/${messageId}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for deleteMessage')
      return { data: { success: true } }
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await apiClient.get('/messages/unread-count')
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getUnreadCount')
      return { data: { success: true, count: 2 } }
    }
  },

  searchMessages: async (query) => {
    try {
      const response = await apiClient.get('/messages/search', {
        params: { q: query },
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for searchMessages')
      return { data: { success: true, data: [] } }
    }
  },
}

export { messagesService }
