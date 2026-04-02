import { useState, useEffect } from 'react';
import { Briefcase, TrendingUp, GraduationCap, DollarSign, ArrowRight, Search } from 'lucide-react';
import { careerRecommendAPI, departmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CareerRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interestInput, setInterestInput] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadDepartments();
    if (user) {
      if (user.interests) setSelectedInterests(user.interests);
      if (user.favoriteSubjects) setSelectedSkills(user.favoriteSubjects);
    }
  }, [user]);

  const loadDepartments = async () => {
    try {
      const res = await departmentAPI.getAll();
      setDepartments(res.data);
    } catch (err) {
      console.error('Failed to load departments:', err);
    }
  };

  const addInterest = () => {
    if (interestInput.trim() && !selectedInterests.includes(interestInput.trim())) {
      setSelectedInterests([...selectedInterests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const removeInterest = (interest) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };

  const addSkill = () => {
    if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
      setSelectedSkills([...selectedSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const res = await careerRecommendAPI.getRecommendations({
        interests: selectedInterests,
        skills: selectedSkills,
        careerGoal: user?.goals || []
      });
      setRecommendations(res.data.recommendations);
    } catch (err) {
      console.error('Failed to get recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-primary-500" />
          Career Recommendations
        </h1>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Discover your ideal career path based on your interests</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Profile</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Interests</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  className="input-field flex-1"
                  placeholder="e.g., programming, design"
                />
                <button onClick={addInterest} className="btn-primary px-4">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedInterests.map((interest, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                    {interest}
                    <button onClick={() => removeInterest(interest)} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="input-field flex-1"
                  placeholder="e.g., problem solving"
                />
                <button onClick={addSkill} className="btn-primary px-4">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 rounded-full text-sm">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGetRecommendations}
              disabled={loading || (selectedInterests.length === 0 && selectedSkills.length === 0)}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Finding...' : 'Get Recommendations'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-2">Quick Start</h3>
            <p className="text-white/80 text-sm mb-4">Select from popular interests:</p>
            <div className="flex flex-wrap gap-2">
              {['Programming', 'Business', 'Design', 'Engineering', 'Healthcare', 'Data Science'].map(interest => (
                <button
                  key={interest}
                  onClick={() => {
                    if (!selectedInterests.includes(interest)) {
                      setSelectedInterests([...selectedInterests, interest]);
                    }
                  }}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm hover:bg-white/30 transition"
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{rec.department}</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{rec.code} • {rec.faculty}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getMatchColor(rec.matchScore)}`}>
                      {rec.matchScore}% Match
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-slate-300 mb-4">{rec.description}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-xl">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" /> Key Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.skills?.slice(0, 4).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-xl">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" /> Salary Range
                      </h4>
                      <p className="text-gray-600 dark:text-slate-300">
                        {rec.salaryRange?.currency} {rec.salaryRange?.min?.toLocaleString()} - {rec.salaryRange?.max?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 dark:from-green-500/20 dark:to-blue-500/20 rounded-xl">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary-500" /> Career Paths
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.careers?.map((career, i) => (
                        <span key={i} className="px-3 py-1 bg-white dark:bg-slate-600 rounded-full text-sm text-gray-700 dark:text-slate-300">
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Recommendations Yet
              </h3>
              <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">
                Add your interests and skills to get personalized career recommendations based on BDU departments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerRecommendations;
