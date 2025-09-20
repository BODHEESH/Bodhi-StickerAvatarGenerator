# Bodhi Sticker Avatar Generator

A web application that transforms user photos into unique, personalized sticker avatars with a modern, clean aesthetic. Create and download your own custom stickers for use across various platforms.

## Features

- Upload your photos to create custom sticker avatars
- Choose from multiple style options to match your personality
- Download high-quality sticker packs for WhatsApp, Telegram, and other platforms
- Share your unique sticker avatars with friends and communities
- User-friendly interface with real-time previews

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker (optional, for containerized development)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/bodhi-sticker-avatar-generator.git
cd bodhi-sticker-avatar-generator
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

4. Start the development servers
```bash
# Start frontend
npm run dev:web

# Start backend
npm run dev:api
```

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Zustand
- **Backend**: Node.js, Express, TypeScript
- **Image Processing**: Sharp
- **Queue**: BullMQ + Redis
- **Storage**: AWS S3
- **Database**: PostgreSQL
- **Authentication**: Firebase Auth
- **Payments**: Stripe

## Project Structure

This is a monorepo containing both frontend and backend code:

- `apps/web`: Next.js frontend application
- `apps/api`: Express backend server
- `packages/ui`: Shared React components
- `packages/lib`: Shared utilities
- `packages/types`: Shared TypeScript types

## License

[MIT](LICENSE)
