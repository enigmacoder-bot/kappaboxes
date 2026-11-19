import { useState, useEffect, useRef, type FormEvent } from 'react';
import {
  MessageSquare,
  X,
  RotateCcw,
  Send,
  ExternalLink,
  ClipboardList,
  Sparkles,
  ChevronDown,
  Building2,
  Users,
  IndianRupee,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import type { ChatMessage, DiscoveredEnquiryState, GiftOffering } from '../../types/chat';
import { OfferingCard } from './OfferingCard';
import { WhatsAppModal } from './WhatsAppModal';
import { LeadCaptureModal } from './LeadCaptureModal';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  text: `Welcome! Looking for corporate gifting solutions for your organisation?\n\nI can help you explore employee welcome kits, festive hampers, client gifts, event kits and customised bulk gifting solutions.\n\nWhat are you planning for your organisation?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  suggestedReplies: [
    'Corporate gifting for employees',
    'Employee onboarding kits',
    'Diwali / festive gift boxes',
    'Client appreciation gifts',
    'Conference and event kits',
    'Custom branded merchandise',
    'Bulk gifting enquiry',
  ],
};

export function CorporateChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enquiryState, setEnquiryState] = useState<DiscoveredEnquiryState>({});
  const [sessionId, setSessionId] = useState<string>('');

  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [showRequirementPill, setShowRequirementPill] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize unique session ID
  useEffect(() => {
    let storedSession = localStorage.getItem('meridian_chat_session');
    if (!storedSession) {
      storedSession = `b2b-sess-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem('meridian_chat_session', storedSession);
    }
    setSessionId(storedSession);
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleResetConversation = () => {
    const newSession = `b2b-sess-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem('meridian_chat_session', newSession);
    setSessionId(newSession);
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setEnquiryState({});
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare history formatted for API (last 10 turns max)
      const historyPayload = messages.slice(-10).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId || 'default-session',
          message: text,
          history: historyPayload,
          currentState: enquiryState,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendations: data.recommendations,
          suggestedReplies: data.suggestedReplies,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (data.enquiryState) {
          setEnquiryState((prev) => ({ ...prev, ...data.enquiryState }));
        }
      } else {
        throw new Error(data.error || 'Failed to process response');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I apologize, but I had trouble reaching our consultation desk. Would you like to connect directly via WhatsApp or retry?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        suggestedReplies: ['Retry Message', 'Open WhatsApp Enquiry'],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleCardSelect = (offering: GiftOffering) => {
    handleSendMessage(`I'm interested in the "${offering.name}" (${offering.category}). Could you share customisation options and minimum order details?`);
  };

  const hasDiscoveredDetails =
    Boolean(enquiryState.occasion) ||
    Boolean(enquiryState.quantity) ||
    Boolean(enquiryState.budgetPerUnit) ||
    Boolean(enquiryState.deliveryLocations);

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end pointer-events-auto">
        {!isOpen && (
          <div className="mb-2 hidden sm:flex items-center gap-2 bg-white text-[#222222] text-xs font-semibold py-1.5 px-3 rounded-full shadow-lg border border-[#e5e7eb] animate-bounce">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>Corporate Gifting Assistant</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0088cc] ${
            isOpen
              ? 'w-12 h-12 bg-gray-800 text-white hover:bg-gray-900 rotate-90'
              : 'w-14 h-14 bg-[#0088cc] hover:bg-[#006497] text-white hover:scale-105'
          }`}
          aria-label={isOpen ? 'Close corporate gifting chat' : 'Open corporate gifting chat'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-7 h-7" />}
        </button>
      </div>

      {/* Main Chat Interface Modal/Drawer */}
      {isOpen && (
        <div className="fixed bottom-22 right-3 sm:right-6 z-40 w-[calc(100vw-24px)] sm:w-[440px] h-[580px] max-h-[calc(100vh-110px)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#006497] text-white px-4 py-3 flex items-center justify-between border-b border-[#00507a] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#0088cc] border-2 border-white/40 flex items-center justify-center font-bold text-white text-sm">
                  KB
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#006497] rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight leading-tight">KappaBoxes Corporate Advisor</h3>
                <p className="text-[11px] text-white/80 flex items-center gap-1">
                  <span>B2B Gifting & Custom Packaging</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetConversation}
                className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Discovered Requirements Snapshot Pill */}
          {hasDiscoveredDetails && showRequirementPill && (
            <div className="bg-[#f0f9ff] border-b border-[#bae6fd] px-3 py-1.5 text-[11px] text-[#0369a1] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                {enquiryState.occasion && (
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-sky-200 font-semibold shrink-0">
                    <Sparkles className="w-3 h-3 text-[#0088cc]" />
                    {enquiryState.occasion}
                  </span>
                )}
                {enquiryState.quantity && (
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-sky-200 font-semibold shrink-0">
                    <Users className="w-3 h-3 text-[#0088cc]" />
                    {enquiryState.quantity} units
                  </span>
                )}
                {enquiryState.budgetPerUnit && (
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-sky-200 font-semibold shrink-0">
                    <IndianRupee className="w-3 h-3 text-[#0088cc]" />
                    ₹{enquiryState.budgetPerUnit}/unit
                  </span>
                )}
                {enquiryState.deliveryLocations && (
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-sky-200 font-semibold shrink-0">
                    <MapPin className="w-3 h-3 text-[#0088cc]" />
                    {enquiryState.deliveryLocations}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowRequirementPill(false)}
                className="text-gray-400 hover:text-gray-600 ml-2"
                aria-label="Dismiss summary bar"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Quick Handoff Bar */}
          <div className="bg-[#f9fafb] border-b border-gray-200 px-3 py-1.5 flex items-center justify-between text-xs shrink-0">
            <span className="text-[11px] font-medium text-gray-500">Need immediate pricing?</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setWhatsAppModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3 h-3" /> WhatsApp Draft
              </button>
              <button
                type="button"
                onClick={() => setLeadModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0088cc] hover:bg-[#006497] text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <ClipboardList className="w-3 h-3" /> Get Formal Quote
              </button>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0088cc] text-white rounded-tr-none'
                      : msg.isError
                      ? 'bg-red-50 text-red-900 border border-red-200 rounded-tl-none'
                      : 'bg-[#f3f4f6] text-[#222222] rounded-tl-none border border-gray-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>

                {/* Recommendations Carousel / Cards */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="w-full mt-2.5 overflow-x-auto pb-2 pt-1 flex gap-2.5 scrollbar-thin">
                    {msg.recommendations.map((offering) => (
                      <OfferingCard
                        key={offering.id}
                        offering={offering}
                        onSelect={handleCardSelect}
                      />
                    ))}
                  </div>
                )}

                {/* Suggested Quick Replies */}
                {msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestedReplies.map((reply) => (
                      <button
                        key={reply}
                        type="button"
                        onClick={() => {
                          if (reply === 'Open WhatsApp Enquiry' || reply === 'Generate WhatsApp Enquiry') {
                            setWhatsAppModalOpen(true);
                          } else if (reply === 'Submit Official Request') {
                            setLeadModalOpen(true);
                          } else {
                            handleSendMessage(reply);
                          }
                        }}
                        className="text-[11px] font-semibold text-[#0088cc] hover:text-white bg-sky-50 hover:bg-[#0088cc] border border-sky-200 hover:border-transparent px-2.5 py-1 rounded-full transition-all duration-150 cursor-pointer"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-1.5 text-gray-400 text-xs py-1">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs">
                  KB
                </div>
                <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tell me what you're planning..."
              maxLength={1000}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0088cc] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2 sm:px-3 sm:py-2 bg-[#0088cc] hover:bg-[#006497] disabled:opacity-40 text-white rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* WhatsApp Enquiry Generator Modal */}
      <WhatsAppModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        enquiryState={enquiryState}
      />

      {/* Direct Sales Quote Request Modal */}
      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        sessionId={sessionId}
        enquiryState={enquiryState}
        onSuccess={(refId) => {
          setMessages((prev) => [
            ...prev,
            {
              id: `ref-${Date.now()}`,
              sender: 'assistant',
              text: `Your corporate enquiry has been successfully logged with reference **${refId}**. Our commercial team will reach out shortly with customized mockups and volume pricing!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }}
      />
    </>
  );
}
