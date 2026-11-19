import { useState, useEffect, useRef, type FormEvent } from 'react';
import {
  MessageSquare,
  X,
  RotateCcw,
  Send,
  ExternalLink,
  ChevronDown,
  Building2,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const COMPANY_WHATSAPP_NUMBER = '918867719798';

type Step = 'REQUIREMENT' | 'COMPANY' | 'NAME' | 'EMAIL' | 'PHONE' | 'COMPLETE';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  isAction?: boolean;
}

interface LeadData {
  requirement: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
}

const QUICK_STARTERS = [
  'Employee Onboarding Kits',
  'Diwali / Festival Hampers',
  'Client Appreciation Gifts',
  'Bulk Branded Merchandise',
  'Custom Rigid Packaging Boxes',
];

export function SimpleLeadChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('REQUIREMENT');
  const [leadData, setLeadData] = useState<LeadData>({
    requirement: '',
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: "👋 Welcome to KappaBoxes!\n\nPlease tell us what corporate gifting or custom packaging solutions you are looking for (or pick one of the options below):",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && currentStep !== 'COMPLETE') {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, currentStep]);

  const handleReset = () => {
    setCurrentStep('REQUIREMENT');
    setLeadData({
      requirement: '',
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
    });
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'bot',
        text: "Conversation restarted. What corporate gifting or packaging solution are you planning for your organisation?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText('');
  };

  const getStepPlaceholder = () => {
    switch (currentStep) {
      case 'REQUIREMENT':
        return 'Describe your requirement or quantity...';
      case 'COMPANY':
        return 'Enter Company / Organisation name...';
      case 'NAME':
        return 'Enter Contact Person Name...';
      case 'EMAIL':
        return 'Enter Work Email Address...';
      case 'PHONE':
        return 'Enter Contact Phone Number...';
      case 'COMPLETE':
        return 'Enquiry ready. Click Send to WhatsApp above!';
      default:
        return 'Type your response...';
    }
  };

  const addBotMessage = (text: string, isAction = false) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAction,
        },
      ]);
      setIsTyping(false);
    }, 400);
  };

  const handleUserInput = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    // 1. Post user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // 2. State-machine transition based on current step
    switch (currentStep) {
      case 'REQUIREMENT': {
        setLeadData((prev) => ({ ...prev, requirement: text }));
        setCurrentStep('COMPANY');
        addBotMessage("Got it! What is the name of your Company / Organisation? *");
        break;
      }

      case 'COMPANY': {
        setLeadData((prev) => ({ ...prev, companyName: text }));
        setCurrentStep('NAME');
        addBotMessage("Thank you. Who should our team speak with? (Contact Person Name *)");
        break;
      }

      case 'NAME': {
        setLeadData((prev) => ({ ...prev, contactName: text }));
        setCurrentStep('EMAIL');
        addBotMessage(`Nice to connect, ${text}! What is your Work Email Address? *`);
        break;
      }

      case 'EMAIL': {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
          addBotMessage("Please provide a valid Work Email Address (e.g. name@company.com) so we can send our catalogue:");
          return;
        }
        setLeadData((prev) => ({ ...prev, email: text }));
        setCurrentStep('PHONE');
        addBotMessage("Almost done! What is your Contact Phone Number (with WhatsApp)? *");
        break;
      }

      case 'PHONE': {
        // Basic phone validation (at least 8 digits)
        const digitsOnly = text.replace(/\D/g, '');
        if (digitsOnly.length < 8) {
          addBotMessage("Please provide a valid phone number (at least 8–10 digits) so our sales desk can connect:");
          return;
        }

        const updatedData = { ...leadData, phone: text };
        setLeadData(updatedData);
        setCurrentStep('COMPLETE');

        const summaryText =
          `🎉 Thank you! Your enquiry details are ready:\n\n` +
          `🏢 *Company:* ${updatedData.companyName}\n` +
          `👤 *Contact:* ${updatedData.contactName}\n` +
          `📧 *Email:* ${updatedData.email}\n` +
          `📱 *Phone:* ${text}\n` +
          `📝 *Requirement:* ${updatedData.requirement}\n\n` +
          `Click the green button below to send this directly to our team on WhatsApp!`;

        addBotMessage(summaryText, true);
        break;
      }

      case 'COMPLETE': {
        addBotMessage("Your enquiry is prepared! Please click the 'Send to WhatsApp' button to connect directly with our sales team.");
        break;
      }
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (currentStep === 'COMPLETE') return;
    handleUserInput(inputText);
  };

  const buildWhatsAppUrl = () => {
    const message =
      `*New Corporate Gifting Enquiry - KappaBoxes*\n` +
      `--------------------------------------\n` +
      `🏢 *Company / Organisation:* ${leadData.companyName || 'Not specified'}\n` +
      `👤 *Contact Person:* ${leadData.contactName || 'Not specified'}\n` +
      `📧 *Work Email:* ${leadData.email || 'Not specified'}\n` +
      `📱 *Contact Phone:* ${leadData.phone || 'Not specified'}\n\n` +
      `📝 *Requirement / Query:*\n${leadData.requirement || 'General bulk corporate gifting enquiry'}\n` +
      `--------------------------------------\n` +
      `_Sent via KappaBoxes Website Assistant_`;

    return `https://wa.me/${COMPANY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const handleOpenWhatsApp = () => {
    const url = buildWhatsAppUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0088cc] hover:bg-[#006497] text-white px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer focus:outline-hidden focus:ring-4 focus:ring-[#0088cc]/30"
          aria-label="Open Gifting Enquiry Assistant"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#25D366] rounded-full border-2 border-white animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold leading-tight tracking-wide uppercase text-white/80">
              Corporate Gifting
            </p>
            <p className="text-sm font-bold leading-tight">Enquire via WhatsApp</p>
          </div>
        </button>
      )}

      {/* Responsive Chat Widget Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Corporate Gifting Enquiry Chat"
          className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[410px] h-[100dvh] sm:h-[620px] max-h-[100dvh] sm:max-h-[85vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden font-sans transition-all duration-200 animate-in fade-in slide-in-from-bottom-4"
        >
          {/* Header */}
          <div className="bg-[#0b1320] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0088cc] to-[#25D366] flex items-center justify-center font-bold text-white text-sm shadow-inner">
                KB
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  KappaBoxes Enquiry Desk
                  <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block animate-pulse" />
                </h3>
                <p className="text-[11px] text-white/70">Quick WhatsApp Enquiry • Direct Response</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Step Progress Bar */}
          <div className="bg-[#f8fafc] border-b border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-500 shrink-0">
            <span className="font-semibold text-gray-700 text-[11px]">
              {currentStep === 'REQUIREMENT' && 'Step 1 of 5: Requirement'}
              {currentStep === 'COMPANY' && 'Step 2 of 5: Company Name'}
              {currentStep === 'NAME' && 'Step 3 of 5: Contact Person'}
              {currentStep === 'EMAIL' && 'Step 4 of 5: Work Email'}
              {currentStep === 'PHONE' && 'Step 5 of 5: Phone Number'}
              {currentStep === 'COMPLETE' && '✓ Enquiry Ready for WhatsApp'}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              {currentStep === 'COMPLETE' ? 'Completed' : 'Fast 1-Min Form'}
            </span>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#fbfcfd] text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0088cc] text-white rounded-tr-none shadow-xs font-medium'
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-200 shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>

                {/* Final WhatsApp Call-to-Action Card */}
                {msg.isAction && currentStep === 'COMPLETE' && (
                  <div className="mt-3 w-full bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-left space-y-2.5 shadow-xs">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      All 5 Details Recorded
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Our corporate gifting team will review your quantities and packaging specifications immediately.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenWhatsApp}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-[0.99]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Send Enquiry via WhatsApp
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Quick Starters (Visible only during Requirement Step) */}
            {currentStep === 'REQUIREMENT' && messages.length === 1 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-1">
                  Popular corporate requests:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_STARTERS.map((starter) => (
                    <button
                      key={starter}
                      type="button"
                      onClick={() => handleUserInput(starter)}
                      className="text-[11px] font-medium text-[#0088cc] hover:text-white bg-sky-50 hover:bg-[#0088cc] border border-sky-200 hover:border-transparent px-3 py-1.5 rounded-full transition-all duration-150 cursor-pointer text-left"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-gray-400 text-xs py-1">
                <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">
                  KB
                </div>
                <div className="bg-white border border-gray-200 px-3 py-2 rounded-2xl rounded-tl-none flex items-center gap-1 shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Action / Input Footer */}
          {currentStep === 'COMPLETE' ? (
            <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                Send via WhatsApp
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                title="Start a new enquiry"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleFormSubmit}
              className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={getStepPlaceholder()}
                maxLength={500}
                disabled={isTyping}
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0088cc] focus:bg-white transition-all text-gray-800"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-2.5 bg-[#0088cc] hover:bg-[#006497] disabled:opacity-40 text-white rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer shadow-xs"
                aria-label="Send response"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
