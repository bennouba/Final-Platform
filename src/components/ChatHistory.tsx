import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Clock,
  Search,
  Trash2,
  Download,
  User,
  Bot,
  MoreVertical,
  Calendar,
  Filter
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'agent' | 'bot';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'product';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  productData?: any;
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
  createdAt: Date;
  topic?: string;
  rating?: number;
}

interface ChatHistoryProps {
  customerId?: string;
  onSessionSelect?: (session: ChatSession) => void;
  onNewChat?: () => void;
  className?: string;
}

class ChatHistoryManager {
  private static readonly STORAGE_KEY = 'eishro_chat_history';

  static saveSession(session: ChatSession): void {
    try {
      const existingHistory = this.getAllSessions();
      const updatedHistory = existingHistory.filter(s => s.id !== session.id);
      updatedHistory.unshift(session); // Add to beginning

      // Keep only last 50 sessions
      const limitedHistory = updatedHistory.slice(0, 50);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedHistory));
    } catch (error) {

    }
  }

  static getAllSessions(): ChatSession[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const sessions = JSON.parse(stored);
      // Convert date strings back to Date objects
      return sessions.map((session: any) => ({
        ...session,
        lastActivity: new Date(session.lastActivity),
        createdAt: new Date(session.createdAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {

      return [];
    }
  }

  static getSessionsByCustomer(customerId: string): ChatSession[] {
    return this.getAllSessions().filter(session => session.customerId === customerId);
  }

  static deleteSession(sessionId: string): void {
    try {
      const existingHistory = this.getAllSessions();
      const updatedHistory = existingHistory.filter(s => s.id !== sessionId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {

    }
  }

  static clearAllHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static exportSession(session: ChatSession): string {
    const exportData = {
      sessionId: session.id,
      customer: session.customerName,
      agent: session.agentName,
      createdAt: session.createdAt.toISOString(),
      messages: session.messages.map(msg => ({
        time: msg.timestamp.toISOString(),
        sender: msg.senderName,
        type: msg.senderType,
        content: msg.content
      }))
    };

    return JSON.stringify(exportData, null, 2);
  }

  static generateTopic(messages: ChatMessage[]): string {
    // Simple topic extraction from first few messages
    const firstUserMessage = messages.find(m => m.senderType === 'user');
    if (!firstUserMessage) return 'حادثة جددة';

    const content = firstUserMessage.content.toLowerCase();

    // Common topics
    if (content.includes('سعر') || content.includes('') || content.includes('price')) {
      return 'استفسار ع اأسعار';
    }
    if (content.includes('طب') || content.includes('order') || content.includes('شح')) {
      return 'تابعة اطبات';
    }
    if (content.includes('إرجاع') || content.includes('استبدا') || content.includes('return')) {
      return 'اإرجاع ااستبدا';
    }
    if (content.includes('دفع') || content.includes('payment')) {
      return 'طر ادفع';
    }

    // Extract first meaningful words
    const words = content.split(' ').slice(0, 3).join(' ');
    return words.length > 10 ? words.substring(0, 10) + '...' : words || 'حادثة عاة';
  }
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  customerId = 'guest',
  onSessionSelect,
  onNewChat,
  className = ""
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

  useEffect(() => {
    loadSessions();
  }, [customerId]);

  useEffect(() => {
    filterAndSortSessions();
  }, [sessions, searchQuery, statusFilter, sortBy]);

  const loadSessions = () => {
    const allSessions = customerId === 'all'
      ? ChatHistoryManager.getAllSessions()
      : ChatHistoryManager.getSessionsByCustomer(customerId);

    // Generate topics for sessions that don't have them
    const sessionsWithTopics = allSessions.map(session => ({
      ...session,
      topic: session.topic || ChatHistoryManager.generateTopic(session.messages)
    }));

    setSessions(sessionsWithTopics);
  };

  const filterAndSortSessions = () => {
    let filtered = sessions;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(session =>
        session.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.agentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.messages.some(msg =>
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      const comparison = sortBy === 'recent'
        ? b.lastActivity.getTime() - a.lastActivity.getTime()
        : a.lastActivity.getTime() - b.lastActivity.getTime();
      return comparison;
    });

    setFilteredSessions(filtered);
  };

  const handleSessionSelect = (session: ChatSession) => {
    onSessionSelect?.(session);
  };

  const handleDeleteSession = (sessionId: string) => {
    ChatHistoryManager.deleteSession(sessionId);
    loadSessions();
  };

  const handleExportSession = (session: ChatSession) => {
    const exportData = ChatHistoryManager.exportSession(session);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-session-${session.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 48) {
      return 'أس';
    } else {
      return date.toLocaleDateString('ar-SA', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getStatusBadge = (status: ChatSession['status']) => {
    const statusConfig = {
      waiting: { label: 'ف ااتظار', color: 'bg-yellow-100 text-yellow-800' },
      active: { label: 'شط', color: 'bg-green-100 text-green-800' },
      closed: { label: 'غ', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getLastMessagePreview = (messages: ChatMessage[]) => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return '';

    const preview = lastMessage.content.length > 50
      ? lastMessage.content.substring(0, 50) + '...'
      : lastMessage.content;

    return `${lastMessage.senderName}: ${preview}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              سج احادثات
            </CardTitle>
            <Button type="button" onClick={onNewChat} className="bg-blue-600 hover:bg-blue-700">
              حادثة جددة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ابحث ف احادثات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جع احاات</SelectItem>
                <SelectItem value="active">شط</SelectItem>
                <SelectItem value="waiting">ف ااتظار</SelectItem>
                <SelectItem value="closed">غ</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'recent' | 'oldest')}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">اأحدث</SelectItem>
                <SelectItem value="oldest">اأد</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sessions.length}</div>
              <div className="text-sm text-gray-600">إجا احادثات</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {sessions.filter(s => s.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">حادثات شطة</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {sessions.filter(s => s.status === 'waiting').length}
              </div>
              <div className="text-sm text-gray-600">ف ااتظار</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {sessions.filter(s => s.rating && s.rating >= 4).length}
              </div>
              <div className="text-sm text-gray-600">تات عاة</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>احادثات ({filteredSessions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>ا تجد حادثات</p>
                {searchQuery && <p className="text-sm">جرب تغر عار ابحث</p>}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleSessionSelect(session)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {session.customerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {session.topic || `حادثة ع ${session.customerName}`}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{session.customerName}</span>
                            {session.agentName && (
                              <>
                                <span></span>
                                <span>ع {session.agentName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(session.status)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExportSession(session)}>
                              <Download className="h-4 w-4 ml-2" />
                              تصدر احادثة
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteSession(session.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 ml-2" />
                              حذف احادثة
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(session.lastActivity)}
                        </div>
                        <span>{session.messages.length} رسائ</span>
                      </div>

                      {session.rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500"></span>
                          <span>{session.rating}/5</span>
                        </div>
                      )}
                    </div>

                    {session.messages.length > 0 && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {getLastMessagePreview(session.messages)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatHistory;
export { ChatHistoryManager };
