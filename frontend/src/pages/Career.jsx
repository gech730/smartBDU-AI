import { useState } from 'react';
import { Briefcase, FileText, MessageSquare, Send, Loader2 } from 'lucide-react';
import { careerAPI } from '../services/api';

const Career = () => {
  const [role, setRole] = useState('');
  const [activeTab, setActiveTab] = useState('cv');
  const [cvTips, setCVTips] = useState('');
  const [interviewPrep, setInterviewPrep] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role.trim()) return;
    
    setLoading(true);
    try {
      if (activeTab === 'cv') {
        const res = await careerAPI.getCVTips(role);
        setCVTips(res.data.tips);
      } else {
        const res = await careerAPI.getInterviewPrep(role);
        setInterviewPrep(res.data.prep);
      }
    } catch (err) {
      console.error('Failed to get tips:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-primary-500" />
          Career Tools
        </h1>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Get expert guidance on CV writing and interview preparation</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => { setActiveTab('cv'); setCVTips(''); setInterviewPrep(''); }}
          className={`flex-1 p-4 rounded-xl text-center transition-all ${
            activeTab === 'cv'
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
              : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
          }`}
        >
          <FileText className="w-6 h-6 mx-auto mb-2" />
          <span className="font-medium">CV Writing Tips</span>
        </button>
        <button
          onClick={() => { setActiveTab('interview'); setCVTips(''); setInterviewPrep(''); }}
          className={`flex-1 p-4 rounded-xl text-center transition-all ${
            activeTab === 'interview'
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
              : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
          }`}
        >
          <MessageSquare className="w-6 h-6 mx-auto mb-2" />
          <span className="font-medium">Interview Prep</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            What role are you targeting?
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Software Developer, Data Scientist, Marketing Manager..."
              className="input-field flex-1"
            />
            <button
              type="submit"
              disabled={loading || !role.trim()}
              className="btn-primary px-6 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Get Tips
            </button>
          </div>
        </form>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {['Software Developer', 'Data Scientist', 'Business Analyst', 'Marketing Manager', 'Electrical Engineer', 'Nurse'].map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`p-3 rounded-lg text-sm transition-all ${
                role === r
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-primary-100 dark:hover:bg-primary-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : activeTab === 'cv' && cvTips ? (
          <div className="prose dark:prose-invert max-w-none">
            <div className="p-6 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 rounded-xl border border-primary-200 dark:border-primary-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">CV Writing Tips for {role}</h2>
              <div className="space-y-4">
                {cvTips.split('\n').filter(Boolean).map((line, idx) => {
                  if (line.startsWith('#')) return <h3 key={idx} className="text-lg font-semibold mt-4">{line.replace(/^#+\s*/, '')}</h3>;
                  if (line.startsWith('-') || line.startsWith('*')) return <li key={idx} className="ml-4">{line.replace(/^[-*]\s*/, '')}</li>;
                  return <p key={idx} className="text-gray-600 dark:text-slate-300">{line}</p>;
                })}
              </div>
            </div>
          </div>
        ) : activeTab === 'interview' && interviewPrep ? (
          <div className="prose dark:prose-invert max-w-none">
            <div className="p-6 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 rounded-xl border border-primary-200 dark:border-primary-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Interview Prep for {role}</h2>
              <div className="space-y-4">
                {interviewPrep.split('\n').filter(Boolean).map((line, idx) => {
                  if (line.startsWith('#')) return <h3 key={idx} className="text-lg font-semibold mt-4">{line.replace(/^#+\s*/, '')}</h3>;
                  if (line.startsWith('-') || line.startsWith('*')) return <li key={idx} className="ml-4">{line.replace(/^[-*]\s*/, '')}</li>;
                  return <p key={idx} className="text-gray-600 dark:text-slate-300">{line}</p>;
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-slate-400">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Enter a target role and click "Get Tips" to receive personalized guidance</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Career;