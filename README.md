# SmartBDU AI - Smart Campus Assistant

An intelligent AI-powered assistant for Bahir Dar University students, built with React, Node.js, MongoDB, and OpenAI GPT-4.

## Features

- **AI Chat** - Natural conversations with context-aware responses
- **Department Explorer** - Browse and search university departments
- **AI Recommendations** - Get personalized department suggestions based on your interests
- **Learning Roadmaps** - Generate step-by-step career learning paths
- **Career Tools** - CV writing tips and interview preparation
- **User Profiles** - Personalized experience with interest tracking

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Lucide React Icons
- jsPDF for PDF export

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- OpenAI GPT-4 API

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   cd smartBDU
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   # Create .env file with VITE_API_URL=http://localhost:5000/api
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:3000`

### Environment Variables

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartbdu
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-your-openai-key
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
smartBDU/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # AI services
│   ├── utils/           # Seed data
│   └── server.js        # Express server
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── context/    # React contexts
│   │   ├── pages/      # Page components
│   │   ├── services/   # API client
│   │   └── App.jsx     # Main app
│   └── package.json
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Chat
- `POST /api/chat` - Send message
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history` - Clear history

### Departments
- `GET /api/departments` - List all departments
- `GET /api/departments/:id` - Get department details
- `POST /api/departments/recommend` - Get AI recommendations

### Roadmap
- `POST /api/roadmap/generate` - Generate roadmap
- `GET /api/roadmap` - List user roadmaps
- `DELETE /api/roadmap/:id` - Delete roadmap

### Career
- `POST /api/career/cv-tips` - Get CV tips
- `POST /api/career/interview-prep` - Get interview prep

## License

MIT