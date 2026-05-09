import { useState, useEffect } from 'react';
import { Bell, Filter, Calendar, Pin, AlertCircle, Info } from 'lucide-react';
import { announcementAPI } from '../services/smartBDUAPI';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'university', label: 'University' },
    { id: 'department', label: 'Department' },
    { id: 'academic', label: 'Academic' },
    { id: 'event', label: 'Events' },
    { id: 'urgent', label: 'Urgent' }
  ];

  useEffect(() => {
    loadAnnouncements();
  }, [selectedCategory]);

  const loadAnnouncements = async () => {
    try {
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await announcementAPI.getAll(params);
      setAnnouncements(response.announcements || []);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'important': return 'border-l-orange-500';
      default: return 'border-l-blue-500';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'urgent': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'event': return <Calendar className="w-5 h-5 text-green-400" />;
      case 'academic': return <Info className="w-5 h-5 text-blue-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Announcements</h1>
        <p className="text-gray-400 mt-1">Stay updated with the latest news and updates</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg transition ${
              selectedCategory === cat.id 
                ? 'bg-primary text-white' 
                : 'bg-dark-lighter hover:bg-dark-hover'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map(ann => (
            <div 
              key={ann._id}
              onClick={() => setSelectedAnnouncement(ann)}
              className={`bg-dark-lighter rounded-xl p-6 border-l-4 cursor-pointer hover:bg-dark-hover transition ${getPriorityColor(ann.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {ann.isPinned && <Pin className="w-5 h-5 text-primary mt-1" />}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(ann.category)}
                      <span className="text-xs font-medium text-gray-400 uppercase">{ann.category}</span>
                      {ann.priority === 'urgent' && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">Urgent</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{ann.title}</h3>
                    <p className="text-gray-400 line-clamp-2">{ann.content}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(ann.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                <span>By: {ann.author?.name || 'Admin'}</span>
                <span>{ann.views || 0} views</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-dark-lighter rounded-xl p-12 text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-semibold mb-2">No Announcements</h3>
          <p className="text-gray-400">No announcements found in this category</p>
        </div>
      )}

      {selectedAnnouncement && (
        <AnnouncementModal 
          announcement={selectedAnnouncement} 
          onClose={() => setSelectedAnnouncement(null)} 
        />
      )}
    </div>
  );
}

function AnnouncementModal({ announcement, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-dark-lighter rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-dark">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase">{announcement.category}</span>
              <h2 className="text-2xl font-bold mt-1">{announcement.title}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-300 whitespace-pre-wrap">{announcement.content}</p>
          
          {announcement.attachments?.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Attachments</h4>
              <div className="space-y-2">
                {announcement.attachments.map((att, idx) => (
                  <a key={idx} href={att.url} className="block p-3 bg-dark rounded-lg hover:bg-dark-hover">
                    {att.name}
                  </a>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-dark text-sm text-gray-400">
            <p>Posted by: {announcement.author?.name || 'Admin'}</p>
            <p>Date: {new Date(announcement.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
