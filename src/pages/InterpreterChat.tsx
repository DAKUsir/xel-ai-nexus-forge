
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Menu, X, Bot, User, ArrowLeft, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const InterpreterChat = () => {
  const [inputValue, setInputValue] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get active chat
  const activeChat = chatSessions.find(chat => chat.id === activeChatId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isTyping]);

  // Create new chat
  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Interpreter Chat',
      messages: [],
      createdAt: new Date()
    };
    
    setChatSessions(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setSidebarOpen(false);
  };

  // Select chat
  const selectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setSidebarOpen(false);
  };

  // Generate AI response using Interpreter API (placeholder - you'll provide the actual API)
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    setIsTyping(true);
    
    try {
      // TODO: Replace with actual Interpreter API call
      // const client = await Client.connect("INTERPRETER-API-URL");
      // const result = await client.predict("/predict", { code: userMessage });
      
      // Temporary placeholder response
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsTyping(false);
      return `Interpreter response to: "${userMessage}". This is a placeholder - please provide the actual API endpoint.`;
    } catch (error) {
      console.error('Error calling Interpreter API:', error);
      setIsTyping(false);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
    }
  };

  // Send message
  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    const messageContent = inputValue.trim();
    setInputValue('');

    // If no active chat, create one
    let currentChatId = activeChatId;
    if (!currentChatId) {
      const newChat: ChatSession = {
        id: Date.now().toString(),
        title: messageContent.slice(0, 30) + (messageContent.length > 30 ? '...' : ''),
        messages: [],
        createdAt: new Date()
      };
      setChatSessions(prev => [newChat, ...prev]);
      currentChatId = newChat.id;
      setActiveChatId(currentChatId);
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setChatSessions(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ));

    // Generate AI response
    try {
      const aiResponse = await generateAIResponse(messageContent);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setChatSessions(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, assistantMessage] }
          : chat
      ));
    } catch (error) {
      console.error('Error generating AI response:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-muted/30 border-r border-border 
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6 pt-12 lg:pt-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/chat')}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold">Interpreter</h2>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>

          {/* New Chat Button */}
          <Button
            onClick={createNewChat}
            variant="outline"
            className="mb-6 justify-start"
          >
            <Plus size={16} className="mr-2" />
            New Interpreter Chat
          </Button>

          {/* Chat History */}
          <div className="flex-1 space-y-2 overflow-y-auto">
            <div className="text-muted-foreground text-sm mb-2">Recent Chats</div>
            {chatSessions.map((chat) => (
              <div
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  activeChatId === chat.id ? 'bg-muted' : ''
                }`}
              >
                <div className="font-medium text-sm truncate mb-1">
                  {chat.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {chat.messages.length > 0 
                    ? chat.messages[chat.messages.length - 1].content.slice(0, 40) + '...'
                    : 'No messages yet'
                  }
                </div>
              </div>
            ))}
            {chatSessions.length === 0 && (
              <div className="text-center text-muted-foreground text-sm p-4">
                No chats yet. Start a new conversation!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-background border-b border-border p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold">Interpreter</h1>
          <div className="w-6" />
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {!activeChat || activeChat.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md p-8">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Code size={24} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Code Interpreter</h2>
                <p className="text-muted-foreground">Execute and interpret code in various programming languages. Share your code and get detailed explanations!</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {activeChat.messages.map((message, index) => (
                <div key={message.id} className={`py-6 px-4 ${index % 2 === 1 ? 'bg-muted/20' : ''}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'assistant' ? 'bg-green-500' : 'bg-secondary'
                    }`}>
                      {message.role === 'assistant' ? (
                        <Code size={16} className="text-white" />
                      ) : (
                        <User size={16} className="text-secondary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">
                          {message.role === 'assistant' ? 'Interpreter' : user?.email?.split('@')[0] || 'You'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div className="text-foreground whitespace-pre-wrap break-words font-mono bg-muted/30 p-3 rounded-lg">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* AI Typing Indicator */}
              {isTyping && (
                <div className="py-6 px-4 bg-muted/20">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Code size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">Interpreter</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-muted-foreground ml-2">Interpreting...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-background p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your code or programming question..."
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 pr-12 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none max-h-32 font-mono"
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isTyping ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Send size={16} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterpreterChat;
