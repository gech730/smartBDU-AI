import { NavLink, useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Building2, 
  Briefcase, 
  Map, 
  User, 
  LogOut,
  Sun,
  Moon,
  Sparkles,
  BarChart3,
  FileText,
  GraduationCap,
  Calendar,
  Bell,
  BookOpen,
  Coffee,
  Home,
  Users,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const mainNavItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/schedule', icon: Calendar, label: 'Schedule' },
    { to: '/announcements', icon: Bell, label: 'Announcements' },
    { to: '/courses', icon: BookOpen, label: 'Courses' },
    { to: '/chat', icon: MessageCircle, label: 'AI Assistant' },
  ];

  const campusNavItems = [
    { to: '/campus', icon: Coffee, label: 'Campus Services' },
    { to: '/directory', icon: Users, label: 'Directory' },
    { to: '/departments', icon: Building2, label: 'Departments' },
  ];

  const careerNavItems = [
    { to: '/career-recommend', icon: GraduationCap, label: 'Career Path' },
    { to: '/roadmap', icon: Map, label: 'Learning Roadmap' },
    { to: '/cv-generator', icon: FileText, label: 'CV Generator' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-800 border-r border-slate-700 flex flex-col z-50">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">SmartBDU</h1>
            <p className="text-xs text-slate-400">Bahir Dar University</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4">
            Main Menu
          </h2>
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4">
            Campus
          </h2>
          <div className="space-y-1">
            {campusNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4">
            Career
          </h2>
          <div className="space-y-1">
            {careerNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700 space-y-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </NavLink>

        <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.universityId}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
