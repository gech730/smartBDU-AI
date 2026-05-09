import { useState, useEffect } from 'react';
import { Search, Users, Mail, Phone, GraduationCap, Filter } from 'lucide-react';
import { authAPI } from '../services/authAPI';

export default function Directory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ role: '', department: '' });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadDirectory();
  }, [filter]);

  const loadDirectory = async () => {
    try {
      const params = {};
      if (filter.role) params.role = filter.role;
      if (filter.department) params.department = filter.department;
      
      const response = await authAPI.getDirectory(params);
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error loading directory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.universityId.toLowerCase().includes(search.toLowerCase()) ||
    user.department?.toLowerCase().includes(search.toLowerCase())
  );

  const departments = [...new Set(users.map(u => u.department).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student & Faculty Directory</h1>
        <p className="text-gray-400 mt-1">Find contacts and information</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <select
          value={filter.role}
          onChange={(e) => setFilter({ ...filter, role: e.target.value })}
          className="px-4 py-3 bg-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="faculty">Faculty</option>
        </select>

        <select
          value={filter.department}
          onChange={(e) => setFilter({ ...filter, department: e.target.value })}
          className="px-4 py-3 bg-dark-lighter rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <div 
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className="bg-dark-lighter rounded-xl p-6 cursor-pointer hover:bg-dark-hover transition"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                {user.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.universityId}</p>
                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                  user.role === 'student' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>
            {user.department && (
              <div className="mt-4 pt-4 border-t border-dark flex items-center gap-2 text-sm text-gray-400">
                <GraduationCap className="w-4 h-4" />
                {user.department}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-dark-lighter rounded-xl p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}

function UserModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-dark-lighter rounded-xl max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center border-b border-dark">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold mx-auto mb-4">
            {user.name?.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-400">{user.universityId}</p>
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
            user.role === 'student' ? 'bg-blue-500/20 text-blue-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {user.role}
          </span>
        </div>

        <div className="p-6 space-y-4">
          {user.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <a href={`mailto:${user.email}`} className="text-primary hover:underline">
                {user.email}
              </a>
            </div>
          )}
          
          {user.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{user.phone}</span>
            </div>
          )}
          
          {user.department && (
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-gray-400" />
              <span>{user.department}</span>
            </div>
          )}

          {user.role === 'student' && user.yearOfStudy && (
            <div className="pt-4 border-t border-dark">
              <p className="text-sm text-gray-400">Year of Study</p>
              <p className="font-medium">Year {user.yearOfStudy}</p>
            </div>
          )}

          {user.bio && (
            <div className="pt-4 border-t border-dark">
              <p className="text-sm text-gray-400 mb-1">Bio</p>
              <p className="text-sm">{user.bio}</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-dark">
          <button 
            onClick={onClose}
            className="w-full py-2 bg-dark rounded-lg hover:bg-dark-hover transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
