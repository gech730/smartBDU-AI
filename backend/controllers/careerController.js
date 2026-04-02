import { getCVTips, getInterviewPrep } from '../ai/service.js';

export const getCVTipsHandler = async (req, res) => {
  try {
    const { targetRole } = req.body;
    if (!targetRole || !targetRole.trim()) {
      return res.status(400).json({ message: 'Target role is required' });
    }
    const tips = await getCVTips(targetRole);
    res.json({ tips });
  } catch (error) {
    console.error('CV Tips error:', error.message);
    res.status(503).json({ message: 'AI service unavailable. Please try again later.' });
  }
};

export const getInterviewPrepHandler = async (req, res) => {
  try {
    const { targetRole } = req.body;
    if (!targetRole || !targetRole.trim()) {
      return res.status(400).json({ message: 'Target role is required' });
    }
    const prep = await getInterviewPrep(targetRole);
    res.json({ prep });
  } catch (error) {
    console.error('Interview Prep error:', error.message);
    res.status(503).json({ message: 'AI service unavailable. Please try again later.' });
  }
};