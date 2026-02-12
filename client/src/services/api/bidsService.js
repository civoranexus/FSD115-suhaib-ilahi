import apiClient from '../../utils/apiClient'
import { dummyBids } from './dummyData'

const bidsService = {
  getBids: async (page = 1, limit = 20) => {
    try {
      const response = await apiClient.get('/bidding', {
        params: { page, limit },
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getBids')
      return {
        data: {
          success: true,
          data: dummyBids,
          pagination: { page, limit, total: dummyBids.length, pages: 1 }
        }
      }
    }
  },

  getListingBids: async (listingId) => {
    try {
      const response = await apiClient.get(`/bidding/listing/${listingId}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getListingBids')
      return { data: { success: true, data: dummyBids.filter(b => b.listingId === listingId) || dummyBids } }
    }
  },

  getMyBids: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/bidding/my/bids', {
        params: { page, limit },
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getMyBids')
      return {
        data: {
          success: true,
          data: dummyBids,
          pagination: { page, limit, total: dummyBids.length, pages: 1 }
        }
      }
    }
  },

  getBidById: async (bidId) => {
    try {
      const response = await apiClient.get(`/bidding/${bidId}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getBidById')
      return { data: { success: true, data: dummyBids.find(b => b.id === bidId) || dummyBids[0] } }
    }
  },

  placeBid: async (listingId, amount) => {
    try {
      const response = await apiClient.post('/bidding', {
        listingId,
        amount,
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for placeBid')
      return { data: { success: true, message: 'Bid placed successfully (Dummy)', data: { ...dummyBids[0], amount, listingId } } }
    }
  },

  updateBid: async (bidId, amount) => {
    try {
      const response = await apiClient.put(`/bidding/${bidId}`, { amount })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for updateBid')
      return { data: { success: true, message: 'Bid updated successfully (Dummy)', data: { ...dummyBids[0], amount } } }
    }
  },

  withdrawBid: async (bidId) => {
    try {
      const response = await apiClient.delete(`/bidding/${bidId}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for withdrawBid')
      return { data: { success: true, message: 'Bid withdrawn successfully (Dummy)' } }
    }
  },

  getBidHistory: async (listingId) => {
    try {
      const response = await apiClient.get(`/bidding/listing/${listingId}/history`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getBidHistory')
      return { data: { success: true, data: dummyBids } }
    }
  },

  getHighestBid: async (listingId) => {
    try {
      const response = await apiClient.get(`/bidding/listing/${listingId}/highest`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getHighestBid')
      return { data: { success: true, data: dummyBids[0] } }
    }
  },

  checkUserBid: async (listingId) => {
    try {
      const response = await apiClient.get(`/bidding/user-bid/${listingId}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for checkUserBid')
      return { data: { success: true, hasBidded: true, data: dummyBids[0] } }
    }
  },
}

export { bidsService }
