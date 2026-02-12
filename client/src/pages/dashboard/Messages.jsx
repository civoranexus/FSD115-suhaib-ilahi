import { useEffect, useState } from 'react'
import { useMessages } from '../../hooks/useMessages'
import { useAuth } from '../../hooks/useAuth'
import { formatRelativeTime } from '../../utils/formatters'
import Card from '../../components/Card'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Loading from '../../components/Loading'
import { FiSend, FiSearch } from 'react-icons/fi'

const Messages = () => {
  const { user } = useAuth()
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    fetchConversations,
    fetchMessages,
    sendMessage,
  } = useMessages()
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchConversations()
  }, [])

  const handleSendMessage = async () => {
    if (messageText.trim() && activeConversation) {
      await sendMessage(activeConversation, messageText)
      setMessageText('')
    }
  }

  if (loading) return <Loading />

  return (
    <div className="h-[600px] flex gap-4">
      {/* Conversations List */}
      <div className="w-64 border border-gray-200 rounded-lg overflow-hidden flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="overflow-y-auto flex-1">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No conversations yet
            </div>
          ) : (
            conversations.map(conv => (
              <button
                key={conv._id}
                onClick={() => fetchMessages(conv._id)}
                className={`w-full p-4 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${activeConversation === conv._id ? 'bg-blue-50' : ''
                  }`}
              >
                <p className="font-medium text-sm">{conv.participant?.name}</p>
                <p className="text-xs text-gray-500 truncate">{conv.lastMessage?.text}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatRelativeTime(conv.lastMessage?.createdAt)}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 rounded-t-lg">
              {messages.map(msg => (
                <div
                  key={msg._id}
                  className={`flex ${msg.sender === user?._id || msg.sender === user?.id || msg.sender === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === user?._id || msg.sender === user?.id || msg.sender === 'currentUser'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                      }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {formatRelativeTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg flex gap-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="text-sm flex-1"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendMessage}
              >
                <FiSend className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Messages
