import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Calendar, User, Check, X, Clock, Plus, Users, MessageSquare, LogOut, Search } from 'lucide-react';
import { toast } from 'sonner';

// --- Types ---
interface User {
    id: string;
    username: string;
    role: 'user' | 'admin';
    lastSeen: string;
    isOnline?: boolean;
}

interface Conversation {
    id: string;
    type: 'dm' | 'group';
    name?: string;
    participants: string[];
    lastMessage?: {
        text: string;
        timestamp: string;
        sender: string;
    };
    isOnline?: boolean; // For DMs
}

interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
    type: 'text' | 'proposal';
    proposal?: {
        date: string;
        time: string;
        location: string;
        status: 'pending' | 'accepted' | 'rejected';
    };
}

const PlayerPortal = () => {
    // Auth State
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('chat_user_data');
        return saved ? JSON.parse(saved) : null;
    });

    // Data State
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);

    // UI State
    const [inputText, setInputText] = useState('');
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [proposalDate, setProposalDate] = useState('');
    const [proposalTime, setProposalTime] = useState('');
    const [selectedUsersForChat, setSelectedUsersForChat] = useState<string[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Effects ---

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Poll for data
    useEffect(() => {
        if (!currentUser) return;

        const fetchData = async () => {
            try {
                // Get Conversations
                const convosRes = await fetch('/api/chat/conversations', {
                    headers: { 'x-user-id': currentUser.id }
                });
                if (convosRes.ok) setConversations(await convosRes.json());

                // Get Messages if active
                if (activeConversationId) {
                    const msgsRes = await fetch(`/api/chat/conversations/${activeConversationId}/messages`);
                    if (msgsRes.ok) setMessages(await msgsRes.json());
                }

                // Get Available Users (also updates my lastSeen)
                const usersRes = await fetch('/api/chat/users', {
                    headers: { 'x-user-id': currentUser.id }
                });
                if (usersRes.ok) setAvailableUsers(await usersRes.json());

            } catch (error) {
                console.error("Polling error", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [currentUser, activeConversationId]);

    // --- Actions ---

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const username = formData.get('username') as string;

        try {
            const res = await fetch('/api/chat/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            if (res.ok) {
                const user = await res.json();
                setCurrentUser(user);
                localStorage.setItem('chat_user_data', JSON.stringify(user));
                toast.success(`Welcome back, ${user.username}!`);
            }
        } catch (error) {
            toast.error("Login failed");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('chat_user_data');
        setCurrentUser(null);
        setConversations([]);
        setActiveConversationId(null);
    };

    const createConversation = async () => {
        if (selectedUsersForChat.length === 0) return;

        const isGroup = selectedUsersForChat.length > 1;
        const participants = [currentUser!.id, ...selectedUsersForChat];

        try {
            const res = await fetch('/api/chat/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: isGroup ? 'group' : 'dm',
                    participants,
                    name: isGroup ? 'New Group' : undefined
                })
            });

            if (res.ok) {
                const newConvo = await res.json();
                setActiveConversationId(newConvo.id);
                setShowNewChatModal(false);
                setSelectedUsersForChat([]);
                // Refresh list immediately
                const convosRes = await fetch('/api/chat/conversations', {
                    headers: { 'x-user-id': currentUser!.id }
                });
                if (convosRes.ok) setConversations(await convosRes.json());
            }
        } catch (error) {
            toast.error("Failed to create chat");
        }
    };

    const sendMessage = async (text: string, type: 'text' | 'proposal' = 'text', proposal?: any) => {
        if (!activeConversationId || (!text.trim() && type === 'text')) return;

        try {
            const res = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: activeConversationId,
                    senderId: currentUser!.id,
                    text,
                    type,
                    proposal
                })
            });

            if (res.ok) {
                setInputText('');
                setShowProposalModal(false);
                const newMsg = await res.json();
                setMessages(prev => [...prev, newMsg]);
            }
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    const updateProposalStatus = async (msgId: string, status: 'accepted' | 'rejected') => {
        try {
            const res = await fetch(`/api/chat/messages/${msgId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                toast.success(`Proposal ${status}`);
                // Refresh messages
                const msgsRes = await fetch(`/api/chat/conversations/${activeConversationId}/messages`);
                if (msgsRes.ok) setMessages(await msgsRes.json());
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    // --- Render ---

    if (!currentUser) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare size={32} className="text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Player Messenger</h2>
                        <p className="text-slate-500 mt-2">Connect with other players, chat, and schedule lessons.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                            <input
                                name="username"
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="Enter your name"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            Start Chatting
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    const activeConvo = conversations.find(c => c.id === activeConversationId);

    return (
        <div className="h-screen pt-20 pb-4 px-4 bg-slate-50 flex flex-col">
            <div className="max-w-6xl mx-auto w-full flex-1 bg-white rounded-2xl shadow-xl overflow-hidden flex">

                {/* Sidebar */}
                <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
                    {/* My Profile */}
                    <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold relative">
                                {currentUser.username[0].toUpperCase()}
                                {currentUser.role === 'admin' && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-yellow-900 font-bold" title="Admin">★</span>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    {currentUser.username}
                                    {currentUser.role === 'admin' && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Admin</span>}
                                </h3>
                                <p className="text-emerald-600 text-xs font-medium flex items-center gap-1">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Online
                                </p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>

                    {/* New Chat Button */}
                    <div className="p-4">
                        <button
                            onClick={() => setShowNewChatModal(true)}
                            className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={18} /> New Chat
                        </button>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                No conversations yet.<br />Start a new chat!
                            </div>
                        ) : (
                            conversations.map(convo => (
                                <button
                                    key={convo.id}
                                    onClick={() => setActiveConversationId(convo.id)}
                                    className={`w-full p-4 flex items-center gap-3 hover:bg-slate-100 transition-colors text-left border-b border-slate-50 ${activeConversationId === convo.id ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : ''
                                        }`}
                                >
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${convo.type === 'group' ? 'bg-blue-500' : 'bg-slate-400'}`}>
                                            {convo.type === 'group' ? <Users size={20} /> : convo.name?.[0].toUpperCase()}
                                        </div>
                                        {convo.type === 'dm' && convo.isOnline && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-slate-900 truncate">{convo.name || 'Group Chat'}</h4>
                                            {convo.lastMessage && (
                                                <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                                    {new Date(convo.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 truncate">
                                            {convo.lastMessage ? (
                                                <span><span className="font-medium text-slate-700">{convo.lastMessage.sender === currentUser.username ? 'You' : convo.lastMessage.sender}:</span> {convo.lastMessage.text}</span>
                                            ) : (
                                                <span className="italic">No messages yet</span>
                                            )}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                    {activeConversationId && activeConvo ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-100 flex items-center gap-3 shadow-sm z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${activeConvo.type === 'group' ? 'bg-blue-500' : 'bg-slate-400'}`}>
                                    {activeConvo.type === 'group' ? <Users size={20} /> : activeConvo.name?.[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{activeConvo.name || 'Group Chat'}</h3>
                                    {activeConvo.type === 'dm' && (
                                        <p className={`text-xs ${activeConvo.isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {activeConvo.isOnline ? 'Active now' : 'Offline'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                                {messages.map((msg) => {
                                    const isMe = msg.senderId === currentUser.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            {!isMe && (
                                                <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center text-xs font-bold text-white mr-2 self-end mb-1">
                                                    {msg.senderName[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                {activeConvo.type === 'group' && !isMe && (
                                                    <span className="text-xs text-slate-500 ml-1 mb-1">{msg.senderName}</span>
                                                )}

                                                {msg.type === 'text' ? (
                                                    <div className={`px-4 py-2 rounded-2xl ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white text-slate-800 shadow-sm rounded-bl-none'}`}>
                                                        {msg.text}
                                                    </div>
                                                ) : (
                                                    <div className={`p-4 rounded-2xl bg-white shadow-md border-l-4 ${msg.proposal?.status === 'accepted' ? 'border-emerald-500' :
                                                            msg.proposal?.status === 'rejected' ? 'border-red-500' : 'border-amber-500'
                                                        }`}>
                                                        <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                                                            <Calendar size={18} className="text-emerald-600" />
                                                            Lesson Proposal
                                                        </div>
                                                        <p className="text-slate-600 mb-3 text-sm">
                                                            Proposed a session on <br />
                                                            <span className="font-semibold">{msg.proposal?.date}</span> at <span className="font-semibold">{msg.proposal?.time}</span>
                                                        </p>

                                                        <div className="flex items-center justify-between gap-4 mt-2">
                                                            <div className={`text-xs font-bold px-2 py-1 rounded uppercase ${msg.proposal?.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                                                                    msg.proposal?.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                                }`}>
                                                                {msg.proposal?.status}
                                                            </div>

                                                            {msg.proposal?.status === 'pending' && !isMe && (
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => updateProposalStatus(msg.id, 'accepted')}
                                                                        className="p-1.5 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200"
                                                                        title="Accept"
                                                                    >
                                                                        <Check size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateProposalStatus(msg.id, 'rejected')}
                                                                        className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                                                        title="Reject"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                <span className="text-[10px] text-slate-400 mt-1 px-1">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-slate-100">
                                <AnimatePresence>
                                    {showProposalModal && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="mb-4 overflow-hidden"
                                        >
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                                                <button
                                                    onClick={() => setShowProposalModal(false)}
                                                    className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                                <h4 className="font-bold text-slate-700 flex items-center gap-2 mb-3">
                                                    <Clock size={18} /> Propose a Time
                                                </h4>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1">Date</label>
                                                        <input
                                                            type="date"
                                                            value={proposalDate}
                                                            onChange={(e) => setProposalDate(e.target.value)}
                                                            className="w-full p-2 rounded border border-slate-200 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-slate-500 mb-1">Time</label>
                                                        <input
                                                            type="time"
                                                            value={proposalTime}
                                                            onChange={(e) => setProposalTime(e.target.value)}
                                                            className="w-full p-2 rounded border border-slate-200 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (!proposalDate || !proposalTime) return toast.error("Select date and time");
                                                        sendMessage(
                                                            `Proposed a lesson on ${proposalDate} at ${proposalTime}`,
                                                            'proposal',
                                                            { date: proposalDate, time: proposalTime, status: 'pending', location: 'Court 1' }
                                                        );
                                                    }}
                                                    className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 text-sm"
                                                >
                                                    Send Proposal
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex gap-2 items-end">
                                    <button
                                        onClick={() => setShowProposalModal(!showProposalModal)}
                                        className={`p-3 rounded-xl transition-colors ${showProposalModal ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                        title="Propose Lesson"
                                    >
                                        <Calendar size={20} />
                                    </button>
                                    <form
                                        className="flex-1 flex gap-2"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            sendMessage(inputText);
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                        <button
                                            type="submit"
                                            className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-500/30"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare size={40} className="text-slate-300" />
                            </div>
                            <p className="text-lg font-medium">Select a chat to start messaging</p>
                        </div>
                    )}
                </div>
            </div>

            {/* New Chat Modal */}
            <AnimatePresence>
                {showNewChatModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg">New Message</h3>
                                <button onClick={() => setShowNewChatModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-4 max-h-96 overflow-y-auto">
                                <p className="text-sm text-slate-500 mb-3">Select users to chat with:</p>
                                <div className="space-y-2">
                                    {availableUsers.length === 0 ? (
                                        <p className="text-center text-slate-400 py-4">No other users online right now.</p>
                                    ) : (
                                        availableUsers.map(user => (
                                            <button
                                                key={user.id}
                                                onClick={() => {
                                                    if (selectedUsersForChat.includes(user.id)) {
                                                        setSelectedUsersForChat(prev => prev.filter(id => id !== user.id));
                                                    } else {
                                                        setSelectedUsersForChat(prev => [...prev, user.id]);
                                                    }
                                                }}
                                                className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors ${selectedUsersForChat.includes(user.id) ? 'bg-emerald-50 border border-emerald-200' : 'hover:bg-slate-50 border border-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs relative">
                                                        {user.username[0].toUpperCase()}
                                                        {user.role === 'admin' && (
                                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white flex items-center justify-center text-[6px] text-yellow-900 font-bold">★</span>
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-slate-900 flex items-center gap-2">
                                                        {user.username}
                                                        {user.role === 'admin' && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1 py-0.5 rounded font-bold uppercase">Admin</span>}
                                                    </span>
                                                </div>
                                                {selectedUsersForChat.includes(user.id) && (
                                                    <Check size={18} className="text-emerald-600" />
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                                <button
                                    onClick={() => setShowNewChatModal(false)}
                                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createConversation}
                                    disabled={selectedUsersForChat.length === 0}
                                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Start Chat {selectedUsersForChat.length > 1 ? '(Group)' : ''}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlayerPortal;
