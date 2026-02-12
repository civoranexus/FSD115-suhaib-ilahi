import apiClient from '../../utils/apiClient'
import { dummyListings } from './dummyData'

const listingsService = {
  getListings: async (page = 1, limit = 20, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      })
      const response = await apiClient.get(`/listings?${params}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getListings')
      return {
        data: {
          success: true,
          data: dummyListings,
          pagination: { page, limit, total: dummyListings.length, pages: 1 }
        }
      }
    }
  },

  getListingById: async (id) => {
    try {
      const response = await apiClient.get(`/listings/${id}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getListingById')
      return { data: { success: true, data: dummyListings.find(l => l.id === id || l._id === id) || dummyListings[0] } }
    }
  },

  getMyListings: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/listings/my/listings', {
        params: { page, limit },
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getMyListings')
      return {
        data: {
          success: true,
          data: dummyListings,
          pagination: { page, limit, total: dummyListings.length, pages: 1 }
        }
      }
    }
  },

  createListing: async (listingData) => {
    try {
      const formData = new FormData()
      Object.keys(listingData).forEach(key => {
        if (Array.isArray(listingData[key])) {
          listingData[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item)
          })
        } else {
          formData.append(key, listingData[key])
        }
      })
      const response = await apiClient.post('/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for createListing')
      return { data: { success: true, message: 'Listing created successfully (Dummy)', data: dummyListings[0] } }
    }
  },

  updateListing: async (id, listingData) => {
    try {
      const formData = new FormData()
      Object.keys(listingData).forEach(key => {
        if (Array.isArray(listingData[key])) {
          listingData[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item)
          })
        } else {
          formData.append(key, listingData[key])
        }
      })
      const response = await apiClient.put(`/listings/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for updateListing')
      return { data: { success: true, message: 'Listing updated successfully (Dummy)', data: { ...dummyListings[0], ...listingData } } }
    }
  },

  deleteListing: async (id) => {
    try {
      const response = await apiClient.delete(`/listings/${id}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for deleteListing')
      return { data: { success: true, message: 'Listing deleted successfully (Dummy)' } }
    }
  },

  uploadImages: async (listingId, files) => {
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('images', file))
      const response = await apiClient.post(`/listings/${listingId}/upload-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for uploadImages')
      return { data: { success: true, message: 'Images uploaded successfully (Dummy)', images: dummyListings[0].images } }
    }
  },

  deleteImage: async (listingId, imageId) => {
    try {
      const response = await apiClient.delete(`/listings/${listingId}/images/${imageId}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for deleteImage')
      return { data: { success: true, message: 'Image deleted successfully (Dummy)' } }
    }
  },

  searchListings: async (query) => {
    try {
      const response = await apiClient.get('/listings/search', {
        params: { q: query },
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for searchListings')
      return { data: { success: true, data: dummyListings } }
    }
  },

  getListingsByCategory: async (category, page = 1, limit = 20) => {
    try {
      const response = await apiClient.get(`/listings/category/${category}`, {
        params: { page, limit },
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getListingsByCategory')
      // Filter dummy listings by category if possible, or just return all
      const filtered = dummyListings.filter(l => l.category === category)
      return {
        data: {
          success: true,
          data: filtered.length > 0 ? filtered : dummyListings,
          pagination: { page, limit, total: dummyListings.length, pages: 1 }
        }
      }
    }
  },

  getTrendingListings: async () => {
    try {
      const response = await apiClient.get('/listings/trending')
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getTrendingListings')
      return { data: { success: true, data: dummyListings } }
    }
  },

  getExpiringListings: async () => {
    try {
      const response = await apiClient.get('/listings/expiring')
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getExpiringListings')
      return { data: { success: true, data: dummyListings } }
    }
  },
}

export { listingsService }
