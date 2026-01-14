import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Calendar Setup
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";
const SERVICE_ACCOUNT_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(process.cwd(), "service-account.json");

async function getCalendarEvents() {
  try {
    if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
      console.warn("Service account file not found at:", SERVICE_ACCOUNT_PATH);
      return [];
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_PATH,
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Fetch events for the next 30 days
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(now.getDate() + 30);

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: now.toISOString(),
      timeMax: nextMonth.toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error;
  }
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // API Routes
  app.get("/api/calendar/events", async (_req, res) => {
    try {
      const googleEvents = await getCalendarEvents();

      // Transform Google Events to our CalendarEvent format
      const events = googleEvents.map((event) => {
        const isAvailable = event.summary?.toLowerCase().includes("available");

        return {
          id: event.id || Math.random().toString(),
          title: event.summary || "Busy",
          start: event.start?.dateTime || event.start?.date || new Date().toISOString(),
          end: event.end?.dateTime || event.end?.date || new Date().toISOString(),
          type: isAvailable ? "availability" : "booking",
          color: isAvailable ? "emerald" : "blue",
        };
      });

      res.json(events);
    } catch (error) {
      // If credentials are missing, return mock data for demo purposes
      console.log("Falling back to mock data due to error or missing credentials");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const mockEvents = [
        {
          id: 'mock-1',
          title: 'Private Coaching',
          start: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000).toISOString(), // Tomorrow 10 AM
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000).toISOString(),
          color: 'blue',
          type: 'booking'
        },
        {
          id: 'mock-2',
          title: 'Available Slot',
          start: new Date(today.getTime() + 48 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(), // Day after tomorrow 2 PM
          end: new Date(today.getTime() + 48 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000).toISOString(),
          color: 'emerald',
          type: 'availability'
        }
      ];
      res.json(mockEvents);
    }
  });

  // --- Messenger API ---

  interface User {
    id: string;
    username: string;
    email: string;
    password?: string; // In a real app, hash this!
    phone?: string;
    level?: string;
    avatar?: string; // Base64 or URL
    role: 'user' | 'admin';
    lastSeen: string;
  }

  interface Conversation {
    id: string;
    type: 'dm' | 'group';
    name?: string;
    participants: string[]; // User IDs
    lastMessage?: {
      text: string;
      timestamp: string;
      sender: string;
    };
  }

  interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
    type: 'text' | 'proposal';
    proposal?: {
      date: string;
      time: string;
      location: string;
      status: 'pending' | 'accepted' | 'rejected';
    };
  }

  // In-memory stores
  let users: User[] = [];
  let conversations: Conversation[] = [];
  let messages: Message[] = [];

  // 1. Register
  app.post("/api/chat/register", express.json({ limit: '10mb' }), (req, res) => {
    const { username, email, password, phone, level, avatar } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    if (users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Simple Admin Logic
    const role = username.toLowerCase() === 'anis' ? 'admin' : 'user';

    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      username,
      email,
      password, // Storing plain text for prototype ONLY
      phone,
      level,
      avatar,
      role,
      lastSeen: new Date().toISOString()
    };

    users.push(newUser);

    // Return user without password
    const { password: _, ...userSafe } = newUser;
    res.json(userSafe);
  });

  // 2. Login
  app.post("/api/chat/login", express.json(), (req, res) => {
    const { identifier, password } = req.body; // identifier can be username or email
    if (!identifier || !password) return res.status(400).json({ error: "Credentials required" });

    const user = users.find(u =>
      (u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase()) &&
      u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    user.lastSeen = new Date().toISOString();

    const { password: _, ...userSafe } = user;
    res.json(userSafe);
  });

  // 3. Update Profile
  app.put("/api/chat/users/:id", express.json({ limit: '10mb' }), (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });

    // Prevent changing id or role via this endpoint for safety
    delete updates.id;
    delete updates.role;

    users[userIndex] = { ...users[userIndex], ...updates };

    const { password: _, ...userSafe } = users[userIndex];
    res.json(userSafe);
  });

  // 2. Get Users (for creating chats)
  app.get("/api/chat/users", (req, res) => {
    // Update lastSeen for the requester if provided
    const currentUserId = req.headers['x-user-id'] as string;
    if (currentUserId) {
      const me = users.find(u => u.id === currentUserId);
      if (me) me.lastSeen = new Date().toISOString();
    }

    // Return all users except me
    const otherUsers = users.filter(u => u.id !== currentUserId).map(u => ({
      ...u,
      isOnline: (new Date().getTime() - new Date(u.lastSeen).getTime()) < 30000 // Online if seen in last 30s
    }));
    res.json(otherUsers);
  });

  // 3. Get My Conversations
  app.get("/api/chat/conversations", (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const myConvos = conversations.filter(c => c.participants.includes(userId));

    // Enrich DMs with other user's name/status
    const enriched = myConvos.map(c => {
      if (c.type === 'dm') {
        const otherId = c.participants.find(p => p !== userId);
        const otherUser = users.find(u => u.id === otherId);
        return {
          ...c,
          name: otherUser ? otherUser.username : "Unknown User",
          isOnline: otherUser ? (new Date().getTime() - new Date(otherUser.lastSeen).getTime()) < 30000 : false
        };
      }
      return c;
    });

    res.json(enriched.sort((a, b) => {
      const timeA = a.lastMessage?.timestamp || '0';
      const timeB = b.lastMessage?.timestamp || '0';
      return timeB.localeCompare(timeA); // Newest first
    }));
  });

  // 4. Create Conversation (DM or Group)
  app.post("/api/chat/conversations", express.json(), (req, res) => {
    const { type, participants, name } = req.body; // participants includes me

    if (type === 'dm') {
      // Check if DM already exists
      const existing = conversations.find(c =>
        c.type === 'dm' &&
        c.participants.every(p => participants.includes(p))
      );
      if (existing) return res.json(existing);
    }

    const newConvo: Conversation = {
      id: Math.random().toString(36).substring(7),
      type,
      name,
      participants
    };
    conversations.push(newConvo);
    res.json(newConvo);
  });

  // 5. Get Messages for Conversation
  app.get("/api/chat/conversations/:id/messages", (req, res) => {
    const { id } = req.params;
    const convoMessages = messages.filter(m => m.conversationId === id);
    res.json(convoMessages);
  });

  // 6. Send Message
  app.post("/api/chat/messages", express.json(), (req, res) => {
    const { conversationId, senderId, text, type = 'text', proposal } = req.body;

    const sender = users.find(u => u.id === senderId);
    if (!sender) return res.status(400).json({ error: "User not found" });

    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      conversationId,
      senderId,
      senderName: sender.username,
      text,
      timestamp: new Date().toISOString(),
      type,
      proposal
    };

    messages.push(newMessage);

    // Update conversation last message
    const convo = conversations.find(c => c.id === conversationId);
    if (convo) {
      convo.lastMessage = {
        text: type === 'proposal' ? '📅 Lesson Proposal' : text,
        timestamp: newMessage.timestamp,
        sender: sender.username
      };
    }

    res.json(newMessage);
  });

  // 7. Update Proposal Status
  app.patch("/api/chat/messages/:id/status", express.json(), (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const message = messages.find(m => m.id === id);
    if (message && message.proposal) {
      message.proposal.status = status;
      res.json(message);
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
