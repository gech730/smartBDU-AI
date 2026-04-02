import { useState, useEffect } from 'react';
import { FileText, Download, Plus, Trash2, Loader2, Save, Edit2, Check } from 'lucide-react';
import { cvAPI } from '../services/api';
import { jsPDF } from 'jspdf';

const CVGenerator = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    careerGoal: '',
    summary: '',
    education: [{ institution: '', degree: '', field: '', year: '' }],
    skills: [],
    projects: [{ name: '', description: '', technologies: '' }],
    experience: [{ company: '', role: '', duration: '', responsibilities: '' }]
  });
  const [skillInput, setSkillInput] = useState('');
  const [generatedCV, setGeneratedCV] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('form');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { institution: '', degree: '', field: '', year: '' }]
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...formData.education];
    updated[index][field] = value;
    setFormData({ ...formData, education: updated });
  };

  const removeEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', description: '', technologies: '' }]
    });
  };

  const updateProject = (index, field, value) => {
    const updated = [...formData.projects];
    updated[index][field] = value;
    setFormData({ ...formData, projects: updated });
  };

  const removeProject = (index) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index)
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: '', role: '', duration: '', responsibilities: '' }]
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData({ ...formData, experience: updated });
  };

  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index)
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await cvAPI.generate(formData);
      setGeneratedCV(res.data.cv);
      setViewMode('preview');
    } catch (err) {
      console.error('Failed to generate CV:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241);
    doc.text(formData.fullName, pageWidth / 2, y, { align: 'center' });
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${formData.email} | ${formData.phone}`, pageWidth / 2, y, { align: 'center' });
    y += 15;

    if (formData.careerGoal) {
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.text('CAREER OBJECTIVE', 20, y);
      y += 8;
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const goalLines = doc.splitTextToSize(formData.careerGoal, pageWidth - 40);
      doc.text(goalLines, 20, y);
      y += goalLines.length * 6 + 10;
    }

    if (formData.education.length > 0 && formData.education[0].institution) {
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.text('EDUCATION', 20, y);
      y += 8;
      
      formData.education.forEach(edu => {
        if (edu.institution) {
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          doc.text(`${edu.degree} in ${edu.field}`, 20, y);
          y += 6;
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(`${edu.institution} | ${edu.year}`, 20, y);
          y += 10;
        }
      });
    }

    if (formData.skills.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.text('SKILLS', 20, y);
      y += 8;
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(formData.skills.join(' | '), 20, y);
      y += 15;
    }

    if (formData.projects.length > 0 && formData.projects[0].name) {
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.text('PROJECTS', 20, y);
      y += 8;

      formData.projects.forEach(proj => {
        if (proj.name) {
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          doc.text(proj.name, 20, y);
          y += 6;
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          if (proj.description) {
            const descLines = doc.splitTextToSize(proj.description, pageWidth - 40);
            doc.text(descLines, 20, y);
            y += descLines.length * 5;
          }
          if (proj.technologies) {
            doc.setTextColor(139, 92, 246);
            doc.text(`Technologies: ${proj.technologies}`, 20, y);
            y += 8;
          }
        }
      });
    }

    if (formData.experience.length > 0 && formData.experience[0].company) {
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      doc.text('EXPERIENCE', 20, y);
      y += 8;

      formData.experience.forEach(exp => {
        if (exp.company) {
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          doc.text(`${exp.role} at ${exp.company}`, 20, y);
          y += 6;
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(exp.duration, 20, y);
          y += 6;
          if (exp.responsibilities) {
            const respLines = doc.splitTextToSize(exp.responsibilities, pageWidth - 40);
            doc.text(respLines, 20, y);
            y += respLines.length * 5 + 5;
          }
        }
      });
    }

    doc.save(`${formData.fullName.replace(/\s+/g, '_')}_CV.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary-500" />
            CV Generator
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">Create a professional resume powered by AI</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('form')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'form' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-slate-800'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-4 py-2 rounded-lg ${viewMode === 'preview' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-slate-800'}`}
          >
            Preview
          </button>
        </div>
      </div>

      {viewMode === 'form' ? (
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="+251 912 345 678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Career Goal</label>
                <input
                  type="text"
                  name="careerGoal"
                  value={formData.careerGoal}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Professional Summary</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                className="input-field"
                rows={3}
                placeholder="Brief summary of your background and goals..."
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Skills</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="input-field"
                  placeholder="Add a skill..."
                />
                <button onClick={addSkill} className="btn-primary px-4">Add</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Education</h2>
              <button onClick={addEducation} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-4">
              {formData.education.map((edu, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                      className="input-field"
                      placeholder="Institution"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                      className="input-field"
                      placeholder="Degree (e.g., Bachelor)"
                    />
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => updateEducation(idx, 'field', e.target.value)}
                      className="input-field"
                      placeholder="Field of Study"
                    />
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(idx, 'year', e.target.value)}
                      className="input-field"
                      placeholder="Year (e.g., 2024)"
                    />
                  </div>
                  <button onClick={() => removeEducation(idx)} className="mt-2 text-red-500 text-sm flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Projects</h2>
              <button onClick={addProject} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-4">
              {formData.projects.map((proj, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(idx, 'name', e.target.value)}
                      className="input-field"
                      placeholder="Project Name"
                    />
                    <input
                      type="text"
                      value={proj.description}
                      onChange={(e) => updateProject(idx, 'description', e.target.value)}
                      className="input-field"
                      placeholder="Description"
                    />
                    <input
                      type="text"
                      value={proj.technologies}
                      onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                      className="input-field"
                      placeholder="Technologies (e.g., React, Node.js)"
                    />
                  </div>
                  <button onClick={() => removeProject(idx)} className="mt-2 text-red-500 text-sm flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Experience</h2>
              <button onClick={addExperience} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-4">
              {formData.experience.map((exp, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                      className="input-field"
                      placeholder="Company"
                    />
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                      className="input-field"
                      placeholder="Role"
                    />
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateExperience(idx, 'duration', e.target.value)}
                      className="input-field"
                      placeholder="Duration (e.g., 2020-2023)"
                    />
                  </div>
                  <textarea
                    value={exp.responsibilities}
                    onChange={(e) => updateExperience(idx, 'responsibilities', e.target.value)}
                    className="input-field mt-4"
                    rows={2}
                    placeholder="Key responsibilities and achievements..."
                  />
                  <button onClick={() => removeExperience(idx)} className="mt-2 text-red-500 text-sm flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button onClick={handleGenerate} disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              {loading ? 'Generating...' : 'Generate CV'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            {generatedCV ? (
              <div className="prose dark:prose-invert max-w-none whitespace-pre-line">
                <pre className="font-sans text-sm leading-relaxed">{generatedCV}</pre>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No CV generated yet. Fill in your details and click Generate.</p>
              </div>
            )}
          </div>

          {generatedCV && (
            <div className="flex justify-end gap-4">
              <button onClick={downloadPDF} className="btn-primary flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CVGenerator;
