import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    universityId: '',
    name: '',
    email: '',
    password: '',
    department: '',
    yearOfStudy: '1',
    program: 'undergraduate',
    phone: '',
    interests: [],
    favoriteSubjects: [],
    goals: []
  });
  const [customInterest, setCustomInterest] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const interestOptions = ['Technology', 'Healthcare', 'Business', 'Engineering', 'Science', 'Arts', 'Agriculture', 'Law', 'Education'];
  const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Languages', 'History', 'Geography', 'Economics'];
  const departmentOptions = ['Computer Science', 'Information Systems', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration', 'Law', 'Nursing', 'Architecture'];
  const programOptions = ['undergraduate', 'masters', 'phd'];
  const yearOptions = ['1', '2', '3', '4', '5', '6'];
  const goalOptions = ['Get a good job', 'Start my own business', 'Pursue higher studies', 'Make a difference', 'Work abroad', 'Become an expert'];

  const addInterest = (interest) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData({ ...formData, interests: [...formData.interests, interest] });
    }
    setCustomInterest('');
  };

  const removeInterest = (interest) => {
    setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
  };

  const addSubject = (subject) => {
    if (subject && !formData.favoriteSubjects.includes(subject)) {
      setFormData({ ...formData, favoriteSubjects: [...formData.favoriteSubjects, subject] });
    }
    setCustomSubject('');
  };

  const removeSubject = (subject) => {
    setFormData({ ...formData, favoriteSubjects: formData.favoriteSubjects.filter(s => s !== subject) });
  };

  const addGoal = (goal) => {
    if (goal && !formData.goals.includes(goal)) {
      setFormData({ ...formData, goals: [...formData.goals, goal] });
    }
    setCustomGoal('');
  };

  const removeGoal = (goal) => {
    setFormData({ ...formData, goals: formData.goals.filter(g => g !== goal) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await register(formData);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative w-full max-w-lg">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 mb-3">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Create Your Account</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">Step {step} of 4</p>
          </div>

          <div className="mb-6 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
              style={{ width: `${step * 25}%` }}
            ></div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">University ID</label>
                <input
                  type="text"
                  value={formData.universityId}
                  onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                  className="input-field"
                  placeholder="BDU1234567"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field pr-12"
                    placeholder="Create a password (min 6 chars)"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select your department</option>
                  {departmentOptions.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Year of Study</label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    className="input-field"
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Program</label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="input-field"
                  >
                    {programOptions.map((program) => (
                      <option key={program} value={program}>{program}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                  placeholder="Optional phone number"
                />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                Next <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">What are you interested in?</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {interestOptions.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => addInterest(opt)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        formData.interests.includes(opt)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-primary-100 dark:hover:bg-primary-900'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest(customInterest))}
                    className="input-field flex-1"
                    placeholder="Add custom interest..."
                  />
                  <button type="button" onClick={() => addInterest(customInterest)} className="btn-primary px-4">Add</button>
                </div>
                {formData.interests.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.interests.map(i => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                        {i}
                        <button type="button" onClick={() => removeInterest(i)} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 btn-primary flex items-center justify-center gap-2">Next <ArrowRight className="w-5 h-5" /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Your favorite subjects?</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {subjectOptions.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => addSubject(opt)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        formData.favoriteSubjects.includes(opt)
                          ? 'bg-secondary-500 text-white'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-secondary-100 dark:hover:bg-secondary-900'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject(customSubject))}
                    className="input-field flex-1"
                    placeholder="Add custom subject..."
                  />
                  <button type="button" onClick={() => addSubject(customSubject)} className="btn-primary px-4">Add</button>
                </div>
                {formData.favoriteSubjects.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.favoriteSubjects.map(s => (
                      <span key={s} className="inline-flex items-center gap-1 px-2 py-1 bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 rounded-full text-sm">
                        {s}
                        <button type="button" onClick={() => removeSubject(s)} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700">Back</button>
                <button onClick={() => setStep(4)} className="flex-1 btn-primary flex items-center justify-center gap-2">Next <ArrowRight className="w-5 h-5" /></button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">What are your goals?</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {goalOptions.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => addGoal(opt)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        formData.goals.includes(opt)
                          ? 'bg-accent-500 text-white'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-accent-100 dark:hover:bg-accent-900'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal(customGoal))}
                    className="input-field flex-1"
                    placeholder="Add custom goal..."
                  />
                  <button type="button" onClick={() => addGoal(customGoal)} className="btn-primary px-4">Add</button>
                </div>
                {formData.goals.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.goals.map(g => (
                      <span key={g} className="inline-flex items-center gap-1 px-2 py-1 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 rounded-full text-sm">
                        {g}
                        <button type="button" onClick={() => removeGoal(g)} className="hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700">Back</button>
                <button onClick={handleSubmit} disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-gray-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;