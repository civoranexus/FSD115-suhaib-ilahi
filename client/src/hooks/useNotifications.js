import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import {
  addNotification,
  fetchNotifications,
  markAsReadAsync,
  markAllAsReadAsync,
  deleteNotificationAsync,
  clearAllNotificationsAsync,
} from '../redux/slices/notificationsSlice'
import { getSocket, socketOn, socketOff, socketEvents } from '../services/socket'

export const useNotifications = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(state => state.notifications)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    socketOn(socketEvents.NOTIFICATION, (notification) => {
      dispatch(addNotification(notification))
    })

    socketOn(socketEvents.ALERT, (alert) => {
      dispatch(addNotification({ ...alert, type: 'alert' }))
    })

    return () => {
      socketOff(socketEvents.NOTIFICATION)
      socketOff(socketEvents.ALERT)
    }
  }, [dispatch])

  return {
    items: notifications.items,
    unreadCount: notifications.unreadCount,
    markAsRead: (id) => dispatch(markAsReadAsync(id)),
    markAllAsRead: () => dispatch(markAllAsReadAsync()),
    removeNotification: (id) => dispatch(deleteNotificationAsync(id)),
    clearAllNotifications: () => dispatch(clearAllNotificationsAsync()),
    loading: notifications.loading,
    error: notifications.error,
  }
}
