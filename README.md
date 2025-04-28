# Kawai - Social Network

A modern social network platform combining features of Pinterest and Discord with a WebValley-inspired design.

## Project Structure

```
kawai/
├── apps/
│   ├── api/         # Backend API server
│   ├── web/         # Next.js web application
│   └── mobile/      # React Native mobile application
└── packages/
    └── shared/      # Shared utilities and types
```

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- npm or yarn
- React Native development environment (for mobile app)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kawai.git
cd kawai
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
- Create a PostgreSQL database named 'kawai'
- Copy `.env.example` to `.env` in the api directory and update the database URL

4. Run database migrations:
```bash
cd apps/api
npm run migrate
```

## Development

### API Server
```bash
cd apps/api
npm run dev
```

### Web Application
```bash
cd apps/web
npm run dev
```

### Mobile Application
```bash
cd apps/mobile
npm run android  # for Android
# or
npm run ios     # for iOS
```

## Features

- User authentication and authorization
- Post creation and sharing
- Real-time messaging
- Friend system
- Post comments and likes
- Admin panel for content moderation
- User profiles and bios
- Search functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 