# SmartBDU AI - Quick Reference Card

## 🚀 Essential Commands

```bash
# Setup
npm install              # Install dependencies
cp .env.example .env    # Create environment file
npm run validate        # Validate setup

# Development
npm run dev             # Start development server (watch mode)
npm start               # Start production server

# Database
npm run seed            # Seed BDU data

# Utilities
npm run validate        # Validate environment setup
```

## 🌐 API Base URL

```
Development: http://localhost:4000/api
```

## 🔐 Authentication

Include JWT token in all protected requests:
```
Authorization: Bearer <your_token>
```

## 📝 Core Endpoints

### Auth
```bash
POST   /api/auth/register    # Create account
POST   /api/auth/login       # Get token
GET    /api/auth/profile     # Get profile
PUT    /api/auth/profile     # Update profile
```

### Chat (Protected)
```bash
POST   /api/chat             # Send message
GET    /api/chat/history    # Get history
DELETE /api/chat/history    # Clear history
```

### Departments
```bash
GET    /api/departments                 # List all
GET    /api/departments/:id             # Get details
POST   /api/departments/recommend       # Get recommendations
GET    /api/departments/search?q=term  # Search
```

### Learning Roadmaps (Protected)
```bash
POST   /api/roadmap/generate    # Generate roadmap
GET    /api/roadmap             # List roadmaps
GET    /api/roadmap/:id         # Get roadmap
DELETE /api/roadmap/:id         # Delete roadmap
```

### Career (Protected)
```bash
POST   /api/career/cv-tips       # Get CV tips
POST   /api/career/interview-prep # Interview prep
POST   /api/cv/generate           # Generate CV
POST   /api/career-recommend     # Career recommendations
```

### System
```bash
GET    /api/health         # Health check
GET    /api/health/ai      # AI status
```

## 📋 Request/Response Format

### Protected Request
```bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "Hello"}'
```

### Response Format
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🔧 Environment Variables

```env
PORT=4000                                    # Server port
MONGODB_URI=mongodb://localhost:27017/smartbdu # Database
JWT_SECRET=your-secret-key                   # Auth secret

AI_PROVIDER=ollama                           # huggingface | ollama
HF_API_KEY=hf_...                            # HuggingFace key
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.3  # HF model
OLLAMA_URL=http://localhost:11434            # Ollama server
OLLAMA_MODEL=mistral                         # Ollama model
```

## 🗄️ MongoDB Collections

- **users** - User accounts
- **messages** - Chat history
- **departments** - University departments
- **bduinfos** - BDU information
- **roadmaps** - Learning roadmaps
- **analytics** - Usage analytics

## 🎯 Common Use Cases

### 1. Student Chat
```bash
# Register → Login → Chat
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"student@bdu.edu.et","password":"pass123","name":"Student"}'
```

### 2. Department Recommendation
```bash
curl -X POST http://localhost:4000/api/departments/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"interests":["technology"],"subjects":["math"]}'
```

### 3. Generate Learning Roadmap
```bash
curl -X POST http://localhost:4000/api/roadmap/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"targetRole":"Software Engineer","timeframe":"6 months"}'
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| AI not responding | Check Ollama: `curl http://localhost:11434/api/tags` |
| DB connection failed | Start MongoDB: `brew services start mongodb-community` |
| Token invalid | Re-login to get new token |
| CORS error | Ensure frontend URL is correct in CORS config |

## 📊 Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **404** - Not Found
- **500** - Server Error
- **503** - Service Unavailable (AI down)

## 🔒 Security

- JWT tokens expire in 7 days
- Passwords hashed with bcrypt
- Rate limiting: 100 req/min per user
- CORS enabled for configured origins

## 📦 Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "axios": "^1.6.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1"
}
```

## 🌟 Key Features

- ✅ RAG-powered AI responses
- ✅ Comprehensive BDU knowledge base
- ✅ Department recommendations
- ✅ Learning roadmaps
- ✅ CV generation
- ✅ Chat history
- ✅ User profiles
- ✅ Analytics

## 📱 Frontend Integration

```javascript
// Setup
const api = axios.create({
  baseURL: 'http://localhost:4000/api'
});

// Add token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Use
await api.post('/chat', { message: 'Hello' });
```

## 🎓 AI Model

**Mistral 7B Instruct v0.3**
- Provider: Ollama (recommended) or HuggingFace
- Context window: 8K tokens
- Optimized for instruction following

## 📁 Key Files

- `server.js` - Entry point
- `ai/service.js` - AI orchestration
- `utils/retriever.js` - RAG retrieval
- `utils/seed.js` - Database seeding
- `utils/validateSetup.js` - Environment validator

## 📚 Documentation

- **README.md** - Full documentation
- **SETUP_GUIDE.md** - Installation guide
- **API_DOCUMENTATION.md** - API reference
- **PROJECT_OVERVIEW.md** - Project summary

---

**Quick Start**: `npm install && npm run dev`
**Validate**: `npm run validate`
**Status**: `curl http://localhost:4000/api/health`
