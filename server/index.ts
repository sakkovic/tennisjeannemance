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
