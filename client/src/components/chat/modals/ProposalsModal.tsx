import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, MapPin, MessageSquare, ArrowRight } from 'lucide-react';
import { collectionGroup, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase';
import { LessonProposal, User, Conversation, Message } from '../../../types';

interface ProposalsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: User;
    conversations: Conversation[];
    onNavigateToChat: (conversationId: string) => void;
}

const ProposalsModal = ({ isOpen, onClose, currentUser, conversations, onNavigateToChat }: ProposalsModalProps) => {
    const [proposals, setProposals] = useState<LessonProposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !currentUser) return;

        // Query ALL proposal messages across the database (Collection Group Query)
        // This ensures we catch proposals created before the new collection was added.
        // We will filter client-side to only show proposals for conversations the user is part of.
        const q = query(
            collectionGroup(db, 'messages'),
            where('type', '==', 'proposal')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const myConversationIds = new Set(conversations.map(c => c.id));

            const fetchedProposals: LessonProposal[] = [];

            snapshot.docs.forEach(doc => {
                const msgData = doc.data() as Message;

                // Client-side Security/Relevance Filter
                if (myConversationIds.has(msgData.conversationId)) {
                    // Find conversation name
                    const convo = conversations.find(c => c.id === msgData.conversationId);
                    let convoName = convo?.name || 'Chat';

                    if (convo?.type === 'dm') {
                        const otherId = convo.participants.find(id => id !== currentUser.id);
                        // If we had availableUsers passed here we could look up name, 
                        // but for now let's use what we have or generic.
                        // Actually, Sidebar passes conversations which might have updated metadata?
                        // Sidebar has availableUsers but doesn't pass it.
                        // We can fallback to "Private Chat" or try to use msg sender if not me?
                        // Displaying "Private Chat" or just the sender's proposal is fine.
                        convoName = "Private Chat";
                    }

                    if (msgData.proposal) {
                        fetchedProposals.push({
                            id: doc.id,
                            conversationId: msgData.conversationId,
                            conversationName: convoName,
                            proposerId: msgData.senderId,
                            proposerName: msgData.senderName,
                            date: msgData.proposal.date,
                            time: msgData.proposal.time,
                            location: msgData.proposal.location,
                            status: msgData.proposal.status || 'pending', // Fallback for old data without status?
                            participants: convo?.participants || [],
                            createdAt: msgData.timestamp
                        } as LessonProposal);
                    }
                }
            });

            // Client-side sort by date/time
            fetchedProposals.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateA.getTime() - dateB.getTime();
            });

            setProposals(fetchedProposals);
            setLoading(false);
            setError(null);
        }, (err) => {
            console.error("Proposals query failed:", err);
            setError("Failed to load proposals. Note: 'Collection Group' queries require a Firestore Index on the 'type' field.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isOpen, currentUser, conversations]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]"
            >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-emerald-50/50">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Calendar className="text-emerald-600" size={20} />
                        Lesson Proposals (All)
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loading ? (
                        <div className="text-center py-8 text-slate-400">Loading proposals...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500 font-bold px-4">
                            {error}
                        </div>
                    ) : proposals.length === 0 ? (
                        <div className="text-center py-12 flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                <Calendar size={32} className="text-slate-300" />
                            </div>
                            <h4 className="text-slate-900 font-bold mb-1">No lessons proposed</h4>
                            <p className="text-slate-500 text-sm">Proposals from your chats will appear here.</p>
                        </div>
                    ) : (
                        proposals.map((proposal) => {
                            const isPast = new Date(`${proposal.date}T${proposal.time}`) < new Date();
                            const isPending = proposal.status === 'pending';
                            const statusColor = isPast ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                proposal.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    proposal.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                        'bg-amber-50 text-amber-700 border-amber-100';

                            return (
                                <div
                                    key={proposal.id}
                                    className={`relative p-4 rounded-xl border-2 transition-all ${statusColor} ${!isPast ? 'hover:shadow-md' : 'opacity-75'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-base">{proposal.conversationName}</h4>
                                            <p className="text-xs font-semibold opacity-75">Proposed by {proposal.proposerName}</p>
                                        </div>
                                        <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-white/50 border border-black/5`}>
                                            {isPast ? 'Expired' : proposal.status}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="opacity-60" />
                                            <span className="font-bold text-sm">{proposal.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="opacity-60" />
                                            <span className="font-bold text-sm">{proposal.time}</span>
                                        </div>
                                        <div className="col-span-2 flex items-center gap-2">
                                            <MapPin size={14} className="opacity-60" />
                                            <span className="text-sm truncate">{proposal.location}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            onNavigateToChat(proposal.conversationId);
                                            onClose();
                                        }}
                                        className="w-full bg-white/80 hover:bg-white border border-black/5 text-slate-700 font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                                    >
                                        Go to Discussion
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ProposalsModal;
