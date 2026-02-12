import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { notificationsService } from '../../services/api/notificationsService'

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsService.getNotifications()
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications')
    }
  }
)

export const markAsReadAsync = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      await notificationsService.markAsRead(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read')
    }
  }
)

export const markAllAsReadAsync = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationsService.markAllAsRead()
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read')
    }
  }
)

export const deleteNotificationAsync = createAsyncThunk(
  'notifications/deleteNotification',
  async (id, { rejectWithValue }) => {
    try {
      await notificationsService.deleteNotification(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification')
    }
  }
)

export const clearAllNotificationsAsync = createAsyncThunk(
  'notifications/clearAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      await notificationsService.clearAllNotifications()
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear notifications')
    }
  }
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload)
      state.unreadCount += 1
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload)
    },
    clearAllNotifications: (state) => {
      state.items = []
      state.unreadCount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload || []
        state.unreadCount = state.items.filter(item => !item.read).length
        state.loading = false
      })
      .addCase(markAsReadAsync.fulfilled, (state, action) => {
        const item = state.items.find(item => item._id === action.payload)
        if (item && !item.read) {
          item.read = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      .addCase(markAllAsReadAsync.fulfilled, (state) => {
        state.items.forEach(item => item.read = true)
        state.unreadCount = 0
      })
      .addCase(deleteNotificationAsync.fulfilled, (state, action) => {
        const item = state.items.find(item => item._id === action.payload)
        if (item && !item.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
        state.items = state.items.filter(item => item._id !== action.payload)
      })
      .addCase(clearAllNotificationsAsync.fulfilled, (state) => {
        state.items = []
        state.unreadCount = 0
      })
  },
})

export const {
  addNotification,
  removeNotification,
  clearAllNotifications,
} = notificationsSlice.actions

export default notificationsSlice.reducer
