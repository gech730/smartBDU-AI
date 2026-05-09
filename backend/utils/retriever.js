import Department from '../models/Department.js';
import BDUInfo from '../models/BDUInfo.js';

class SemanticRetriever {
  constructor() {
    this.embeddingCache = new Map();
    this.vectorStore = null;
  }

  simpleTextToVector(text) {
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq = {};
    
    words.forEach(word => {
      if (word.length > 2) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    return wordFreq;
  }

  cosineSimilarity(vec1, vec2) {
    const allWords = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    allWords.forEach(word => {
      const val1 = vec1[word] || 0;
      const val2 = vec2[word] || 0;
      
      dotProduct += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    });
    
    if (norm1 === 0 || norm2 === 0) return 0;
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  getRelevantContext(query, maxResults = 5, minSimilarity = 0.1) {
    try {
      const queryVector = this.simpleTextToVector(query);
      
      const departments = [
        'Computer Science', 'Information Systems', 'Electrical Engineering',
        'Mechanical Engineering', 'Civil Engineering', 'Medicine', 'Nursing',
        'Business Administration', 'Economics', 'Law', 'Agriculture', 'Architecture',
        'Chemistry', 'Physics'
      ];
      
      const facilities = [
        'library', 'computer lab', 'hostel', 'sports complex', 'student center',
        'cafeteria', 'research center', 'workshop', 'clinic', 'sports facility'
      ];
      
      const admission = [
        'admission', 'requirements', 'application', 'deadline', 'eligibility',
        'undergraduate', 'graduate', 'international students'
      ];
      
      const careers = [
        'career', 'job', 'employment', 'salary', 'internship', 'placement',
        'professional development', 'job market'
      ];
      
      const studentLife = [
        'student life', 'clubs', 'activities', 'culture', 'sports', 'facilities',
        'accommodation', 'transportation'
      ];

      const categories = {
        departments,
        facilities,
        admission,
        careers,
        studentLife
      };

      const results = [];
      
      Object.entries(categories).forEach(([category, keywords]) => {
        keywords.forEach(keyword => {
          const keywordVector = this.simpleTextToVector(keyword);
          const similarity = this.cosineSimilarity(queryVector, keywordVector);
          
          if (similarity >= minSimilarity) {
            results.push({
              category,
              keyword,
              similarity
            });
          }
        });
      });

      results.sort((a, b) => b.similarity - a.similarity);
      
      return results.slice(0, maxResults);
    } catch (error) {
      console.error('Semantic retrieval error:', error.message);
      return [];
    }
  }

  async retrieveContext(query, options = {}) {
    const {
      maxResults = 5,
      includeDepartments = true,
      includeBDUInfo = true,
      minSimilarity = 0.1
    } = options;

    try {
      const queryLower = query.toLowerCase();
      const queryVector = this.simpleTextToVector(queryLower);
      
      let results = {
        departments: [],
        bduInfo: [],
        semanticMatches: this.getRelevantContext(query, maxResults)
      };

      if (includeDepartments) {
        const departments = await Department.find({}).lean();
        
        const deptScores = departments.map(dept => {
          const searchText = [
            dept.name,
            dept.description,
            dept.faculty,
            ...(dept.skills || []),
            ...(dept.careerOpportunities || []),
            ...(dept.courses?.map(c => `${c.code} ${c.name} ${c.description}`) || [])
          ].join(' ').toLowerCase();
          
          const deptVector = this.simpleTextToVector(searchText);
          const similarity = this.cosineSimilarity(queryVector, deptVector);
          
          const keywordMatches = this.keywordMatch(queryLower, {
            name: dept.name,
            skills: dept.skills,
            careers: dept.careerOpportunities,
            courses: dept.courses?.map(c => c.name)
          });
          
          const score = (similarity * 0.5) + (keywordMatches * 0.5);
          
          return {
            type: 'department',
            item: dept,
            score,
            similarity,
            keywordMatches
          };
        });
        
        results.departments = deptScores
          .filter(d => d.score > minSimilarity || d.keywordMatches > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
      }

      if (includeBDUInfo) {
        const bduInfos = await BDUInfo.find({ active: true }).lean();
        
        const infoScores = bduInfos.map(info => {
          const searchText = [
            info.title,
            info.description,
            ...(info.keywords || []),
            info.category
          ].join(' ').toLowerCase();
          
          const infoVector = this.simpleTextToVector(searchText);
          const similarity = this.cosineSimilarity(queryVector, infoVector);
          
          let keywordBoost = 0;
          info.keywords?.forEach(kw => {
            if (queryLower.includes(kw.toLowerCase())) {
              keywordBoost += 0.3;
            }
          });
          
          const score = similarity + keywordBoost;
          
          return {
            type: 'info',
            item: info,
            score
          };
        });
        
        results.bduInfo = infoScores
          .filter(i => i.score > minSimilarity)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
      }

      return this.formatContext(results);
    } catch (error) {
      console.error('Retrieval error:', error.message);
      return '';
    }
  }

  keywordMatch(query, obj) {
    let matches = 0;
    
    if (typeof obj === 'string') {
      if (query.includes(obj.toLowerCase())) matches += 1;
    } else if (Array.isArray(obj)) {
      obj.forEach(item => {
        if (item && query.includes(item.toString().toLowerCase())) {
          matches += 0.5;
        }
      });
    }
    
    return matches;
  }

  formatContext(results) {
    const parts = [];
    
    if (results.departments.length > 0) {
      const deptContext = results.departments.map(d => {
        const dept = d.item;
        return `${dept.name} (${dept.code}):
  Description: ${dept.description}
  Duration: ${dept.duration}
  Skills: ${dept.skills?.join(', ') || 'N/A'}
  Careers: ${dept.careerOpportunities?.join(', ') || 'N/A'}
  Courses: ${dept.courses?.map(c => `${c.code}: ${c.name}`).join(', ') || 'N/A'}`;
      }).join('\n\n');
      
      parts.push(`DEPARTMENTS:\n${deptContext}`);
    }
    
    if (results.bduInfo.length > 0) {
      const infoContext = results.bduInfo.map(i => {
        const info = i.item;
        return `[${info.category.toUpperCase()}] ${info.title}:
  ${info.description}`;
      }).join('\n\n');
      
      parts.push(`UNIVERSITY INFORMATION:\n${infoContext}`);
    }
    
    if (results.semanticMatches.length > 0) {
      const semanticContext = results.semanticMatches
        .slice(0, 3)
        .map(m => `Related topic: ${m.keyword} (${m.category})`)
        .join(', ');
      
      parts.push(`SEMANTIC MATCHES:\n${semanticContext}`);
    }
    
    return parts.join('\n\n');
  }

  async hybridSearch(query, options = {}) {
    const {
      departmentBoost = 1.0,
      infoBoost = 0.8,
      semanticBoost = 0.6
    } = options;

    const context = await this.retrieveContext(query, options);
    
    return {
      context,
      metadata: {
        departmentsFound: context.includes('DEPARTMENTS:'),
        infoFound: context.includes('UNIVERSITY INFORMATION:'),
        semanticMatches: this.getRelevantContext(query, 3).map(m => m.keyword),
        retrievalMethod: 'hybrid',
        timestamp: new Date().toISOString()
      }
    };
  }

  clearCache() {
    this.embeddingCache.clear();
    console.log('Embedding cache cleared');
  }
}

const retriever = new SemanticRetriever();

export default retriever;
export { SemanticRetriever };
