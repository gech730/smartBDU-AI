# SmartBDU AI - API Reference Documentation

## Base URL

```
Development: http://localhost:4000/api
Production:  https://your-domain.com/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@bdu.edu.et",
  "password": "securepassword123",
  "interests": ["technology", "programming"],
  "favoriteSubjects": ["math", "physics"],
  "goals": ["Become a software engineer"]
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@bdu.edu.et",
    "interests": ["technology", "programming"]
  }
}
```

**Errors:**
- 400: Validation error (invalid email, weak password)
- 409: Email already exists

---

### Login User

Authenticate and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@bdu.edu.et",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@bdu.edu.et",
    "interests": ["technology", "programming"]
  }
}
```

**Errors:**
- 401: Invalid credentials

---

### Get User Profile

Retrieve current user's profile.

**Endpoint:** `GET /api/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@bdu.edu.et",
    "interests": ["technology", "programming"],
    "favoriteSubjects": ["math", "physics"],
    "goals": ["Become a software engineer"],
    "preferredDepartment": "Computer Science",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Errors:**
- 401: Unauthorized

---

### Update User Profile

Update user profile information.

**Endpoint:** `PUT /api/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "interests": ["AI", "data science"],
  "favoriteSubjects": ["math", "statistics"],
  "goals": ["Become an AI engineer"]
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Updated",
    "interests": ["AI", "data science"],
    "favoriteSubjects": ["math", "statistics"],
    "goals": ["Become an AI engineer"]
  }
}
```

---

## 💬 Chat Endpoints

### Send Message

Send a message to the AI assistant.

**Endpoint:** `POST /api/chat`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "Tell me about Computer Science at BDU"
}
```

**Response (200):**
```json
{
  "success": true,
  "response": "Computer Science at Bahir Dar University is a 4-year program...",
  "metadata": {
    "provider": "ollama",
    "model": "mistral",
    "context_used": true,
    "response_time_ms": 2500
  }
}
```

**Errors:**
- 400: Empty message
- 401: Unauthorized
- 503: AI service unavailable

---

### Get Chat History

Retrieve user's chat history.

**Endpoint:** `GET /api/chat/history`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional): Number of messages (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response (200):**
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg_id",
      "role": "user",
      "content": "Tell me about Computer Science",
      "createdAt": "2024-01-15T10:35:00Z"
    },
    {
      "id": "msg_id",
      "role": "assistant",
      "content": "Computer Science at BDU is...",
      "createdAt": "2024-01-15T10:35:02Z"
    }
  ],
  "total": 45,
  "limit": 100,
  "offset": 0
}
```

---

### Clear Chat History

Delete all user's chat messages.

**Endpoint:** `DELETE /api/chat/history`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Chat history cleared successfully",
  "deletedCount": 45
}
```

---

## 🎓 Department Endpoints

### Get All Departments

List all university departments.

**Endpoint:** `GET /api/departments`

**Query Parameters:**
- `faculty` (optional): Filter by faculty
- `duration` (optional): Filter by program duration
- `sort` (optional): Sort field (popularity, name)
- `order` (optional): asc or desc

**Response (200):**
```json
{
  "success": true,
  "departments": [
    {
      "id": "dept_id",
      "name": "Computer Science",
      "code": "CS",
      "faculty": "Faculty of Computing and Informatics",
      "description": "Study of computation and information processing...",
      "duration": "4 years",
      "requirements": ["Strong math skills", "Logical thinking"],
      "skills": ["Programming", "Machine Learning", "Data Science"],
      "courses": [
        { "code": "CS101", "name": "Introduction to Programming" },
        { "code": "CS201", "name": "Data Structures" }
      ],
      "careerOpportunities": ["Software Developer", "Data Scientist"],
      "salaryRange": { "min": 15000, "max": 80000, "currency": "ETB" },
      "popularity": 95
    }
  ],
  "total": 14
}
```

---

### Get Department by ID

Get detailed information about a specific department.

**Endpoint:** `GET /api/departments/:id`

**Response (200):**
```json
{
  "success": true,
  "department": {
    "id": "dept_id",
    "name": "Computer Science",
    "code": "CS",
    "faculty": "Faculty of Computing and Informatics",
    "description": "Full description here...",
    "duration": "4 years",
    "requirements": ["Strong math skills", "Logical thinking", "Problem-solving"],
    "skills": ["Programming", "Data Structures", "Algorithms", "AI", "Database"],
    "courses": [
      { "code": "CS101", "name": "Introduction to Programming", "description": "..." },
      { "code": "CS201", "name": "Data Structures", "description": "..." }
    ],
    "careerOpportunities": ["Software Developer", "Data Scientist", "AI Engineer"],
    "salaryRange": { "min": 15000, "max": 80000, "currency": "ETB" },
    "popularity": 95
  }
}
```

---

### Get Department Recommendations

Get AI-powered department recommendations based on user profile.

**Endpoint:** `POST /api/departments/recommend`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "interests": ["technology", "problem solving"],
  "favoriteSubjects": ["mathematics", "physics"],
  "goals": ["work in tech industry"],
  "skills": ["logical thinking", "programming basics"]
}
```

**Response (200):**
```json
{
  "success": true,
  "recommendations": [
    {
      "department": "Computer Science",
      "matchScore": 95,
      "reason": "Perfect match for your interests in technology and problem-solving.",
      "skills": ["Programming", "Data Structures", "Algorithms", "AI"],
      "careers": ["Software Developer", "Data Scientist", "AI Engineer"]
    },
    {
      "department": "Information Systems",
      "matchScore": 78,
      "reason": "Good fit if you're interested in combining technology with business.",
      "skills": ["Business Analysis", "Database Management", "Project Management"],
      "careers": ["Business Analyst", "IT Consultant"]
    }
  ],
  "profile_summary": {
    "interests": "technology, problem solving",
    "best_fit": "Computer Science"
  }
}
```

---

### Search Departments

Search departments by keywords.

**Endpoint:** `GET /api/departments/search`

**Query Parameters:**
- `q` (required): Search query
- `field` (optional): Specific field to search (name, skills, careers)

**Example:** `GET /api/departments/search?q=programming&field=name`

**Response (200):**
```json
{
  "success": true,
  "query": "programming",
  "results": [
    {
      "id": "dept_id",
      "name": "Computer Science",
      "code": "CS",
      "relevanceScore": 95,
      "matchedOn": ["skills", "description"]
    }
  ],
  "total": 1
}
```

---

## 🛤️ Roadmap Endpoints

### Generate Learning Roadmap

Generate a personalized learning roadmap for a career path.

**Endpoint:** `POST /api/roadmap/generate`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "targetRole": "Full Stack Developer",
  "currentSkills": ["HTML", "CSS"],
  "timeframe": "6 months",
  "interest": "Web Development"
}
```

**Response (200):**
```json
{
  "success": true,
  "roadmap": {
    "id": "roadmap_id",
    "title": "Full Stack Developer Path",
    "overview": "Become a complete web developer...",
    "skills": ["HTML", "CSS", "JavaScript", "React", "Node.js", "Databases"],
    "steps": [
      {
        "title": "Master HTML & CSS Fundamentals",
        "description": "Build responsive layouts...",
        "duration": "2 weeks",
        "resources": ["MDN Web Docs", "freeCodeCamp"],
        "skills": ["HTML5", "CSS3", "Flexbox", "Grid"]
      },
      {
        "title": "Learn JavaScript",
        "description": "Master JavaScript fundamentals...",
        "duration": "4 weeks",
        "resources": ["JavaScript.info", "Eloquent JavaScript"],
        "skills": ["ES6+", "DOM Manipulation", "Async/Await"]
      }
    ],
    "tools": ["VS Code", "Git", "Chrome DevTools", "Node.js"],
    "timeline": {
      "beginner": "0-3 months",
      "intermediate": "3-6 months",
      "advanced": "6-12 months"
    },
    "careers": ["Frontend Developer", "Full Stack Developer", "Web Architect"]
  }
}
```

---

### Get User Roadmaps

Retrieve all roadmaps generated by the user.

**Endpoint:** `GET /api/roadmap`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "roadmaps": [
    {
      "id": "roadmap_id",
      "title": "Full Stack Developer Path",
      "overview": "...",
      "targetRole": "Full Stack Developer",
      "createdAt": "2024-01-15T10:30:00Z",
      "progress": 0,
      "completedSteps": []
    }
  ],
  "total": 1
}
```

---

### Get Roadmap by ID

Get a specific roadmap.

**Endpoint:** `GET /api/roadmap/:id`

**Response (200):** Same as generate endpoint

---

### Delete Roadmap

Delete a roadmap.

**Endpoint:** `DELETE /api/roadmap/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Roadmap deleted successfully"
}
```

---

## 💼 Career Endpoints

### Get CV Tips

Get AI-generated CV/resume writing tips for a specific role.

**Endpoint:** `POST /api/career/cv-tips`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "targetRole": "Software Engineer",
  "experience": "entry-level"
}
```

**Response (200):**
```json
{
  "success": true,
  "tips": {
    "role": "Software Engineer",
    "sections": [
      "Contact Information",
      "Professional Summary",
      "Education",
      "Technical Skills",
      "Projects",
      "Work Experience"
    ],
    "content": "# CV Writing Tips for Software Engineer\n\n## Key Sections..."
  }
}
```

---

### Get Interview Preparation

Get AI-generated interview preparation tips.

**Endpoint:** `POST /api/career/interview-prep`

**Request Body:**
```json
{
  "targetRole": "Software Engineer",
  "interviewType": "technical"
}
```

**Response (200):**
```json
{
  "success": true,
  "preparation": {
    "role": "Software Engineer",
    "type": "technical",
    "content": "# Interview Preparation Guide\n\n## Common Questions..."
  }
}
```

---

### Generate CV

Generate a professional CV/resume.

**Endpoint:** `POST /api/cv/generate`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "template": "modern",
  "fullName": "John Doe",
  "email": "john@bdu.edu.et",
  "phone": "+251912345678",
  "careerGoal": "Software engineer",
  "summary": "Passionate developer with experience in...",
  "education": [
    {
      "institution": "Bahir Dar University",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "year": "2024"
    }
  ],
  "skills": ["JavaScript", "Python", "React", "Node.js", "Git"],
  "projects": [
    {
      "name": "E-commerce Platform",
      "description": "Built a full-stack e-commerce application",
      "technologies": "React, Node.js, MongoDB"
    }
  ],
  "experience": [
    {
      "company": "Tech Startup",
      "role": "Software Developer Intern",
      "duration": "6 months",
      "responsibilities": "Developed web features, collaborated with team"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "cv": {
    "template": "modern",
    "content": "John Doe\njohn@bdu.edu.et | +251912345678\n\nCareer Objective...",
    "generatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 🎯 Career Recommendations

### Get Career Recommendations

Get career path recommendations based on interests and skills.

**Endpoint:** `POST /api/career-recommend`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "interests": ["technology", "creativity"],
  "skills": ["problem solving", "communication"],
  "education": "Computer Science"
}
```

**Response (200):**
```json
{
  "success": true,
  "recommendations": [
    {
      "career": "Software Engineer",
      "matchScore": 92,
      "description": "Design and develop software applications...",
      "requiredSkills": ["Programming", "Problem Solving", "Teamwork"],
      "growthPotential": "High",
      "salary": { "min": 25000, "max": 100000, "currency": "ETB" }
    }
  ]
}
```

---

## 📊 Analytics Endpoints

### Track User Action

Track user interactions for analytics.

**Endpoint:** `POST /api/analytics/track`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "action": "department_view",
  "metadata": {
    "departmentId": "dept_id",
    "departmentName": "Computer Science"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "tracked": true
}
```

---

### Get Analytics Dashboard

Get analytics data for the user.

**Endpoint:** `GET /api/analytics/dashboard`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "totalChats": 45,
    "departmentsViewed": 12,
    "roadmapsGenerated": 3,
    "favoriteDepartment": "Computer Science",
    "commonQuestions": [
      "Admission requirements",
      "Computer Science details",
      "Career paths"
    ],
    "activityTimeline": [
      { "date": "2024-01-15", "actions": 5 },
      { "date": "2024-01-14", "actions": 3 }
    ]
  }
}
```

---

## 🏥 System Endpoints

### Health Check

Check API health status.

**Endpoint:** `GET /api/health`

**Response (200):**
```json
{
  "status": "ok",
  "message": "SmartBDU AI Server is running",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "ai": {
    "provider": "ollama",
    "model": "mistral",
    "available": true
  },
  "database": {
    "status": "connected",
    "collections": 5
  }
}
```

---

### AI Status

Check AI provider status.

**Endpoint:** `GET /api/health/ai`

**Response (200):**
```json
{
  "success": true,
  "ai": {
    "provider": "ollama",
    "model": "mistral",
    "available": true,
    "url": "http://localhost:11434",
    "instructions": "To install: ollama pull mistral"
  }
}
```

---

## Common Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here",
  "code": "ERROR_CODE",
  "details": {} // Optional additional info
}
```

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (invalid/missing token)
- **404**: Not Found
- **409**: Conflict (duplicate entry)
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error
- **503**: Service Unavailable (AI provider down)

---

## Rate Limiting

Protected endpoints are rate limited to:
- **100 requests per minute** per user
- **1000 requests per hour** per user

Rate limit headers included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642234567
```

---

## Webhooks & Real-time

Currently, the API uses polling for chat. For real-time features:

**Option 1: Polling** (Current)
```javascript
// Poll every 2 seconds
setInterval(async () => {
  const messages = await api.get('/chat/history');
}, 2000);
```

**Option 2: WebSocket** (Future)
WebSocket support can be added using Socket.io for real-time chat.

---

## Pagination

List endpoints support pagination:

```
GET /api/chat/history?limit=20&offset=0
```

**Response includes:**
```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## Filtering & Sorting

**Departments Example:**
```
GET /api/departments?faculty=Computing&duration=4+years&sort=popularity&order=desc
```

---

## Testing Examples

### Using Fetch (JavaScript)

```javascript
// Login
const login = async () => {
  const response = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@bdu.edu.et',
      password: 'password123'
    })
  });
  const data = await response.json();
  return data.token;
};

// Chat
const chat = async (token, message) => {
  const response = await fetch('http://localhost:4000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });
  const data = await response.json();
  return data.response;
};
```

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 30000
});

// Add token interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Use in components
const sendMessage = async (message) => {
  const response = await api.post('/chat', { message });
  return response.data.response;
};
```

### Using cURL

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@bdu.edu.et","password":"test123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@bdu.edu.et","password":"test123"}'

# Get departments
curl http://localhost:4000/api/departments

# Chat (replace TOKEN)
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"message":"What is Computer Science?"}'
```

---

## API Versioning

Current version: v1

Future versions will be available at:
- v1: `/api/` (current)
- v2: `/api/v2/` (planned)

Breaking changes will increment version number.

---

## Need Help?

- **Documentation**: Check README files
- **Issues**: Create GitHub Issue
- **Support**: Contact development team

---

**Last Updated:** January 2024  
**API Version:** 1.0.0
