import apiClient from '../../utils/apiClient'

const usersService = {
  getUserProfile: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`)
    return response
  },

  updateProfile: async (userData) => {
    const formData = new FormData()
    Object.keys(userData).forEach(key => {
      formData.append(key, userData[key])
    })
    const response = await apiClient.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response
  },

  getUserRatings: async (userId) => {
    const response = await apiClient.get(`/users/${userId}/ratings`)
    return response
  },

  getUserListings: async (userId, page = 1, limit = 10) => {
    const response = await apiClient.get(`/users/${userId}/listings`, {
      params: { page, limit },
    })
    return response
  },

  getUserStats: async (userId) => {
    const response = await apiClient.get(`/users/${userId}/stats`)
    return response
  },

  rateUser: async (userId, rating, review) => {
    const response = await apiClient.post(`/users/${userId}/rate`, {
      rating,
      review,
    })
    return response
  },

  reportUser: async (userId, reason, description) => {
    const response = await apiClient.post(`/users/${userId}/report`, {
      reason,
      description,
    })
    return response
  },

  blockUser: async (userId) => {
    const response = await apiClient.post(`/users/${userId}/block`)
    return response
  },

  unblockUser: async (userId) => {
    const response = await apiClient.delete(`/users/${userId}/block`)
    return response
  },

  getBlockedUsers: async () => {
    const response = await apiClient.get('/users/blocked')
    return response
  },
}

export { usersService }
