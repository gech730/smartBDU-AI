import axios from 'axios';

const HF_API_KEY = process.env.HF_API_KEY;
const MODEL = process.env.HF_MODEL;

async function testHuggingFace() {
  console.log('🧪 Testing HuggingFace API...\n');
  console.log(`Model: ${MODEL}\n`);

  try {
    console.log('Sending test request...\n');
    
    const response = await axios.post(
      'https://router.huggingface.co/v1/chat/completions',
      {
        model: MODEL,
        messages: [
          { role: 'user', content: 'Say "Hello from SmartBDU!"' }
        ],
        max_tokens: 50
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );
    
    console.log('✅ SUCCESS! Response:');
    console.log(response.data.choices[0].message.content);
    
  } catch (error) {
    console.error('❌ FAILED!');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data?.error?.message || error.response?.data || error.message);
    
    if (error.response?.status === 503) {
      console.log('\n💡 Model is loading on HuggingFace servers.');
      console.log('💡 This can take 1-2 minutes. Try again later.');
    }
  }
}

testHuggingFace();
