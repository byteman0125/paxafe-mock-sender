# PAXAFE Mock Tive Sender

A clean, professional web application for generating and sending test Tive payloads to the Integration API.

## Features

- ✅ Load pre-configured sample payloads
- ✅ Generate random payloads for testing
- ✅ Edit payloads in JSON editor
- ✅ Send payloads to Integration API
- ✅ View request history with success/failure status
- ✅ Toggle raw payload visibility
- ✅ Clean, professional UI with Tailwind CSS
- ✅ Real-time response display

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS + Custom Components
- **Icons**: Lucide React

## Setup

### Prerequisites

- Node.js 18+

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage

1. **Configure API**: Enter your Integration API URL and API key
2. **Load Sample**: Click on a sample payload to load it into the editor
3. **Generate Random**: Create a random payload based on templates
4. **Edit Payload**: Modify the JSON in the editor as needed
5. **Send**: Click "Send Payload" to send to your Integration API
6. **View History**: Check the request history panel for previous requests

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Deploy

No environment variables needed for the Mock Sender.

## Project Structure

```
mock-sender/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── payloads.ts         # Payload generation utilities
│   └── utils.ts            # Utility functions
└── data/
    └── sample-payloads.json # Sample payload data
```

