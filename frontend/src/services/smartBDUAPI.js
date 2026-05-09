import api from './api';

export const scheduleAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/schedules', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/schedules', data);
    return response.data;
  }
};

export const announcementAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/announcements', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },
  
  markAsRead: async (id) => {
    const response = await api.put(`/announcements/${id}/read`);
    return response.data;
  }
};

export const courseAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/courses/courses/${id}`);
    return response.data;
  },
  
  getAssignments: async (params = {}) => {
    const response = await api.get('/courses/assignments', { params });
    return response.data;
  }
};

export const campusAPI = {
  getDormitories: async () => {
    const response = await api.get('/campus/dormitories');
    return response.data;
  },
  
  getCafeterias: async () => {
    const response = await api.get('/campus/cafeterias');
    return response.data;
  },
  
  getTodayMenu: async () => {
    const response = await api.get('/campus/cafeterias/menu/today');
    return response.data;
  },
  
  getTransport: async () => {
    const response = await api.get('/campus/transport');
    return response.data;
  }
};
