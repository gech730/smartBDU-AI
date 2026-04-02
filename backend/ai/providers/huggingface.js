import axios from 'axios';

const HF_API_URL = 'https://router.huggingface.co/v1';
const HF_MODEL = 'meta-llama/Llama-3.2-1B-Instruct';

let hfClient = null;

const getClient = () => {
  if (!hfClient) {
    if (!process.env.HF_API_KEY) {
      throw new Error('HF_API_KEY is not set');
    }
    hfClient = axios.create({
      baseURL: HF_API_URL,
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 180000
    });
  }
  return hfClient;
};

export const chat = async (messages) => {
  const client = getClient();
  
  const response = await client.post('/chat/completions', {
    model: HF_MODEL,
    messages: messages,
    max_tokens: 1024,
    temperature: 0.7
  });

  if (response.data?.choices?.[0]?.message?.content) {
    return response.data.choices[0].message.content;
  }

  throw new Error('Invalid response from Hugging Face');
};

export const getStatus = () => ({
  provider: 'huggingface',
  available: !!process.env.HF_API_KEY,
  model: HF_MODEL
});
