import Message from '../models/Message.js';
import User from '../models/User.js';
import { generateChatResponse } from '../ai/service.js';

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const userId = req.user._id;

    const user = await User.findById(userId);
    const recentMessages = await Message.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const conversationHistory = recentMessages.reverse().map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const aiResponse = await generateChatResponse(
      message,
      { 
        interests: user.interests, 
        favoriteSubjects: user.favoriteSubjects, 
        goals: user.goals,
        preferredDepartment: user.preferredDepartment
      }
    );

    await Message.create({
      userId,
      role: 'user',
      content: message
    });

    await Message.create({
      userId,
      role: 'assistant',
      content: aiResponse
    });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(503).json({ message: 'AI service unavailable. Please try again later.' });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user._id })
      .sort({ createdAt: 1 })
      .limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    await Message.deleteMany({ userId: req.user._id });
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};