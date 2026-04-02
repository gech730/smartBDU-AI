import * as hfProvider from './providers/huggingface.js';
import * as ollamaProvider from './providers/ollama.js';
import Department from '../models/Department.js';
import BDUInfo from '../models/BDUInfo.js';

const getProvider = () => {
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  
  switch (provider) {
    case 'ollama':
      return ollamaProvider;
    case 'huggingface':
    default:
      return hfProvider;
  }
};

const chat = async (messages) => {
  const provider = getProvider();
  return provider.chat(messages);
};

const getProviderStatus = async () => {
  const provider = getProvider();
  if (provider.getStatus) {
    return provider.getStatus();
  }
  return { provider: process.env.AI_PROVIDER || 'huggingface', available: false };
};

const getCurrentProvider = () => {
  return process.env.AI_PROVIDER?.toLowerCase() || 'huggingface';
};

const SYSTEM_PROMPT = `You are SmartBDU AI, an intelligent assistant for Bahir Dar University (BDU) students.

Your role:
- Help students choose departments at BDU
- Answer questions about BDU campuses, facilities, and admissions
- Provide study strategies and career advice

IMPORTANT RULES:
- ALWAYS use the provided context information to answer questions
- If the context contains relevant BDU information, use it to form your answer
- Only answer based on the provided context - do NOT use your own training knowledge
- If context is provided, base your answer on it specifically
- If no relevant context is available, politely ask the user for more details or say "I don't have that specific information, but here's what I know about BDU generally..."

Response format:
1. Brief explanation based on context
2. Key points
3. Any recommended next steps`;

const generateMessages = (userMessage, context = '', userProfile = null) => {
  const messages = [];
  
  messages.push({ role: 'system', content: SYSTEM_PROMPT });
  
  if (context) {
    messages.push({
      role: 'system',
      content: `--- Relevant BDU Information ---\n${context}`
    });
  }
  
  if (userProfile) {
    const profileParts = [];
    if (userProfile.interests?.length) profileParts.push(`Interests: ${userProfile.interests.join(', ')}`);
    if (userProfile.favoriteSubjects?.length) profileParts.push(`Subjects: ${userProfile.favoriteSubjects.join(', ')}`);
    if (userProfile.goals?.length) profileParts.push(`Goals: ${userProfile.goals.join(', ')}`);
    
    if (profileParts.length > 0) {
      messages.push({ role: 'system', content: `--- User Profile ---\n${profileParts.join('\n')}` });
    }
  }

  messages.push({ role: 'user', content: userMessage });
  
  return messages;
};

const retrieveContext = async (query) => {
  try {
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(w => w.length > 2);
    
    // Search departments
    const departments = await Department.find({});
    const deptScored = departments.map(dept => {
      let score = 0;
      const searchText = `${dept.name} ${dept.description} ${dept.skills?.join(' ') || ''} ${dept.careerOpportunities?.join(' ') || ''}`.toLowerCase();
      
      keywords.forEach(kw => {
        if (searchText.includes(kw)) score += 1;
      });
      
      if (queryLower.includes(dept.name.toLowerCase())) score += 5;
      
      return { type: 'department', item: dept, score };
    });
    
    // Search BDU info
    const bduInfos = await BDUInfo.find({ active: true });
    const infoScored = bduInfos.map(info => {
      let score = 0;
      const searchText = `${info.title} ${info.description} ${info.keywords?.join(' ') || ''}`.toLowerCase();
      
      keywords.forEach(kw => {
        if (searchText.includes(kw)) score += 2;
      });
      
      info.keywords?.forEach(kw => {
        if (queryLower.includes(kw.toLowerCase())) score += 5;
      });
      
      return { type: 'info', item: info, score };
    });
    
    // Combine and sort
    const allResults = [...deptScored, ...infoScored]
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    if (allResults.length === 0) return '';
    
    // Format context
    const contextParts = allResults.map(result => {
      if (result.type === 'department') {
        const dept = result.item;
        return `${dept.name} (${dept.code}): ${dept.description}. Skills: ${dept.skills?.join(', ') || 'N/A'}. Careers: ${dept.careerOpportunities?.join(', ') || 'N/A'}`;
      } else {
        const info = result.item;
        return `[${info.category.toUpperCase()}] ${info.title}: ${info.description}`;
      }
    });
    
    return contextParts.join('\n\n');
  } catch (error) {
    console.error('Retrieval error:', error.message);
    return '';
  }
};

export const generateChatResponse = async (userMessage, userProfile = null) => {
  const context = await retrieveContext(userMessage);
  const messages = generateMessages(userMessage, context, userProfile);
  
  const response = await chat(messages);
  
  if (!response || response.trim() === '') {
    return "I'm sorry, I couldn't generate a response. Could you try rephrasing your question?";
  }
  
  return response;
};

export const fetchRelevantDepartments = async (query) => {
  const departments = await Department.find({});
  
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  const scored = departments.map(dept => {
    let score = 0;
    const searchText = `${dept.name} ${dept.description} ${dept.skills?.join(' ') || ''} ${dept.careerOpportunities?.join(' ') || ''}`.toLowerCase();
    
    keywords.forEach(kw => {
      if (searchText.includes(kw)) score += 1;
    });
    
    if (queryLower.includes(dept.name.toLowerCase())) score += 5;
    
    return { dept, score };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.dept);
};

export const generateRoadmap = async (targetRole, currentSkills, timeframe, interest = null) => {
  let context = '';
  
  try {
    if (interest) {
      const departments = await Department.find({});
      const queryLower = interest.toLowerCase();
      const keywords = queryLower.split(/\s+/).filter(w => w.length > 2);
      
      const scored = departments.map(dept => {
        let score = 0;
        const searchText = `${dept.name} ${dept.description} ${dept.skills?.join(' ') || ''} ${dept.careerOpportunities?.join(' ') || ''}`.toLowerCase();
        
        keywords.forEach(kw => {
          if (searchText.includes(kw)) score += 1;
        });
        if (dept.name.toLowerCase().includes(queryLower)) score += 5;
        
        return { dept, score };
      });
      
      const relevant = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map(s => s.dept);
      
      if (relevant.length > 0) {
        context = relevant.map(dept => 
          `- ${dept.name} (${dept.code}): ${dept.description}. Skills: ${dept.skills?.join(', ') || 'N/A'}. Careers: ${dept.careerOpportunities?.join(', ') || 'N/A'}`
        ).join('\n');
      }
    }
  } catch (e) {
    console.warn('Context retrieval error:', e.message);
  }

  const prompt = `<system>You are SmartBDU AI, a helpful university advisor for Bahir Dar University students. Create learning roadmaps in JSON format only.</system>

${context ? `--- Relevant BDU Department Information ---\n${context}\n` : ''}
Create a detailed learning roadmap for: ${targetRole || interest}

${currentSkills?.length ? `Current skills: ${currentSkills.join(', ')}` : ''}
Timeframe: ${timeframe || '6 months'}

Provide a structured roadmap with the following EXACT JSON format:
{
  "title": "Roadmap Title",
  "overview": "Brief overview of what the learner will achieve",
  "skills": ["skill1", "skill2", "skill3"],
  "steps": [
    {
      "title": "Step Title",
      "description": "Brief description of what to learn",
      "duration": "Time period",
      "resources": ["resource1", "resource2"],
      "skills": ["skill1", "skill2"]
    }
  ],
  "tools": ["tool1", "tool2", "tool3"],
  "timeline": {
    "beginner": "0-3 months",
    "intermediate": "3-6 months",
    "advanced": "6-12 months"
  },
  "careers": ["career1", "career2"]
}

IMPORTANT: 
- Return ONLY valid JSON, no additional text
- Include at least 5-7 steps
- Provide realistic timeline and resources
- Make it beginner-friendly

JSON Response:`;

  try {
    const result = await chat([{ role: 'user', content: prompt }]);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { error: 'Failed to parse roadmap', raw: result };
  } catch (e) {
    return { error: 'Failed to generate roadmap: ' + e.message };
  }
};

export const getCVTips = async (targetRole) => {
  const prompt = `<system>You are SmartBDU AI, a helpful career advisor.</system>

Provide professional CV/resume writing tips for someone targeting a ${targetRole} position. Include:
1. Key sections to include
2. What to highlight
3. Common mistakes to avoid
4. Formatting tips

Format as structured markdown.`;

  return await chat([{ role: 'user', content: prompt }]);
};

export const getInterviewPrep = async (targetRole) => {
  const prompt = `<system>You are SmartBDU AI, a helpful career advisor.</system>

Provide interview preparation tips for a ${targetRole} position. Include:
1. Common interview questions for this role
2. How to prepare answers
3. Body language tips
4. Questions to ask the interviewer

Format as structured markdown.`;

  return await chat([{ role: 'user', content: prompt }]);
};

export const recommendDepartments = async (userInterests, favoriteSubjects) => {
  const prompt = `<system>You are SmartBDU AI, a university advisor.</system>

Based on the following student profile, recommend the best departments from Bahir Dar University:
        
User Interests: ${userInterests.join(', ')}
Favorite Subjects: ${favoriteSubjects.join(', ')}

For each recommendation, explain:
1. Why it's a good fit
2. What skills they'll develop
3. Career opportunities

Format as JSON with this structure:
{
  "recommendations": [
    {
      "department": "Department Name",
      "matchScore": 95,
      "reason": "Explanation",
      "skills": ["skill1", "skill2"],
      "careers": ["career1", "career2"]
    }
  ]
}

JSON Response:`;

  try {
    const result = await chat([{ role: 'user', content: prompt }]);
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { error: 'Failed to parse recommendations' };
  } catch (e) {
    return { error: 'Failed to get recommendations: ' + e.message };
  }
};

export const getDepartmentInfo = async (departmentName) => {
  const dept = await Department.findOne({ 
    $or: [
      { name: { $regex: departmentName, $options: 'i' } },
      { code: { $regex: departmentName, $options: 'i' } }
    ]
  });

  if (!dept) return null;

  const prompt = `<system>You are SmartBDU AI, a helpful university advisor.</system>

Provide detailed information about ${dept.name} at Bahir Dar University in a friendly, helpful way. Include:
1. What students learn
2. Key skills developed
3. Career paths
4. Why a student might enjoy this field

Department info: ${dept.description}
Skills: ${dept.skills?.join(', ') || 'N/A'}
Careers: ${dept.careerOpportunities?.join(', ') || 'N/A'}`;

  const aiDescription = await chat([{ role: 'user', content: prompt }]);

  return {
    ...dept.toObject(),
    aiDescription
  };
};

export const checkAPIStatus = async () => {
  const status = await getProviderStatus();
  return {
    ...status,
    provider: getCurrentProvider()
  };
};

export const generateCV = async (cvData, template = 'modern') => {
  const prompt = `<system>You are a professional CV/resume writer. Create a clean, professional CV in plain text format without any markdown symbols like ** or ##.</system>

Create a ${template} style CV for the following candidate:

Personal Information:
- Full Name: ${cvData.fullName}
- Email: ${cvData.email}
- Phone: ${cvData.phone || 'Not provided'}
- Career Goal: ${cvData.careerGoal || 'Not specified'}

Summary: ${cvData.summary || 'Not provided'}

Education (list all with institution, degree, field, year):
${cvData.education.map(e => `- ${e.institution}: ${e.degree} in ${e.field}, ${e.year}`).join('\n') || 'Not provided'}

Skills (comma separated):
${cvData.skills.join(', ') || 'Not provided'}

Projects (list with name, description, technologies used):
${cvData.projects.map(p => `- ${p.name}: ${p.description} (${p.technologies})`).join('\n') || 'Not provided'}

Experience (list with company, role, duration, responsibilities):
${cvData.experience.map(e => `- ${e.company}: ${e.role} (${e.duration})\n  ${e.responsibilities}`).join('\n') || 'Not provided'}

Create a professional CV with the following structure:
1. HEADER - Name, Email, Phone (single line)
2. CAREER OBJECTIVE - Brief summary
3. EDUCATION - List with details
4. SKILLS - Organized by category if possible
5. PROJECTS - Brief descriptions
6. EXPERIENCE - Key responsibilities and achievements

IMPORTANT: Use plain text only, no markdown symbols like ** or ##. Use clean formatting with clear sections.`;

  try {
    const result = await chat([{ role: 'user', content: prompt }]);
    return result;
  } catch (error) {
    console.error('CV generation error:', error.message);
    return 'Failed to generate CV. Please try again.';
  }
};
