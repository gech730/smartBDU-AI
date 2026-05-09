import { useState, useEffect } from 'react';
import { Map, Plus, Trash2, Download, Loader2, Calendar, BookOpen, Link as LinkIcon, Award } from 'lucide-react';
import { roadmapAPI } from '../services/api';
import { jsPDF } from 'jspdf';

const Roadmap = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ interest: '', targetRole: '', timeframe: '6 months', currentSkills: [] });
  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await roadmapAPI.getAll();
      setRoadmaps(res.data);
    } catch (err) {
      console.error('Failed to load roadmaps:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    const inputValue = formData.interest || formData.targetRole;
    if (!inputValue?.trim()) return;
    
    setGenerating(true);
    try {
      const res = await roadmapAPI.create({
        interest: formData.interest || null,
        targetRole: formData.targetRole || null,
        timeframe: formData.timeframe,
        currentSkills: formData.currentSkills
      });
      
      const roadmapWithId = {
        ...res.data,
        _id: res.data._id || Date.now().toString(),
        targetRole: inputValue,
        duration: res.data.duration || formData.timeframe
      };
      
      setRoadmaps([roadmapWithId, ...roadmaps]);
      setShowForm(false);
      setFormData({ interest: '', targetRole: '', timeframe: '6 months', currentSkills: [] });
      setSelectedRoadmap(roadmapWithId);
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this roadmap?')) return;
    try {
      await roadmapAPI.delete(id);
      setRoadmaps(roadmaps.filter(r => r._id !== id));
      if (selectedRoadmap?._id === id) setSelectedRoadmap(null);
    } catch (err) {
      console.error('Failed to delete roadmap:', err);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.currentSkills.includes(skillInput.trim())) {
      setFormData({ ...formData, currentSkills: [...formData.currentSkills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, currentSkills: formData.currentSkills.filter(s => s !== skill) });
  };

  const exportPDF = (roadmap) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    // Header with gradient background
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('SmartBDU AI', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Learning Roadmap', pageWidth / 2, 40, { align: 'center' });
    
    y = 70;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(roadmap.title, pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Target and duration
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Target: ${roadmap.targetRole || roadmap.interest} | Duration: ${roadmap.duration}`, pageWidth / 2, y, { align: 'center' });
    y += 20;

    // Overview
    if (roadmap.overview) {
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.setFont('helvetica', 'bold');
      doc.text('OVERVIEW', 20, y);
      y += 10;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      const overviewLines = doc.splitTextToSize(roadmap.overview, pageWidth - 40);
      doc.text(overviewLines, 20, y);
      y += overviewLines.length * 6 + 15;
    }

    // Required Skills
    if (roadmap.skills?.length) {
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.setFont('helvetica', 'bold');
      doc.text('REQUIRED SKILLS', 20, y);
      y += 10;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      
      // Group skills in rows
      const skillsPerRow = 3;
      for (let i = 0; i < roadmap.skills.length; i += skillsPerRow) {
        const row = roadmap.skills.slice(i, i + skillsPerRow);
        doc.text('• ' + row.join('  • '), 20, y);
        y += 8;
      }
      y += 10;
    }

    // Timeline
    if (roadmap.timeline) {
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.setFont('helvetica', 'bold');
      doc.text('TIMELINE', 20, y);
      y += 10;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(`Beginner: ${roadmap.timeline.beginner}`, 20, y);
      y += 8;
      doc.text(`Intermediate: ${roadmap.timeline.intermediate}`, 20, y);
      y += 8;
      doc.text(`Advanced: ${roadmap.timeline.advanced}`, 20, y);
      y += 15;
    }

    // Tools & Technologies
    if (roadmap.tools?.length) {
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.setFont('helvetica', 'bold');
      doc.text('TOOLS & TECHNOLOGIES', 20, y);
      y += 10;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      
      // Group tools in rows
      const toolsPerRow = 3;
      for (let i = 0; i < roadmap.tools.length; i += toolsPerRow) {
        const row = roadmap.tools.slice(i, i + toolsPerRow);
        doc.text('• ' + row.join('  • '), 20, y);
        y += 8;
      }
      y += 10;
    }

    // Career Opportunities
    if (roadmap.careers?.length) {
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.setFont('helvetica', 'bold');
      doc.text('CAREER OPPORTUNITIES', 20, y);
      y += 10;
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      
      // Group careers in rows
      const careersPerRow = 2;
      for (let i = 0; i < roadmap.careers.length; i += careersPerRow) {
        const row = roadmap.careers.slice(i, i + careersPerRow);
        doc.text('• ' + row.join('  • '), 20, y);
        y += 8;
      }
      y += 20;
    }

    // Learning Steps
    doc.setFontSize(16);
    doc.setTextColor(99, 102, 241);
    doc.setFont('helvetica', 'bold');
    doc.text('LEARNING STEPS', pageWidth / 2, y, { align: 'center' });
    y += 15;

    roadmap.steps?.forEach((step, idx) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Step header with background
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y - 5, pageWidth - 30, 12, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.setFont('helvetica', 'bold');
      doc.text(`${idx + 1}. ${step.title}`, 20, y + 2);
      y += 15;

      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(step.description, pageWidth - 40);
      doc.text(descLines, 20, y);
      y += descLines.length * 6 + 8;

      if (step.duration) {
        doc.setFontSize(10);
        doc.setTextColor(139, 92, 246);
        doc.setFont('helvetica', 'italic');
        doc.text(`Duration: ${step.duration}`, 20, y);
        y += 6;
      }

      if (step.skills?.length) {
        doc.setFontSize(10);
        doc.setTextColor(6, 182, 212);
        doc.setFont('helvetica', 'italic');
        doc.text(`Skills: ${step.skills.join(', ')}`, 20, y);
        y += 6;
      }

      if (step.resources?.length) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'italic');
        doc.text(`Resources: ${step.resources.join(', ')}`, 20, y);
        y += 6;
      }

      y += 10;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by SmartBDU AI', pageWidth / 2, pageHeight - 10, { align: 'center' });

    const filename = (roadmap.targetRole || roadmap.interest || 'roadmap').replace(/\s+/g, '_');
    doc.save(`${filename}_roadmap.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Map className="w-8 h-8 text-primary-500" />
            Learning Roadmaps
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">Generate personalized career learning paths</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Generate Roadmap
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create New Roadmap</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">What do you want to learn?</label>
              <input
                type="text"
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value, targetRole: '' })}
                placeholder="e.g., programming, AI, Medicine, Business"
                className="input-field"
              />
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Enter your interest or field you want to learn</p>
            </div>
            <div className="text-center text-gray-400 dark:text-slate-500">- OR -</div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Specific Career Goal</label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value, interest: '' })}
                placeholder="e.g., Software Developer, Data Scientist"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Timeframe</label>
              <select
                value={formData.timeframe}
                onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                className="input-field"
              >
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="1 year">1 year</option>
                <option value="2 years">2 years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Current Skills (optional)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill and press Enter"
                  className="input-field flex-1"
                />
                <button type="button" onClick={addSkill} className="btn-primary px-4">Add</button>
              </div>
              {formData.currentSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.currentSkills.map(skill => (
                    <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={generating || (!formData.interest && !formData.targetRole)} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Map className="w-5 h-5" />}
                {generating ? 'Generating...' : 'Generate Roadmap'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl">
          <Map className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No roadmaps yet</h3>
          <p className="text-gray-500 dark:text-slate-400 mb-4">Generate your first learning roadmap to get started</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Generate Roadmap</button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {roadmaps.map(roadmap => (
              <div
                key={roadmap._id}
                onClick={() => setSelectedRoadmap(roadmap)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  selectedRoadmap?._id === roadmap._id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-semibold ${selectedRoadmap?._id === roadmap._id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{roadmap.targetRole}</h3>
                    <p className={`text-sm ${selectedRoadmap?._id === roadmap._id ? 'text-white/70' : 'text-gray-500 dark:text-slate-400'}`}>{roadmap.duration} • {roadmap.steps?.length || 0} steps</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(roadmap._id); }}
                    className={`p-1.5 rounded-lg ${selectedRoadmap?._id === roadmap._id ? 'hover:bg-white/20' : 'hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedRoadmap ? (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedRoadmap.title}</h2>
                    <p className="text-gray-500 dark:text-slate-400">Target: {selectedRoadmap.targetRole || selectedRoadmap.interest} • {selectedRoadmap.duration}</p>
                  </div>
                  <button onClick={() => exportPDF(selectedRoadmap)} className="btn-primary flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                </div>

                {selectedRoadmap.overview && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Overview</h3>
                    <p className="text-gray-600 dark:text-slate-300">{selectedRoadmap.overview}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {selectedRoadmap.skills?.length > 0 && (
                    <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary-500" /> Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedRoadmap.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-sm">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedRoadmap.tools?.length > 0 && (
                    <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-secondary-500" /> Tools & Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedRoadmap.tools.map((tool, i) => (
                          <span key={i} className="px-2 py-1 bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 rounded text-sm">{tool}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {selectedRoadmap.timeline && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent-500" /> Learning Timeline
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-500">Beginner</div>
                        <div className="text-sm text-gray-600 dark:text-slate-300">{selectedRoadmap.timeline.beginner}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-500">Intermediate</div>
                        <div className="text-sm text-gray-600 dark:text-slate-300">{selectedRoadmap.timeline.intermediate}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-500">Advanced</div>
                        <div className="text-sm text-gray-600 dark:text-slate-300">{selectedRoadmap.timeline.advanced}</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRoadmap.careers?.length > 0 && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 dark:from-green-500/20 dark:to-blue-500/20 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Career Opportunities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoadmap.careers.map((career, i) => (
                        <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">{career}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Step-by-Step Learning Plan</h3>
                  {selectedRoadmap.steps?.map((step, idx) => (
                    <div key={idx} className="relative pl-8 pb-6 border-l-2 border-primary-200 dark:border-primary-800 last:border-0">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xs font-bold">
                        {idx + 1}
                      </div>
                      <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                        <p className="text-gray-600 dark:text-slate-300 mb-3">{step.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          {step.duration && (
                            <span className="flex items-center gap-1 text-secondary-500">
                              <Calendar className="w-4 h-4" /> {step.duration}
                            </span>
                          )}
                          {step.skills?.length > 0 && (
                            <span className="flex items-center gap-1 text-accent-500">
                              <Award className="w-4 h-4" /> {step.skills.join(', ')}
                            </span>
                          )}
                        </div>
                        {step.resources?.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
                            <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400 mb-2">
                              <LinkIcon className="w-4 h-4" /> Resources:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {step.resources.map((r, i) => (
                                <span key={i} className="px-2 py-1 bg-white dark:bg-slate-600 rounded text-xs text-gray-600 dark:text-slate-300">{r}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center">
                <Map className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
                <p className="text-gray-500 dark:text-slate-400">Select a roadmap to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;