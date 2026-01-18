import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Users } from 'lucide-react';
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp,
    setDoc,
    where,
    deleteDoc,
    arrayUnion
} from 'firebase/firestore';
import { onAuthStateChanged, signOut, deleteUser } from 'firebase/auth'; // Added deleteUser import
import { auth, db } from '../firebase';
import { User, Conversation } from '../types';

// Components
import Sidebar from './chat/Sidebar';
import ChatArea from './chat/ChatArea';
import Auth from './auth/Auth';
import NewChatModal from './chat/modals/NewChatModal';
import MembersModal from './chat/modals/MembersModal';
import ProfileModal from './chat/modals/ProfileModal';

const PlayerPortal = () => {
    // Auth State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Data State
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [publicChannels, setPublicChannels] = useState<Conversation[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [availableUsers, setAvailableUsers] = useState<User[]>([]);
    const [invitations, setInvitations] = useState<Conversation[]>([]);

    // UI State
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    // Auth Listener & User Sync
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                const userRef = doc(db, 'users', authUser.uid);
                await setDoc(userRef, {
                    username: authUser.displayName || 'Player',
                    email: authUser.email,
                    lastSeen: new Date().toISOString(),
                    isOnline: true,
                    avatar: authUser.photoURL || '',
                    role: 'user' // Default role
                }, { merge: true });

                const unsubUser = onSnapshot(userRef, (doc) => {
                    setCurrentUser({ id: doc.id, ...doc.data() } as User);
                    setLoading(false);
                });
                return () => unsubUser();
            } else {
                setCurrentUser(null);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // Fetch Data (Users, Conversations, Public Channels)
    useEffect(() => {
        if (!currentUser) return;

        // 1. Available Users
        const qUsers = query(collection(db, 'users'));
        const unsubUsers = onSnapshot(qUsers, (snapshot) => {
            const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
            setAvailableUsers(users);
        });

        // 2. Conversations
        const qConvos = query(
            collection(db, 'conversations'),
            where('participants', 'array-contains', currentUser.id)
        );
        const unsubConvos = onSnapshot(qConvos, (snapshot) => {
            const convos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation));
            // Filter out pending invitations
            const active = convos.filter(c => !c.pendingParticipants?.includes(currentUser.id) && c.type !== 'public');
            const invites = convos.filter(c => c.pendingParticipants?.includes(currentUser.id));
            setConversations(active);
            setInvitations(invites);
        });

        // 3. Public Channels
        const qPublic = query(
            collection(db, 'conversations'),
            where('type', '==', 'public')
        );
        const unsubPublic = onSnapshot(qPublic, (snapshot) => {
            const channels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation));
            setPublicChannels(channels);
        });

        return () => {
            unsubUsers();
            unsubConvos();
            unsubPublic();
        };
    }, [currentUser]);

    // Handlers
    const handleLogout = async () => {
        if (currentUser) {
            await updateDoc(doc(db, 'users', currentUser.id), { isOnline: false });
        }
        await signOut(auth);
    };

    const handleDeleteAccount = async () => {
        if (!currentUser || !auth.currentUser) return;
        try {
            await deleteDoc(doc(db, 'users', currentUser.id));
            await deleteUser(auth.currentUser);
            toast.success("Account deleted");
        } catch (error) {
            console.error("Delete account error:", error);
            toast.error("Failed to delete account");
        }
    };

    const handleCreateConversation = async (selectedUsers: string[], groupName?: string) => {
        if (!currentUser) return;

        // Check if DM exists
        if (selectedUsers.length === 1) {
            const existing = conversations.find(c =>
                c.type === 'dm' && c.participants.includes(selectedUsers[0])
            );
            if (existing) {
                setActiveConversationId(existing.id);
                return;
            }
        }

        const isGroup = selectedUsers.length > 1;
        const targetUser = availableUsers.find(u => u.id === selectedUsers[0]);

        const newConvoData = {
            type: isGroup ? 'group' : 'dm',
            participants: [currentUser.id, ...selectedUsers],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            // Only set name for groups
            // For DMs, we resolve name dynamically in UI
            ...(isGroup ? { name: groupName || 'Group Chat' } : {
                name: targetUser?.username || 'Chat'
            }),
            isOnline: false
        };

        const docRef = await addDoc(collection(db, 'conversations'), newConvoData);
        setActiveConversationId(docRef.id);
    };

    const handleAddMember = async (selectedUsers: string[]) => {
        if (!activeConversationId) return;
        try {
            const convoRef = doc(db, 'conversations', activeConversationId);
            await updateDoc(convoRef, {
                participants: arrayUnion(...selectedUsers)
            });
            toast.success("Members added");
        } catch (error) {
            toast.error("Failed to add members");
        }
    };

    const handleAcceptInvitation = async (id: string) => {
        if (!currentUser) return;
        try {
            const convoRef = doc(db, 'conversations', id);
            await updateDoc(convoRef, {
                pendingParticipants: conversations.find(c => c.id === id)?.pendingParticipants?.filter(p => p !== currentUser.id) || [],
                participants: arrayUnion(currentUser.id)
            });
            toast.success("Invitation accepted");
        } catch (error) {
            toast.error("Failed to accept");
        }
    };

    const handleDeclineInvitation = async (id: string) => {
        // Logic to remove pending? Or just remove self.
        // Actually updateDoc pendingParticipants arrayRemove
        // But need current list? No arrayRemove works.
        // But I'm accessing it via conversations state which might not have it if I'm not careful.
        // But I have the id.
        if (!currentUser) return;
        try {
            // For now just delete the conversation reference for me?
            // Actually if I decline, I am removed from pending.
            const convoRef = doc(db, 'conversations', id);
            // We need to implement arrayRemove properly
            // But simpler to just read and update for now or assume arrayRemove
            // Let's use arrayRemove which I haven't imported yet?
            // Ah I need to import arrayRemove. 
            // Wait, I imported arrayUnion.
            // I'll import arrayRemove to be safe.
            // Actually, the previous implementation didn't use arrayRemove.
            // It used filter.
            const convo = invitations.find(c => c.id === id);
            if (convo && convo.pendingParticipants) {
                const newPending = convo.pendingParticipants.filter(p => p !== currentUser.id);
                await updateDoc(convoRef, { pendingParticipants: newPending });
            }
            toast.info("Invitation declined");
        } catch (error) {
            toast.error("Failed to decline");
        }
    };

    const handleStartDM = (userId: string) => {
        handleCreateConversation([userId]);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin text-emerald-600"><Users /></div></div>;
    if (!currentUser) return <Auth />;

    // Derived State
    const activeConvo = conversations.find(c => c.id === activeConversationId) || publicChannels.find(c => c.id === activeConversationId);

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8 font-sans flex items-center justify-center">
            <div className="w-full max-w-[1400px] h-[85vh] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 flex ring-1 ring-slate-900/5 relative">
                {/* Sidebar Container: Hidden on mobile if chat active */}
                <div className={`
                    ${activeConversationId ? 'hidden md:flex' : 'flex'} 
                    w-full md:w-80 border-r border-slate-100 flex-col bg-slate-50/50 h-full
                `}>
                    <Sidebar
                        currentUser={currentUser}
                        conversations={conversations}
                        publicChannels={publicChannels}
                        activeConversationId={activeConversationId}
                        setActiveConversationId={setActiveConversationId}
                        availableUsers={availableUsers}
                        invitations={invitations}
                        onNewChat={() => setShowNewChatModal(true)}
                        onEditProfile={() => setShowProfileModal(true)}
                        handleLogout={handleLogout}
                        handleAcceptInvitation={handleAcceptInvitation}
                        handleDeclineInvitation={handleDeclineInvitation}
                        onStartDM={handleStartDM}
                    />
                </div>

                {/* Chat Area Container: Hidden on mobile if no chat active */}
                <div className={`
                    ${!activeConversationId ? 'hidden md:flex' : 'flex'} 
                    flex-1 flex-col bg-white h-full
                `}>
                    <ChatArea
                        currentUser={currentUser}
                        activeConversationId={activeConversationId}
                        activeConvo={activeConvo}
                        onAddMember={() => setShowAddMemberModal(true)}
                        onShowMembers={() => setShowMembersModal(true)}
                        onBack={() => setActiveConversationId(null)}
                    />
                </div>
            </div>

            {/* Modals */}
            <NewChatModal
                isOpen={showNewChatModal}
                onClose={() => setShowNewChatModal(false)}
                availableUsers={availableUsers}
                currentUser={currentUser}
                createConversation={handleCreateConversation}
                mode="create"
            />

            {showAddMemberModal && activeConvo && (
                <NewChatModal
                    isOpen={showAddMemberModal}
                    onClose={() => setShowAddMemberModal(false)}
                    availableUsers={availableUsers}
                    currentUser={currentUser}
                    createConversation={(users) => handleAddMember(users)}
                    mode="add"
                    activeConvo={activeConvo}
                />
            )}

            {showMembersModal && activeConvo && (
                <MembersModal
                    activeConvo={activeConvo}
                    currentUser={currentUser}
                    availableUsers={availableUsers}
                    onClose={() => setShowMembersModal(false)}
                />
            )}

            {showProfileModal && (
                <ProfileModal
                    currentUser={currentUser}
                    onClose={() => setShowProfileModal(false)}
                    handleDeleteAccount={handleDeleteAccount}
                />
            )}
        </div>
    );
};

export default PlayerPortal;
