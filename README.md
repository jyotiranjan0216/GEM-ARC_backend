# GEM-ARC

A modern web application for architecture and design.

## Live Links

- **Frontend**: [https://gem-arc.netlify.app](https://gem-arc.netlify.app)
- **Backend**: [https://gem-arc-backend.onrender.com](https://gem-arc-backend.onrender.com)
- **Main GitHub Repository**: [Access the complete project (Frontend + Backend)](https://github.com/jyotiranjan0216/GEM-ARC)

## Overview

GEM-ARC is a full-stack web application built with React on the frontend and Express.js on the backend. The application leverages modern web technologies to deliver a seamless user experience.

## Frontend

The frontend is built with React 19 and Vite, using a modern tech stack that includes:

- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Chart.js for data visualization
- Axios for API requests
- React Toastify for notifications
- React Slick for carousels

### Requirements

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>/frontend

# Install dependencies
npm install
```

### Running the Frontend

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
VITE_API_URL=https://gem-arc-backend.onrender.com
```

## Backend

The backend is built with Express.js and MongoDB, featuring:

- JWT-based authentication
- Google AI integration
- Twilio for messaging
- Natural language processing capabilities
- Mongoose for MongoDB object modeling

### Requirements

- Node.js (v16 or higher recommended)
- MongoDB (local or Atlas connection)

### Installation

```bash
# Navigate to backend directory
cd <repository-name>/backend

# Install dependencies
npm install
```

### Running the Backend

```bash
# Start the server
npm start
```

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
GOOGLE_AI_API_KEY=<your-google-ai-api-key>
TWILIO_ACCOUNT_SID=<your-twilio-account-sid>
TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
TWILIO_PHONE_NUMBER=<your-twilio-phone-number>
```

## API Endpoints

The backend exposes several API endpoints:

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/projects` - Project operations
- `/api/ai` - AI integration

## Technologies Used

### Frontend
- React 19
- Vite 6
- Tailwind CSS 4
- React Router 7
- Framer Motion
- Chart.js
- Axios

### Backend
- Express 5
- MongoDB with Mongoose
- JWT Authentication
- Google Generative AI
- Natural Language Processing
- Twilio

## Contributing

Please read the CONTRIBUTING.md file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the terms specified in the LICENSE file.
