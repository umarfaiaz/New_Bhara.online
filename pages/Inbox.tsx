
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, MessageCircle, ChevronLeft, MoreVertical, Send, Check, CheckCheck, Percent, AlertCircle, Info, Plus, Users, Building2, Briefcase, MapPin, UserPlus, LogOut, X, Phone, Video, Image as ImageIcon, Paperclip, Smile, Settings, Trash2, Edit2, Camera } from 'lucide-react';
import { useNavigate, Routes, Route, useParams } from 'react-router-dom';
import { ChatService, DataService } from '../services/mockData';
import { ChatSession, ChatMessage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

// --- MAIN INBOX ROUTER ---
const Inbox: React.FC = () => {
    return (
        <Routes>
            <Route index element={<InboxHome />} />
            <Route path="chat/:id" element={<ChatScreen />} />
            <Route path="group/:id" element={<ChatScreen isGroup />} />
        </Routes>
    );
};

// --- INBOX HOME (List View) ---
const InboxHome: React.FC = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'messages' | 'groups' | 'notifications'>('messages');
    const [chats, setChats] = useState<ChatSession[]>([]);
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    useEffect(() => {
        const loadChats = () => {
            setChats(ChatService.getChats());
        };
        loadChats();
        const interval = setInterval(loadChats, 2000);
        return () => clearInterval(interval);
    }, []);

    const directChats = chats.filter(c => c.type === 'direct');
    const groupChats = chats.filter(c => c.type === 'group');

    const handleCreateGroup = (name: string, members: string[]) => {
        const newGroup = ChatService.createGroup(name, members);
        setShowCreateGroup(false);
        navigate(`group/${newGroup.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header: Sticky positioning */}
            <div className="bg-white sticky top-0 z-30 pt-6 px-5 pb-0 shadow-sm border-b border-gray-100 transition-all">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{t('inbox_title')}</h1>
                    <div className="bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                        <Search size={20} className="text-gray-500"/>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="flex">
                    <button 
                        onClick={() => setActiveTab('messages')}
                        className={`flex-1 pb-3 text-sm font-bold relative transition-colors ${activeTab === 'messages' ? 'text-[#ff4b9a]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {t('tab_messages')}
                        {activeTab === 'messages' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#ff4b9a] rounded-t-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('groups')}
                        className={`flex-1 pb-3 text-sm font-bold relative transition-colors ${activeTab === 'groups' ? 'text-[#ff4b9a]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {t('tab_groups')}
                        {activeTab === 'groups' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#ff4b9a] rounded-t-full"></div>}
                    </button>
                     <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`flex-1 pb-3 text-sm font-bold relative transition-colors ${activeTab === 'notifications' ? 'text-[#ff4b9a]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {t('tab_alerts')}
                        {activeTab === 'notifications' && <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#ff4b9a] rounded-t-full"></div>}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 pt-2 relative">
                {activeTab === 'messages' && (
                    <div className="bg-white min-h-full">
                        {directChats.length === 0 && <EmptyState type="messages" />}
                        {directChats.map(chat => <ChatItem key={chat.id} chat={chat} onClick={() => navigate(`chat/${chat.id}`)} />)}
                    </div>
                )}
                {activeTab === 'groups' && (
                    <div className="bg-white min-h-full pb-20">
                         {groupChats.length === 0 && <EmptyState type="groups" />}
                         {groupChats.map(chat => <ChatItem key={chat.id} chat={chat} onClick={() => navigate(`group/${chat.id}`)} />)}
                         
                         {/* Create Group FAB */}
                         <div className="fixed bottom-24 right-5 z-20">
                             <button onClick={() => setShowCreateGroup(true)} className="bg-[#2d1b4e] text-white p-4 rounded-full shadow-lg hover:bg-black transition-all active:scale-90 flex items-center gap-2">
                                 <Plus size={24} />
                                 <span className="font-bold text-sm pr-1">New Community</span>
                             </button>
                         </div>
                    </div>
                )}
                {activeTab === 'notifications' && <NotificationsList />}
            </div>

            {/* Modals */}
            {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} onCreate={handleCreateGroup} />}
        </div>
    );
};

// --- CREATE GROUP MODAL ---
const CreateGroupModal: React.FC<{ onClose: () => void, onCreate: (name: string, members: string[]) => void }> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const contacts = ChatService.getContacts();

    const toggleMember = (id: string) => {
        if(selectedMembers.includes(id)) setSelectedMembers(prev => prev.filter(m => m !== id));
        else setSelectedMembers(prev => [...prev, id]);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex flex-col justify-end sm:justify-center items-center backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] h-[90vh] sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                    <h3 className="text-lg font-bold text-gray-900">Create Community</h3>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"><X size={20}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 cursor-pointer hover:border-[#ff4b9a] hover:text-[#ff4b9a] transition-all">
                            <Camera size={24} className="mb-1"/>
                            <span className="text-[10px] font-bold uppercase">Add Photo</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-xs font-bold text-gray-700 mb-2">Community Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-bold focus:outline-none focus:border-[#ff4b9a]" placeholder="e.g. Uttara Residents" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-3">Add Members ({selectedMembers.length})</label>
                        <div className="space-y-3">
                            {contacts.map(contact => (
                                <div key={contact.id} onClick={() => toggleMember(contact.id)} className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${selectedMembers.includes(contact.id) ? 'border-[#ff4b9a] bg-pink-50' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                                    <img src={contact.avatar} className="w-10 h-10 rounded-full bg-gray-200" alt={contact.name}/>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-gray-900">{contact.name}</h4>
                                        <p className="text-[10px] text-gray-500">{contact.role}</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedMembers.includes(contact.id) ? 'bg-[#ff4b9a] border-[#ff4b9a]' : 'border-gray-300'}`}>
                                        {selectedMembers.includes(contact.id) && <Check size={12} className="text-white"/>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 safe-bottom">
                    <button 
                        disabled={!name}
                        onClick={() => onCreate(name, selectedMembers)}
                        className="w-full py-4 bg-[#ff4b9a] text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                    >
                        Create Community
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- CHAT ITEM COMPONENT ---
const ChatItem: React.FC<{ chat: ChatSession, onClick: () => void }> = ({ chat, onClick }) => {
    // Determine display name and avatar
    const isGroup = chat.type === 'group';
    const otherUser = chat.participants.find(p => p.id !== 'u1') || chat.participants[0]; // Assuming 'u1' is current user
    const name = isGroup ? chat.name : otherUser?.name;
    const avatar = isGroup ? chat.image : otherUser?.avatar;
    const time = chat.lastMessage ? new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
    const lastMsg = chat.lastMessage?.text || (isGroup ? 'Group created' : 'Start a conversation');

    return (
        <div onClick={onClick} className="flex items-center gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors group">
            <div className="relative">
                <img src={avatar || 'https://i.pravatar.cc/150'} alt={name} className="w-14 h-14 rounded-full object-cover bg-gray-100 border border-gray-200 group-hover:scale-105 transition-transform"/>
                {!isGroup && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{name}</h4>
                    <span className={`text-[10px] font-bold ${chat.unreadCount > 0 ? 'text-[#ff4b9a]' : 'text-gray-400'}`}>{time}</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className={`text-xs truncate max-w-[80%] ${chat.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                        {chat.lastMessage?.senderId === 'u1' && <span className="text-gray-400 font-normal mr-1">You:</span>}
                        {lastMsg}
                    </p>
                    {chat.unreadCount > 0 && (
                        <div className="min-w-[1.25rem] h-5 bg-[#ff4b9a] rounded-full flex items-center justify-center text-[10px] text-white font-bold px-1.5 shadow-sm">
                            {chat.unreadCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- CHAT SCREEN (Detailed View) ---
const ChatScreen: React.FC<{ isGroup?: boolean }> = ({ isGroup }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatInfo, setChatInfo] = useState<ChatSession | undefined>(undefined);
    const [inputText, setInputText] = useState('');
    const [showGroupInfo, setShowGroupInfo] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(id) {
            setChatInfo(ChatService.getChatById(id));
            setMessages(ChatService.getMessages(id));
        }
    }, [id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (inputText.trim() && id) {
            const newMsg = ChatService.sendMessage(id, inputText);
            setMessages(prev => [...prev, newMsg]);
            setInputText('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!chatInfo) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    // Helper info
    const otherUser = chatInfo.participants.find(p => p.id !== 'u1'); // u1 is current user
    const title = isGroup ? chatInfo.name : otherUser?.name;
    const avatar = isGroup ? chatInfo.image : otherUser?.avatar;
    const status = isGroup ? `${chatInfo.participants.length} members` : 'Online';

    return (
        <div className="flex flex-col h-screen bg-gray-50 animate-in slide-in-from-right duration-300 relative">
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 p-3 flex items-center justify-between sticky top-0 z-40 shadow-sm h-[72px]">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/inbox')} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => isGroup && setShowGroupInfo(true)}>
                        <div className="relative">
                            <img src={avatar || 'https://i.pravatar.cc/150'} alt={title} className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-100" />
                            {!isGroup && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 leading-tight flex items-center gap-1">{title} {isGroup && <ChevronLeft size={12} className="rotate-180 text-gray-400"/>}</h2>
                            <p className="text-[10px] text-gray-500 font-medium">{status}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><Phone size={20} /></button>
                    {isGroup ? (
                        <button onClick={() => setShowGroupInfo(true)} className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><Settings size={20} /></button>
                    ) : (
                        <button className="p-2.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><MoreVertical size={20} /></button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-4">
                {/* Date Separator Example */}
                <div className="flex justify-center my-4">
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
                </div>

                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === 'u1';
                    const showAvatar = isGroup && !isMe;
                    const sender = chatInfo.participants.find(p => p.id === msg.senderId);

                    if (msg.type === 'system') {
                        return (
                            <div key={msg.id} className="flex justify-center my-4 px-8 text-center">
                                <span className="text-xs text-gray-500 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">{msg.text}</span>
                            </div>
                        );
                    }

                    return (
                        <div key={msg.id} className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {showAvatar && (
                                <img src={sender?.avatar} className="w-6 h-6 rounded-full self-end mb-1" alt={sender?.name} />
                            )}
                            <div className={`max-w-[75%] px-4 py-3 shadow-sm text-sm leading-relaxed relative group ${
                                isMe 
                                    ? 'bg-[#2d1b4e] text-white rounded-2xl rounded-tr-none' 
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none'
                            }`}>
                                {isGroup && !isMe && <p className="text-[10px] font-bold text-orange-600 mb-0.5">{sender?.name}</p>}
                                <p>{msg.text}</p>
                                <div className={`text-[9px] font-medium mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    {isMe && (
                                        <span>
                                            {msg.status === 'read' ? <CheckCheck size={12} className="text-blue-300"/> : <Check size={12}/>}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-100 p-3 pb-safe-bottom">
                 <div className="flex items-end gap-2 bg-gray-50 rounded-[1.5rem] p-2 border border-gray-200 focus-within:border-[#ff4b9a] focus-within:ring-1 focus-within:ring-[#ff4b9a]/20 transition-all">
                     <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><Plus size={22} /></button>
                     <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-900 py-3 max-h-32 resize-none custom-scrollbar placeholder:text-gray-400"
                        style={{ minHeight: '44px' }}
                     />
                     <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors hidden sm:block"><Paperclip size={20} /></button>
                     <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors hidden sm:block"><Smile size={20} /></button>
                     {inputText.trim() ? (
                         <button onClick={handleSend} className="p-2.5 bg-[#ff4b9a] text-white rounded-full hover:bg-pink-600 shadow-md transition-all active:scale-90 animate-in zoom-in">
                             <Send size={18} className="ml-0.5" />
                         </button>
                     ) : (
                         <button className="p-2.5 bg-gray-200 text-gray-400 rounded-full cursor-default">
                             <Send size={18} className="ml-0.5" />
                         </button>
                     )}
                 </div>
            </div>

            {/* Group Info Modal */}
            {showGroupInfo && chatInfo && (
                <GroupInfoModal 
                    chat={chatInfo} 
                    onClose={() => setShowGroupInfo(false)} 
                    onUpdate={(updated) => setChatInfo(updated)}
                />
            )}
        </div>
    );
};

// --- GROUP INFO / MANAGE COMMUNITY MODAL ---
const GroupInfoModal: React.FC<{ chat: ChatSession, onClose: () => void, onUpdate: (c: ChatSession) => void }> = ({ chat, onClose, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [groupName, setGroupName] = useState(chat.name || '');
    const [showAddMember, setShowAddMember] = useState(false);
    const contacts = ChatService.getContacts();

    const isAdmin = chat.participants.find(p => p.id === 'u1')?.role === 'admin';

    const handleSaveName = () => {
        const updated = ChatService.updateGroup(chat.id, { name: groupName });
        if(updated) onUpdate(updated);
        setIsEditing(false);
    };

    const handleAddMember = (id: string) => {
        ChatService.addMember(chat.id, id);
        // Refresh local state (in a real app, this would be cleaner)
        const updated = ChatService.getChatById(chat.id);
        if(updated) onUpdate(updated);
        setShowAddMember(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex flex-col justify-end sm:justify-center items-center backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] h-[90vh] sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl relative">
                {/* Header with Cover */}
                <div className="relative h-40 bg-gray-200 shrink-0">
                    <img src={chat.image || `https://ui-avatars.com/api/?name=${chat.name}&background=random`} className="w-full h-full object-cover opacity-80" />
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-colors"><X size={20}/></button>
                    {isAdmin && (
                        <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg text-gray-700 hover:text-[#ff4b9a]">
                            <Camera size={18}/>
                        </button>
                    )}
                </div>

                <div className="px-6 py-6 -mt-10 relative z-10 flex-1 overflow-y-auto custom-scrollbar bg-white rounded-t-[2rem]">
                    {/* Title Section */}
                    <div className="mb-8 text-center">
                        {isEditing ? (
                            <div className="flex items-center gap-2 mb-2">
                                <input 
                                    value={groupName} 
                                    onChange={e => setGroupName(e.target.value)}
                                    className="text-xl font-bold text-center border-b-2 border-[#ff4b9a] outline-none flex-1 py-1"
                                    autoFocus
                                />
                                <button onClick={handleSaveName} className="p-2 bg-[#ff4b9a] text-white rounded-full"><Check size={16}/></button>
                            </div>
                        ) : (
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                                {chat.name} 
                                {isAdmin && <Edit2 size={16} className="text-gray-400 cursor-pointer hover:text-[#ff4b9a]" onClick={() => setIsEditing(true)}/>}
                            </h2>
                        )}
                        <p className="text-sm text-gray-500">{chat.participants.length} Members • Created {new Date(chat.updatedAt).toLocaleDateString()}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-4 mb-8">
                         <div className="flex flex-col items-center gap-2">
                             <button onClick={() => setShowAddMember(true)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 border border-gray-100 shadow-sm hover:bg-[#ff4b9a]/10 hover:text-[#ff4b9a] transition-all"><UserPlus size={20}/></button>
                             <span className="text-[10px] font-bold text-gray-500">Add</span>
                         </div>
                         <div className="flex flex-col items-center gap-2">
                             <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 border border-gray-100 shadow-sm hover:bg-blue-50 hover:text-blue-600 transition-all"><Search size={20}/></button>
                             <span className="text-[10px] font-bold text-gray-500">Search</span>
                         </div>
                         <div className="flex flex-col items-center gap-2">
                             <button className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-600 border border-gray-100 shadow-sm hover:bg-red-50 hover:text-red-600 transition-all"><LogOut size={20}/></button>
                             <span className="text-[10px] font-bold text-gray-500">Leave</span>
                         </div>
                    </div>

                    {/* Members List */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Community Members</h3>
                        <div className="space-y-4">
                            {chat.participants.map(p => (
                                <div key={p.id} className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={p.avatar || `https://i.pravatar.cc/150?u=${p.id}`} className="w-10 h-10 rounded-full bg-gray-100" />
                                        {p.role === 'admin' && <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-[8px] font-bold px-1 rounded shadow-sm border border-white">ADMIN</div>}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-gray-900">{p.name} {p.id === 'u1' && '(You)'}</h4>
                                        <p className="text-[10px] text-gray-500">Joined recently</p>
                                    </div>
                                    {isAdmin && p.id !== 'u1' && (
                                        <button className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Add Member Drawer (Nested) */}
                {showAddMember && (
                    <div className="absolute inset-0 bg-white z-20 animate-in slide-in-from-right flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                            <button onClick={() => setShowAddMember(false)}><ChevronLeft size={24}/></button>
                            <h3 className="font-bold text-gray-900">Add Members</h3>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1">
                            {contacts.filter(c => !chat.participants.find(p => p.id === c.id)).map(contact => (
                                <div key={contact.id} onClick={() => handleAddMember(contact.id)} className="flex items-center gap-3 p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                                    <img src={contact.avatar} className="w-10 h-10 rounded-full bg-gray-200" />
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">{contact.name}</h4>
                                        <p className="text-[10px] text-gray-500">{contact.role}</p>
                                    </div>
                                    <Plus size={18} className="ml-auto text-gray-400"/>
                                </div>
                            ))}
                            {contacts.filter(c => !chat.participants.find(p => p.id === c.id)).length === 0 && (
                                <p className="text-center text-gray-400 text-sm mt-10">No new contacts to add.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Empty State ---
const EmptyState: React.FC<{ type: 'messages' | 'groups' }> = ({ type }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
            {type === 'messages' ? <MessageCircle size={32} className="text-gray-300"/> : <Users size={32} className="text-gray-300"/>}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No {type} yet</h3>
        <p className="text-sm text-gray-500 max-w-xs">Connect with renters, owners, or service providers to start chatting.</p>
    </div>
);

// --- Notifications List (Existing logic, simplified UI) ---
const NotificationsList: React.FC = () => {
    // Reusing existing notifications array logic or import it
    const notifications = [
        { id: '1', title: 'Rent Received', desc: 'You received ৳25,000 from Rafiqul Islam.', date: 'Today, 10:32 AM', type: 'success' },
        { id: '2', title: 'Bill Generated', desc: 'Utility bills for March are ready.', date: 'Yesterday, 6:00 PM', type: 'info' },
        { id: '3', title: 'Maintenance Alert', desc: 'Lift maintenance scheduled.', date: '3 days ago', type: 'alert' },
    ];

    const getIcon = (type: string) => {
        switch(type) {
            case 'success': return <Check size={18} className="text-green-600" />;
            case 'alert': return <AlertCircle size={18} className="text-red-600" />;
            default: return <Info size={18} className="text-blue-600" />;
        }
    };
    const getBg = (type: string) => {
        switch(type) {
            case 'success': return 'bg-green-50';
            case 'alert': return 'bg-red-50';
            default: return 'bg-blue-50';
        }
    };

    return (
        <div className="p-3 space-y-3">
            {notifications.map(notif => (
                <div key={notif.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full ${getBg(notif.type)} flex items-center justify-center shrink-0`}>
                        {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-bold text-gray-900">{notif.title}</h4>
                            <span className="text-[10px] text-gray-400 font-medium">{notif.date}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{notif.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Inbox;
