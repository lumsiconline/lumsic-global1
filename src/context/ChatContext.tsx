import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ConsultationSession, ChatMessage } from '../types';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

interface ChatContextType {
  activeSession: ConsultationSession | null;
  pendingRequests: ConsultationSession[];
  messages: ChatMessage[];
  durationSeconds: number;
  isLoading: boolean;
  error: string | null;
  startSession: (sessionId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  acceptRequest: (sessionId: string) => Promise<void>;
  rejectRequest: (sessionId: string, reason?: string) => Promise<void>;
  endSession: (sessionId: string) => Promise<ConsultationSession>;
  setActiveSession: (session: ConsultationSession | null) => void;
  refreshSessions: () => Promise<void>;
  clearError: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<ConsultationSession | null>(null);
  const [pendingRequests, setPendingRequests] = useState<ConsultationSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeSessionRef = useRef<ConsultationSession | null>(null);
  activeSessionRef.current = activeSession;

  // Poll for sessions & pending requests
  const refreshSessions = async () => {
    if (!user) return;
    try {
      if (user.role === 'astrologer') {
        const list = await api.consultations.list({
          userId: user.id,
          role: 'astrologer',
          astrologerId: user.astrologerId,
        });
        const pending = list.filter(c => c.status === 'pending');
        setPendingRequests(pending);

        const current = list.find(c => c.status === 'active');
        if (current && (!activeSessionRef.current || activeSessionRef.current.id !== current.id)) {
          setActiveSession(current);
        }
      } else if (user.role === 'customer') {
        const list = await api.consultations.list({
          userId: user.id,
          role: 'customer',
        });
        const current = list.find(c => c.status === 'active' || c.status === 'pending');
        if (current) {
          setActiveSession(current);
        } else if (activeSessionRef.current && (activeSessionRef.current.status === 'pending' || activeSessionRef.current.status === 'active')) {
          // If was active/pending and now none, check if it just completed
          const updated = await api.consultations.get(activeSessionRef.current.id).catch(() => null);
          if (updated && updated.status !== activeSessionRef.current.status) {
            setActiveSession(updated);
          }
        }
      }
    } catch {
      // quiet poll
    }
  };

  useEffect(() => {
    if (!user) {
      setActiveSession(null);
      setPendingRequests([]);
      setMessages([]);
      return;
    }

    refreshSessions();
    const interval = setInterval(refreshSessions, 4000);
    return () => clearInterval(interval);
  }, [user?.id, user?.role, user?.astrologerId]);

  // Messages polling for active session
  useEffect(() => {
    if (!activeSession) {
      setMessages([]);
      setDurationSeconds(0);
      return;
    }

    const fetchMessages = async () => {
      try {
        const msgs = await api.chat.getMessages(activeSession.id);
        setMessages(msgs);
      } catch {
        // quiet
      }
    };

    fetchMessages();
    const msgInterval = setInterval(fetchMessages, 2500);

    return () => clearInterval(msgInterval);
  }, [activeSession?.id]);

  // Live timer for active session
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'active') return;

    const calcDuration = () => {
      if (activeSession.startedAt) {
        const start = new Date(activeSession.startedAt).getTime();
        const now = Date.now();
        const secs = Math.max(0, Math.floor((now - start) / 1000));
        setDurationSeconds(secs);
      }
    };

    calcDuration();
    const timerInterval = setInterval(calcDuration, 1000);
    return () => clearInterval(timerInterval);
  }, [activeSession?.id, activeSession?.status, activeSession?.startedAt]);

  const startSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const session = await api.consultations.get(sessionId);
      setActiveSession(session);
    } catch (err: any) {
      setError(err.message || 'Failed to load session');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptRequest = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const res = await api.consultations.accept(sessionId);
      setActiveSession(res.session);
      setPendingRequests(prev => prev.filter(p => p.id !== sessionId));
    } catch (err: any) {
      setError(err.message || 'Failed to accept session request');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRequest = async (sessionId: string, reason?: string) => {
    setIsLoading(true);
    try {
      await api.consultations.reject(sessionId, reason);
      setPendingRequests(prev => prev.filter(p => p.id !== sessionId));
      if (activeSession?.id === sessionId) {
        setActiveSession(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reject request');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!activeSession || !user) return;
    try {
      const newMsg = await api.chat.sendMessage(activeSession.id, {
        senderId: user.id,
        senderRole: user.role === 'customer' ? 'customer' : 'astrologer',
        senderName: user.fullName,
        content,
      });
      setMessages(prev => [...prev, newMsg]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      throw err;
    }
  };

  const endSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const res = await api.consultations.end(sessionId);
      setActiveSession(res.session);
      return res.session;
    } catch (err: any) {
      setError(err.message || 'Failed to end session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        activeSession,
        pendingRequests,
        messages,
        durationSeconds,
        isLoading,
        error,
        startSession,
        sendMessage,
        acceptRequest,
        rejectRequest,
        endSession,
        setActiveSession,
        refreshSessions,
        clearError: () => setError(null),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
