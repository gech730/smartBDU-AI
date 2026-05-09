import { useState, useEffect } from 'react';
import { BookOpen, FileText, Download, User, Clock } from 'lucide-react';
import { courseAPI } from '../services/smartBDUAPI';
import { useAuth } from '../context/AuthContext';

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedTab, setSelectedTab] = useState('courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [courseRes, assignmentRes] = await Promise.all([
        courseAPI.getAll({ department: user?.department }),
        courseAPI.getAssignments()
      ]);
      setCourses(courseRes.courses || []);
      setAssignments(assignmentRes.assignments || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAssignments = assignments.filter(a => new Date(a.dueDate) > new Date());
  const pastAssignments = assignments.filter(a => new Date(a.dueDate) <= new Date());

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
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-gray-400 mt-1">
          {user?.department} • Year {user?.yearOfStudy}
        </p>
      </div>

      <div className="flex gap-4 border-b border-dark">
        <button
          onClick={() => setSelectedTab('courses')}
          className={`pb-4 px-2 ${selectedTab === 'courses' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
        >
          My Courses
        </button>
        <button
          onClick={() => setSelectedTab('assignments')}
          className={`pb-4 px-2 ${selectedTab === 'assignments' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
        >
          Assignments ({upcomingAssignments.length})
        </button>
        <button
          onClick={() => setSelectedTab('materials')}
          className={`pb-4 px-2 ${selectedTab === 'materials' ? 'border-b-2 border-primary text-primary' : 'text-gray-400'}`}
        >
          Materials
        </button>
      </div>

      {selectedTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <div 
              key={course._id}
              onClick={() => setSelectedCourse(course)}
              className="bg-dark-lighter rounded-xl p-6 cursor-pointer hover:bg-dark-hover transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <span className="text-2xl font-bold text-primary">{course.code}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{course.credits} Credits</span>
                <span className="text-gray-400">{course.semester}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'assignments' && (
        <div className="space-y-4">
          {upcomingAssignments.length > 0 && (
            <>
              <h2 className="text-xl font-semibold">Upcoming</h2>
              {upcomingAssignments.map(assignment => (
                <AssignmentCard key={assignment._id} assignment={assignment} />
              ))}
            </>
          )}
          
          {pastAssignments.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-8">Past Due</h2>
              {pastAssignments.map(assignment => (
                <AssignmentCard key={assignment._id} assignment={assignment} past />
              ))}
            </>
          )}
          
          {assignments.length === 0 && (
            <div className="bg-dark-lighter rounded-xl p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-semibold mb-2">No Assignments</h3>
              <p className="text-gray-400">No assignments posted yet</p>
            </div>
          )}
        </div>
      )}

      {selectedTab === 'materials' && (
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course._id} className="bg-dark-lighter rounded-xl p-6">
              <h3 className="font-semibold mb-4">{course.code} - {course.name}</h3>
              {course.materials?.length > 0 ? (
                <div className="space-y-2">
                  {course.materials.map((mat, idx) => (
                    <a 
                      key={idx}
                      href={mat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-dark rounded-lg hover:bg-dark-hover transition"
                    >
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="flex-1">{mat.title}</span>
                      <Download className="w-4 h-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No materials available</p>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedCourse && (
        <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </div>
  );
}

function AssignmentCard({ assignment, past }) {
  return (
    <div className={`bg-dark-lighter rounded-xl p-6 border-l-4 ${
      past ? 'border-l-gray-500 opacity-75' : 'border-l-orange-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              assignment.type === 'quiz' ? 'bg-blue-500/20 text-blue-400' :
              assignment.type === 'project' ? 'bg-purple-500/20 text-purple-400' :
              'bg-green-500/20 text-green-400'
            }`}>
              {assignment.type}
            </span>
            <span className="text-sm text-gray-400">{assignment.courseCode}</span>
          </div>
          <h3 className="text-lg font-semibold">{assignment.title}</h3>
          <p className="text-gray-400 text-sm mt-2">{assignment.description}</p>
        </div>
        <div className="text-right">
          <p className={`font-medium ${past ? 'text-gray-500' : 'text-orange-400'}`}>
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-400 mt-1">{assignment.maxScore} points</p>
        </div>
      </div>
    </div>
  );
}

function CourseModal({ course, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-dark-lighter rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-dark">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-primary font-bold text-xl">{course.code}</span>
              <h2 className="text-2xl font-bold mt-1">{course.name}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-300">{course.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <User className="w-4 h-4" />
                <span className="text-sm">Instructor</span>
              </div>
              <p className="font-medium">{course.instructor?.name || course.instructorName || 'TBA'}</p>
            </div>
            <div className="bg-dark rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Credits</span>
              </div>
              <p className="font-medium">{course.credits}</p>
            </div>
          </div>

          {course.prerequisites?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Prerequisites</h4>
              <div className="flex flex-wrap gap-2">
                {course.prerequisites.map((prereq, idx) => (
                  <span key={idx} className="px-3 py-1 bg-dark rounded-full text-sm">
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {course.gradingPolicy && (
            <div>
              <h4 className="font-semibold mb-2">Grading Policy</h4>
              <div className="bg-dark rounded-lg p-4 space-y-2">
                {Object.entries(course.gradingPolicy).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-400 capitalize">{key}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
