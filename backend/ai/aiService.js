import hfProvider from './providers/huggingface.js';
import ollamaProvider from './providers/ollama.js';

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

export const chat = async (messages) => {
  const provider = getProvider();
  return provider.chat(messages);
};

export const getProviderStatus = async () => {
  const provider = getProvider();
  if (provider.getStatus) {
    return provider.getStatus();
  }
  return { provider: process.env.AI_PROVIDER || 'huggingface', available: false };
};

export const getCurrentProvider = () => {
  return process.env.AI_PROVIDER?.toLowerCase() || 'huggingface';
};
