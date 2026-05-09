import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class SetupValidator {
  constructor() {
    this.results = [];
    this.errors = [];
  }

  log(message, type = 'info') {
    const prefix = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      title: '📋'
    }[type] || '•';

    console.log(`${prefix} ${message}`);
    this.results.push({ message, type });
  }

  async checkMongoDB() {
    this.log('Checking MongoDB Connection...', 'title');
    
    try {
      const uri = process.env.MONGODB_URI;
      
      if (!uri) {
        throw new Error('MONGODB_URI not configured');
      }

      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      const collections = await mongoose.connection.db.listCollections().toArray();
      
      this.log(`MongoDB connected successfully`, 'success');
      this.log(`Database: ${mongoose.connection.name}`, 'info');
      this.log(`Collections: ${collections.length}`, 'info');
      
      await mongoose.connection.close();
      return true;
    } catch (error) {
      this.errors.push({ check: 'MongoDB', error: error.message });
      this.log(`MongoDB Error: ${error.message}`, 'error');
      
      if (error.message.includes('ECONNREFUSED')) {
        this.log('Solution: Make sure MongoDB is running', 'warning');
      }
      
      return false;
    }
  }

  async checkAIPProvider() {
    this.log('\nChecking AI Provider Configuration...', 'title');
    
    const provider = process.env.AI_PROVIDER?.toLowerCase();
    
    if (provider === 'ollama') {
      return await this.checkOllama();
    } else if (provider === 'huggingface') {
      return await this.checkHuggingFace();
    } else {
      this.log(`AI_PROVIDER not set, defaulting to ollama`, 'warning');
      return await this.checkOllama();
    }
  }

  async checkOllama() {
    try {
      const url = process.env.OLLAMA_URL || 'http://localhost:11434';
      this.log(`Checking Ollama at ${url}`, 'info');
      
      const response = await axios.get(`${url}/api/tags`, {
        timeout: 5000
      });
      
      if (response.data?.models) {
        this.log(`Ollama connected successfully`, 'success');
        this.log(`Available models: ${response.data.models.length}`, 'info');
        
        const models = response.data.models.map(m => m.name).join(', ');
        this.log(`Models: ${models}`, 'info');
        
        const model = process.env.OLLAMA_MODEL || 'mistral';
        const hasMistral = response.data.models.some(m => m.name.includes('mistral'));
        
        if (hasMistral) {
          this.log(`Mistral model is available ✓`, 'success');
          return true;
        } else {
          this.log(`Mistral model not found. Install with: ollama pull mistral`, 'warning');
          return false;
        }
      }
    } catch (error) {
      this.errors.push({ check: 'Ollama', error: error.message });
      this.log(`Ollama Error: ${error.message}`, 'error');
      this.log(`Solution: Start Ollama with 'ollama serve'`, 'warning');
      this.log(`Then install Mistral: ollama pull mistral`, 'warning');
      return false;
    }
    
    return false;
  }

  async checkHuggingFace() {
    try {
      const apiKey = process.env.HF_API_KEY;
      
      if (!apiKey || apiKey === 'hf_your_api_key_here') {
        this.log(`HF_API_KEY not configured`, 'error');
        this.log(`Get a free key at: https://huggingface.co/settings/tokens`, 'info');
        return false;
      }

      this.log(`Checking HuggingFace API key...`, 'info');
      
      const response = await axios.get(
        'https://huggingface.co/api/whoami-v2',
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          },
          timeout: 5000
        }
      );

      if (response.data?.name) {
        this.log(`HuggingFace authenticated successfully`, 'success');
        this.log(`Account: ${response.data.name}`, 'info');
        
        const model = process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3';
        this.log(`Model configured: ${model}`, 'info');
        
        return true;
      }
    } catch (error) {
      this.errors.push({ check: 'HuggingFace', error: error.message });
      this.log(`HuggingFace Error: ${error.message}`, 'error');
      
      if (error.response?.status === 401) {
        this.log(`Invalid API key`, 'error');
        this.log(`Get a valid key at: https://huggingface.co/settings/tokens`, 'info');
      }
      
      return false;
    }
    
    return false;
  }

  async testAIResponse() {
    this.log('\nTesting AI Response...', 'title');
    
    try {
      const provider = process.env.AI_PROVIDER?.toLowerCase() || 'ollama';
      
      if (provider === 'ollama') {
        const url = process.env.OLLAMA_URL || 'http://localhost:11434';
        const model = process.env.OLLAMA_MODEL || 'mistral';
        
        this.log(`Sending test request to Ollama...`, 'info');
        
        const startTime = Date.now();
        
        const response = await axios.post(
          `${url}/api/chat`,
          {
            model,
            messages: [
              { role: 'user', content: 'Say "Hello from SmartBDU!" and nothing else.' }
            ],
            stream: false
          },
          {
            timeout: 30000
          }
        );
        
        const duration = Date.now() - startTime;
        
        if (response.data?.message?.content) {
          this.log(`AI Response received in ${duration}ms`, 'success');
          this.log(`Response: "${response.data.message.content.trim()}"`, 'info');
          return true;
        }
      } else {
        const apiKey = process.env.HF_API_KEY;
        const model = process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3';
        
        this.log(`Sending test request to HuggingFace...`, 'info');
        
        const startTime = Date.now();
        
        const response = await axios.post(
          'https://router.huggingface.co/v1/chat/completions',
          {
            model,
            messages: [
              { role: 'user', content: 'Say "Hello from SmartBDU!" and nothing else.' }
            ],
            max_tokens: 50,
            stream: false
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        );
        
        const duration = Date.now() - startTime;
        
        if (response.data?.choices?.[0]?.message?.content) {
          this.log(`AI Response received in ${duration}ms`, 'success');
          this.log(`Response: "${response.data.choices[0].message.content.trim()}"`, 'info');
          return true;
        }
      }
    } catch (error) {
      this.errors.push({ check: 'AI Response', error: error.message });
      this.log(`AI Response Error: ${error.message}`, 'error');
      return false;
    }
    
    return false;
  }

  checkEnvironmentVariables() {
    this.log('Checking Environment Variables...', 'title');
    
    const required = [
      'MONGODB_URI',
      'JWT_SECRET'
    ];
    
    const optional = [
      'AI_PROVIDER',
      'HF_API_KEY',
      'HF_MODEL',
      'OLLAMA_URL',
      'OLLAMA_MODEL'
    ];
    
    let allRequired = true;
    
    required.forEach(varName => {
      const value = process.env[varName];
      if (!value) {
        this.log(`${varName} is not set`, 'error');
        allRequired = false;
      } else {
        const displayValue = varName === 'JWT_SECRET' ? '***' + value.slice(-4) : value;
        this.log(`${varName} = ${displayValue}`, 'success');
      }
    });
    
    this.log('\nOptional Variables:', 'info');
    optional.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        const displayValue = varName.includes('KEY') ? '***' : value;
        this.log(`${varName} = ${displayValue}`, 'success');
      } else {
        this.log(`${varName} = not set`, 'warning');
      }
    });
    
    return allRequired;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    this.log('VALIDATION SUMMARY', 'title');
    console.log('='.repeat(60));
    
    const passed = this.results.filter(r => r.type === 'success').length;
    const total = this.results.filter(r => r.type !== 'title').length;
    
    this.log(`Checks Passed: ${passed}/${total}`, passed === total ? 'success' : 'warning');
    
    if (this.errors.length > 0) {
      this.log('\nErrors Found:', 'error');
      this.errors.forEach(err => {
        this.log(`- ${err.check}: ${err.error}`, 'error');
      });
    }
    
    console.log('\n' + '='.repeat(60));
    
    if (this.errors.length === 0 && passed === total) {
      console.log('🎉 All checks passed! Your setup is ready.');
      console.log('\nNext steps:');
      console.log('1. npm run dev - Start the server');
      console.log('2. Test endpoints with Postman or curl');
      console.log('3. Integrate with frontend');
    } else {
      console.log('⚠️  Some checks failed. Please fix the issues above.');
      console.log('\nCommon solutions:');
      console.log('- MongoDB: Ensure MongoDB is running');
      console.log('- Ollama: Run "ollama serve" and "ollama pull mistral"');
      console.log('- HuggingFace: Get API key from https://huggingface.co/settings/tokens');
    }
    
    console.log('='.repeat(60));
    
    return this.errors.length === 0;
  }

  async runAll() {
    console.log('\n🔍 SmartBDU Backend - Environment Validation\n');
    console.log('='.repeat(60));
    
    this.checkEnvironmentVariables();
    await this.checkMongoDB();
    await this.checkAIPProvider();
    await this.testAIResponse();
    
    return this.printSummary();
  }
}

async function validateSetup() {
  const validator = new SetupValidator();
  const success = await validator.runAll();
  process.exit(success ? 0 : 1);
}

validateSetup().catch(error => {
  console.error('Validation script error:', error);
  process.exit(1);
});
