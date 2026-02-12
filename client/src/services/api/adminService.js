import apiClient from '../../utils/apiClient'

const adminService = {
  getDashboardStats: async () => {
    const response = await apiClient.get('/admin/dashboard')
    return response
  },

  getUsers: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    })
    const response = await apiClient.get(`/admin/users?${params}`)
    return response
  },

  getUserDetails: async (userId) => {
    const response = await apiClient.get(`/admin/users/${userId}`)
    return response
  },

  updateUserStatus: async (userId, status) => {
    const response = await apiClient.put(`/admin/users/${userId}/status`, { status })
    return response
  },

  suspendUser: async (userId, reason, duration) => {
    const response = await apiClient.post(`/admin/users/${userId}/suspend`, {
      reason,
      duration,
    })
    return response
  },

  unsuspendUser: async (userId) => {
    const response = await apiClient.post(`/admin/users/${userId}/unsuspend`)
    return response
  },

  getListings: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    })
    const response = await apiClient.get(`/admin/listings?${params}`)
    return response
  },

  getListingDetails: async (listingId) => {
    const response = await apiClient.get(`/admin/listings/${listingId}`)
    return response
  },

  approveListing: async (listingId) => {
    const response = await apiClient.post(`/admin/listings/${listingId}/approve`)
    return response
  },

  rejectListing: async (listingId, reason) => {
    const response = await apiClient.post(`/admin/listings/${listingId}/reject`, { reason })
    return response
  },

  removeListing: async (listingId, reason) => {
    const response = await apiClient.delete(`/admin/listings/${listingId}`, {
      data: { reason },
    })
    return response
  },

  getReports: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/admin/reports', {
      params: { page, limit },
    })
    return response
  },

  getReportDetails: async (reportId) => {
    const response = await apiClient.get(`/admin/reports/${reportId}`)
    return response
  },

  resolveReport: async (reportId, action, notes) => {
    const response = await apiClient.post(`/admin/reports/${reportId}/resolve`, {
      action,
      notes,
    })
    return response
  },

  getTransactions: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    })
    const response = await apiClient.get(`/admin/transactions?${params}`)
    return response
  },

  refundTransaction: async (transactionId, reason) => {
    const response = await apiClient.post(`/admin/transactions/${transactionId}/refund`, {
      reason,
    })
    return response
  },

  getAnalytics: async (period = '30d') => {
    const response = await apiClient.get('/admin/analytics', {
      params: { period },
    })
    return response
  },

  exportData: async (dataType, format = 'csv') => {
    const response = await apiClient.get('/admin/export', {
      params: { type: dataType, format },
      responseType: format === 'csv' ? 'blob' : 'json',
    })
    return response
  },

  updateSettings: async (settings) => {
    const response = await apiClient.put('/admin/settings', settings)
    return response
  },

  getSettings: async () => {
    const response = await apiClient.get('/admin/settings')
    return response
  },
}

export { adminService }
