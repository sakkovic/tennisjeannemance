import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, X, Users, Check } from 'lucide-react';
import { User, Conversation } from '../../../types';
import Avatar from '../../ui/Avatar';
import { toast } from 'sonner';

interface NewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableUsers: User[];
    currentUser: User;
    createConversation: (selectedUsers: string[], groupName?: string) => Promise<void>;
    mode: 'create' | 'add';
    activeConvo?: Conversation; // Only needed for 'add' mode to filter existing members
}

const NewChatModal = ({
    isOpen,
    onClose,
    availableUsers,
    currentUser,
    createConversation,
    mode,
    activeConvo
}: NewChatModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('All');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [groupName, setGroupName] = useState('');

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setSelectedUsers([]);
            setSearchTerm('');
            setLevelFilter('All');
            setGroupName('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleToggleUser = (userId: string) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(prev => prev.filter(id => id !== userId));
        } else {
            setSelectedUsers(prev => [...prev, userId]);
        }
    };

    const handleSubmit = () => {
        if (selectedUsers.length === 0) return;
        createConversation(selectedUsers, groupName);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]"
            >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">
                        {mode === 'add' ? 'Add Members' : 'New Chat'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Group Name Input (Only for new group creation) */}
                {mode === 'create' && selectedUsers.length > 1 && (
                    <div className="px-4 pt-4 animate-in fade-in slide-in-from-top-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Group Name (Optional)</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="e.g. Sunday Tennis Squad"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                )}

                <div className="p-4 overflow-y-auto flex-1">
                    <div className="flex gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search players..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-600 font-medium"
                        >
                            <option value="All">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Available Players</p>
                        {availableUsers
                            .filter(user => {
                                // Filter out current user
                                if (user.id === currentUser.id) return false;

                                // If adding members, filter out existing participants and pending invites
                                if (mode === 'add' && activeConvo) {
                                    return !activeConvo.participants.includes(user.id) && !activeConvo.pendingParticipants?.includes(user.id);
                                }
                                return true;
                            })
                            .filter(user => {
                                const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
                                const matchesLevel = levelFilter === 'All' || user.level?.includes(levelFilter.split(' ')[0]); // Handle "Advanced" vs "Advanced +" if needed
                                return matchesSearch && matchesLevel;
                            })
                            .map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => handleToggleUser(user.id)}
                                    className={`w-full p-2 rounded-xl flex items-center gap-3 transition-all ${selectedUsers.includes(user.id) ? 'bg-emerald-50 ring-1 ring-emerald-500' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="relative">
                                        <Avatar user={user} />
                                        {selectedUsers.includes(user.id) && (
                                            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                                                <Check size={10} strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-left flex-1">
                                        <h4 className={`text-sm ${selectedUsers.includes(user.id) ? 'font-bold text-emerald-900' : 'font-medium text-slate-900'}`}>{user.username}</h4>
                                        <p className="text-xs text-slate-500">{user.level}</p>
                                    </div>
                                </button>
                            ))}
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={selectedUsers.length === 0}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                    >
                        {mode === 'add' ? 'Add Selected' : 'Start Chat'}
                        <Send size={16} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NewChatModal;
