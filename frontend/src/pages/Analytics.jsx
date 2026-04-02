import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, MessageSquare, Map, FileText, Users, Search, Clock } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await analyticsAPI.getUserAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'chat': return <MessageSquare className="w-4 h-4" />;
      case 'roadmap_generate': return <Map className="w-4 h-4" />;
      case 'cv_generate': return <FileText className="w-4 h-4" />;
      case 'search': return <Search className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getEventLabel = (type) => {
    switch (type) {
      case 'chat': return 'AI Chat';
      case 'roadmap_generate': return 'Roadmap Generated';
      case 'cv_generate': return 'CV Generated';
      case 'department_view': return 'Department Viewed';
      case 'search': return 'Search';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary-500" />
          Analytics Dashboard
        </h1>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Track your learning journey and activity</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Chats</p>
              <p className="text-3xl font-bold mt-1">{analytics?.totalChats || 0}</p>
            </div>
            <MessageSquare className="w-10 h-10 text-white/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Roadmaps Created</p>
              <p className="text-3xl font-bold mt-1">{analytics?.totalRoadmaps || 0}</p>
            </div>
            <Map className="w-10 h-10 text-white/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">CVs Generated</p>
              <p className="text-3xl font-bold mt-1">{analytics?.totalCVs || 0}</p>
            </div>
            <FileText className="w-10 h-10 text-white/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Topics Explored</p>
              <p className="text-3xl font-bold mt-1">{analytics?.topicCounts?.length || 0}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-white/50" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {analytics?.recentActivity?.length > 0 ? (
              analytics.recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                    {getEventIcon(activity.eventType)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{getEventLabel(activity.eventType)}</p>
                    {activity.topic && (
                      <p className="text-sm text-gray-500 dark:text-slate-400">Topic: {activity.topic}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 dark:text-slate-500">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-slate-400 text-center py-8">
                No activity yet. Start chatting to see your history!
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary-500" />
            Your Top Topics
          </h2>
          <div className="space-y-3">
            {analytics?.topicCounts?.length > 0 ? (
              analytics.topicCounts.slice(0, 10).map((topic, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">{topic._id}</span>
                      <span className="text-sm text-gray-500 dark:text-slate-400">{topic.count} queries</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                        style={{ width: `${(topic.count / analytics.topicCounts[0].count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-slate-400 text-center py-8">
                No topics tracked yet. Ask the AI about departments, careers, or campus info!
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tips for Better Results</h3>
        <ul className="space-y-2 text-gray-600 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
            Ask specific questions about departments to get better recommendations
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary-500"></span>
            Update your profile with interests and goals for personalized advice
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-500"></span>
            Generate learning roadmaps to track your career path progress
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
