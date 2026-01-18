import { motion } from 'framer-motion';
import { X, Users } from 'lucide-react';
import { User, Conversation } from '../../../types';
import Avatar from '../../ui/Avatar';

interface MembersModalProps {
    activeConvo: Conversation;
    currentUser: User;
    availableUsers: User[];
    onClose: () => void;
}

const MembersModal = ({ activeConvo, currentUser, availableUsers, onClose }: MembersModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]"
            >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                        <Users size={18} className="text-emerald-600" />
                        Group Members
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                    <div className="space-y-3">
                        {/* Current User */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar user={currentUser} size="sm" showStatus />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">{currentUser.username} <span className="text-slate-400 font-normal">(You)</span></h4>
                                <p className="text-xs text-slate-500">{currentUser.level}</p>
                            </div>
                        </div>

                        {/* Other Participants */}
                        {activeConvo.participants
                            .filter(id => id !== currentUser.id)
                            .map(participantId => {
                                const user = availableUsers.find(u => u.id === participantId);
                                if (!user) return null;
                                return (
                                    <div key={participantId} className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar user={user} size="sm" showStatus />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">{user.username}</h4>
                                            <p className="text-xs text-slate-500">{user.level}</p>
                                        </div>
                                    </div>
                                );
                            })}

                        {/* Pending Invites */}
                        {activeConvo.pendingParticipants?.map(pendingId => {
                            const user = availableUsers.find(u => u.id === pendingId);
                            if (!user) return null;
                            return (
                                <div key={pendingId} className="flex items-center gap-3 opacity-60">
                                    <div className="relative">
                                        <Avatar user={user} size="sm" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">{user.username}</h4>
                                        <p className="text-xs text-slate-500 italic">Invited..</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MembersModal;
