import apiClient from '../../utils/apiClient'

const dummyNotifications = [
    {
        _id: 'notif_1',
        type: 'bid',
        title: 'New Bid Received',
        message: 'Someone placed a bid of $1650 on your "Premium Holstein Cow"',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        link: '/dashboard/listings'
    },
    {
        _id: 'notif_2',
        type: 'system',
        title: 'Welcome to AuctionHub',
        message: 'Your account has been successfully verified.',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        link: '/dashboard/profile'
    },
    {
        _id: 'notif_3',
        type: 'message',
        title: 'New Message',
        message: 'Farm Best sent you a message.',
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        link: '/dashboard/messages'
    }
]

const notificationsService = {
    getNotifications: async (page = 1, limit = 20) => {
        try {
            const response = await apiClient.get('/notifications', {
                params: { page, limit }
            })
            return response
        } catch (error) {
            console.warn('Backend unavailable, using dummy data for getNotifications')
            return {
                data: {
                    success: true,
                    data: dummyNotifications,
                    pagination: { page, limit, total: dummyNotifications.length, pages: 1 }
                }
            }
        }
    },

    markAsRead: async (id) => {
        try {
            const response = await apiClient.put(`/notifications/${id}/read`)
            return response
        } catch (error) {
            console.warn('Backend unavailable, using dummy data for markAsRead')
            return { data: { success: true, message: 'Notification marked as read' } }
        }
    },

    markAllAsRead: async () => {
        try {
            const response = await apiClient.put('/notifications/read-all')
            return response
        } catch (error) {
            console.warn('Backend unavailable, using dummy data for markAllAsRead')
            return { data: { success: true, message: 'All notifications marked as read' } }
        }
    },

    deleteNotification: async (id) => {
        try {
            const response = await apiClient.delete(`/notifications/${id}`)
            return response
        } catch (error) {
            console.warn('Backend unavailable, using dummy data for deleteNotification')
            return { data: { success: true, message: 'Notification deleted' } }
        }
    },

    clearAllNotifications: async () => {
        try {
            const response = await apiClient.delete('/notifications')
            return response
        } catch (error) {
            console.warn('Backend unavailable, using dummy data for clearAllNotifications')
            return { data: { success: true, message: 'All notifications cleared' } }
        }
    }
}

export { notificationsService }
