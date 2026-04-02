import Analytics from '../models/Analytics.js';

export const trackEvent = async (req, res) => {
  try {
    const { eventType, topic, metadata } = req.body;
    
    const analytics = await Analytics.create({
      userId: req.user?._id,
      eventType,
      topic,
      metadata
    });
    
    res.status(201).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const totalChats = await Analytics.countDocuments({ userId, eventType: 'chat' });
    const totalRoadmaps = await Analytics.countDocuments({ userId, eventType: 'roadmap_generate' });
    const totalCVs = await Analytics.countDocuments({ userId, eventType: 'cv_generate' });
    
    const recentActivity = await Analytics.find({ userId })
      .sort({ timestamp: -1 })
      .limit(20)
      .select('eventType topic timestamp');
    
    const topicCounts = await Analytics.aggregate([
      { $match: { userId: req.user._id, topic: { $exists: true, $ne: null } } },
      { $group: { _id: '$topic', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      totalChats,
      totalRoadmaps,
      totalCVs,
      recentActivity,
      topicCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await Analytics.distinct('userId').countDocuments();
    
    const totalChats = await Analytics.countDocuments({ eventType: 'chat' });
    const totalSearches = await Analytics.countDocuments({ eventType: 'search' });
    const totalRoadmaps = await Analytics.countDocuments({ eventType: 'roadmap_generate' });
    const totalCVs = await Analytics.countDocuments({ eventType: 'cv_generate' });
    
    const dailyActivity = await Analytics.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          chats: { $sum: { $cond: [{ $eq: ['$eventType', 'chat'] }, 1, 0] } },
          searches: { $sum: { $cond: [{ $eq: ['$eventType', 'search'] }, 1, 0] } },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);
    
    const topTopics = await Analytics.aggregate([
      { $match: { topic: { $exists: true, $ne: null } } },
      { $group: { _id: '$topic', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);
    
    const departmentViews = await Analytics.aggregate([
      { $match: { eventType: 'department_view' } },
      { $group: { _id: '$metadata.department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      totalUsers,
      totalChats,
      totalSearches,
      totalRoadmaps,
      totalCVs,
      dailyActivity,
      topTopics,
      departmentViews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
