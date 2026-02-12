import apiClient from '../../utils/apiClient'
import { dummyWatchlist } from './dummyData'

const watchlistService = {
  getWatchlist: async () => {
    try {
      const response = await apiClient.get('/watchlist')
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getWatchlist')
      return { data: { success: true, watchlist: dummyWatchlist } }
    }
  },

  addToWatchlist: async (listingId) => {
    try {
      const response = await apiClient.post('/watchlist', { listingId })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for addToWatchlist')
      return { data: { success: true, message: 'Added to watchlist (Dummy)' } }
    }
  },

  removeFromWatchlist: async (listingId) => {
    try {
      const response = await apiClient.delete(`/watchlist/${listingId}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for removeFromWatchlist')
      return { data: { success: true, message: 'Removed from watchlist (Dummy)' } }
    }
  },

  isInWatchlist: async (listingId) => {
    try {
      const response = await apiClient.get(`/watchlist/check/${listingId}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for isInWatchlist')
      return { data: { success: true, isWatched: false } }
    }
  },

  getWatchlistCount: async () => {
    try {
      const response = await apiClient.get('/watchlist/count')
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getWatchlistCount')
      return { data: { success: true, count: dummyWatchlist.length } }
    }
  },

  clearWatchlist: async () => {
    try {
      const response = await apiClient.delete('/watchlist')
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for clearWatchlist')
      return { data: { success: true, message: 'Watchlist cleared (Dummy)' } }
    }
  },
}

export { watchlistService }
