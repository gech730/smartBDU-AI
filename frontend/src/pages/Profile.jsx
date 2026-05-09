import { useState, useRef } from 'react';
import { User, Mail, Target, BookOpen, Save, Loader2, Camera, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    interests: user?.interests || [],
    favoriteSubjects: user?.favoriteSubjects || [],
    goals: user?.goals || []
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateUser(formData);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Please select a valid image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);
    setMessage('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('avatar', file);

      // For now, we'll simulate the upload and use a data URL
      // In a real app, you'd upload to your backend
      const reader = new FileReader();
      reader.onload = async (e) => {
        const avatarUrl = e.target.result;
        setAvatar(avatarUrl);
        
        // Update user profile with avatar
        await updateUser({ ...formData, avatar: avatarUrl });
        setMessage('Avatar updated successfully!');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setMessage('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const addItem = (field, value) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
    }
  };

  const removeItem = (field, item) => {
    setFormData({ ...formData, [field]: formData[field].filter(i => i !== item) });
  };

  const interestOptions = ['Technology', 'Healthcare', 'Business', 'Engineering', 'Science', 'Arts', 'Agriculture', 'Law', 'Education'];
  const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Languages', 'History', 'Geography', 'Economics'];
  const goalOptions = ['Get a good job', 'Start my own business', 'Pursue higher studies', 'Make a difference', 'Work abroad', 'Become an expert'];

  const renderTagList = (field, options) => (
    <>
      <div className="flex flex-wrap gap-2 mb-3">
        {options.slice(0, 6).map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => addItem(field, opt)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              formData[field].includes(opt)
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-primary-100'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {formData[field].length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {formData[field].map(item => (
            <span key={item} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm">
              {item}
              <button type="button" onClick={() => removeItem(field, item)} className="hover:text-red-500">×</button>
            </span>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <User className="w-8 h-8 text-primary-500" />
          Profile
        </h1>
        <p className="text-gray-500 dark:text-slate-400 mt-2">Manage your account and preferences</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-slate-700">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <button
              onClick={triggerFileInput}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-full shadow-lg transition-colors disabled:opacity-50"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-gray-500 dark:text-slate-400">{user?.email}</p>
            <p className="text-sm text-primary-500 mt-1">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field pl-12"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary-500" /> Interests
          </label>
          {renderTagList('interests', interestOptions)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-secondary-500" /> Favorite Subjects
          </label>
          {renderTagList('favoriteSubjects', subjectOptions)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-accent-500" /> Goals
          </label>
          {renderTagList('goals', goalOptions)}
        </div>

        {message && (
          <div className={`p-4 rounded-xl ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {message}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default Profile;