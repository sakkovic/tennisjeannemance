import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Calendar, Check, X, Clock, Plus, Users, MessageSquare, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    getDoc
} from 'firebase/firestore';
import { db } from '../../firebase';
import { User, Conversation, Message } from '../../types';
import Avatar from '../ui/Avatar';

interface ChatAreaProps {
    currentUser: User;
    activeConversationId: string | null;
    activeConvo: Conversation | undefined;
    onAddMember: () => void;
    onShowMembers: () => void;
    onBack: () => void;
}

const ChatArea = ({
    currentUser,
    activeConversationId,
    activeConvo,
    onAddMember,
    onShowMembers,
    onBack
}: ChatAreaProps) => {
    // Data State
    const [messages, setMessages] = useState<Message[]>([]);

    // UI State
    const [inputText, setInputText] = useState('');
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [proposalDate, setProposalDate] = useState(() => {
        const d = new Date();
        d.setFullYear(2025);
        return d.toISOString().split('T')[0];
    });
    const [proposalTime, setProposalTime] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Listen to Messages
    useEffect(() => {
        if (!activeConversationId) return;

        const qMsgs = query(
            collection(db, `conversations/${activeConversationId}/messages`),
            orderBy('timestamp', 'asc')
        );

        const unsubMsgs = onSnapshot(qMsgs, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(msgs);
        });

        return () => unsubMsgs();
    }, [activeConversationId]);

    // Mark as Read
    useEffect(() => {
        if (!activeConversationId || !currentUser) return;

        const markAsRead = async () => {
            try {
                const convoRef = doc(db, 'conversations', activeConversationId);
                // We use setDoc with merge to ensure nested field update works even if map doesn't exist?
                // valid updateDoc syntax for nested map: "lastRead.uid": val
                await updateDoc(convoRef, {
                    [`lastRead.${currentUser.id}`]: serverTimestamp()
                });
            } catch (error) {
                console.error("Error marking read:", error);
            }
        };

        markAsRead();
    }, [activeConversationId, currentUser, messages.length]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Actions
    const sendMessage = async (text: string, type: 'text' | 'proposal' = 'text', proposal?: any) => {
        if (!activeConversationId || !currentUser || (!text.trim() && type === 'text')) return;

        try {
            const msgData = {
                conversationId: activeConversationId,
                senderId: currentUser.id,
                senderName: currentUser.username,
                text,
                type,
                proposal: proposal || null,
                timestamp: serverTimestamp()
            };

            await addDoc(collection(db, `conversations/${activeConversationId}/messages`), msgData);

            // Update conversation last message
            await updateDoc(doc(db, 'conversations', activeConversationId), {
                lastMessage: {
                    text: type === 'proposal' ? '📅 Lesson Proposal' : text,
                    timestamp: serverTimestamp(),
                    sender: currentUser.username
                }
            });

            setInputText('');
            setShowProposalModal(false);
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    const updateProposalStatus = async (msgId: string, status: 'accepted' | 'rejected') => {
        if (!activeConversationId) return;
        try {
            const msgRef = doc(db, `conversations/${activeConversationId}/messages`, msgId);
            await updateDoc(msgRef, {
                'proposal.status': status
            });
            toast.success(`Proposal ${status}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleVote = async (msgId: string, voteType: 'yes' | 'no') => {
        if (!activeConversationId || !currentUser) return;
        try {
            const msgRef = doc(db, `conversations/${activeConversationId}/messages`, msgId);
            const msgDoc = await getDoc(msgRef);
            if (!msgDoc.exists()) return;

            const msgData = msgDoc.data() as Message;
            const currentVotes = msgData.votes || { yes: [], no: [] };

            const userId = currentUser.id;

            // Remove from both first to toggle/switch
            let newYes = currentVotes.yes.filter(id => id !== userId);
            let newNo = currentVotes.no.filter(id => id !== userId);

            // Add to selected
            if (voteType === 'yes') {
                if (!currentVotes.yes.includes(userId)) {
                    newYes.push(userId);
                }
            } else {
                if (!currentVotes.no.includes(userId)) {
                    newNo.push(userId);
                }
            }

            await updateDoc(msgRef, {
                votes: { yes: newYes, no: newNo }
            });

        } catch (error) {
            console.error("Voting failed", error);
            toast.error("Failed to record vote");
        }
    };

    if (!activeConversationId || !activeConvo) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare size={40} className="text-slate-300" />
                </div>
                <p className="text-lg font-medium">Select a chat to start messaging</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white h-full min-h-0">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shadow-sm z-10 bg-white/80 backdrop-blur-md sticky top-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${activeConvo.type === 'group' ? 'bg-blue-500' :
                        activeConvo.type === 'public' ? 'bg-slate-700' : 'bg-gradient-to-br from-slate-400 to-slate-500'}`}>
                        {activeConvo.type === 'group' ? <Users size={20} /> :
                            activeConvo.type === 'public' ? '#' :
                                activeConvo.name?.[0].toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 leading-tight">{activeConvo.name || 'Group Chat'}</h3>
                        {activeConvo.type === 'dm' && (
                            <p className={`text-xs font-medium ${activeConvo.isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {activeConvo.isOnline ? 'Active now' : 'Offline'}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {activeConvo.type === 'group' && (
                        <button
                            onClick={onAddMember}
                            className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
                        >
                            <Plus size={14} /> Add Member
                        </button>
                    )}
                    {activeConvo.type === 'group' && (
                        <button
                            onClick={onShowMembers}
                            className="bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
                        >
                            <Users size={14} /> Members
                        </button>
                    )}
                    <button
                        onClick={() => setShowProposalModal(true)}
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
                    >
                        <Calendar size={14} /> Schedule Lesson
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {!isMe && (
                                <div className="mr-2 self-end mb-1">
                                    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                                        {msg.senderName[0].toUpperCase()}
                                    </div>
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
                                    <div className={`p-6 rounded-2xl bg-white shadow-md border-l-4 w-[280px] sm:w-[320px] ${msg.proposal?.status === 'accepted' ? 'border-emerald-500' :
                                        msg.proposal?.status === 'rejected' ? 'border-red-500' : 'border-amber-500'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-3 font-bold text-slate-900 text-base">
                                            <Calendar size={20} className="text-emerald-600" />
                                            Lesson Proposal
                                        </div>
                                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                            Proposed a session on <br />
                                            <span className="font-bold text-slate-900 text-lg">{msg.proposal?.date}</span> at <span className="font-bold text-slate-900 text-lg">{msg.proposal?.time}</span>
                                            {msg.proposal?.location && (
                                                <> <br /> <span className="text-slate-500 text-xs">@ {msg.proposal.location}</span></>
                                            )}
                                        </p>

                                        <div className="flex items-center justify-between gap-4 mt-2 border-t border-slate-100 pt-3">
                                            <div className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${msg.proposal?.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                                                msg.proposal?.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {msg.proposal?.status}
                                            </div>

                                            {/* Voting UI */}
                                            {msg.proposal?.status === 'pending' && (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleVote(msg.id, 'yes')}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${msg.votes?.yes.includes(currentUser?.id || '')
                                                            ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-200'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-600'
                                                            }`}
                                                    >
                                                        <Check size={14} />
                                                        Yes {msg.votes?.yes.length ? `(${msg.votes.yes.length})` : ''}
                                                    </button>
                                                    <button
                                                        onClick={() => handleVote(msg.id, 'no')}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${msg.votes?.no.includes(currentUser?.id || '')
                                                            ? 'bg-red-500 text-white shadow-md ring-2 ring-red-200'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600'
                                                            }`}
                                                    >
                                                        <X size={14} />
                                                        No {msg.votes?.no.length ? `(${msg.votes?.no.length})` : ''}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <span className="text-[10px] text-slate-400 mt-1 px-1">
                                    {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
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
                                            className="w-full p-2 rounded border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Location</label>
                                    <input
                                        id="proposal-location"
                                        type="text"
                                        defaultValue="Jeanne-Mance Park"
                                        className="w-full p-2 rounded border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="e.g. Court 1"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        if (!proposalDate || !proposalTime) return toast.error("Select date and time");
                                        const location = (document.getElementById('proposal-location') as HTMLInputElement)?.value || 'Court 1';
                                        sendMessage(
                                            `Proposed a lesson on ${proposalDate} at ${proposalTime} @ ${location}`,
                                            'proposal',
                                            { date: proposalDate, time: proposalTime, status: 'pending', location }
                                        );
                                    }}
                                    className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg hover:bg-emerald-700 text-sm shadow-md shadow-emerald-200"
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
        </div>
    );
};

export default ChatArea;
