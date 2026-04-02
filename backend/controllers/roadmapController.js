import Roadmap from '../models/Roadmap.js';
import { generateRoadmap } from '../ai/service.js';

export const createRoadmap = async (req, res) => {
  try {
    const { targetRole, currentSkills, timeframe } = req.body;

    if (!targetRole || !targetRole.trim()) {
      return res.status(400).json({ message: 'Target role is required' });
    }

    const roadmapData = await generateRoadmap(
      targetRole, 
      currentSkills || [], 
      timeframe || '6 months'
    );

    if (roadmapData.error) {
      console.error('Roadmap generation error:', roadmapData.error);
      return res.status(503).json({ message: 'Failed to generate roadmap. Please try again.' });
    }

    if (!roadmapData.steps || !roadmapData.title) {
      return res.status(503).json({ message: 'Invalid roadmap format generated. Please try again.' });
    }

    const roadmap = await Roadmap.create({
      userId: req.user._id,
      title: roadmapData.title,
      targetRole: roadmapData.targetRole,
      duration: roadmapData.duration,
      steps: roadmapData.steps
    });

    res.status(201).json(roadmap);
  } catch (error) {
    console.error('Roadmap error:', error.message);
    res.status(503).json({ message: 'AI service unavailable. Please try again later.' });
  }
};

export const createInterestRoadmap = async (req, res) => {
  try {
    const { interest, targetRole, currentSkills, timeframe } = req.body;

    const inputValue = interest || targetRole;
    
    if (!inputValue || !inputValue.trim()) {
      return res.status(400).json({ message: 'Interest or target role is required' });
    }

    const roadmapData = await generateRoadmap(
      targetRole || null, 
      currentSkills || [], 
      timeframe || '6 months',
      interest || null
    );

    if (roadmapData.error) {
      console.error('Roadmap generation error:', roadmapData.error);
      return res.status(503).json({ message: 'Failed to generate roadmap. Please try again.' });
    }

    if (!roadmapData.steps || !roadmapData.title) {
      const fallback = {
        title: `${inputValue} Learning Roadmap`,
        overview: `A comprehensive guide to learning ${inputValue} from beginner to advanced level.`,
        skills: ["Core concepts", "Problem solving", "Practical application"],
        steps: [
          { title: "Foundation", description: "Learn the basics and fundamentals", duration: "0-3 months", resources: ["Online courses", "Textbooks"], skills: ["Basic concepts"] },
          { title: "Core Skills", description: "Develop core competencies", duration: "3-6 months", resources: ["Practice projects"], skills: ["Practical skills"] },
          { title: "Advanced Topics", description: "Master advanced concepts", duration: "6-12 months", resources: ["Research papers", "Expert courses"], skills: ["Advanced techniques"] },
          { title: "Portfolio", description: "Build projects for portfolio", duration: "Ongoing", resources: ["Personal projects"], skills: ["Project management"] },
          { title: "Career Prep", description: "Prepare for career opportunities", duration: "Final phase", resources: ["Interview prep"], skills: ["Career skills"] }
        ],
        tools: ["Learning resources", "Development tools"],
        timeline: { beginner: "0-3 months", intermediate: "3-6 months", advanced: "6-12 months" },
        careers: ["Professional roles"]
      };
      return res.status(201).json(fallback);
    }

    const roadmap = await Roadmap.create({
      userId: req.user._id,
      title: roadmapData.title,
      targetRole: inputValue,
      duration: roadmapData.timeline ? `${roadmapData.timeline.beginner} to ${roadmapData.timeline.advanced}` : '6 months',
      steps: roadmapData.steps
    });

    res.status(201).json(roadmapData);
  } catch (error) {
    console.error('Roadmap error:', error.message);
    res.status(503).json({ message: 'AI service unavailable. Please try again later.' });
  }
};

export const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (roadmap) {
      res.json(roadmap);
    } else {
      res.status(404).json({ message: 'Roadmap not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoadmap = async (req, res) => {
  try {
    await Roadmap.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    res.json({ message: 'Roadmap deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};