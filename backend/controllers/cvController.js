import { generateCV } from '../ai/service.js';
import User from '../models/User.js';

export const generateCVHandler = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      phone, 
      summary, 
      education, 
      skills, 
      projects, 
      experience, 
      careerGoal,
      template
    } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const cvData = {
      fullName,
      email,
      phone: phone || '',
      summary: summary || '',
      education: education || [],
      skills: skills || [],
      projects: projects || [],
      experience: experience || [],
      careerGoal: careerGoal || ''
    };

    const generatedCV = await generateCV(cvData, template);

    res.json({ cv: generatedCV });
  } catch (error) {
    console.error('CV Generation error:', error.message);
    res.status(500).json({ message: 'Failed to generate CV' });
  }
};

export const getCVTemplates = async (req, res) => {
  res.json({
    templates: [
      { id: 'modern', name: 'Modern', description: 'Clean and professional design' },
      { id: 'classic', name: 'Classic', description: 'Traditional resume layout' },
      { id: 'creative', name: 'Creative', description: 'Eye-catching with accent colors' },
      { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' }
    ]
  });
};
