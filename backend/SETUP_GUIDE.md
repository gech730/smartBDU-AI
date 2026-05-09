# SmartBDU AI - Complete Setup Guide

## Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **MongoDB** installed locally or MongoDB Atlas account ([Get Atlas](https://www.mongodb.com/atlas))
- **Git** installed ([Download](https://git-scm.com/))
- Basic understanding of REST APIs

## Quick Setup (10 minutes)

### Step 1: Clone and Install

```bash
# Navigate to project directory
cd smartBDU

# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Step 2: Configure Environment

Open `.env` file and configure:

```env
# REQUIRED: MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/smartbdu
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartbdu

# REQUIRED: JWT Secret (use a long random string)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters

# REQUIRED: Choose AI Provider
# Option A: Ollama (RECOMMENDED - Free)
AI_PROVIDER=ollama

# Option B: HuggingFace (Cloud-based)
# AI_PROVIDER=huggingface
# HF_API_KEY=hf_your_api_key
```

### Step 3: Setup AI Provider

#### Option A: Ollama (Recommended)

1. **Install Ollama**
   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows: Download from https://ollama.ai/download
   ```

2. **Download Mistral 7B**
   ```bash
   ollama pull mistral
   ```
   Wait for download (~4GB). This happens only once.

3. **Start Ollama Server**
   ```bash
   ollama serve
   ```
   Keep this terminal open.

4. **Test Ollama**
   ```bash
   curl http://localhost:11434/api/tags
   ```

#### Option B: HuggingFace

1. **Get API Key**
   - Go to: https://huggingface.co/settings/tokens
   - Click "New token"
   - Name: "smartBDU"
   - Role: "Read"
   - Copy the generated token

2. **Update .env**
   ```env
   AI_PROVIDER=huggingface
   HF_API_KEY=hf_your_token_here
   HF_MODEL=mistralai/Mistral-7B-Instruct-v0.3
   ```

3. **Note**: Free tier works with smaller models. For Mistral 7B, you need Pro subscription.

### Step 4: Start Database (if local)

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# MongoDB should be running as a service
```

Or use MongoDB Atlas (cloud) - no installation needed.

### Step 5: Start Backend

```bash
# From backend directory
npm run dev
```

You should see:
```
✓ MongoDB connected successfully
✓ BDU data seeded
✓ AI enabled (ollama) - Model: mistral
✓ Server running on http://localhost:4000
```

### Step 6: Test the API

```bash
# Open new terminal

# 1. Health check
curl http://localhost:4000/api/health

# 2. Register a user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"student@bdu.edu.et","password":"test123","name":"BDU Student"}'

# 3. Login (copy the token from response)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@bdu.edu.et","password":"test123"}'

# 4. Chat with AI (replace YOUR_TOKEN)
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"What programs does BDU offer?"}'
```

## Project Structure Overview

```
smartBDU/
├── backend/              # Backend API
│   ├── ai/              # AI integration (Mistral 7B)
│   ├── controllers/      # API route handlers
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── config/          # Database config
│   ├── utils/           # Utilities & seeding
│   └── server.js        # Express server
├── frontend/            # React frontend (if running separately)
└── README.md
```

## Understanding the Architecture

### How Chat Works

```
1. User sends message via POST /api/chat
2. Server validates JWT token
3. Server retrieves user's profile and chat history
4. Server searches BDU database for relevant information (RAG)
5. Server constructs AI prompt with context
6. Server sends to Mistral 7B (via Ollama/HuggingFace)
7. AI generates response
8. Response saved to database
9. Response sent back to user
```

### RAG (Retrieval-Augmented Generation)

The system doesn't just use AI's training data - it retrieves specific BDU information:

```javascript
// User asks: "Tell me about Computer Science"
const context = await retrieveContext("Computer Science")
// → Gets CS department details, courses, skills, careers

// AI receives:
{
  system: "You are SmartBDU AI assistant...",
  context: "Computer Science: 4-year program, Skills: Programming, ML..."
  user: "Tell me about Computer Science"
}
```

This ensures accurate, up-to-date BDU-specific answers.

## Common Issues and Solutions

### Issue: "MongoDB connection failed"

**Solution:**
```bash
# Check if MongoDB is running
# macOS
pgrep -l mongod

# Start MongoDB
# macOS
brew services start mongodb-community

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### Issue: "AI service unavailable"

**Solution:**
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# If not running, start it
ollama serve

# Or check HuggingFace key
# Make sure HF_API_KEY is correct in .env
```

### Issue: "Token validation failed"

**Solution:**
- Ensure you're including the full token in Authorization header
- Format: `Authorization: Bearer <your_token>`
- Token expires after 7 days, re-login if needed

### Issue: "CORS error in browser"

**Solution:**
```javascript
// In server.js, CORS is already configured
app.use(cors({
  origin: 'http://localhost:3000' // Your frontend URL
}));
```

## API Endpoints Quick Reference

### Authentication
```
POST   /api/auth/register    - Create new account
POST   /api/auth/login       - Login and get token
GET    /api/auth/profile     - Get current user profile
```

### Chat & AI
```
POST   /api/chat             - Send message to AI assistant
GET    /api/chat/history     - Get chat history
```

### Departments
```
GET    /api/departments                 - List all departments
GET    /api/departments/:id             - Get department details
POST   /api/departments/recommend       - Get AI recommendations
```

### Career & Learning
```
POST   /api/roadmap/generate            - Generate learning roadmap
POST   /api/cv/generate                 - Generate CV
POST   /api/career/cv-tips              - Get CV writing tips
```

### System
```
GET    /api/health                      - Check API status
```

## Testing with Postman

1. **Import Collection** (optional, or manually create requests)

2. **Create Environment**
   ```
   Name: SmartBDU
   Variables:
   - baseUrl: http://localhost:4000
   - token: (will be set from login response)
   ```

3. **Test Flow:**
   - POST `/auth/register` → Save token
   - POST `/auth/login` → Update token variable
   - POST `/chat` with `{{token}}` in header

4. **Example Request (Chat):**
   ```
   Method: POST
   URL: {{baseUrl}}/api/chat
   Headers:
     Content-Type: application/json
     Authorization: Bearer {{token}}
   Body:
     {
       "message": "What is the admission process?"
     }
   ```

## Frontend Integration

### Connecting Frontend to Backend

1. **Create .env in frontend**
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```

2. **API Service Setup**
   ```javascript
   // frontend/src/services/api.js
   import axios from 'axios';
   
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
     headers: {
       'Content-Type': 'application/json',
     },
   });
   
   // Add token to requests
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   
   export default api;
   ```

3. **Example Usage**
   ```javascript
   // Login
   const login = async (email, password) => {
     const response = await api.post('/auth/login', { email, password });
     localStorage.setItem('token', response.data.token);
     return response.data;
   };
   
   // Chat
   const chat = async (message) => {
     const response = await api.post('/chat', { message });
     return response.data;
   };
   ```

## Database Schema Overview

### Users
```javascript
{
  email: "student@bdu.edu.et",
  password: "hashed_password",
  name: "Student Name",
  interests: ["technology", "programming"],
  favoriteSubjects: ["math", "physics"],
  goals: ["Become software engineer"]
}
```

### Messages
```javascript
{
  userId: "user_id",
  role: "user" | "assistant",
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
  skills: ["Programming", "AI", "Data Science"],
  courses: [...],
  careers: [...]
}
```

## Performance Tips

1. **Use Ollama** (local) instead of HuggingFace for:
   - Faster responses
   - No API costs
   - Better privacy
   - Works offline

2. **Database Indexing**
   ```javascript
   // Already configured in models
   messageSchema.index({ userId: 1, createdAt: -1 });
   ```

3. **Chat History Limit**
   - Limit context to last 10 messages
   - Reduces token usage and cost

## Production Deployment

### Render.com (Free Tier)

1. Create Render account
2. Connect GitHub repo
3. Create Web Service:
   - Build command: `npm install`
   - Start command: `npm start`
4. Add environment variables
5. Deploy!

### Railway.app

1. Create Railway account
2. New Project → Deploy from GitHub
3. Add MongoDB plugin
4. Add environment variables
5. Deploy!

### Vercel (Serverless)

Note: Express backend needs to be adapted for serverless or use dedicated hosting.

## Security Checklist

- [ ] Change JWT_SECRET to long random string
- [ ] Enable MongoDB authentication
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Never commit .env file
- [ ] Validate all user inputs
- [ ] Enable CORS only for your frontend domain

## Monitoring & Logging

The system logs important events:
```
✓ Server started successfully
✓ MongoDB connected
✓ BDU data seeded
✓ AI enabled (provider) - Model: model_name
✓ New user registered: email@example.com
✓ Chat message received
✓ AI response generated
```

For production, consider:
- Winston for advanced logging
- Sentry for error tracking
- PM2 for process management

## Next Steps

1. **Test thoroughly** with Postman/curl
2. **Review API responses** for your frontend needs
3. **Customize AI prompts** in `ai/service.js`
4. **Add more BDU data** in `utils/seed.js`
5. **Implement rate limiting** for security
6. **Set up monitoring** for production

## Support

For help:
- Check existing issues: GitHub Issues
- Review API docs: This README
- Contact: development team

## Success Indicators

You'll know setup is complete when:

✅ `curl http://localhost:4000/api/health` returns success
✅ Registration and login work
✅ `/api/chat` returns AI responses
✅ Responses include accurate BDU information
✅ Chat history is saved and retrieved correctly

---

**Congratulations!** Your SmartBDU AI backend is now running. 🎉
