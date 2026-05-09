import Dormitory from '../models/Dormitory.js';
import Cafeteria from '../models/Cafeteria.js';
import Transport from '../models/Transport.js';

export const getDormitories = async (req, res) => {
  try {
    const dormitories = await Dormitory.find({ isActive: true });
    res.json({ success: true, dormitories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDormitoryById = async (req, res) => {
  try {
    const dormitory = await Dormitory.findById(req.params.id);
    if (!dormitory) {
      return res.status(404).json({ success: false, error: 'Dormitory not found' });
    }
    res.json({ success: true, dormitory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCafeterias = async (req, res) => {
  try {
    const cafeterias = await Cafeteria.find({ isActive: true });
    res.json({ success: true, cafeterias });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCafeteriaById = async (req, res) => {
  try {
    const cafeteria = await Cafeteria.findById(req.params.id);
    if (!cafeteria) {
      return res.status(404).json({ success: false, error: 'Cafeteria not found' });
    }
    res.json({ success: true, cafeteria });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTodayMenu = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const cafeterias = await Cafeteria.find({ isActive: true });
    
    const menus = cafeterias.map(c => {
      const todayMenu = c.menus.find(m => m.day === today);
      return {
        cafeteria: c.name,
        location: c.location,
        hours: c.operatingHours[today.toLowerCase()],
        menu: todayMenu || { breakfast: [], lunch: [], dinner: [] }
      };
    });

    res.json({ success: true, day: today, menus });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTransport = async (req, res) => {
  try {
    const transports = await Transport.find({ isActive: true });
    res.json({ success: true, transports });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTransportById = async (req, res) => {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).json({ success: false, error: 'Transport not found' });
    }
    res.json({ success: true, transport });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
