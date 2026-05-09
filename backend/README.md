# SmartBDU AI Backend - Technical Documentation

## Overview

SmartBDU is an intelligent AI-powered assistant backend system for Bahir Dar University, built with Node.js, Express, MongoDB, and Mistral 7B. The system provides comprehensive information about BDU departments, admissions, campus facilities, and student services through conversational AI.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Express   │────▶│   MongoDB   │
│  (React)    │     │   Server    │     │  Database   │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │  AI Service │
                    │   (Mistral) │
                    └─────────────┘
```

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Database**: MongoDB with Mongoose
- **AI Provider**: Mistral 7B (via Ollama or HuggingFace)
- **Authentication**: JWT
- **Language**: ES6 Modules

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Ollama OR HuggingFace API key
- Git

### Installation

```bash
# Clone repository
cd smartBDU/backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure .env with your settings (see Configuration section)

# Start server
npm run dev
```

## Configuration

### Environment Variables (.env)

```env
# Server
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartbdu
JWT_SECRET=your-secret-key

# AI Provider: 'huggingface' or 'ollama'
AI_PROVIDER=ollama

# HuggingFace API (for cloud-based AI)
# Get free key at: https://huggingface.co/settings/tokens
HF_API_KEY=hf_your_api_key
HF_MODEL=mistralai/Mistral-7B-Instruct-v0.3

# Ollama (for local AI - RECOMMENDED)
# Install from: https://ollama.ai
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

### AI Provider Setup

#### Option 1: Ollama (Recommended - Free, Local)

1. **Install Ollama**
   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows: Download from https://ollama.ai
   ```

2. **Download Mistral 7B Model**
   ```bash
   ollama pull mistral
   ```

3. **Start Ollama Server**
   ```bash
   ollama serve
   ```

4. **Configure Backend**
   ```env
   AI_PROVIDER=ollama
   OLLAMA_MODEL=mistral
   ```

#### Option 2: HuggingFace (Cloud-based)

1. **Get API Key**
   - Visit: https://huggingface.co/settings/tokens
   - Create new token with "Read" permissions

2. **Note on Models**
   - Free tier: Use smaller models (Llama 3.2 1B)
   - Pro tier: Use Mistral 7B and larger models

3. **Configure Backend**
   ```env
   AI_PROVIDER=huggingface
   HF_API_KEY=hf_your_key
   HF_MODEL=mistralai/Mistral-7B-Instruct-v0.3
   ```

## Project Structure

```
backend/
├── ai/
│   ├── service.js           # Main AI service orchestrator
│   └── providers/           # AI provider implementations
│       ├── huggingface.js   # HuggingFace Inference API
│       └── ollama.js        # Ollama local API
├── config/
│   └── db.js               # MongoDB connection
├── controllers/            # Route handlers
│   ├── authController.js
│   ├── chatController.js
│   ├── departmentController.js
│   ├── roadmapController.js
│   ├── careerController.js
│   ├── cvController.js
│   ├── analyticsController.js
│   └── careerRecommendationController.js
├── middleware/
│   └── auth.js             # JWT authentication
├── models/                 # Mongoose schemas
│   ├── User.js
│   ├── Message.js
│   ├── Department.js
│   ├── BDUInfo.js
│   ├── Roadmap.js
│   └── Analytics.js
├── routes/                 # Express routes
│   ├── authRoutes.js
│   ├── chatRoutes.js
│   ├── departmentRoutes.js
│   ├── roadmapRoutes.js
│   ├── careerRoutes.js
│   ├── cvRoutes.js
│   ├── analyticsRoutes.js
│   └── careerRecommendationRoutes.js
├── utils/
│   └── seed.js             # Database seeding
├── server.js              # Express app entry point
├── .env                   # Environment variables
└── package.json
```

## API Endpoints

### Authentication
```
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login user
GET    /api/auth/profile     # Get user profile
PUT    /api/auth/profile     # Update profile
```

### Chat (AI Assistant)
```
POST   /api/chat              # Send message to AI
GET    /api/chat/history      # Get chat history
DELETE /api/chat/history      # Clear chat history
```

### Departments
```
GET    /api/departments                    # List all departments
GET    /api/departments/:id                # Get department details
POST   /api/departments/recommend          # Get AI recommendations
GET    /api/departments/search              # Search departments
```

### Learning Roadmaps
```
POST   /api/roadmap/generate                # Generate learning roadmap
GET    /api/roadmap                         # List user roadmaps
GET    /api/roadmap/:id                     # Get specific roadmap
DELETE /api/roadmap/:id                    # Delete roadmap
```

### Career Services
```
POST   /api/career/cv-tips                  # Get CV writing tips
POST   /api/career/interview-prep           # Get interview prep
```

### CV Generation
```
POST   /api/cv/generate                     # Generate CV
GET    /api/cv/templates                    # Get available templates
```

### Career Recommendations
```
POST   /api/career-recommend                # Get career recommendations
GET    /api/career-recommend/fields         # List career fields
```

### Analytics
```
POST   /api/analytics/track                 # Track user actions
GET    /api/analytics/dashboard             # Get analytics dashboard
```

### System
```
GET    /api/health                          # Health check
GET    /api/health/ai                       # AI provider status
```

## API Request/Response Examples

### Chat Endpoint

**Request:**
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"message": "Tell me about Computer Science at BDU"}'
```

**Response:**
```json
{
  "success": true,
  "response": "Computer Science at Bahir Dar University is a 4-year program...",
  "metadata": {
    "provider": "ollama",
    "model": "mistral",
    "context_used": true
  }
}
```

### Department Recommendation

**Request:**
```bash
curl -X POST http://localhost:5000/api/departments/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "interests": ["technology", "problem solving"],
    "subjects": ["mathematics", "physics"]
  }'
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "department": "Computer Science",
      "matchScore": 95,
      "reason": "Perfect match for your technology interests",
      "skills": ["Programming", "Data Structures", "AI"],
      "careers": ["Software Developer", "Data Scientist"]
    }
  ]
}
```

## RAG System (Retrieval-Augmented Generation)

The system implements RAG for accurate, context-aware responses:

1. **User Query** → Natural language question
2. **Retrieval** → Search BDU database for relevant info
3. **Context Injection** → Add retrieved data to prompt
4. **Generation** → AI generates response with context
5. **Response** → Structured, accurate answer

### How It Works

```javascript
// 1. User asks about Computer Science
const query = "What courses are in Computer Science?"

// 2. Retrieve relevant BDU data
const context = await retrieveContext(query)
// → Returns: CS department info, courses, skills, careers

// 3. Inject into AI prompt
const messages = [
  { role: 'system', content: SYSTEM_PROMPT },
  { role: 'system', content: `Context: ${context}` },
  { role: 'user', content: query }
]

// 4. Generate response with context
const response = await chat(messages)
```

## Database Models

### User
```javascript
{
  email: String,
  password: String (hashed),
  name: String,
  interests: [String],
  favoriteSubjects: [String],
  goals: [String],
  preferredDepartment: String,
  createdAt: Date
}
```

### Message
```javascript
{
  userId: ObjectId,
  role: 'user' | 'assistant',
  content: String,
  createdAt: Date
}
```

### Department
```javascript
{
  name: String,
  code: String,
  faculty: String,
  description: String,
  duration: String,
  requirements: [String],
  skills: [String],
  courses: [{ code, name, description }],
  careerOpportunities: [String],
  salaryRange: { min, max, currency }
}
```

### BDUInfo
```javascript
{
  category: 'campus' | 'facility' | 'admission' | 'overview' | 'service',
  title: String,
  description: String,
  keywords: [String],
  details: Object,
  active: Boolean
}
```

## Authentication

The system uses JWT for authentication:

1. **Register**: Create account with email/password
2. **Login**: Receive JWT token
3. **Protected Routes**: Include token in Authorization header

### Protected Route Example
```javascript
// Frontend
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ message: 'Hello!' })
})
```

## Error Handling

All API errors return consistent JSON:

```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

### Error Codes
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not Found
- `500`: Internal Server Error
- `503`: Service Unavailable (AI provider down)

## Testing

### Manual Testing with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@bdu.edu.et","password":"test123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@bdu.edu.et","password":"test123"}'

# Chat (replace TOKEN with actual token)
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"message":"What is Computer Science about?"}'
```

### Testing with Postman

1. Import the routes
2. Set base URL: `http://localhost:5000`
3. Add `Authorization: Bearer <token>` header for protected routes
4. Test endpoints

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Configure MongoDB Atlas or secure local MongoDB
- [ ] Set up HTTPS
- [ ] Configure AI_PROVIDER (Ollama recommended for cost)
- [ ] Set up monitoring (error tracking, logging)
- [ ] Enable rate limiting
- [ ] Configure CORS for production domain

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### MongoDB Atlas Setup

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartbdu
```

## Troubleshooting

### AI Not Working

1. **Check AI Provider Status**
   ```bash
   curl http://localhost:5000/api/health/ai
   ```

2. **Ollama Issues**
   ```bash
   # Check if Ollama is running
   curl http://localhost:11434/api/tags
   
   # Check installed models
   ollama list
   ```

3. **HuggingFace Issues**
   - Verify API key is correct
   - Check account has sufficient credits
   - Try with smaller model

### Database Connection Failed

1. Ensure MongoDB is running
2. Check connection string
3. Verify network access
4. Check credentials

### Authentication Issues

1. Token expired → Re-login
2. Invalid token → Check token format
3. Missing token → Add Authorization header

## Performance Optimization

- Enable query caching for frequently accessed data
- Implement pagination for large result sets
- Use MongoDB indexes on frequently queried fields
- Consider connection pooling for database
- Implement rate limiting

## Security Best Practices

- Never commit `.env` to version control
- Use strong JWT secrets (32+ characters)
- Implement rate limiting on API endpoints
- Sanitize user inputs
- Use HTTPS in production
- Keep dependencies updated
- Enable MongoDB authentication

## Support and Contributions

For issues, questions, or contributions:
- Create GitHub Issue
- Submit Pull Request
- Contact: development team

## License

MIT License - See LICENSE file

## Version

1.0.0 - Initial Release
