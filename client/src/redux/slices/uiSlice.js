import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sidebarOpen: false,
  mobileMenuOpen: false,
  theme: localStorage.getItem('theme') || 'light',
  notification: null,
  modal: {
    isOpen: false,
    type: '',
    data: null,
  },
  loadingStates: {},
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', state.theme)
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      }
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: '',
        data: null,
      }
    },
    setLoadingState: (state, action) => {
      state.loadingStates[action.payload.key] = action.payload.value
    },
    clearLoadingState: (state, action) => {
      delete state.loadingStates[action.payload]
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  setTheme,
  toggleTheme,
  openModal,
  closeModal,
  setLoadingState,
  clearLoadingState,
} = uiSlice.actions

export default uiSlice.reducer
