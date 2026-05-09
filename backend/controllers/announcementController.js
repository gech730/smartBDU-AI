import Announcement from '../models/Announcement.js';

export const getAnnouncements = async (req, res) => {
  try {
    const { category, priority, department, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (department) {
      query.$or = [
        { department: { $exists: false } },
        { department: department }
      ];
    }

    const announcements = await Announcement.find(query)
      .populate('author', 'name universityId')
      .sort({ isPinned: -1, priority: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Announcement.countDocuments(query);

    res.json({
      success: true,
      announcements,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name universityId');

    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    res.json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      author: req.user.id
    });
    res.status(201).json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }
    res.json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    const alreadyRead = announcement.readBy.some(
      r => r.user.toString() === req.user.id
    );

    if (!alreadyRead) {
      announcement.readBy.push({ user: req.user.id });
      await announcement.save();
    }

    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
