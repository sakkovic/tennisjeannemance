import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera } from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { User } from '../../../types';
import Avatar from '../../ui/Avatar';
import { toast } from 'sonner';

interface ProfileModalProps {
    currentUser: User;
    onClose: () => void;
    handleDeleteAccount: () => void;
}

const ProfileModal = ({ currentUser, onClose, handleDeleteAccount }: ProfileModalProps) => {
    const [editForm, setEditForm] = useState({
        username: currentUser.username,
        level: currentUser.level || 'Beginner',
        avatar: currentUser.avatar || ''
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, 'users', currentUser.id), {
                username: editForm.username,
                level: editForm.level,
                avatar: editForm.avatar
            });
            toast.success("Profile updated");
            onClose();
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Edit Profile</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="flex justify-center mb-6">
                            <div className="relative group cursor-pointer">
                                <Avatar user={{ ...currentUser, avatar: editForm.avatar }} size="xl" />
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={24} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Username</label>
                            <input
                                type="text"
                                value={editForm.username}
                                onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Level</label>
                            <select
                                value={editForm.level}
                                onChange={(e) => setEditForm(prev => ({ ...prev, level: e.target.value }))}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Coach">Coach</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Avatar URL</label>
                            <input
                                type="text"
                                value={editForm.avatar}
                                onChange={(e) => setEditForm(prev => ({ ...prev, avatar: e.target.value }))}
                                placeholder="https://..."
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="pt-4 space-y-4">
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors">
                                Save Changes
                            </button>

                            <div className="flex justify-center border-t border-slate-100 pt-4">
                                {showDeleteConfirm ? (
                                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                                        <span className="text-sm font-bold text-red-600">Are you sure?</span>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleDeleteAccount}
                                                className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700"
                                            >
                                                Yes, Delete
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="px-3 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="text-red-500 text-xs font-bold hover:text-red-700 hover:underline"
                                    >
                                        Delete Account
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileModal;
