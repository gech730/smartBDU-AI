import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Bell, BookOpen, Users, Coffee, Bus, 
  ChevronRight, TrendingUp, FileText, GraduationCap
} from 'lucide-react';
import { scheduleAPI, announcementAPI, courseAPI } from '../services/smartBDUAPI';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const [scheduleRes, announcementRes, assignmentRes] = await Promise.all([
        scheduleAPI.getAll({ dayOfWeek: today }),
        announcementAPI.getAll({ limit: 5 }),
        courseAPI.getAssignments({ upcoming: 'true' })
      ]);
      
      setSchedules(scheduleRes.schedules?.slice(0, 4) || []);
      setAnnouncements(announcementRes.announcements?.slice(0, 5) || []);
      setAssignments(assignmentRes.assignments?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="welcome-banner bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {user?.name?.split(' ')[0]}!</h1>
        <p className="opacity-90">
          Welcome to SmartBDU • ID: {user?.universityId}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Calendar className="w-6 h-6" />}
          title="Today's Classes"
          value={schedules.length}
          color="blue"
        />
        <StatCard 
          icon={<Bell className="w-6 h-6" />}
          title="Announcements"
          value={announcements.length}
          color="green"
        />
        <StatCard 
          icon={<FileText className="w-6 h-6" />}
          title="Pending Tasks"
          value={assignments.length}
          color="orange"
        />
        <StatCard 
          icon={<TrendingUp className="w-6 h-6" />}
          title="Week Progress"
          value="75%"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-lighter rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Today's Schedule
              </h2>
              <a href="/schedule" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            
            {schedules.length > 0 ? (
              <div className="space-y-3">
                {schedules.map((schedule, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center gap-4 p-4 bg-dark rounded-lg hover:bg-dark-hover transition"
                  >
                    <div 
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: schedule.color || '#6366f1' }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{schedule.courseName}</h3>
                      <p className="text-sm text-gray-400">
                        {schedule.courseCode} • {schedule.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{schedule.startTime} - {schedule.endTime}</p>
                      <p className="text-sm text-gray-400">{schedule.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No classes scheduled for today</p>
              </div>
            )}
          </div>

          <div className="bg-dark-lighter rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange" />
                Upcoming Assignments
              </h2>
              <a href="/courses" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            
            {assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="flex items-center justify-between p-4 bg-dark rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange/20 rounded-lg">
                        <FileText className="w-5 h-5 text-orange" />
                      </div>
                      <div>
                        <h3 className="font-medium">{assignment.title}</h3>
                        <p className="text-sm text-gray-400">{assignment.courseName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming assignments</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-dark-lighter rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-green" />
                Latest Announcements
              </h2>
            </div>
            
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann._id} className="p-3 bg-dark rounded-lg hover:bg-dark-hover transition">
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      ann.priority === 'urgent' ? 'bg-red-500' :
                      ann.priority === 'important' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <h4 className="font-medium text-sm">{ann.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-dark-lighter rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction 
                icon={<BookOpen className="w-5 h-5" />}
                label="Courses"
                href="/courses"
                color="blue"
              />
              <QuickAction 
                icon={<Users className="w-5 h-5" />}
                label="Directory"
                href="/directory"
                color="green"
              />
              <QuickAction 
                icon={<Coffee className="w-5 h-5" />}
                label="Cafeteria"
                href="/campus"
                color="orange"
              />
              <QuickAction 
                icon={<Bus className="w-5 h-5" />}
                label="Transport"
                href="/campus"
                color="purple"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    orange: 'bg-orange-500/20 text-orange-400',
    purple: 'bg-purple-500/20 text-purple-400'
  };

  return (
    <div className="bg-dark-lighter rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  );
}

function QuickAction({ icon, label, href, color }) {
  const colors = {
    blue: 'hover:bg-blue-500/20 hover:text-blue-400',
    green: 'hover:bg-green-500/20 hover:text-green-400',
    orange: 'hover:bg-orange-500/20 hover:text-orange-400',
    purple: 'hover:bg-purple-500/20 hover:text-purple-400'
  };

  return (
    <a 
      href={href}
      className={`flex flex-col items-center justify-center p-4 bg-dark rounded-lg text-gray-400 ${colors[color]} transition`}
    >
      {icon}
      <span className="text-xs mt-2">{label}</span>
    </a>
  );
}
