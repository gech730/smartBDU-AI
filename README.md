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
- Node.js 18+
- MongoDB (local or Atlas)
- Ollama (recommended) or HuggingFace API

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment
cp .env.example .env
# Edit .env with your settings

# Start MongoDB (if local)
# Or use MongoDB Atlas

# Start Ollama (recommended)
ollama pull mistral
ollama serve

# Start server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env
echo "VITE_API_URL=http://localhost:4000/api" > .env

# Start development
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Health Check: http://localhost:4000/api/health

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
curl http://localhost:4000/api/health
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
