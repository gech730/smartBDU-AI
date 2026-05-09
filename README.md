# SmartBDU: Smart Campus Web Application

## 🎓 Bahir Dar University's Intelligent Campus Platform

SmartBDU is a comprehensive smart campus web application for Bahir Dar University students and faculty. It provides centralized access to academic services, campus information, and AI-powered assistance.

## ✨ Features

### 📊 Dashboard
- Daily schedule overview
- Latest announcements
- Upcoming assignments
- Quick actions

### 📅 Schedule Management
- Daily & weekly class schedules
- Color-coded courses
- Room & instructor info
- Calendar view

### 📢 Announcements
- University-wide announcements
- Department updates
- Event notifications
- Priority levels (normal, important, urgent)

### 📚 Courses & Assignments
- Course listing by department
- Course details & syllabus
- Assignment tracking
- Due date reminders
- Course materials

### 🏫 Campus Services
- **Cafeteria**: Daily menus, nutritional info
- **Dormitories**: Hostel info, amenities
- **Transport**: Shuttle schedules, bus routes

### 👥 Student Directory
- Search students & faculty
- Filter by department
- Contact information

### 🤖 AI Assistant (SmartBDU AI)
- Conversational AI powered by Mistral 7B
- RAG-based responses
- Academic guidance
- Career recommendations

### 💼 Career Tools
- AI-powered department recommendations
- Learning roadmaps
- CV generator
- Interview preparation

## 🛠️ Technology Stack

### Frontend
- **React 18** + Vite
- **Tailwind CSS** - Responsive styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **jsPDF** - CV generation

### Backend
- **Node.js** + Express
- **MongoDB** + Mongoose
- **JWT** - Authentication
- **Mistral 7B** - AI (via Ollama/HuggingFace)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or later
- MongoDB (local or Atlas)
- Ollama (recommended) or HuggingFace API credentials

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and configure:
- `MONGODB_URI` - e.g. `mongodb://localhost:27017/smartbdu`
- `JWT_SECRET` - strong random string
- `AI_PROVIDER` - `ollama` or `huggingface`
- `HF_API_KEY` / `HF_MODEL` if using HuggingFace
- `OLLAMA_URL` / `OLLAMA_MODEL` if using Ollama
- `FRONTEND_URL` - `http://localhost:3000`

Start database and AI provider:
- Local MongoDB: start the service or use Docker
- Ollama: `ollama pull mistral` and `ollama serve`

Then start the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Open `frontend/.env` and confirm:
- `VITE_API_URL=http://localhost:5000/api`

Start the frontend:

```bash
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## 🚀 Production Deployment

### 1. Build frontend for production

```bash
cd frontend
npm install
npm run build
```

Copy the generated `dist/` folder to your static host or serve it from your backend web server.

### 2. Configure backend for production

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with production values:
- `PORT=5000`
- `MONGODB_URI` to your production MongoDB
- `JWT_SECRET` to a secure secret
- `AI_PROVIDER` and model provider credentials
- `FRONTEND_URL` to your production frontend URL

### 3. Start the backend in production

```bash
npm start
```

### 4. Deploy options

- **Heroku / Railway / Fly.io**: Deploy backend with environment variables set in dashboard.
- **Vercel / Netlify**: Deploy frontend from `frontend/` and point `VITE_API_URL` to backend.
- **Docker**: Build containers for backend and frontend, then deploy together.

### 5. Verify deployment

- Visit frontend URL.
- Confirm `/api/health` returns `status: ok`.
- Test login and registration flows.
- Validate AI provider with chat and roadmap features.

## 📁 Project Structure

```
smartBDU/
├── backend/
│   ├── ai/
│   │   ├── service.js          # AI orchestration
│   │   └── providers/         # Ollama/HuggingFace
│   ├── controllers/           # Route handlers
│   ├── models/               # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/           # Auth middleware
│   ├── utils/               # Utilities & seeding
│   ├── config/              # Database config
│   └── server.js            # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/       # UI components
│   │   ├── services/         # API services
│   │   ├── context/          # React contexts
│   │   └── App.jsx          # Router setup
│   └── public/
│
└── README.md
```

## 🔐 Authentication

### Student Login Format
- University ID: `BDU1601567`
- Or use email/password

### User Roles
- **student**: Full access to all features
- **faculty**: Department & course management
- **admin**: System administration

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register     # Register with University ID
POST   /api/auth/login        # Login
GET    /api/auth/profile      # Get profile
PUT    /api/auth/profile      # Update profile
GET    /api/auth/directory   # Search directory
```

### Academic
```
GET    /api/schedules        # Get schedules
GET    /api/announcements    # Get announcements
GET    /api/courses          # Get courses
GET    /api/courses/assignments # Get assignments
```

### Campus
```
GET    /api/campus/dormitories     # Get dormitories
GET    /api/campus/cafeterias     # Get cafeterias
GET    /api/campus/cafeterias/menu/today # Today's menu
GET    /api/campus/transport      # Get transport info
```

### AI Features
```
POST   /api/chat                    # AI chat
POST   /api/departments/recommend   # AI recommendations
POST   /api/roadmap/generate        # Generate roadmap
POST   /api/cv/generate            # Generate CV
```

## 🎨 UI Features

### Responsive Design
- Desktop sidebar navigation
- Mobile-friendly layout
- Dark/Light theme toggle

### Modern Components
- Gradient accents
- Smooth transitions
- Card-based layouts
- Modal dialogs

## 📚 Database Models

### User
- universityId (BDU1601567)
- email, password
- name, role
- department, yearOfStudy
- profile information

### Schedule
- courseCode, courseName
- dayOfWeek, time, room
- instructor, color

### Announcement
- title, content
- category, priority
- author, views

### Course
- code, name, description
- instructor, credits
- materials, syllabus

### Campus
- Dormitory info
- Cafeteria menus
- Transport routes

## 🤖 AI Integration

### RAG System
- Semantic retrieval
- Context injection
- Accurate BDU information

### AI Providers
1. **Ollama** (Recommended)
   - Free, local, private
   - Mistral 7B model
   - No API costs

2. **HuggingFace** (Cloud)
   - API key required
   - Internet access needed
   - Model access varies by tier

## 📱 PWA Support (Future)

- Offline access
- App-like experience
- Push notifications

## 🔒 Security

- JWT authentication
- Password hashing
- Protected routes
- Input validation

## 🚢 Deployment

### Docker
```bash
docker-compose up -d
```

### Traditional
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run build
```

## 📈 Features Roadmap

- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Offline mode
- [ ] File upload
- [ ] Real-time chat
- [ ] Payment integration
- [ ] Attendance tracking
- [ ] Grade management

## 🐛 Troubleshooting

### Backend Issues
```bash
# Check if MongoDB is running
pgrep -l mongod

# Check if Ollama is running
curl http://localhost:11434/api/tags

# Validate setup
npm run validate
```

### Frontend Issues
```bash
# Clear cache
rm -rf node_modules/.vite

# Check API connection
curl http://localhost:5000/api/health
```

## 📄 Documentation

- [Backend README](backend/README.md)
- [API Documentation](backend/API_DOCUMENTATION.md)
- [Setup Guide](backend/SETUP_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT License - See LICENSE file

## 👥 Team

Built for **Bahir Dar University**
Development Team: SmartBDU AI Team

## 🙏 Acknowledgments

- Bahir Dar University
- Faculty of Computing and Informatics
- All contributors

---

**Built with ❤️ for BDU Students**

For questions or support, create an issue on GitHub.
