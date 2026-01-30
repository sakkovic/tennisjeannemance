import { useState } from 'react';
import { Search, Users, Mail, Plus, Edit2, LogOut, MessageSquare, Shield, Calendar } from 'lucide-react';
import { Link } from 'wouter';
import { User, Conversation } from '../../types';
import Avatar from '../ui/Avatar';
import ProposalsModal from './modals/ProposalsModal';

interface SidebarProps {
    currentUser: User;
    conversations: Conversation[];
    publicChannels: Conversation[];
    activeConversationId: string | null;
    setActiveConversationId: (id: string) => void;
    availableUsers: User[];
    invitations: Conversation[];
    onNewChat: () => void;
    onEditProfile: () => void;
    handleLogout: () => void;
    handleAcceptInvitation: (id: string) => void;
    handleDeclineInvitation: (id: string) => void;
    onStartDM: (userId: string) => void;
}

const Sidebar = ({
    currentUser,
    conversations,
    publicChannels,
    activeConversationId,
    setActiveConversationId,
    availableUsers,
    invitations,
    onNewChat,
    onEditProfile,
    handleLogout,
    handleAcceptInvitation,
    handleDeclineInvitation,
    onStartDM
}: SidebarProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [chatFilter, setChatFilter] = useState<'all' | 'channels' | 'groups'>('all');
    const [showProposals, setShowProposals] = useState(false);

    const isUnread = (convo: Conversation) => {
        if (!convo.lastMessage) return false;
        if (activeConversationId === convo.id) return false;
        if (convo.lastMessage.sender === currentUser.username) return false;

        const lastRead = convo.lastRead?.[currentUser.id];
        if (!lastRead) return true; // Never read

        // Safety check for timestamps
        const msgTime = convo.lastMessage.timestamp?.seconds || 0;
        const readTime = lastRead.seconds || 0;
        return msgTime > readTime;
    };

    return (
        <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50 h-full">
            {/* My Profile */}
            <div className="p-4 bg-white border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={onEditProfile}>
                    <Avatar user={currentUser} />
                    <div>
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            {currentUser.username}
                            {(currentUser.role === 'admin' || currentUser.email === 'anis.federe@gmail.com') && (
                                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                                    Admin
                                </span>
                            )}
                        </h3>
                        <p className="text-emerald-600 text-xs font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Online
                        </p>
                    </div>
                </div>
                <button onClick={onEditProfile} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors" title="Edit Profile">
                    <Edit2 size={18} />
                </button>
                {(currentUser.role === 'admin' || currentUser.email === 'anis.federe@gmail.com') && (
                    <Link
                        to="/admin"
                        className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                        title="Admin Panel"
                    >
                        <Shield size={18} />
                    </Link>
                )}
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                    <LogOut size={18} />
                </button>
            </div>

            {/* New Chat Button */}
            <div className="p-4 space-y-2">
                <button
                    onClick={onNewChat}
                    className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={18} /> New Chat
                </button>

                <button
                    onClick={() => setShowProposals(true)}
                    className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                    <Calendar size={18} /> My Schedule
                </button>

                {/* Create Channel Button - Admin Only */}
                {(currentUser.role === 'admin' || currentUser.email === 'anis.federe@gmail.com') && (
                    <button
                        onClick={() => {
                            const channelName = prompt('Enter channel name:');
                            if (channelName && channelName.trim()) {
                                // Create channel logic will be handled
                                import('firebase/firestore').then(({ addDoc, collection, serverTimestamp }) => {
                                    import('../../firebase').then(({ db }) => {
                                        addDoc(collection(db, 'conversations'), {
                                            type: 'public',
                                            name: channelName.trim(),
                                            participants: [],
                                            createdAt: serverTimestamp(),
                                            updatedAt: serverTimestamp()
                                        }).then(() => {
                                            import('sonner').then(({ toast }) => {
                                                toast.success(`Channel "${channelName}" created!`);
                                            });
                                        });
                                    });
                                });
                            }
                        }}
                        className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={18} /> Create Channel
                    </button>
                )}
            </div>

            {/* Sidebar Search */}
            <div className="px-4 pb-2">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search Messenger"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
                    />
                </div>
                <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setChatFilter('all')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${chatFilter === 'all' ? 'bg-emerald-100/80 text-emerald-800' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setChatFilter('channels')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${chatFilter === 'channels' ? 'bg-emerald-100/80 text-emerald-800' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                    >
                        Channels
                    </button>
                    <button
                        onClick={() => setChatFilter('groups')}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${chatFilter === 'groups' ? 'bg-emerald-100/80 text-emerald-800' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                    >
                        Groups
                    </button>
                </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto no-scrollbar">

                {/* Pending Invitations Section */}
                {invitations.length > 0 && (
                    <div className="mb-4">
                        <div className="px-4 py-2 text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                            <Mail size={12} /> Invitations ({invitations.length})
                        </div>
                        {invitations.map(invite => (
                            <div key={invite.id} className="px-4 py-2 border-b border-slate-50 last:border-0 bg-amber-50/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                        {invite.type === 'group' ? <Users size={14} /> : invite.name?.[0]}
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 truncate">{invite.name || 'Group Chat'}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAcceptInvitation(invite.id)}
                                        className="flex-1 bg-emerald-500 text-white text-xs font-bold py-1 rounded hover:bg-emerald-600 transition-colors"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleDeclineInvitation(invite.id)}
                                        className="flex-1 bg-slate-200 text-slate-600 text-xs font-bold py-1 rounded hover:bg-slate-300 transition-colors"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Channels Section - Only show when filter is 'all' or 'channels' */}
                {(chatFilter === 'all' || chatFilter === 'channels') && publicChannels.length > 0 && (
                    <>
                        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                            # Channels
                        </div>
                        {publicChannels
                            .filter(channel => channel.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(channel => (
                                <button
                                    key={channel.id}
                                    onClick={() => setActiveConversationId(channel.id)}
                                    className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left ${activeConversationId === channel.id ? 'bg-emerald-50/50' : ''
                                        }`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold flex-shrink-0">#</div>
                                    <div>
                                        <h4 className={`text-sm ${activeConversationId === channel.id ? 'font-bold text-emerald-900' : 'font-medium text-slate-700'}`}>{channel.name}</h4>
                                    </div>
                                </button>
                            ))}
                    </>
                )}

                {/* Groups Section - Only show when filter is 'all' or 'groups' */}
                {(chatFilter === 'all' || chatFilter === 'groups') && (
                    <>
                        {conversations.filter(c => c.type === 'group').length > 0 && (
                            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 flex items-center gap-2">
                                <Users size={12} /> Groups
                            </div>
                        )}
                        {conversations
                            .filter(convo => convo.type === 'group')
                            .filter(convo => convo.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(convo => {
                                const unread = isUnread(convo);
                                return (
                                    <button
                                        key={convo.id}
                                        onClick={() => setActiveConversationId(convo.id)}
                                        className={`w-full p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 ${activeConversationId === convo.id ? 'bg-emerald-50/50' : ''
                                            }`}
                                    >
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm bg-blue-500">
                                                <Users size={16} />
                                            </div>
                                            {unread && (
                                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h4 className={`text-sm truncate ${activeConversationId === convo.id ? 'font-bold text-emerald-900' : unread ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                                    {convo.name || 'Group Chat'}
                                                </h4>
                                                {convo.lastMessage && (
                                                    <span className={`text-[10px] whitespace-nowrap ml-2 ${unread ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                                                        {convo.lastMessage.timestamp?.toDate ? convo.lastMessage.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-xs truncate ${activeConversationId === convo.id ? 'text-emerald-700/80' : unread ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                                                {convo.lastMessage ? (
                                                    <span><span className="font-medium">{convo.lastMessage.sender === currentUser.username ? 'You' : convo.lastMessage.sender}:</span> {convo.lastMessage.text}</span>
                                                ) : (
                                                    <span className="italic">No messages yet</span>
                                                )}
                                            </p>
                                        </div>
                                        {unread && <div className="w-2 h-2 rounded-full bg-blue-500 self-center ml-1"></div>}
                                    </button>
                                );
                            })}
                    </>
                )}

                {/* All Players Section - DMs + Available Users without DMs */}
                {(chatFilter === 'all') && (
                    <>
                        {/* DM Conversations */}
                        {conversations.filter(c => c.type === 'dm').length > 0 && (
                            <>
                                <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 flex items-center gap-2">
                                    <Users size={12} /> All Players
                                </div>
                                {conversations
                                    .filter(convo => convo.type === 'dm')
                                    .filter(convo => {
                                        const otherParticipantId = convo.participants?.find(id => id !== currentUser.id);
                                        const otherUser = availableUsers.find(u => u.id === otherParticipantId);
                                        return otherUser?.username.toLowerCase().includes(searchTerm.toLowerCase());
                                    })
                                    .map(convo => {
                                        const unread = isUnread(convo);
                                        const otherParticipantId = convo.participants?.find(id => id !== currentUser.id);
                                        const otherUser = availableUsers.find(u => u.id === otherParticipantId);

                                        return (
                                            <button
                                                key={convo.id}
                                                onClick={() => setActiveConversationId(convo.id)}
                                                className={`w-full p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 ${activeConversationId === convo.id ? 'bg-emerald-50/50' : ''
                                                    }`}
                                            >
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm bg-gradient-to-br from-slate-400 to-slate-500">
                                                        {otherUser?.username?.[0].toUpperCase() || '?'}
                                                    </div>
                                                    {otherUser?.isOnline && (
                                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                                                    )}
                                                    {unread && (
                                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-baseline mb-0.5">
                                                        <h4 className={`text-sm truncate ${activeConversationId === convo.id ? 'font-bold text-emerald-900' : unread ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                                            {otherUser?.username || 'Unknown User'}
                                                        </h4>
                                                        {convo.lastMessage && (
                                                            <span className={`text-[10px] whitespace-nowrap ml-2 ${unread ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                                                                {convo.lastMessage.timestamp?.toDate ? convo.lastMessage.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className={`text-xs truncate ${activeConversationId === convo.id ? 'text-emerald-700/80' : unread ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                                                        {convo.lastMessage ? (
                                                            <span><span className="font-medium">{convo.lastMessage.sender === currentUser.username ? 'You' : convo.lastMessage.sender}:</span> {convo.lastMessage.text}</span>
                                                        ) : (
                                                            <span className="italic">No messages yet</span>
                                                        )}
                                                    </p>
                                                </div>
                                                {unread && <div className="w-2 h-2 rounded-full bg-blue-500 self-center ml-1"></div>}
                                            </button>
                                        );
                                    })}
                            </>
                        )}

                        {/* Players without DM conversations - Only show if no conversations exist yet or there are users without DMs */}
                        {(() => {
                            // Get IDs of users who already have DM conversations
                            const usersWithDMs = new Set(
                                conversations
                                    .filter(c => c.type === 'dm')
                                    .flatMap(c => c.participants)
                                    .filter(id => id !== currentUser.id)
                            );

                            // Filter users who don't have DM conversations yet and match search
                            const usersWithoutDMs = availableUsers
                                .filter(user => user.id !== currentUser.id && !usersWithDMs.has(user.id))
                                .filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()));

                            if (usersWithoutDMs.length === 0) return null;

                            return (
                                <>
                                    {conversations.filter(c => c.type === 'dm').length === 0 && (
                                        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 flex items-center gap-2">
                                            <Users size={12} /> All Players
                                        </div>
                                    )}
                                    {usersWithoutDMs.map(user => (
                                        <button
                                            key={user.id}
                                            onClick={() => onStartDM(user.id)}
                                            className="w-full px-4 py-2 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
                                        >
                                            <div className="relative">
                                                <Avatar user={user} size="sm" showStatus />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-slate-700 truncate">{user.username}</h4>
                                                <p className="text-[10px] text-slate-400 truncate">
                                                    {user.email === 'anis.federe@gmail.com' ? 'Coach' : (user.level || 'Player')}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </>
                            );
                        })()}
                    </>
                )}

                {/* Empty State */}
                {conversations.length === 0 && publicChannels.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare size={24} className="text-slate-400" />
                        </div>
                        <p>No messages found.</p>
                        <button onClick={onNewChat} className="text-emerald-600 font-bold hover:underline mt-2">Start a chat</button>
                    </div>
                )}
            </div>

            <ProposalsModal
                isOpen={showProposals}
                onClose={() => setShowProposals(false)}
                currentUser={currentUser}
                conversations={conversations}
                onNavigateToChat={setActiveConversationId}
            />
        </div>
    );
};

export default Sidebar;
