import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import {
  setConversations,
  setMessages,
  addMessage,
  setActiveConversation,
  setUnreadCount,
  addConversation,
} from '../redux/slices/messagesSlice'
import { messagesService } from '../services/api/messagesService'
import { getSocket, socketOn, socketOff, socketEmit, socketEvents } from '../services/socket'

export const useMessages = () => {
  const dispatch = useDispatch()
  const messages = useSelector(state => state.messages)

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    socketOn(socketEvents.NEW_MESSAGE, (message) => {
      dispatch(addMessage(message))
    })

    return () => {
      socketOff(socketEvents.NEW_MESSAGE)
    }
  }, [dispatch])

  const fetchConversations = async () => {
    try {
      const response = await messagesService.getConversations()
      dispatch(setConversations(response.data.data || []))
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }

  const fetchMessages = async (conversationId) => {
    try {
      const response = await messagesService.getMessages(conversationId)
      dispatch(setMessages(response.data.data || []))
      dispatch(setActiveConversation(conversationId))
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async (conversationId, text) => {
    try {
      const response = await messagesService.sendMessage(conversationId, text)
      dispatch(addMessage(response.data.data))
      socketEmit(socketEvents.MESSAGE_SENT, response.data.data)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const createConversation = async (userId) => {
    try {
      const response = await messagesService.createConversation(userId)
      dispatch(addConversation(response.data.data))
      return response.data.data
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await messagesService.getUnreadCount()
      dispatch(setUnreadCount(response.data.count))
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  return {
    conversations: messages.conversations,
    activeConversation: messages.activeConversation,
    messages: messages.messages,
    unreadCount: messages.unreadCount,
    loading: messages.loading,
    error: messages.error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    fetchUnreadCount,
  }
}
