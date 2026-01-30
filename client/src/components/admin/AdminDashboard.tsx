import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
    Users,
    MessageSquare,
    Trash2,
    Edit2,
    Shield,
    ArrowLeft,
    Search,
    AlertTriangle,
    X,
    Calendar
} from 'lucide-react';
import {
    collection,
    query,
    onSnapshot,
    deleteDoc,
    doc,
    where,
    getDocs,
    collectionGroup,
    orderBy
} from 'firebase/firestore';
import { db } from '../../firebase';
import { User, Conversation, Message } from '../../types';
import { toast } from 'sonner';
import Avatar from '../ui/Avatar';

const AdminDashboard = () => {
    const [, setLocation] = useLocation();
    const [activeTab, setActiveTab] = useState<'users' | 'channels' | 'groups' | 'proposals'>('users');
    const [users, setUsers] = useState<User[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [proposals, setProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit State
    const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [viewingParticipants, setViewingParticipants] = useState<Conversation | null>(null);

    // Check Admin Access (Client-side protection)
    // Note: Real security requires Firestore Rules
    const checkAdmin = () => {
        const storedUser = localStorage.getItem('tennis-user-cache'); // Fallback or context
        // ... (existing check)
    };

    useEffect(() => {
        const qUsers = query(collection(db, 'users'));
        const unsubUsers = onSnapshot(qUsers, (snapshot) => {
            setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as User)));
        });

        const qConvos = query(collection(db, 'conversations'));
        const unsubConvos = onSnapshot(qConvos, (snapshot) => {
            setConversations(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Conversation)));
        });

        // Fetch All Proposals (Global)
        const qProposals = query(
            collectionGroup(db, 'messages'),
            where('type', '==', 'proposal')
            // Add orderBy if index exists, else rely on client sort or natural order
        );
        const unsubProposals = onSnapshot(qProposals, (snapshot) => {
            const fetchedProps = snapshot.docs.map(d => ({
                id: d.id,
                ...d.data() as Message
            }));
            // Sort by creation time (desc)
            fetchedProps.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
            setProposals(fetchedProps);
            setLoading(false);
        }, (err) => {
            console.error("Admin proposals fetch failed:", err);
            toast.error("Failed to load proposals (Check Console/Indexes)");
            setLoading(false);
        });

        return () => {
            unsubUsers();
            unsubConvos();
            unsubProposals();
        };
    }, []);

    const handleDeleteUser = async (userId: string, username: string) => {
        if (!confirm(`Are you sure you want to delete user "${username}" ? This cannot be undone.`)) return;

        try {
            await deleteDoc(doc(db, 'users', userId));
            toast.success(`User ${username} deleted`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete user");
        }
    };

    const handleDeleteChannel = async (conversationId: string, conversationName: string) => {
        if (!confirm(`Are you sure you want to delete "${conversationName}" ? Messages will be lost.`)) return;

        try {
            await deleteDoc(doc(db, 'conversations', conversationId));
            toast.success("Conversation deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete conversation");
        }
    };

    const startEditing = (conversation: Conversation) => {
        setEditingChannelId(conversation.id);
        setEditName(conversation.name || '');
    };

    const handleSaveEdit = async (conversationId: string) => {
        if (!editName.trim()) return toast.error("Name cannot be empty");

        try {
            const { updateDoc } = await import('firebase/firestore'); // Dynamic import to solve missing import
            await updateDoc(doc(db, 'conversations', conversationId), {
                name: editName.trim()
            });
            toast.success("Name updated");
            setEditingChannelId(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update name. Check permissions.");
        }
    };

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const publicChannels = conversations.filter(c =>
        c.type === 'public' &&
        (c.name || 'Chat').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupChats = conversations.filter(c =>
        c.type === 'group' &&
        (c.name || 'Group').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper to get list based on tab
    const getActiveList = () => {
        if (activeTab === 'channels') return publicChannels;
        if (activeTab === 'groups') return groupChats;
        return [];
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setLocation('/portal')}
                            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Shield className="text-emerald-400" />
                            Admin Dashboard
                        </h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto w-full p-6">

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 sm:gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all text-sm sm:text-base ${activeTab === 'users'
                            ? 'bg-white text-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                            : 'bg-white/50 text-slate-500 hover:bg-white hover:text-slate-700'
                            }`}
                    >
                        <Users size={20} />
                        <span className="hidden xs:inline">Manage</span> Users
                        <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                            {users.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('channels')}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all text-sm sm:text-base ${activeTab === 'channels'
                            ? 'bg-white text-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                            : 'bg-white/50 text-slate-500 hover:bg-white hover:text-slate-700'
                            }`}
                    >
                        <span className="text-lg font-bold">#</span>
                        <span className="hidden xs:inline">Manage</span> Channels
                        <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                            {conversations.filter(c => c.type === 'public').length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('groups')}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all text-sm sm:text-base ${activeTab === 'groups'
                            ? 'bg-white text-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                            : 'bg-white/50 text-slate-500 hover:bg-white hover:text-slate-700'
                            }`}
                    >
                        <Users size={20} />
                        <span className="hidden xs:inline">Manage</span> Groups
                        <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                            {conversations.filter(c => c.type === 'group').length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('proposals')}
                        className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all text-sm sm:text-base ${activeTab === 'proposals'
                            ? 'bg-white text-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                            : 'bg-white/50 text-slate-500 hover:bg-white hover:text-slate-700'
                            }`}
                    >
                        <Calendar size={20} />
                        <span className="hidden xs:inline">All</span> Proposals
                        <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                            {proposals.length}
                        </span>
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    />
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {activeTab === 'users' ? (
                        <div className="divide-y divide-slate-100">
                            {/* Desktop Table Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50 font-bold text-xs text-slate-500 uppercase tracking-wider">
                                <div className="col-span-4">User</div>
                                <div className="col-span-4">Email</div>
                                <div className="col-span-2">Role</div>
                                <div className="col-span-2 text-right">Actions</div>
                            </div>
                            {filteredUsers.map(user => (
                                <div key={user.id}>
                                    {/* Desktop Table Row */}
                                    <div className="hidden md:grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors">
                                        <div className="col-span-4 flex items-center gap-3">
                                            <Avatar user={user} size="sm" />
                                            <span className="font-bold text-slate-700">
                                                {user.username}
                                                {user.email === 'anis.federe@gmail.com' && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">YOU</span>}
                                            </span>
                                        </div>
                                        <div className="col-span-4 text-sm text-slate-500 truncate">
                                            {user.email}
                                        </div>
                                        <div className="col-span-2">
                                            <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${user.email === 'anis.federe@gmail.com'
                                                ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-500/20'
                                                : user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {user.email === 'anis.federe@gmail.com' ? 'COACH' : (user.role || 'user')}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            {user.email !== 'anis.federe@gmail.com' && (
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.username)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {/* Mobile Card */}
                                    <div className="md:hidden p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <Avatar user={user} size="sm" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className="font-bold text-slate-700">
                                                        {user.username}
                                                        {user.email === 'anis.federe@gmail.com' && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">YOU</span>}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${user.email === 'anis.federe@gmail.com'
                                                        ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-500/20'
                                                        : user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        {user.email === 'anis.federe@gmail.com' ? 'COACH' : (user.role || 'user')}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-slate-500 truncate mb-2">{user.email}</div>
                                                {user.email !== 'anis.federe@gmail.com' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id, user.username)}
                                                        className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete User
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {/* Desktop Table Header */}
                            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50 font-bold text-xs text-slate-500 uppercase tracking-wider">
                                <div className="col-span-5">{activeTab === 'channels' ? 'Channel Name' : 'Group Name'}</div>
                                <div className="col-span-2">Type</div>
                                <div className="col-span-3">Participants</div>
                                <div className="col-span-2 text-right">Actions</div>
                            </div>
                            {getActiveList().map(conv => (
                                <div key={conv.id}>
                                    {/* Desktop Table Row */}
                                    <div className="hidden md:grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors">
                                        <div className="col-span-5 flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${conv.type === 'group' ? 'bg-blue-500' :
                                                conv.type === 'public' ? 'bg-slate-700' : 'bg-emerald-500'
                                                }`}>
                                                {conv.type === 'public' ? '#' : (conv.name?.[0] || '?')}
                                            </div>
                                            {/* Inline Edit or Display */}
                                            {editingChannelId === conv.id ? (
                                                <div className="flex items-center gap-2 flex-1">
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border border-emerald-500 rounded focus:outline-none"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleSaveEdit(conv.id)} className="text-emerald-600 hover:text-emerald-700 font-bold text-xs">Save</button>
                                                    <button onClick={() => setEditingChannelId(null)} className="text-slate-400 hover:text-slate-600 text-xs">Cancel</button>
                                                </div>
                                            ) : (
                                                <span className="font-bold text-slate-700 truncate">{conv.name || 'Untitled Chat'}</span>
                                            )}
                                        </div>
                                        <div className="col-span-2">
                                            <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${conv.type === 'public' ? 'bg-slate-200 text-slate-700' :
                                                conv.type === 'group' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {conv.type}
                                            </span>
                                        </div>
                                        <div className="col-span-3 text-sm text-slate-500">
                                            <button
                                                onClick={() => setViewingParticipants(conv)}
                                                className="hover:text-emerald-600 hover:underline flex items-center gap-1"
                                            >
                                                <Users size={14} />
                                                {conv.participants?.length || 0} members
                                            </button>
                                        </div>
                                        <div className="col-span-2 text-right flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => startEditing(conv)}
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Edit Name"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteChannel(conv.id, conv.name || 'Chat')}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    {/* Mobile Card */}
                                    <div className="md:hidden p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 ${conv.type === 'group' ? 'bg-blue-500' :
                                                conv.type === 'public' ? 'bg-slate-700' : 'bg-emerald-500'
                                                }`}>
                                                {conv.type === 'public' ? '#' : (conv.name?.[0] || '?')}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {editingChannelId === conv.id ? (
                                                    <div className="flex flex-col gap-2 mb-2">
                                                        <input
                                                            type="text"
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                            className="w-full px-2 py-1 text-sm border border-emerald-500 rounded focus:outline-none"
                                                            autoFocus
                                                        />
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleSaveEdit(conv.id)} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold">Save</button>
                                                            <button onClick={() => setEditingChannelId(null)} className="px-3 py-1 bg-slate-200 text-slate-600 rounded text-xs">Cancel</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="font-bold text-slate-700 mb-1">{conv.name || 'Untitled Chat'}</div>
                                                )}
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${conv.type === 'public' ? 'bg-slate-200 text-slate-700' :
                                                        conv.type === 'group' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                        {conv.type}
                                                    </span>
                                                    <button
                                                        onClick={() => setViewingParticipants(conv)}
                                                        className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1"
                                                    >
                                                        <Users size={12} />
                                                        {conv.participants?.length || 0} members
                                                    </button>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => startEditing(conv)}
                                                        className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                                                    >
                                                        <Edit2 size={14} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteChannel(conv.id, conv.name || 'Chat')}
                                                        className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'proposals' && (
                        <div className="divide-y divide-slate-100">
                            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50 font-bold text-xs text-slate-500 uppercase tracking-wider">
                                <div className="col-span-4">Proposed By</div>
                                <div className="col-span-4">Conversation</div>
                                <div className="col-span-2">Date/Time</div>
                                <div className="col-span-2 text-right">Status</div>
                            </div>
                            {proposals
                                .filter(p =>
                                    p.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    p.proposal?.location?.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map(prop => {
                                    const convo = conversations.find(c => c.id === prop.conversationId);
                                    let convoName = convo?.name || 'Private Chat';
                                    if (convo?.type === 'dm') {
                                        // Try to find the other user's name
                                        const otherId = convo.participants.find(id => id !== prop.senderId);
                                        const otherUser = users.find(u => u.id === otherId);
                                        convoName = otherUser ? `Chat with ${otherUser.username}` : 'Private Chat';
                                    }
                                    return (
                                        <div key={prop.id} className="p-4 hover:bg-slate-50 transition-colors">
                                            <div className="grid md:grid-cols-12 gap-4 items-center">
                                                <div className="col-span-4 font-bold text-slate-700">
                                                    {prop.senderName}
                                                </div>
                                                <div className="col-span-4 text-sm text-slate-500 truncate">
                                                    {convoName}
                                                </div>
                                                <div className="col-span-2 text-sm font-medium">
                                                    {prop.proposal?.date} <span className="opacity-50">at</span> {prop.proposal?.time}
                                                </div>
                                                <div className="col-span-2 text-right">
                                                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${prop.proposal?.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                                                            prop.proposal?.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                                'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {prop.proposal?.status || 'pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}

                    {/* Empty States */}
                    {((activeTab === 'users' && filteredUsers.length === 0) ||
                        (activeTab === 'channels' && publicChannels.length === 0) ||
                        (activeTab === 'groups' && groupChats.length === 0) ||
                        (activeTab === 'proposals' && proposals.length === 0)) && (
                            <div className="p-12 text-center text-slate-400">
                                <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No {activeTab} found matching "{searchTerm}"</p>
                            </div>
                        )}
                </div>
            </div>
            {/* Participants Modal */}
            {viewingParticipants && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800">
                                Participants ({viewingParticipants.participants?.length || 0})
                            </h3>
                            <button
                                onClick={() => setViewingParticipants(null)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                                {viewingParticipants.participants?.map(participantId => {
                                    const participant = users.find(u => u.id === participantId);
                                    return (
                                        <div key={participantId} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                                            {participant ? (
                                                <>
                                                    <Avatar user={participant} size="sm" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-slate-700 truncate">{participant.username}</div>
                                                        <div className="text-xs text-slate-500 truncate">{participant.email}</div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-3 opacity-50">
                                                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-400">?</div>
                                                    <span className="text-slate-400 italic">Unknown User ({participantId})</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
