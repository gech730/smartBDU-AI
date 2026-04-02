import axios from 'axios';

const getBaseUrl = () => process.env.OLLAMA_URL || 'http://localhost:11434';
const getModel = () => process.env.OLLAMA_MODEL || 'mistral';

let ollamaClient = null;

const getClient = () => {
  if (!ollamaClient) {
    ollamaClient = axios.create({
      baseURL: getBaseUrl(),
      timeout: 180000
    });
  }
  return ollamaClient;
};

export const chat = async (messages) => {
  const client = getClient();
  
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';
  const userMessages = messages.filter(m => m.role === 'user');
  const lastUserMessage = userMessages[userMessages.length - 1]?.content || '';
  
  const response = await client.post('/api/chat', {
    model: getModel(),
    messages: [
      { role: 'system', content: systemMessage },
      ...messages.filter(m => m.role !== 'system').slice(0, -1),
      { role: 'user', content: lastUserMessage }
    ],
    stream: false
  });

  if (response.data?.message?.content) {
    return response.data.message.content;
  }

  throw new Error('Invalid response from Ollama');
};

export const getStatus = async () => {
  try {
    const client = getClient();
    await client.get('/api/tags');
    return {
      provider: 'ollama',
      available: true,
      model: getModel(),
      url: getBaseUrl()
    };
  } catch {
    return {
      provider: 'ollama',
      available: false,
      model: getModel(),
      url: getBaseUrl()
    };
  }
};
