import { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { 
  PaperAirplaneIcon, 
  UserIcon, 
  PhoneIcon, 
  VideoCameraIcon,
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import api from '../services/api';
import useAuthStore from '../store/authStore';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const { chatId } = useParams(); // Get chatId from URL params
  const [chats, setChats] = useState([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [chatsError, setChatsError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { hydrated, isAuthenticated, user: currentUser } = useAuthStore();

  // Fetch chats on mount
  useEffect(() => {
    setChatsLoading(true);
    setChatsError(null);
    api.messages.getChats()
      .then(data => setChats(data.chats || []))
      .catch(() => setChatsError('Failed to load chats.'))
      .finally(() => setChatsLoading(false));
  }, []);

  // Select chat from URL params or search params
  useEffect(() => {
    if (chats.length > 0) {
      let chatToSelect = null;
      
      // First check for chatId in URL params (from Profile page navigation)
      if (chatId) {
        chatToSelect = chats.find(c => c.id === chatId);
      }
      
      // If no chatId, check for user parameter (legacy support)
      if (!chatToSelect) {
        const userName = searchParams.get('user');
        if (userName) {
          chatToSelect = chats.find(c => c.name === userName);
        }
      }
      
      if (chatToSelect) {
        handleSelectChat(chatToSelect);
      }
    }
    // eslint-disable-next-line
  }, [chatId, searchParams, chats]);

  // Fetch messages for selected chat
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowProfile(false);
    setMessagesLoading(true);
    setMessagesError(null);
    api.messages.getMessages(chat.id)
      .then(data => setMessages(data.messages || []))
      .catch(() => setMessagesError('Failed to load messages.'))
      .finally(() => setMessagesLoading(false));
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;
    setSending(true);
    try {
      await api.messages.sendMessage(selectedChat.id, { 
        content: message.trim(),
        message_type: "text"
      });
      setMessage('');
      // Refresh messages
      setMessagesLoading(true);
      const data = await api.messages.getMessages(selectedChat.id);
      setMessages(data.messages || []);
      setMessagesLoading(false);
    } catch {
      alert('Failed to send message.');
      setSending(false);
    }
    setSending(false);
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="h-[calc(90vh-4rem)] flex">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-white/10 backdrop-blur-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {chatsLoading ? (
            <div className="flex justify-center items-center py-8 text-gray-500 dark:text-gray-400">Loading chats...</div>
          ) : chatsError ? (
            <div className="text-center text-red-600 dark:text-red-400 py-8">{chatsError}</div>
          ) : chats.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">No chats found.</div>
          ) : (
            chats.map((chat) => (
            <button
              key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ${selectedChat?.id === chat.id ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center text-xl font-bold text-indigo-700">
                    {chat.name?.[0] || '?'}
                  </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {chat.name}
                  </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {chat.last_message_at ? new Date(chat.last_message_at).toLocaleString() : ''}
                    </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {chat.last_message?.content || ''}
                </p>
              </div>
            </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-md">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-lg font-bold text-indigo-700">
                    {selectedChat.name?.[0] || '?'}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedChat.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedChat.is_group ? 'Group Chat' : 'Direct Message'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messagesLoading ? (
                    <div className="flex justify-center items-center py-8 text-gray-500 dark:text-gray-400">Loading messages...</div>
                  ) : messagesError ? (
                    <div className="text-center text-red-600 dark:text-red-400 py-8">{messagesError}</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">No messages yet.</div>
                  ) : (
                    messages.map((msg) => {
                      const isOwnMessage = msg.sender_id === currentUser?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="flex items-end space-x-2 max-w-[70%]">
                            {!isOwnMessage && (
                              <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-base font-bold text-indigo-700">
                                {msg.sender_name?.[0] || '?'}
                              </div>
                            )}
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                isOwnMessage
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isOwnMessage ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Profile Sidebar */}
              {showProfile && (
                <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white/5 backdrop-blur-sm">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Chat Info</h3>
                    <button 
                      onClick={() => setShowProfile(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center text-3xl font-bold text-indigo-700 mx-auto mb-3">
                        {selectedChat.name?.[0] || '?'}
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {selectedChat.name}
                      </h4>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400">
                        {selectedChat.is_group ? 'Group Chat' : 'Direct Message'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedChat.participant_names?.join(', ')}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Participants</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedChat.participant_names?.map((name) => (
                          <span
                            key={name}
                            className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Select a chat to start messaging</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Choose from your existing conversations or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;