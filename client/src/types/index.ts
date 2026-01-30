export interface User {
    id: string;
    username: string;
    email: string;
    phone?: string;
    level?: string;
    avatar?: string;
    role: 'user' | 'admin';
    lastSeen: string;
    isOnline?: boolean;
}

export interface Conversation {
    id: string;
    type: 'dm' | 'group' | 'public';
    name?: string;
    participants: string[];
    pendingParticipants?: string[];
    lastMessage?: {
        text: string;
        timestamp: any;
        sender: string;
    };
    isOnline?: boolean; // For DMs
    lastRead?: { [userId: string]: any }; // Timestamp
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: any;
    type: 'text' | 'proposal';
    proposal?: {
        date: string;
        time: string;
        location: string;
        status: 'pending' | 'accepted' | 'rejected';
    };
    votes?: {
        yes: string[];
        no: string[];
    };
}
export interface LessonProposal {
    id: string;
    conversationId: string;
    conversationName: string;
    proposerId: string;
    proposerName: string;
    date: string;
    time: string;
    location: string;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    participants: string[];
    createdAt: any;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'proposal_received' | 'proposal_accepted';
    title: string;
    message: string;
    read: boolean;
    createdAt: any;
    link?: string; // e.g., conversationId
}
