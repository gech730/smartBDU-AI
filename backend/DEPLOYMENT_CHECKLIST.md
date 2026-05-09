# SmartBDU AI - Production Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Review
- [ ] All endpoints tested
- [ ] Error handling in place
- [ ] No hardcoded secrets
- [ ] Code follows conventions
- [ ] Comments added where needed

### ✅ Security
- [ ] `.env` file not committed to git
- [ ] `.gitignore` includes `.env`
- [ ] Strong JWT secret (32+ characters)
- [ ] MongoDB authentication enabled
- [ ] CORS configured for production domain
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured

### ✅ Environment Configuration
- [ ] `NODE_ENV=production`
- [ ] Production MongoDB URI
- [ ] Valid JWT secret
- [ ] AI provider configured
- [ ] All required env vars set

### ✅ Database
- [ ] MongoDB Atlas or secure local MongoDB
- [ ] Database indexes created
- [ ] Data seeding completed
- [ ] Backup strategy in place

### ✅ Performance
- [ ] Connection pooling configured
- [ ] Pagination on large queries
- [ ] Query optimization
- [ ] Caching where needed
- [ ] Compression enabled

### ✅ Monitoring
- [ ] Error logging configured
- [ ] Health check endpoint
- [ ] Request logging
- [ ] Performance metrics
- [ ] Uptime monitoring

---

## Environment Variables for Production

```env
# Server
NODE_ENV=production
PORT=4000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smartbdu

# Security
JWT_SECRET=your-very-long-and-secure-secret-key-here-32chars

# AI (Production-ready)
AI_PROVIDER=ollama  # or huggingface with proper scaling
OLLAMA_URL=http://your-ollama-server:11434
OLLAMA_MODEL=mistral

# Optional
LOG_LEVEL=info
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

---

## Deployment Options

### Option 1: Traditional Server (VPS)

```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# 4. Install Ollama (for AI)
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull mistral

# 5. Clone and setup
git clone your-repo
cd smartBDU/backend
npm install --production
cp .env.example .env
# Edit .env with production values

# 6. Start with PM2
npm install -g pm2
pm2 start server.js --name smartbdu

# 7. Setup Nginx reverse proxy
sudo nano /etc/nginx/sites-available/smartbdu
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/smartbdu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option 2: Docker & Docker Compose

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/smartbdu
      - JWT_SECRET=${JWT_SECRET}
      - AI_PROVIDER=${AI_PROVIDER}
      - OLLAMA_URL=http://ollama:11434
    depends_on:
      - mongo
      - ollama
    restart: unless-stopped

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

volumes:
  mongo_data:
  ollama_data:
```

```bash
# Build and run
docker-compose up -d

# With GPU support (NVIDIA)
docker-compose -f docker-compose.yml -f docker-compose.gpu.yml up -d
```

---

### Option 3: Render.com (Free Tier)

1. **Create Render Account**: https://render.com

2. **Create Web Service**:
   - Connect GitHub repository
   - Select backend folder
   - Build command: `npm install`
   - Start command: `npm start`

3. **Add Environment Variables**:
   - `NODE_ENV=production`
   - `MONGODB_URI` (use Render's free MongoDB or Atlas)
   - `JWT_SECRET` (generate strong secret)
   - `AI_PROVIDER=huggingface` (Ollama not available on Render free)

4. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment
   - Get URL: `https://your-app.onrender.com`

---

### Option 4: Railway.app

1. **Create Railway Account**: https://railway.app

2. **New Project**:
   - "Deploy from GitHub"
   - Select repository and backend folder

3. **Configure**:
   - Add MongoDB plugin
   - Add environment variables
   - Set start command: `npm start`

4. **Deploy**:
   - Railway auto-detects Node.js
   - Deploys automatically on push

---

### Option 5: AWS (Elastic Beanstalk)

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js smartbdu-backend
eb create smartbdu-env

# Deploy
eb deploy

# Configure environment
eb setenv NODE_ENV=production JWT_SECRET=your-secret

# Domain
eb setenv DOMAIN=your-domain.com
```

---

## Post-Deployment Verification

### ✅ Health Check
```bash
curl https://your-domain.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "ai": { "available": true },
  "database": { "status": "connected" }
}
```

### ✅ Authentication Test
```bash
# Register
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@domain.com","password":"pass123","name":"Test"}'

# Login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@domain.com","password":"pass123"}'

# Test chat
curl -X POST https://your-domain.com/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"Hello"}'
```

### ✅ AI Test
```bash
curl https://your-domain.com/api/health/ai
```

Expected:
```json
{
  "success": true,
  "ai": {
    "provider": "ollama",
    "model": "mistral",
    "available": true
  }
}
```

---

## Monitoring & Logging

### PM2 Setup (for traditional deployment)

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start server.js --name smartbdu

# Monitor
pm2 monitor

# View logs
pm2 logs smartbdu

# Restart on file changes (development)
pm2 start server.js --name smartbdu --watch

# Cluster mode (production)
pm2 start server.js -i max --name smartbdu

# Startup script
pm2 startup
pm2 save
```

### Log Management

```bash
# View recent logs
pm2 logs smartbdu --lines 50

# Rotate logs
pm2 install pm2-logrotate

# Configure rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:rotate_interval 86400
```

### Error Tracking (Optional)

**Sentry Integration:**
```javascript
// Install
npm install @sentry/node

// Setup in server.js
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: 'https://key@sentry.io/project',
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.errorHandler());
```

---

## Performance Optimization

### 1. Enable Compression
```bash
npm install compression
```

```javascript
import compression from 'compression';
app.use(compression());
```

### 2. Response Caching
```javascript
// Cache department list for 1 hour
app.get('/api/departments', cache('1 hour'), (req, res) => {
  // ...
});
```

### 3. Database Indexes
```javascript
// In models
messageSchema.index({ userId: 1, createdAt: -1 });
userSchema.index({ email: 1 }, { unique: true });
departmentSchema.index({ name: 'text', skills: 'text' });
```

### 4. Query Optimization
```javascript
// Use lean() for read-only queries
const departments = await Department.find({}).lean();

// Select only needed fields
const users = await User.find({}, 'name email').lean();
```

### 5. Connection Pooling
```javascript
// mongoose connection
mongoose.connect(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});
```

---

## Security Hardening

### 1. Helmet.js
```bash
npm install helmet
```

```javascript
import helmet from 'helmet';
app.use(helmet());
```

### 2. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);
```

### 3. Input Sanitization
```javascript
import mongoSanitize from 'express-mongo-sanitize';

app.use(mongoSanitize()); // Prevent NoSQL injection
```

### 4. CORS Configuration
```javascript
app.use(cors({
  origin: ['https://your-frontend.com'],
  credentials: true
}));
```

---

## Backup & Recovery

### Database Backup
```bash
# MongoDB Atlas - automated backups enabled

# Local MongoDB
mongodump --uri="mongodb://localhost:27017/smartbdu" --out=/backup/

# Restore
mongorestore --uri="mongodb://localhost:27017/smartbdu" /backup/smartbdu/
```

### Automated Backups (Cron)
```bash
# crontab -e
0 2 * * * mongodump --uri="mongodb://user:pass@cluster.mongodb.net/smartbdu" --out=/backups/$(date +\%Y\%m\%d)
```

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (nginx, AWS ELB)
- Deploy multiple instances with PM2 cluster
- Use Redis for session storage
- Consider Kubernetes for orchestration

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize queries
- Add caching layer (Redis)
- Use CDN for static assets

### AI Scaling
- Ollama: Deploy on powerful GPU server
- HuggingFace: Upgrade to Pro/Premium tier
- Consider dedicated AI inference endpoints

---

## Troubleshooting Production Issues

### High Response Time
1. Check database query performance
2. Monitor AI provider latency
3. Enable query caching
4. Scale horizontally

### Memory Leaks
1. Monitor with PM2: `pm2 monit`
2. Check for unclosed connections
3. Restart periodically (if needed)
4. Use heap dumps for debugging

### Database Connection Issues
1. Verify MongoDB URI
2. Check network/firewall rules
3. Monitor connection pool
4. Enable retry logic

### AI Not Responding
1. Check Ollama/HuggingFace status
2. Verify model is downloaded/available
3. Check API rate limits
4. Implement fallback responses

---

## Success Metrics

Track these metrics post-deployment:

- [ ] API response time < 2 seconds
- [ ] Error rate < 1%
- [ ] Uptime > 99%
- [ ] AI response accuracy > 90%
- [ ] User satisfaction
- [ ] System resource usage

---

## Emergency Procedures

### If System Down
1. Check logs: `pm2 logs smartbdu`
2. Restart service: `pm2 restart smartbdu`
3. Check database connection
4. Verify AI provider
5. Rollback if needed: `pm2 revert smartbdu`

### Rollback Procedure
```bash
# With PM2
pm2 log smartbdu --lines 100  # Check errors
pm2 restart smartbdu           # Try restart

# With Git
git revert HEAD
npm install
pm2 restart smartbdu

# With Docker
docker-compose down
docker-compose pull
docker-compose up -d
```

---

## Documentation for Operations

Create an operations manual including:

- System architecture diagram
- Contact information
- Escalation procedures
- Backup schedules
- Monitoring dashboards
- Common issues & solutions
- Runbooks for each service

---

## Final Checklist Before Going Live

- [ ] All tests passing
- [ ] Security audit complete
- [ ] Performance tested
- [ ] Monitoring configured
- [ ] Backups automated
- [ ] Documentation complete
- [ ] Team trained
- [ ] Rollback plan ready
- [ ] DNS configured
- [ ] SSL certificate installed
- [ ] Domain pointing to server
- [ ] Load balancer configured
- [ ] Firewall rules set
- [ ] Health checks working
- [ ] Alerts configured
- [ ] Go live date communicated

---

**Deployment Status**: Ready for Production ✅

For detailed deployment instructions, see SETUP_GUIDE.md or specific platform guides above.
