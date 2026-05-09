import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Departments from './pages/Departments';
import Schedule from './pages/Schedule';
import Announcements from './pages/Announcements';
import Courses from './pages/Courses';
import CampusServices from './pages/CampusServices';
import Directory from './pages/Directory';
import Career from './pages/Career';
import Roadmap from './pages/Roadmap';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import CVGenerator from './pages/CVGenerator';
import CareerRecommendations from './pages/CareerRecommendations';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><Layout><Schedule /></Layout></ProtectedRoute>} />
      <Route path="/announcements" element={<ProtectedRoute><Layout><Announcements /></Layout></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><Layout><Courses /></Layout></ProtectedRoute>} />
      <Route path="/campus" element={<ProtectedRoute><Layout><CampusServices /></Layout></ProtectedRoute>} />
      <Route path="/directory" element={<ProtectedRoute><Layout><Directory /></Layout></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute><Layout><Departments /></Layout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Layout><Chat /></Layout></ProtectedRoute>} />
      <Route path="/career" element={<ProtectedRoute><Layout><Career /></Layout></ProtectedRoute>} />
      <Route path="/career-recommend" element={<ProtectedRoute><Layout><CareerRecommendations /></Layout></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><Layout><Roadmap /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
      <Route path="/cv-generator" element={<ProtectedRoute><Layout><CVGenerator /></Layout></ProtectedRoute>} />
      
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
