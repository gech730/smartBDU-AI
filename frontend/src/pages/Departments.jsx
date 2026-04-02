import { useState, useEffect } from 'react';
import { Search, Building2, MapPin, Clock, TrendingUp, DollarSign, BookOpen, Briefcase, Sparkles } from 'lucide-react';
import { departmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await departmentAPI.getAll();
      setDepartments(res.data);
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const res = await departmentAPI.getRecommendations({
        interests: user?.interests || [],
        favoriteSubjects: user?.favoriteSubjects || []
      });
      setRecommendations(res.data);
    } catch (err) {
      console.error('Failed to get recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.code.toLowerCase().includes(search.toLowerCase()) ||
    d.faculty.toLowerCase().includes(search.toLowerCase())
  );

  const getPopularityColor = (pop) => {
    if (pop >= 90) return 'bg-green-500';
    if (pop >= 80) return 'bg-blue-500';
    if (pop >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Building2 className="w-8 h-8 text-primary-500" />
          Departments
        </h1>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Explore Bahir Dar University departments and find your path</p>
      </div>

      <div className="mb-6">
        <button
          onClick={getRecommendations}
          className="btn-primary flex items-center gap-2"
          disabled={loading}
        >
          <Sparkles className="w-5 h-5" />
          {loading ? 'Analyzing...' : 'Get AI Recommendations'}
        </button>
      </div>

      {recommendations && (
        <div className="mb-8 p-6 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 rounded-2xl border border-primary-200 dark:border-primary-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recommended for You</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendations.recommendations?.map((rec, idx) => (
              <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{rec.department}</h3>
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full">{rec.matchScore}% Match</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">{rec.reason}</p>
                <div className="flex flex-wrap gap-1">
                  {rec.skills?.slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-xs rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setRecommendations(null)} className="mt-4 text-sm text-primary-500 hover:text-primary-600">Hide recommendations</button>
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search departments by name, code, or faculty..."
          className="input-field pl-12"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepts.map(dept => (
            <div
              key={dept._id}
              onClick={() => setSelected(dept)}
              className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer card-hover border border-gray-100 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{dept.name}</h3>
                  <p className="text-sm text-primary-500 font-medium">{dept.code}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs text-white ${getPopularityColor(dept.popularity)}`}>
                  {dept.popularity}% Popular
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-4 line-clamp-2">{dept.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{dept.duration}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{dept.faculty.split(' ')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selected.name}</h2>
                <p className="text-primary-500 font-medium">{selected.code} • {selected.faculty}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <p className="text-gray-600 dark:text-slate-300 mb-6">{selected.description}</p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-primary-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Duration</span>
                </div>
                <p className="text-gray-600 dark:text-slate-400">{selected.duration}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-gray-900 dark:text-white">Salary Range</span>
                </div>
                <p className="text-gray-600 dark:text-slate-400">{selected.salaryRange?.min?.toLocaleString()} - {selected.salaryRange?.max?.toLocaleString()} {selected.salaryRange?.currency}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary-500" />
                Key Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {selected.skills?.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent-500" />
                Career Opportunities
              </h3>
              <div className="flex flex-wrap gap-2">
                {selected.careerOpportunities?.map(career => (
                  <span key={career} className="px-3 py-1 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 rounded-full text-sm">{career}</span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Core Courses</h3>
              <div className="space-y-2">
                {selected.courses?.map(course => (
                  <div key={course.code} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">{course.code}</span>
                      <span className="text-gray-500 dark:text-slate-400"> - {course.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;