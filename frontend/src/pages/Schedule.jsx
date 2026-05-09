import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { scheduleAPI } from '../services/smartBDUAPI';
import { useAuth } from '../context/AuthContext';

export default function Schedule() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [view, setView] = useState('day');
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadSchedules();
  }, [selectedDay]);

  const loadSchedules = async () => {
    try {
      const response = await scheduleAPI.getAll({ 
        dayOfWeek: selectedDay,
        department: user?.department,
        yearOfStudy: user?.yearOfStudy
      });
      setSchedules(response.schedules || []);
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateDay = (direction) => {
    const currentIndex = days.indexOf(selectedDay);
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % 7 
      : (currentIndex - 1 + 7) % 7;
    setSelectedDay(days[newIndex]);
  };

  const getTypeIcon = (type) => {
    const icons = {
      lecture: '📚',
      lab: '🔬',
      tutorial: '💻',
      seminar: '🎓'
    };
    return icons[type] || '📚';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class Schedule</h1>
          <p className="text-gray-400 mt-1">
            {user?.department} • Year {user?.yearOfStudy}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('day')}
            className={`px-4 py-2 rounded-lg ${view === 'day' ? 'bg-primary text-white' : 'bg-dark-lighter'}`}
          >
            Day View
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-lg ${view === 'week' ? 'bg-primary text-white' : 'bg-dark-lighter'}`}
          >
            Week View
          </button>
        </div>
      </div>

      <div className="bg-dark-lighter rounded-xl p-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigateDay('prev')} className="p-2 hover:bg-dark rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedDay === day 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-dark'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
          <button onClick={() => navigateDay('next')} className="p-2 hover:bg-dark rounded-lg">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {schedules.length > 0 ? (
        <div className="space-y-4">
          {schedules
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((schedule, idx) => (
              <div 
                key={idx}
                className="bg-dark-lighter rounded-xl p-6 hover:bg-dark-hover transition"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: schedule.color || '#6366f1' }}
                  >
                    {getTypeIcon(schedule.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{schedule.courseName}</h3>
                        <p className="text-gray-400">{schedule.courseCode}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        schedule.type === 'lecture' ? 'bg-blue-500/20 text-blue-400' :
                        schedule.type === 'lab' ? 'bg-green-500/20 text-green-400' :
                        schedule.type === 'tutorial' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {schedule.type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{schedule.startTime} - {schedule.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{schedule.room} {schedule.building && `(${schedule.building})`}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <User className="w-4 h-4" />
                        <span>{schedule.instructor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-dark-lighter rounded-xl p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-semibold mb-2">No Classes Scheduled</h3>
          <p className="text-gray-400">You have no classes on {selectedDay}</p>
        </div>
      )}
    </div>
  );
}
