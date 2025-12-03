import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bot,
  Check,
  CheckCheck,
  Maximize2,
  Minimize2,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  User,
  Video,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import NotificationManager from '@/services/NotificationManager';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'agent' | 'bot';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'product';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  productData?: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

interface ChatSession {
  id: string;
  customerId: string;
  customerName: string;
  agentId?: string;
  agentName?: string;
  status: 'waiting' | 'active' | 'closed';
  messages: ChatMessage[];
  lastActivity: Date;
}

interface LiveChatProps {
  customerId?: string;
  customerName?: string;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onClose?: () => void;
}

type EventType = 'message' | 'messageStatus' | 'agentJoined';

interface EventPayloads {
  message: { sessionId: string; message: ChatMessage };
  messageStatus: { sessionId: string; messageId: string; status: ChatMessage['status'] };
  agentJoined: { sessionId: string; agent: string };
}

class MockWebSocketService {
  private listeners: { [K in EventType]: Array<(data: EventPayloads[K]) => void> } = {
    message: [],
    messageStatus: [],
    agentJoined: [],
  };
  private sessions: Map<string, ChatSession> = new Map();

  constructor() {
    // Simulate periodic agent responses
    setInterval(() => {
      this.simulateAgentResponses();
    }, 5000 + Math.random() * 10000); // Random interval between 5-15 seconds
  }

  connect(sessionId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {

        resolve();
      }, 1000);
    });
  }

  disconnect(): void {

  }

  sendMessage(sessionId: string, message: ChatMessage): void {
    // Add message to session
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messages.push(message);
      session.lastActivity = new Date();

      // Notify listeners
      this.notifyListeners('message', { sessionId, message });

      // Simulate message delivery
      setTimeout(() => {
        message.status = 'delivered';
        this.notifyListeners('messageStatus', { sessionId, messageId: message.id, status: 'delivered' });
      }, 1000);

      setTimeout(() => {
        message.status = 'read';
        this.notifyListeners('messageStatus', { sessionId, messageId: message.id, status: 'read' });
      }, 2000);
    }
  }

  on<T extends EventType>(event: T, callback: (data: EventPayloads[T]) => void): void {
    this.listeners[event].push(callback);
  }

  off<T extends EventType>(event: T, callback: (data: EventPayloads[T]) => void): void {
    const eventListeners = this.listeners[event];
    const index = eventListeners.indexOf(callback);
    if (index > -1) {
      eventListeners.splice(index, 1);
    }
  }

  private notifyListeners<T extends EventType>(event: T, data: EventPayloads[T]): void {
    this.listeners[event].forEach(callback => callback(data));
  }

  private simulateAgentResponses(): void {
    // Simulate agent joining and responding
    this.sessions.forEach((session, sessionId) => {
      if (session.status === 'waiting' && Math.random() < 0.3) {
        // Agent joins
        session.status = 'active';
        session.agentId = 'agent_1';
        session.agentName = 'أحد حد';

        const joinMessage: ChatMessage = {
          id: `msg_${Date.now()}_join`,
          senderId: session.agentId,
          senderName: session.agentName,
          senderType: 'agent',
          content: 'رحبا! ف  ساعدت ا',
          timestamp: new Date(),
          type: 'text',
          status: 'read'
        };

        session.messages.push(joinMessage);
        this.notifyListeners('message', { sessionId, message: joinMessage });
        this.notifyListeners('agentJoined', { sessionId, agent: session.agentName });
      } else if (session.status === 'active' && session.messages.length > 1) {
        // Random agent responses
        const responses = [
          'شرا تاص عا',
          'سأتح  ذ ',
          '  تد ازد  اتفاص',
          'ع ا ساعدت ف ذ',
          'سعر ذا اتج اسب جدا',
          'س بإرسا اعرض  ربا',
          ' ترد عرفة ازد ع تجاتا'
        ];

        if (Math.random() < 0.2) { // 20% chance to respond
          const responseIndex = Math.floor(Math.random() * responses.length);
          const response = responses[responseIndex];
          if (!response) {
            return;
          }
          const responseMessage: ChatMessage = {
            id: `msg_${Date.now()}_response`,
            senderId: session.agentId!,
            senderName: session.agentName!,
            senderType: 'agent',
            content: response,
            timestamp: new Date(),
            type: 'text',
            status: 'read'
          };

          session.messages.push(responseMessage);
          this.notifyListeners('message', { sessionId, message: responseMessage });
        }
      }
    });
  }

  createSession(customerId: string, customerName: string): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: ChatSession = {
      id: sessionId,
      customerId,
      customerName,
      status: 'waiting',
      messages: [],
      lastActivity: new Date()
    };

    this.sessions.set(sessionId, session);

    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: `msg_${Date.now()}_welcome`,
      senderId: 'system',
      senderName: 'ظا ادردشة',
      senderType: 'bot',
      content: 'رحبا ب ف خدة اعاء! ست تج إ أحد ثا ربا.',
      timestamp: new Date(),
      type: 'text',
      status: 'read'
    };

    session.messages.push(welcomeMessage);

    return sessionId;
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }
}

// Global WebSocket service instance
const wsService = new MockWebSocketService();

const LiveChat: React.FC<LiveChatProps> = ({
  customerId = 'guest',
  customerName = 'زائر',
  isMinimized = false,
  onMinimize,
  onClose
}) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNewMessage = useCallback((data: EventPayloads['message']) => {
    if (data.sessionId === sessionId) {
      setMessages(prev => [...prev, data.message]);
      if (data.message.senderType !== 'user') {
        NotificationManager.createNotification({
          type: 'chat',
          title: `رساة جددة  ${data.message.senderName}`,
          message: data.message.content.length > 50 ? data.message.content.substring(0, 50) + '...' : data.message.content,
          priority: 'medium',
          actionUrl: '/chat',
          actionText: 'عرض احادثة'
        }).catch(() => {
          void 0;
        });
      }
    }
  }, [sessionId]);

  const handleMessageStatus = useCallback((data: EventPayloads['messageStatus']) => {
    if (data.sessionId === sessionId) {
      setMessages(prev => prev.map(msg =>
        msg.id === data.messageId
          ? { ...msg, status: data.status }
          : msg
      ));
    }
  }, [sessionId]);

  const handleAgentJoined = useCallback((data: EventPayloads['agentJoined']) => {
    if (data.sessionId === sessionId) {
      setSession(prev => prev ? { ...prev, status: 'active', agentName: data.agent } : null);
    }
  }, [sessionId]);

  // Initialize chat session
  useEffect(() => {
    const initChat = async () => {
      const newSessionId = wsService.createSession(customerId, customerName);
      setSessionId(newSessionId);

      const chatSession = wsService.getSession(newSessionId);
      if (chatSession) {
        setSession(chatSession);
        setMessages(chatSession.messages);
      }

      await wsService.connect(newSessionId);
      setIsConnected(true);

      wsService.on('message', handleNewMessage);
      wsService.on('messageStatus', handleMessageStatus);
      wsService.on('agentJoined', handleAgentJoined);
    };

    initChat();

    return () => {
      wsService.off('message', handleNewMessage);
      wsService.off('messageStatus', handleMessageStatus);
      wsService.off('agentJoined', handleAgentJoined);
      wsService.disconnect();
    };
  }, [customerId, customerName, handleAgentJoined, handleMessageStatus, handleNewMessage]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !sessionId) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: customerId,
      senderName: customerName,
      senderType: 'user',
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      status: 'sending'
    };

    // Add to local messages immediately
    setMessages(prev => [...prev, message]);

    // Send via WebSocket
    wsService.sendMessage(sessionId, message);

    setNewMessage('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: ChatMessage['status']) => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getSenderIcon = (senderType: ChatMessage['senderType']) => {
    switch (senderType) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'agent':
        return <User className="w-4 h-4" />;
      case 'bot':
        return <Bot className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button type="button" onClick={onMinimize}
          className="bg-blue-600 hover:bg-blue-700 rounded-full w-12 h-12 shadow-lg"
        >
          <User className="w-5 h-5" />
        </Button>
        {messages.length > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500">
            {messages.filter(m => m.senderType !== 'user' && m.status === 'read').length}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 w-80 h-96 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                {session?.agentName ? session.agentName.charAt(0) : 'د'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm">
                {session?.agentName || 'خدة اعاء'}
              </CardTitle>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500">
                  {session?.status === 'waiting' ? 'جار ابحث ع ث...' :
                   session?.status === 'active' ? 'شط' : 'غ'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onMinimize}>
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-4">
          <div className="space-y-3 py-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.senderType !== 'user' && (
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {getSenderIcon(message.senderType)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`max-w-[70%] ${message.senderType === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`px-3 py-2 rounded-lg text-sm ${
                      message.senderType === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.senderType === 'agent'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-green-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                    message.senderType === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{formatTime(message.timestamp)}</span>
                    {message.senderType === 'user' && getStatusIcon(message.status)}
                  </div>
                </div>

                {message.senderType === 'user' && (
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {customerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    <Bot className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 px-3 py-2 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اتب رسات..."
            className="flex-1"
            disabled={!isConnected}
          />
          <Button type="button" onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LiveChat;
