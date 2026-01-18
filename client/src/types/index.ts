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
