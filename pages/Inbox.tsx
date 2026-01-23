
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Bell, MessageCircle, ChevronLeft, MoreVertical, Send, Check, CheckCheck, 
  Plus, Users, X, Image as ImageIcon, Paperclip, Smile, Receipt, 
  CheckCircle2, AlertTriangle, Filter, Edit, Info, Lock, Globe, ChevronRight
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChatService, DataService, UserService } from '../services/mockData';
import { ChatSession, ChatMessage, Bill } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { UserProfileModal } from './Marketplace'; 

// --- MAIN INBOX COMPONENT ---
const Inbox: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); 
    const location = useLocation();
    
    const [isMobileList, setIsMobileList] = useState(true);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    useEffect(() => {
        const pathParts = location.pathname.split('/');
        // Path format: /inbox/chat/:id or /inbox/group/:id
        const chatIdFromUrl = pathParts.length > 3 ? pathParts[3] : null; 
        
        if (chatIdFromUrl) {
            setSelectedChatId(chatIdFromUrl);
            setIsMobileList(false);
        } else {
            setSelectedChatId(null);
            setIsMobileList(true);
        }
    }, [location]);

    const handleSelectChat = (chatId: string, type: 'chat' | 'group') => {
        navigate(`/inbox/${type}/${chatId}`);
    };

    const handleBackToList = () => {
        navigate('/inbox');
    };

    return (
        <div className="flex h-full bg-white md:my-0 md:rounded-none md:shadow-none md:border-0 border-gray-200 overflow-hidden w-full relative">
            {/* LEFT SIDEBAR (List) */}
            <div className={`w-full md:w-[350px] lg:w-[380px] flex flex-col bg-white border-r border-gray-100 h-full ${!isMobileList ? 'hidden md:flex' : 'flex'}`}>
                <InboxSidebar onSelectChat={handleSelectChat} selectedId={selectedChatId} />
            </div>

            {/* RIGHT MAIN (Chat) */}
            <div className={`flex-1 flex flex-col bg-[#f0f2f5] h-full ${isMobileList ? 'hidden md:flex' : 'flex'} relative min-w-0`}>
                {selectedChatId ? (
                    <ChatInterface chatId={selectedChatId} onBack={handleBackToList} />
                ) : (
                    <div className="hidden md:flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50/50">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <MessageCircle size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Your Inbox</h3>
                        <p className="text-sm mt-2 text-gray-500">Select a conversation or community to start.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SIDEBAR COMPONENT ---
const InboxSidebar: React.FC<{ onSelectChat: (id: string, type: 'chat'|'group') => void, selectedId: string | null }> = ({ onSelectChat, selectedId }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'chats' | 'groups' | 'alerts'>('chats');
    const [chats, setChats] = useState<ChatSession[]>([]);
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    
    // Notifications State (Mock)
    const notifications = [
        { id: 'n1', title: 'Rent Received', desc: 'Rafiqul paid ৳25,000 for Oct.', time: '10:30 AM', type: 'success' },
        { id: 'n2', title: 'Maintenance Request', desc: 'New request: Leaky faucet in Flat 4A.', time: 'Yesterday', type: 'alert' }
    ];

    useEffect(() => {
        const load = () => setChats(ChatService.getChats());
        load();
        const interval = setInterval(load, 3000);
        return () => clearInterval(interval);
    }, []);

    const filteredChats = chats.filter(c => {
        if (activeTab === 'groups') return c.type === 'group';
        if (activeTab === 'chats') return c.type === 'direct';
        return false;
    });

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Header - Fixed Top */}
            <div className="px-6 pt-8 pb-4 shrink-0 bg-white z-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t('inbox_title')}</h1>
                    <div className="flex gap-3">
                        <button onClick={() => setShowCreateGroup(true)} className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors shadow-sm text-gray-600 hover:text-[#ff4b9a]">
                            <Edit size={20}/>
                        </button>
                    </div>
                </div>
                
                {/* Fancy Segmented Controls */}
                <div className="bg-gray-100/70 p-1.5 rounded-2xl flex relative font-bold text-xs shadow-inner">
                    {/* Animated Glider Background */}
                    <div 
                        className={`absolute top-1.5 bottom-1.5 rounded-xl bg-white shadow-sm transition-all duration-300 ease-out z-0`}
                        style={{
                            width: 'calc(33.33% - 6px)',
                            left: activeTab === 'chats' ? '4px' : activeTab === 'groups' ? 'calc(33.33% + 2px)' : 'calc(66.66% + 0px)'
                        }}
                    ></div>

                    {[
                        { id: 'chats', label: t('tab_messages') },
                        { id: 'groups', label: t('tab_groups') },
                        { id: 'alerts', label: t('tab_alerts') }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-2.5 rounded-xl z-10 transition-colors duration-300 ${activeTab === tab.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List Content - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-safe-bottom">
                {activeTab === 'alerts' ? (
                    <div className="space-y-3 mt-2 px-3">
                        {notifications.map(n => (
                            <div key={n.id} className="p-4 bg-white hover:bg-gray-50 rounded-[1.2rem] border border-gray-100 transition-colors cursor-pointer flex gap-4 shadow-sm group">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${n.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {n.type === 'success' ? <CheckCircle2 size={20}/> : <AlertTriangle size={20}/>}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-sm text-gray-900">{n.title}</h4>
                                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">{n.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-1 mt-2 px-1">
                        {activeTab === 'groups' && (
                            <button 
                                onClick={() => setShowCreateGroup(true)}
                                className="w-full p-4 mb-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-[#ff4b9a] hover:text-[#ff4b9a] hover:bg-pink-50 transition-all flex items-center justify-center gap-2 group font-bold text-sm mx-auto"
                            >
                                <Globe size={18} className="group-hover:scale-110 transition-transform"/> Discover Communities
                            </button>
                        )}

                        {filteredChats.map(chat => (
                            <ChatItem 
                                key={chat.id} 
                                chat={chat} 
                                isSelected={selectedId === chat.id}
                                onClick={() => onSelectChat(chat.id, chat.type)} 
                            />
                        ))}
                        
                        {filteredChats.length === 0 && activeTab !== 'groups' && (
                            <div className="py-20 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                    <MessageCircle size={28} className="text-gray-300"/>
                                </div>
                                <p className="text-gray-400 text-sm font-medium">No messages yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create/Join Group Modal Overlay */}
            {showCreateGroup && (
                <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-right duration-300">
                    <CreateGroupFlow onClose={() => setShowCreateGroup(false)} />
                </div>
            )}
        </div>
    );
};

// ... ChatItem (unchanged) ...
const ChatItem: React.FC<{ chat: ChatSession, isSelected: boolean, onClick: () => void }> = ({ chat, isSelected, onClick }) => {
    const currentUser = UserService.getCurrentUser();
    const otherUser = chat.participants.find(p => p.id !== currentUser.id);
    
    const title = chat.type === 'group' ? chat.name : otherUser?.name;
    const avatar = chat.type === 'group' ? chat.image : otherUser?.avatar;
    const lastMsg = chat.lastMessage;
    
    const getTimeString = (iso: string) => {
        const date = new Date(iso);
        const now = new Date();
        if (date.toDateString() === now.toDateString()) return date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        return date.toLocaleDateString([], {month:'short', day:'numeric'});
    };

    const time = lastMsg ? getTimeString(lastMsg.timestamp) : '';

    return (
        <div 
            onClick={onClick}
            className={`flex items-center gap-4 p-3.5 mx-2 rounded-2xl cursor-pointer transition-all border border-transparent group ${isSelected ? 'bg-[#ff4b9a]/5 border-[#ff4b9a]/20 shadow-sm' : 'hover:bg-gray-50'}`}
        >
            <div className="relative shrink-0">
                <img src={avatar || 'https://i.pravatar.cc/150'} alt={title} className="w-12 h-12 rounded-2xl object-cover bg-gray-200 border border-gray-100 transition-transform group-hover:scale-105" />
                {chat.type !== 'group' && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-[#ff4b9a]' : 'text-gray-900'}`}>{title}</h4>
                    <span className="text-[10px] text-gray-400 font-medium ml-2">{time}</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className={`text-xs truncate max-w-[85%] ${chat.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                        {lastMsg?.senderId === currentUser.id && <span className="text-gray-400 font-normal mr-1">You:</span>}
                        {lastMsg?.type === 'action' ? (
                            <span className="italic flex items-center gap-1 font-medium text-blue-600"><Receipt size={12}/> Invoice Sent</span>
                        ) : (
                            lastMsg?.text || 'Start chatting'
                        )}
                    </p>
                    {chat.unreadCount > 0 && (
                        <span className="bg-[#ff4b9a] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center shadow-sm">
                            {chat.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- MAIN CHAT INTERFACE ---
const ChatInterface: React.FC<{ chatId: string, onBack: () => void }> = ({ chatId, onBack }) => {
    const currentUser = UserService.getCurrentUser();
    const { t } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [session, setSession] = useState<ChatSession>();
    const [inputText, setInputText] = useState('');
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [viewUserId, setViewUserId] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Load Chat Data
    useEffect(() => {
        const load = () => {
            setSession(ChatService.getChatById(chatId));
            setMessages(ChatService.getMessages(chatId));
        };
        load();
        const interval = setInterval(load, 2000);
        return () => clearInterval(interval);
    }, [chatId]);

    // Scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (text: string = inputText, type: ChatMessage['type'] = 'text', actionData?: any) => {
        if (!text.trim() && type === 'text') return;
        
        ChatService.sendMessage(chatId, text, currentUser.id); 
        
        const newMsg: ChatMessage = {
            id: `temp-${Date.now()}`,
            chatId,
            senderId: currentUser.id,
            text,
            type,
            status: 'sent',
            timestamp: new Date().toISOString(),
            actionData
        };
        
        if (type !== 'text') {
             setMessages(prev => [...prev, newMsg]);
        }

        setInputText('');
    };

    const sendInvoice = (bill: Bill) => {
        const invoiceMsg: ChatMessage = {
            id: `inv-${Date.now()}`,
            chatId,
            senderId: currentUser.id,
            text: `Invoice #${bill.id.slice(-4)}`,
            type: 'action',
            status: 'sent',
            timestamp: new Date().toISOString(),
            actionData: {
                type: 'invoice',
                title: bill.asset_name || 'Rent Invoice',
                amount: bill.total,
                id: bill.id,
                status: bill.status
            }
        };
        
        setMessages(prev => [...prev, invoiceMsg]);
        setShowInvoiceModal(false);
        setShowAttachMenu(false);
    };

    if (!session) return <div className="flex-1 flex items-center justify-center">Loading...</div>;

    const otherUser = session.participants.find(p => p.id !== currentUser.id);
    const title = session.type === 'group' ? session.name : otherUser?.name;
    const avatar = session.type === 'group' ? session.image : otherUser?.avatar;

    const handleHeaderClick = () => {
        if (session.type === 'group') setShowInfoModal(true);
        else if (otherUser) setViewUserId(otherUser.id);
    };

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden bg-white">
            {/* 1. Header - Sticky */}
            <div className="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center shadow-sm z-20 shrink-0 h-[70px]">
                <div className="flex items-center gap-3 cursor-pointer" onClick={handleHeaderClick}>
                    <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="relative">
                        <img src={avatar || 'https://i.pravatar.cc/150'} className="w-10 h-10 rounded-full object-cover bg-gray-200 border border-gray-100" />
                        {session.type === 'direct' && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                            {title} {session.type === 'group' && <ChevronRight size={14} className="text-gray-400"/>}
                        </h2>
                        <p className="text-[10px] text-gray-500 font-medium">
                            {session.type === 'group' ? `${session.participants.length} ${t('group_members')}` : 'Tap to view profile'}
                        </p>
                    </div>
                </div>
                {/* Cleaned up Menu - Info Button */}
                <button onClick={handleHeaderClick} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                    <Info size={20}/>
                </button>
            </div>

            {/* 2. Messages Area - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-[#f8f9fa] bg-[url('https://site-assets.fontawesome.com/releases/v6.5.1/svgs/solid/message-lines.svg')] bg-fixed bg-no-repeat bg-center bg-[length:150px] bg-blend-soft-light relative">
                <div className="flex justify-center my-4">
                    <span className="bg-gray-200/60 backdrop-blur-sm text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">Today</span>
                </div>

                {messages.map((msg, i) => {
                    const isMe = msg.senderId === currentUser.id;
                    const senderName = session.type === 'group' && !isMe 
                        ? session.participants.find(p=>p.id===msg.senderId)?.name 
                        : undefined;
                    
                    // Check if previous message was from same sender to group bubbles
                    const isSequence = i > 0 && messages[i-1].senderId === msg.senderId;

                    return (
                        <MessageBubble 
                            key={msg.id || i} 
                            message={msg} 
                            isMe={isMe} 
                            senderName={senderName} 
                            isSequence={isSequence}
                        />
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* 3. Input Area - Sticky Bottom */}
            <div className="bg-white p-3 border-t border-gray-200 relative pb-safe-bottom shrink-0 z-20">
                {showAttachMenu && (
                    <div className="absolute bottom-full left-4 mb-3 bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] border border-gray-100 p-2 flex flex-col gap-1 w-52 animate-in slide-in-from-bottom-4 fade-in z-20">
                        <button className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl text-left transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-100"><ImageIcon size={16}/></div>
                            <span className="text-sm font-bold text-gray-700">Photo/Video</span>
                        </button>
                        <button onClick={() => setShowInvoiceModal(true)} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl text-left transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-[#ff4b9a]/10 text-[#ff4b9a] flex items-center justify-center group-hover:bg-[#ff4b9a]/20"><Receipt size={16}/></div>
                            <span className="text-sm font-bold text-gray-700">Send Invoice</span>
                        </button>
                    </div>
                )}

                <div className="flex items-end gap-2 max-w-4xl mx-auto">
                    <button 
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        className={`p-3 rounded-full transition-colors shrink-0 ${showAttachMenu ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        <Plus size={20} className={`transition-transform duration-300 ${showAttachMenu ? 'rotate-45' : ''}`}/>
                    </button>
                    
                    <div className="flex-1 bg-gray-100 rounded-[1.5rem] flex items-center px-4 py-1 border border-transparent focus-within:border-gray-300 focus-within:bg-white focus-within:shadow-sm transition-all">
                        <input 
                            type="text" 
                            className="flex-1 bg-transparent border-none outline-none py-3 text-sm text-gray-900 placeholder:text-gray-400 font-medium"
                            placeholder={t('chat_type_message')}
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button className="text-gray-400 hover:text-gray-600 p-1"><Smile size={20}/></button>
                    </div>

                    <button 
                        onClick={() => handleSend()} 
                        disabled={!inputText.trim()}
                        className="p-3 bg-[#2d1b4e] text-white rounded-full hover:bg-[#3a2366] disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all active:scale-95 shrink-0"
                    >
                        <Send size={18} className="ml-0.5" />
                    </button>
                </div>
            </div>

            {/* Modals */}
            {showInvoiceModal && <BillPickerModal onClose={() => setShowInvoiceModal(false)} onSelect={sendInvoice} />}
            {showInfoModal && <GroupInfoModal session={session} onClose={() => setShowInfoModal(false)} />}
            {viewUserId && <UserProfileModal userId={viewUserId} onClose={() => setViewUserId(null)} />}
        </div>
    );
};

// ... Rest of the file (MessageBubble, BillPickerModal, GroupInfoModal, CreateGroupFlow) ...
// Included for context but not changed substantially except translations/imports

// --- MESSAGE BUBBLE COMPONENT ---
const MessageBubble: React.FC<{ message: ChatMessage, isMe: boolean, senderName?: string, isSequence?: boolean }> = ({ message, isMe, senderName, isSequence }) => {
    const isInvoice = message.type === 'action' && message.actionData?.type === 'invoice';

    if (isInvoice && message.actionData) {
        return (
            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-6 group`}>
                <div className="bg-white border border-gray-200 rounded-2xl w-64 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#ff4b9a]/10 text-[#ff4b9a] flex items-center justify-center">
                                <Receipt size={16}/>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">Invoice</p>
                                <p className="text-xs font-bold text-gray-900 leading-none">#{message.actionData.id?.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <p className="text-sm font-bold text-gray-600 mb-1">{message.actionData.title}</p>
                        <h3 className="text-2xl font-black text-gray-900 mb-5">৳ {message.actionData.amount?.toLocaleString()}</h3>
                        {isMe ? (
                            <button className="w-full py-2.5 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold border border-transparent cursor-default flex items-center justify-center gap-2">
                                <Check size={14}/> Request Sent
                            </button>
                        ) : (
                            <button className="w-full py-2.5 bg-[#2d1b4e] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#3a2366] active:scale-95 transition-all">
                                Pay Now
                            </button>
                        )}
                    </div>
                </div>
                <span className={`text-[9px] text-gray-400 mt-1.5 px-1 font-medium ${isMe ? 'text-right' : 'text-left'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group ${isSequence ? 'mt-0.5' : 'mt-3'}`}>
            {!isMe && senderName && !isSequence && (
                <span className="text-[10px] text-gray-500 ml-3 mb-1 font-bold">{senderName}</span>
            )}
            <div 
                className={`max-w-[75%] px-4 py-2 text-[15px] leading-snug relative shadow-sm transition-all
                    ${isMe 
                        ? 'bg-gradient-to-br from-[#2d1b4e] to-[#3c2466] text-white rounded-[1.2rem] rounded-tr-sm' 
                        : 'bg-white text-gray-900 rounded-[1.2rem] rounded-tl-sm border border-gray-100'
                    }`}
            >
                {message.text}
                <div className={`text-[9px] flex items-center justify-end gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 ${isMe ? 'right-0' : 'left-0'} text-gray-400 font-bold whitespace-nowrap px-1 z-10`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                    {isMe && <CheckCheck size={12} className="text-[#2d1b4e]" />}
                </div>
            </div>
        </div>
    );
};

const BillPickerModal: React.FC<{ onClose: () => void, onSelect: (b: Bill) => void }> = ({ onClose, onSelect }) => {
    const [bills] = useState<Bill[]>(DataService.getBills().filter(b => b.status === 'unpaid').sort((a,b) => new Date(b.month).getTime() - new Date(a.month).getTime()));
    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-[1.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[80vh]">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                    <h3 className="font-bold text-gray-900 text-lg">Send Invoice</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><X size={20}/></button>
                </div>
                <div className="overflow-y-auto p-3 custom-scrollbar bg-gray-50 flex-1">
                    {bills.length > 0 && <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Pending Payments</p>}
                    {bills.map(bill => (
                        <div key={bill.id} onClick={() => onSelect(bill)} className="p-4 bg-white hover:border-[#ff4b9a] rounded-2xl cursor-pointer border border-gray-100 transition-all mb-2 shadow-sm group">
                            <div className="flex justify-between items-center">
                                <div><p className="font-bold text-sm text-gray-900">{bill.tenant_name}</p><p className="text-xs text-gray-500 mt-0.5">{bill.asset_name}</p></div>
                                <span className="font-black text-[#ff4b9a] group-hover:scale-110 transition-transform">৳{bill.total.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                    {bills.length === 0 && <div className="p-10 text-center"><p className="text-gray-400 text-sm font-medium">No unpaid invoices found.</p></div>}
                </div>
            </div>
        </div>
    );
};

const GroupInfoModal: React.FC<{ session: ChatSession, onClose: () => void }> = ({ session, onClose }) => {
    const currentUser = UserService.getCurrentUser();
    const isMember = session.participants.some(p => p.id === currentUser.id);
    const [members, setMembers] = useState(session.participants);

    const handleJoin = () => {
        ChatService.joinGroup(session.id);
        setMembers([...members, {id:currentUser.id, name:currentUser.name, avatar:currentUser.avatar||''}]);
    };

    const handleLeave = () => {
        ChatService.leaveGroup(session.id);
        setMembers(members.filter(p => p.id !== currentUser.id));
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><X size={20}/></button>
                <div className="flex flex-col items-center">
                    <img src={session.image} className="w-20 h-20 rounded-2xl object-cover shadow-md mb-4"/>
                    <h3 className="text-xl font-bold text-gray-900 text-center">{session.name}</h3>
                    <p className="text-xs text-gray-500 mb-4 uppercase font-bold tracking-wide">{session.privacy} Group • {members.length} Members</p>
                    
                    <p className="text-sm text-gray-600 text-center mb-6">{session.description || 'No description provided.'}</p>

                    {isMember ? (
                        <button onClick={handleLeave} className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl mb-6 hover:bg-red-100 transition-colors">Leave Community</button>
                    ) : (
                        <button onClick={handleJoin} className="w-full py-3 bg-[#2d1b4e] text-white font-bold rounded-xl mb-6 shadow-lg active:scale-95 transition-transform">Join Community</button>
                    )}

                    <div className="w-full">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Members</h4>
                        <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-2">
                            {members.map(m => (
                                <div key={m.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl">
                                    <img src={m.avatar || 'https://i.pravatar.cc/150'} className="w-8 h-8 rounded-full bg-gray-200"/>
                                    <span className="text-sm font-bold text-gray-800">{m.name}</span>
                                    {m.role === 'admin' && <span className="ml-auto text-[9px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">Admin</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CreateGroupFlow: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [members, setMembers] = useState<string[]>([]);
    const [publicGroups] = useState(ChatService.getPublicCommunities());
    const contacts = ChatService.getContacts();

    const handleCreate = () => {
        const group = ChatService.createGroup(name, members);
        onClose();
        navigate(`/inbox/group/${group.id}`);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                <button onClick={() => step === 1 ? onClose() : setStep(1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100"><ChevronLeft size={24}/></button>
                <h2 className="font-black text-xl text-gray-900">{step === 1 ? 'Communities' : 'New Community'}</h2>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                {step === 1 ? (
                    <div>
                        <button onClick={() => setStep(2)} className="w-full p-4 mb-6 bg-[#2d1b4e] text-white rounded-2xl shadow-lg flex items-center justify-center gap-2 font-bold hover:bg-[#3a2366] active:scale-95 transition-all">
                            <Plus size={20}/> Create New Group
                        </button>
                        
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Discover Public Groups</h3>
                        <div className="space-y-3">
                            {publicGroups.map(g => (
                                <div key={g.id} onClick={() => { onClose(); navigate(`/inbox/group/${g.id}`); }} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#ff4b9a] cursor-pointer group transition-all">
                                    <img src={g.image} className="w-12 h-12 rounded-xl object-cover bg-gray-200"/>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900">{g.name}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-1">{g.description}</p>
                                    </div>
                                    <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold group-hover:bg-[#ff4b9a] group-hover:text-white transition-colors">View</button>
                                </div>
                            ))}
                            {publicGroups.length === 0 && <p className="text-gray-400 text-sm italic">No public communities yet.</p>}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-900 uppercase mb-2 ml-1">Community Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ragib Villa Tenants" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-gray-900 focus:outline-none focus:border-[#ff4b9a] focus:ring-4 focus:ring-pink-50 transition-all text-lg" autoFocus />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-900 uppercase mb-2 ml-1">Add Members ({members.length})</label>
                            <div className="space-y-2">
                                {contacts.map(contact => {
                                    const isSelected = members.includes(contact.id);
                                    return (
                                        <div key={contact.id} onClick={() => setMembers(prev => isSelected ? prev.filter(id => id !== contact.id) : [...prev, contact.id])} className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'border-[#ff4b9a] bg-pink-50 shadow-sm' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                                            <img src={contact.avatar} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                                            <div className="flex-1"><h4 className={`font-bold text-sm ${isSelected ? 'text-[#ff4b9a]' : 'text-gray-900'}`}>{contact.name}</h4><p className="text-[10px] text-gray-500 font-medium">{contact.role}</p></div>
                                            {isSelected && <div className="bg-[#ff4b9a] rounded-full border-2 border-white w-5 h-5 flex items-center justify-center"><Check size={12} className="text-white"/></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {step === 2 && (
                <div className="p-5 border-t border-gray-100 safe-bottom">
                    <button disabled={!name || members.length === 0} onClick={handleCreate} className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:shadow-none hover:bg-[#3a2366] active:scale-95 transition-all text-sm uppercase tracking-wide">Create Group</button>
                </div>
            )}
        </div>
    );
};

export default Inbox;
