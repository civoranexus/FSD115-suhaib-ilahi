import apiClient from '../../utils/apiClient'
import { dummyTransactions } from './dummyData'

const paymentsService = {
  getPayments: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/payments', {
        params: { page, limit },
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getPayments')
      return {
        data: {
          success: true,
          payments: dummyTransactions,
          pagination: { page, limit, total: dummyTransactions.length, pages: 1 }
        }
      }
    }
  },

  getPaymentById: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payments/${paymentId}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getPaymentById')
      return { data: { success: true, payment: dummyTransactions.find(t => t.id === paymentId) || dummyTransactions[0] } }
    }
  },

  initiatePayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/initiate', paymentData)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for initiatePayment')
      return { data: { success: true, clientSecret: 'dummy_client_secret', paymentId: 'dummy_payment_id' } }
    }
  },

  confirmPayment: async (paymentId, transactionId) => {
    try {
      const response = await apiClient.post(`/payments/${paymentId}/confirm`, {
        transactionId,
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for confirmPayment')
      return { data: { success: true, message: 'Payment confirmed successfully (Dummy)' } }
    }
  },

  cancelPayment: async (paymentId) => {
    try {
      const response = await apiClient.post(`/payments/${paymentId}/cancel`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for cancelPayment')
      return { data: { success: true, message: 'Payment cancelled successfully (Dummy)' } }
    }
  },

  refundPayment: async (paymentId) => {
    try {
      const response = await apiClient.post(`/payments/${paymentId}/refund`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for refundPayment')
      return { data: { success: true, message: 'Payment refunded successfully (Dummy)' } }
    }
  },

  getPaymentMethods: async () => {
    try {
      const response = await apiClient.get('/payments/methods')
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getPaymentMethods')
      return { data: { success: true, methods: [{ id: 'pm_1', type: 'card', last4: '4242', brand: 'visa' }] } }
    }
  },

  addPaymentMethod: async (methodData) => {
    try {
      const response = await apiClient.post('/payments/methods', methodData)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for addPaymentMethod')
      return { data: { success: true, message: 'Payment method added (Dummy)' } }
    }
  },

  deletePaymentMethod: async (methodId) => {
    try {
      const response = await apiClient.delete(`/payments/methods/${methodId}`)
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for deletePaymentMethod')
      return { data: { success: true, message: 'Payment method deleted (Dummy)' } }
    }
  },

  getInvoice: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payments/${paymentId}/invoice`, {
        responseType: 'blob',
      })
      return response
    } catch (error) {
      console.warn('Backend unavailable, using dummy data for getInvoice')
      // Return a dummy PDF blob
      return { data: new Blob(['Dummy Invoice'], { type: 'application/pdf' }) }
    }
  },
}

export { paymentsService }
