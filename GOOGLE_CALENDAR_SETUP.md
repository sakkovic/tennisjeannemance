# Google Calendar Integration Guide

To fully integrate your personal Google Calendar with this website so that:
1. **You (Admin)** can see and manage bookings in your Google Calendar.
2. **Users** can see your real-time availability on the website.

You need to set up the Google Calendar API. Follow these steps:

## 1. Google Cloud Setup
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "Tennis Website").
3. Enable the **Google Calendar API** for this project.
4. Create **Service Account** credentials:
   - Go to "Credentials" > "Create Credentials" > "Service Account".
   - Name it (e.g., "calendar-bot").
   - Download the JSON key file. **Keep this safe!**
5. Share your personal calendar with the Service Account:
   - Open the JSON key file and find the `client_email`.
   - Go to your Google Calendar settings > "Share with specific people".
   - Add the service account email and give it "Make changes to events" permission.

## 2. Backend Implementation
You need to update your server to fetch events using the `googleapis` library.

### Install Dependencies
```bash
npm install googleapis dotenv
```

### Update Server Code
In `server/index.ts`, add an endpoint to fetch events:

```typescript
import { google } from 'googleapis';

// Load your service account key
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const key = require('./path-to-your-service-account-key.json');

const auth = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  SCOPES
);

const calendar = google.calendar({ version: 'v3', auth });

app.get('/api/calendar/events', async (req, res) => {
  try {
    const response = await calendar.events.list({
      calendarId: 'primary', // or your specific calendar ID
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary || 'Busy',
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      type: event.summary?.includes('Available') ? 'availability' : 'booking'
    }));
    
    res.json(events);
  } catch (error) {
    res.status(500).send(error);
  }
});
```

## 3. Frontend Update
Once the backend is ready, update `client/src/hooks/use-google-calendar.ts` to fetch from your new API endpoint instead of using mock data.

```typescript
// In use-google-calendar.ts
const response = await fetch('/api/calendar/events');
const data = await response.json();
setEvents(data);
```
