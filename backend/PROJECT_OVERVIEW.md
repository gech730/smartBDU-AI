# SmartBDU AI Assistant - Project Overview

## 🎯 What Was Built

A complete, production-ready AI-powered backend system for Bahir Dar University that provides intelligent assistance to students through conversational AI.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│          SmartBDU AI System             │
├─────────────────────────────────────────┤
│                                          │
│  ┌──────────┐    ┌──────────────────┐   │
│  │ Frontend │───▶│  Express API     │   │
│  │ (React)  │    │  (Node.js)        │   │
│  └──────────┘    └────────┬─────────┘   │
│                           │              │
│         ┌─────────────────┼──────────┐  │
│         │                 │           │  │
│         ▼                 ▼           ▼  │
│  ┌────────────┐  ┌────────────┐  ┌────────┐│
│  │ MongoDB    │  │ RAG Engine │  │Mistral 7B│
│  │ Database   │  │ (Retrieval)│  │  AI     ││
│  └────────────┘  └────────────┘  └────────┘│
│                                          │
└──────────────────────────────────────────┘
```

## 🔑 Key Features Implemented

### 1. 🤖 AI-Powered Chat System
- Conversational AI with Mistral 7B model
- Context-aware responses using RAG
- Chat history storage and retrieval
- Personalized responses based on user profile

### 2. 📚 Comprehensive BDU Knowledge Base
- **14 Departments** with full details
  - Computer Science, Information Systems, Engineering (all branches)
  - Medicine, Nursing, Business, Law, Agriculture, etc.
- **45+ Information categories**
  - Campuses and facilities
  - Admission requirements
  - Student life
  - Career services
  - Fees and costs

### 3. 🎓 Intelligent Recommendations
- Department recommendations based on interests
- Career path suggestions
- Learning roadmaps
- CV and interview preparation

### 4. 🔐 Authentication & User Management
- JWT-based authentication
- User profile with preferences
- Chat history per user
- Analytics tracking

### 5. ⚡ RESTful API Design
- Clean, consistent JSON responses
- Comprehensive error handling
- Rate limiting support
- Pagination for lists

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js 18+ | Server runtime |
| Framework | Express.js | REST API framework |
| Database | MongoDB | Data storage |
| AI Model | Mistral 7B | Intelligent responses |
| AI Runtime | Ollama/HuggingFace | Model hosting |
| Auth | JWT | User authentication |
| Language | ES6 Modules | Modern JavaScript |

## 📁 Project Structure

```
backend/
├── ai/                         # AI Integration
│   ├── service.js             # Main AI orchestrator
│   └── providers/             # AI provider implementations
│       ├── huggingface.js     # HuggingFace API
│       └── ollama.js          # Ollama local API
│
├── config/                    # Configuration
│   └── db.js                 # MongoDB connection
│
├── controllers/              # Request handlers
│   ├── authController.js     # Authentication
│   ├── chatController.js     # Chat & AI
│   ├── departmentController.js
│   ├── roadmapController.js
│   ├── careerController.js
│   ├── cvController.js
│   ├── analyticsController.js
│   └── careerRecommendationController.js
│
├── middleware/               # Express middleware
│   └── auth.js              # JWT authentication
│
├── models/                  # Mongoose schemas
│   ├── User.js             # User accounts
│   ├── Message.js          # Chat messages
│   ├── Department.js       # University departments
│   ├── BDUInfo.js          # BDU information
│   ├── Roadmap.js          # Learning roadmaps
│   └── Analytics.js        # Usage analytics
│
├── routes/                  # Express routes
│   ├── authRoutes.js
│   ├── chatRoutes.js
│   ├── departmentRoutes.js
│   ├── roadmapRoutes.js
│   ├── careerRoutes.js
│   ├── cvRoutes.js
│   ├── analyticsRoutes.js
│   └── careerRecommendationRoutes.js
│
├── utils/                  # Utilities
│   ├── seed.js            # Database seeding (BDU data)
│   ├── retriever.js      # RAG retrieval system
│   └── validateSetup.js   # Environment validation
│
├── server.js              # Application entry point
├── package.json
├── .env.example
├── README.md             # Full documentation
├── SETUP_GUIDE.md        # Step-by-step setup
└── API_DOCUMENTATION.md  # API reference
```

## 🚀 Getting Started

### Quick Start (5 minutes)

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Setup AI (choose one)
# Option A: Ollama (recommended)
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull mistral
ollama serve

# Option B: HuggingFace
# Get API key from https://huggingface.co/settings/tokens

# 4. Start MongoDB (if local)
# Or use MongoDB Atlas (cloud)

# 5. Start server
npm run dev

# 6. Validate setup
npm run validate
```

### Verify Installation

```bash
# Health check
curl http://localhost:4000/api/health

# Should return:
# {"status": "ok", "ai": {"provider": "ollama", "model": "mistral"}}
```

## 💬 API Usage Examples

### 1. Register & Login

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"student@bdu.edu.et","password":"test123","name":"Student"}'

# Login (copy token from response)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@bdu.edu.et","password":"test123"}'
```

### 2. Chat with AI

```bash
# Replace YOUR_TOKEN with actual token
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"What programs does BDU offer?"}'
```

### 3. Get Department Recommendations

```bash
curl -X POST http://localhost:4000/api/departments/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"interests":["technology"],"subjects":["math"]}'
```

## 🔍 How RAG Works

```
User Query: "Tell me about Computer Science"
    │
    ▼
┌──────────────────────────────────────┐
│  1. SEMANTIC RETRIEVAL               │
│     - Convert query to vector         │
│     - Search departments & info        │
│     - Calculate similarity scores    │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│  2. CONTEXT ASSEMBLY                  │
│     - Retrieve relevant BDU data      │
│     - Format as context prompt        │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│  3. AI GENERATION                     │
│     - Send context + query to AI     │
│     - Generate response with context  │
└──────────────────────────────────────┘
    │
    ▼
User Response: "Computer Science at BDU is..."
```

## 📊 Database Collections

### Users
```javascript
{
  email: "student@bdu.edu.et",
  name: "Student Name",
  interests: ["technology", "programming"],
  favoriteSubjects: ["math", "physics"],
  goals: ["Software Engineer"]
}
```

### Messages
```javascript
{
  userId: "user_id",
  role: "user", // or "assistant"
  content: "message text",
  createdAt: timestamp
}
```

### Departments
```javascript
{
  name: "Computer Science",
  code: "CS",
  faculty: "Computing",
  description: "...",
  skills: [...],
  courses: [...],
  careers: [...]
}
```

### BDUInfo
```javascript
{
  category: "campus", // campus|facility|admission|overview|service
  title: "Main Library",
  description: "...",
  keywords: [...]
}
```

## 🎨 Features for Frontend Integration

### 1. Chat Interface
- Real-time messaging
- Typing indicators
- Message history
- Context persistence

### 2. Department Explorer
- Search and filter
- Detailed department pages
- Course listings
- Career information

### 3. Career Tools
- AI-powered recommendations
- Learning roadmaps
- CV generation
- Interview preparation

### 4. User Dashboard
- Profile management
- Chat history
- Saved roadmaps
- Analytics overview

## 🔒 Security Features

- JWT token authentication
- Password hashing (bcrypt)
- Protected API routes
- Input validation
- Rate limiting ready
- CORS configuration

## 📈 Performance Optimizations

- MongoDB indexes
- Query caching ready
- Pagination support
- Connection pooling
- Efficient data models

## 🌐 Deployment Options

### Local Development
```bash
npm run dev
```

### Production
```bash
# Option 1: Traditional hosting
npm install
npm start

# Option 2: Docker
docker build -t smartbdu-backend .
docker run -p 4000:4000 smartbdu-backend

# Option 3: Cloud platforms
# - Render.com
# - Railway.app
# - Vercel (requires adapter)
```

## 🧪 Testing

```bash
# Manual testing with cURL
curl http://localhost:4000/api/health

# Automated validation
npm run validate

# Postman collection (import API_DOCUMENTATION.md endpoints)
```

## 📚 Documentation Structure

1. **README.md** - Overview and architecture
2. **SETUP_GUIDE.md** - Step-by-step setup instructions
3. **API_DOCUMENTATION.md** - Complete API reference
4. **This file** - Project overview and structure

## 🎯 Use Cases

### For Students
- "What should I study?"
- "Tell me about Computer Science"
- "What are the admission requirements?"
- "Help me create a learning roadmap"
- "How do I prepare for interviews?"

### For Prospective Students
- "What programs does BDU offer?"
- "What are the campus facilities?"
- "How much does it cost?"
- "What is student life like?"

### For Career Guidance
- "What careers can I pursue with a CS degree?"
- "Generate a roadmap to become a data scientist"
- "Help me write a CV"
- "What skills are in demand?"

## 🔮 Future Enhancements

### Phase 2 (Recommended)
- [ ] WebSocket support for real-time chat
- [ ] Advanced embeddings (sentence-transformers)
- [ ] Vector database (Pinecone/Weaviate)
- [ ] Multi-language support
- [ ] Voice interface

### Phase 3 (Advanced)
- [ ] Mobile app backend
- [ ] Advanced analytics dashboard
- [ ] Integration with LMS
- [ ] Automated data updates
- [ ] Custom model fine-tuning

## 🤝 Integration Guide

### Frontend Connection

```javascript
// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:4000/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Usage Example

```javascript
// Chat component
const sendMessage = async (message) => {
  try {
    const response = await api.post('/chat', { message });
    return response.data.response;
  } catch (error) {
    console.error('Chat error:', error);
  }
};
```

## 🐛 Troubleshooting

### AI Not Working
```bash
# Check Ollama
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Install Mistral
ollama pull mistral
```

### Database Connection Failed
```bash
# Check MongoDB
mongosh

# Start MongoDB (macOS)
brew services start mongodb-community
```

### Token Issues
- Ensure token is in Authorization header
- Check token hasn't expired (7 days)
- Verify JWT_SECRET is consistent

## 📞 Support

- **Documentation**: Check README files
- **Issues**: GitHub Issues
- **Email**: development team
- **Wiki**: Project wiki (if available)

## ✅ Success Criteria

Your setup is complete when:

- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] AI provider responds
- [ ] User can register and login
- [ ] Chat endpoint returns AI responses
- [ ] Responses include accurate BDU information
- [ ] Chat history persists

## 🎓 Learning Outcomes

By implementing this system, you gain experience with:

- AI/LLM integration (Mistral 7B)
- RAG (Retrieval-Augmented Generation)
- Vector similarity search
- RESTful API design
- MongoDB with Mongoose
- JWT authentication
- Node.js/Express
- Environment configuration
- Production deployment

## 🏆 Project Status

**Status**: ✅ Complete and Production-Ready

All core features implemented:
- ✅ AI-powered chat
- ✅ RAG system
- ✅ BDU knowledge base
- ✅ User authentication
- ✅ API endpoints
- ✅ Documentation
- ✅ Setup validation

## 📄 License

MIT License - See LICENSE file

## 👥 Credits

Built for Bahir Dar University
Development Team: [Your Team Name]

---

**Built with ❤️ for BDU Students**

For questions, contributions, or feedback, please reach out!
