import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import listingsReducer from './slices/listingsSlice'
import bidsReducer from './slices/bidsSlice'
import watchlistReducer from './slices/watchlistSlice'
import messagesReducer from './slices/messagesSlice'
import notificationsReducer from './slices/notificationsSlice'
import searchReducer from './slices/searchSlice'
import filtersReducer from './slices/filtersSlice'
import uiReducer from './slices/uiSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    listings: listingsReducer,
    bids: bidsReducer,
    watchlist: watchlistReducer,
    messages: messagesReducer,
    notifications: notificationsReducer,
    search: searchReducer,
    filters: filtersReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['notifications/addNotification'],
        ignoredPaths: ['notifications.items'],
      },
    }),
})

export default store
