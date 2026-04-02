import Department from '../models/Department.js';
import BDUInfo from '../models/BDUInfo.js';

const departments = [
  {
    name: 'Computer Science',
    code: 'CS',
    faculty: 'Faculty of Computing and Informatics',
    description: 'Study of computation, algorithms, and information processing. Covers programming, software development, AI, databases, and computer systems.',
    duration: '4 years',
    requirements: ['Strong math skills', 'Logical thinking', 'Problem-solving ability'],
    skills: ['Programming', 'Data Structures', 'Algorithms', 'Machine Learning', 'Database Management', 'Software Engineering'],
    courses: [
      { code: 'CS101', name: 'Introduction to Programming', description: 'Basic programming concepts using Python' },
      { code: 'CS201', name: 'Data Structures', description: 'Arrays, linked lists, trees, graphs' },
      { code: 'CS301', name: 'Algorithms', description: 'Algorithm design and analysis' },
      { code: 'CS401', name: 'Machine Learning', description: 'ML algorithms and applications' }
    ],
    careerOpportunities: ['Software Developer', 'Data Scientist', 'AI Engineer', 'Web Developer', 'Database Administrator', 'Systems Analyst'],
    salaryRange: { min: 15000, max: 80000, currency: 'ETB' },
    popularity: 95
  },
  {
    name: 'Information Systems',
    code: 'IS',
    faculty: 'Faculty of Computing and Informatics',
    description: 'Focus on business processes and technology integration. Combines business knowledge with IT skills to design and manage information systems.',
    duration: '4 years',
    requirements: ['Business acumen', 'Communication skills', 'Technical interest'],
    skills: ['Business Analysis', 'Database Design', 'Project Management', 'System Analysis', 'ERP Systems', 'Data Analytics'],
    courses: [
      { code: 'IS101', name: 'Introduction to IS', description: 'Fundamentals of information systems' },
      { code: 'IS201', name: 'Database Management', description: 'Database design and implementation' },
      { code: 'IS301', name: 'Systems Analysis', description: 'Business process modeling' },
      { code: 'IS401', name: 'Business Intelligence', description: 'Data analytics for business' }
    ],
    careerOpportunities: ['Business Analyst', 'Systems Analyst', 'IT Consultant', 'Database Administrator', 'Project Manager', 'Data Analyst'],
    salaryRange: { min: 12000, max: 60000, currency: 'ETB' },
    popularity: 85
  },
  {
    name: 'Electrical Engineering',
    code: 'EE',
    faculty: 'Faculty of Engineering',
    description: 'Study of electricity, electronics, and electromagnetism. Covers circuit design, power systems, electronics, and communication systems.',
    duration: '5 years',
    requirements: ['Strong physics and math', 'Analytical thinking', 'Practical skills'],
    skills: ['Circuit Analysis', 'Electronics', 'Power Systems', 'Signal Processing', 'Control Systems', 'Embedded Systems'],
    courses: [
      { code: 'EE101', name: 'Circuit Theory', description: 'Basic circuit analysis' },
      { code: 'EE201', name: 'Electronics', description: 'Electronic devices and circuits' },
      { code: 'EE301', name: 'Power Systems', description: 'Generation and distribution' },
      { code: 'EE401', name: 'Control Systems', description: 'Control theory and applications' }
    ],
    careerOpportunities: ['Electrical Engineer', 'Electronics Engineer', 'Power Engineer', 'Telecommunications Engineer', 'Embedded Systems Developer', 'Maintenance Engineer'],
    salaryRange: { min: 18000, max: 75000, currency: 'ETB' },
    popularity: 88
  },
  {
    name: 'Mechanical Engineering',
    code: 'ME',
    faculty: 'Faculty of Engineering',
    description: 'Design and analysis of mechanical systems. Covers thermodynamics, mechanics, materials science, and manufacturing processes.',
    duration: '5 years',
    requirements: ['Physics and math strength', 'Design interest', 'Problem-solving skills'],
    skills: ['Thermodynamics', 'Mechanics', 'CAD Design', 'Manufacturing', 'Materials Science', 'Machine Design'],
    courses: [
      { code: 'ME101', name: 'Engineering Mechanics', description: 'Statics and dynamics' },
      { code: 'ME201', name: 'Thermodynamics', description: 'Heat and energy transfer' },
      { code: 'ME301', name: 'Machine Design', description: 'Mechanical component design' },
      { code: 'ME401', name: 'Manufacturing Processes', description: 'Production methods' }
    ],
    careerOpportunities: ['Mechanical Engineer', 'Design Engineer', 'Manufacturing Engineer', 'Automotive Engineer', 'Aerospace Engineer', 'Quality Engineer'],
    salaryRange: { min: 15000, max: 70000, currency: 'ETB' },
    popularity: 82
  },
  {
    name: 'Civil Engineering',
    code: 'CE',
    faculty: 'Faculty of Engineering',
    description: 'Design and construction of infrastructure. Covers structural analysis, transportation, water resources, and environmental engineering.',
    duration: '5 years',
    requirements: ['Physics and math', 'Project management', 'Attention to detail'],
    skills: ['Structural Analysis', 'Surveying', 'Construction Management', 'Water Resources', 'Transportation', 'Geotechnical Engineering'],
    courses: [
      { code: 'CE101', name: 'Surveying', description: 'Land measurement and mapping' },
      { code: 'CE201', name: 'Structural Mechanics', description: 'Structural analysis' },
      { code: 'CE301', name: 'Construction Materials', description: 'Building materials properties' },
      { code: 'CE401', name: 'Transportation Engineering', description: 'Road and traffic design' }
    ],
    careerOpportunities: ['Civil Engineer', 'Structural Engineer', 'Construction Manager', 'Transportation Engineer', 'Water Resources Engineer', 'Project Manager'],
    salaryRange: { min: 14000, max: 65000, currency: 'ETB' },
    popularity: 78
  },
  {
    name: 'Medicine',
    code: 'MD',
    faculty: 'Faculty of Health Sciences',
    description: 'Medical education preparing students to become physicians. Covers anatomy, physiology, pathology, and clinical skills.',
    duration: '6 years',
    requirements: ['Biology and chemistry', 'Compassion', 'Dedication', 'High academic achievement'],
    skills: ['Clinical Diagnosis', 'Patient Care', 'Medical Procedures', 'Research', 'Communication', 'Problem-Solving'],
    courses: [
      { code: 'MD101', name: 'Anatomy', description: 'Human body structure' },
      { code: 'MD201', name: 'Physiology', description: 'Body functions' },
      { code: 'MD301', name: 'Pathology', description: 'Disease mechanisms' },
      { code: 'MD401', name: 'Clinical Medicine', description: 'Patient diagnosis and treatment' }
    ],
    careerOpportunities: ['Physician', 'Surgeon', 'Medical Researcher', 'Hospital Administrator', 'Public Health Specialist', 'Medical Educator'],
    salaryRange: { min: 25000, max: 150000, currency: 'ETB' },
    popularity: 92
  },
  {
    name: 'Nursing',
    code: 'NS',
    faculty: 'Faculty of Health Sciences',
    description: 'Healthcare profession focused on patient care. Covers nursing theory, clinical practice, and healthcare management.',
    duration: '4 years',
    requirements: ['Compassion', 'Communication skills', 'Physical stamina', 'Biology background'],
    skills: ['Patient Care', 'Clinical Skills', 'Healthcare Management', 'Emergency Care', 'Health Education', 'Communication'],
    courses: [
      { code: 'NS101', name: 'Fundamentals of Nursing', description: 'Basic nursing principles' },
      { code: 'NS201', name: 'Medical-Surgical Nursing', description: 'Adult care nursing' },
      { code: 'NS301', name: 'Pediatric Nursing', description: 'Child healthcare' },
      { code: 'NS401', name: 'Community Health', description: 'Public health nursing' }
    ],
    careerOpportunities: ['Registered Nurse', 'Clinical Nurse', 'Nurse Manager', 'Community Health Nurse', 'ICU Nurse', 'Nurse Educator'],
    salaryRange: { min: 10000, max: 45000, currency: 'ETB' },
    popularity: 80
  },
  {
    name: 'Business Administration',
    code: 'BA',
    faculty: 'Faculty of Business and Economics',
    description: 'Study of business management and operations. Covers marketing, finance, human resources, and strategic planning.',
    duration: '4 years',
    requirements: ['Communication skills', 'Leadership potential', 'Business interest'],
    skills: ['Marketing', 'Finance', 'Strategic Planning', 'Leadership', 'Project Management', 'Analytical Thinking'],
    courses: [
      { code: 'BA101', name: 'Principles of Management', description: 'Management fundamentals' },
      { code: 'BA201', name: 'Marketing Management', description: 'Marketing strategies' },
      { code: 'BA301', name: 'Financial Management', description: 'Corporate finance' },
      { code: 'BA401', name: 'Strategic Management', description: 'Business strategy' }
    ],
    careerOpportunities: ['Business Manager', 'Marketing Manager', 'Financial Analyst', 'HR Manager', 'Entrepreneur', 'Consultant'],
    salaryRange: { min: 12000, max: 70000, currency: 'ETB' },
    popularity: 90
  },
  {
    name: 'Economics',
    code: 'EC',
    faculty: 'Faculty of Business and Economics',
    description: 'Study of production, distribution, and consumption of goods and services. Covers microeconomics, macroeconomics, and econometrics.',
    duration: '4 years',
    requirements: ['Math skills', 'Analytical thinking', 'Interest in market dynamics'],
    skills: ['Economic Analysis', 'Data Analysis', 'Financial Modeling', 'Policy Analysis', 'Research', 'Quantitative Methods'],
    courses: [
      { code: 'EC101', name: 'Microeconomics', description: 'Individual market behavior' },
      { code: 'EC201', name: 'Macroeconomics', description: 'National economy' },
      { code: 'EC301', name: 'Econometrics', description: 'Statistical methods in economics' },
      { code: 'EC401', name: 'Development Economics', description: 'Economic development' }
    ],
    careerOpportunities: ['Economist', 'Financial Analyst', 'Policy Analyst', 'Researcher', 'Business Consultant', 'Data Analyst'],
    salaryRange: { min: 11000, max: 55000, currency: 'ETB' },
    popularity: 75
  },
  {
    name: 'Law',
    code: 'LW',
    faculty: 'Faculty of Law',
    description: 'Study of legal systems and regulations. Covers constitutional law, civil law, criminal law, and international law.',
    duration: '4 years',
    requirements: ['Analytical thinking', 'Communication skills', 'Research ability', 'Interest in justice'],
    skills: ['Legal Analysis', 'Research', 'Courtroom Practice', 'Contract Drafting', 'Negotiation', 'Critical Thinking'],
    courses: [
      { code: 'LW101', name: 'Introduction to Law', description: 'Legal foundations' },
      { code: 'LW201', name: 'Constitutional Law', description: 'Constitutional principles' },
      { code: 'LW301', name: 'Criminal Law', description: 'Criminal justice system' },
      { code: 'LW401', name: 'International Law', description: 'Global legal frameworks' }
    ],
    careerOpportunities: ['Lawyer', 'Judge', 'Legal Consultant', 'Corporate Counsel', 'Legal Researcher', 'Public Prosecutor'],
    salaryRange: { min: 15000, max: 100000, currency: 'ETB' },
    popularity: 83
  },
  {
    name: 'Agriculture',
    code: 'AG',
    faculty: 'Faculty of Agriculture',
    description: 'Study of agricultural science and practices. Covers crop production, animal husbandry, agricultural economics, and sustainable farming.',
    duration: '4 years',
    requirements: ['Interest in farming', 'Biology background', 'Environmental concern'],
    skills: ['Crop Management', 'Animal Science', 'Soil Science', 'Agribusiness', 'Sustainable Agriculture', 'Research'],
    courses: [
      { code: 'AG101', name: 'Introduction to Agriculture', description: 'Agricultural basics' },
      { code: 'AG201', name: 'Crop Science', description: 'Crop production' },
      { code: 'AG301', name: 'Animal Science', description: 'Livestock management' },
      { code: 'AG401', name: 'Agricultural Economics', description: 'Farm business management' }
    ],
    careerOpportunities: ['Agricultural Scientist', 'Farm Manager', 'Agribusiness Manager', 'Agricultural Economist', 'Extension Officer', 'Researcher'],
    salaryRange: { min: 10000, max: 50000, currency: 'ETB' },
    popularity: 70
  },
  {
    name: 'Architecture',
    code: 'AR',
    faculty: 'Faculty of Technology',
    description: 'Design of buildings and structures. Covers architectural design, building construction, urban planning, and architectural history.',
    duration: '5 years',
    requirements: ['Creative skills', 'Drawing ability', 'Design interest', 'Spatial thinking'],
    skills: ['Architectural Design', 'Building Construction', 'Urban Planning', 'CAD Software', '3D Modeling', 'Visualization'],
    courses: [
      { code: 'AR101', name: 'Architectural Design', description: 'Design fundamentals' },
      { code: 'AR201', name: 'Building Construction', description: 'Construction methods' },
      { code: 'AR301', name: 'Urban Planning', description: 'City design' },
      { code: 'AR401', name: 'Sustainable Design', description: 'Green architecture' }
    ],
    careerOpportunities: ['Architect', 'Urban Planner', 'Interior Designer', 'Landscape Architect', 'Construction Manager', 'Design Consultant'],
    salaryRange: { min: 15000, max: 80000, currency: 'ETB' },
    popularity: 76
  }
];

const bduInfoData = [
  // Campuses
  {
    category: 'campus',
    title: 'Bahir Dar Polytechnic Institute (BDPI)',
    description: 'The main polytechnic campus of Bahir Dar University, offering technical and vocational programs. Located near the main campus, it provides hands-on training in various engineering and technology fields.',
    keywords: ['poly', 'polytechnic', 'technical', 'vocational', 'BDPI', 'poly campus'],
    details: { location: 'Bahir Dar', established: 2005, programs: ['Engineering', 'Technology', 'Vocational'] }
  },
  {
    category: 'campus',
    title: 'Main Campus (Tana)',
    description: 'The central campus of Bahir Dar University located near Lake Tana. Houses most faculties including Engineering, Business, and Health Sciences.',
    keywords: ['main', 'tana', 'central', 'headquarters'],
    details: { location: 'Bahir Dar', near: 'Lake Tana', faculties: 8 }
  },
  {
    category: 'campus',
    title: 'College of Business and Economics',
    description: 'Located on the main campus, this college offers degrees in Business Administration, Economics, and Accounting.',
    keywords: ['business', 'economics', 'cbe', 'college'],
    details: { location: 'Main Campus', faculties: ['Business Admin', 'Economics', 'Accounting'] }
  },
  {
    category: 'campus',
    title: 'Faculty of Medicine',
    description: 'The health sciences campus houses the Medicine and Nursing programs. Includes teaching hospitals and clinical training facilities.',
    keywords: ['medicine', 'medical', 'nursing', 'health', 'hospital', 'doctor'],
    details: { location: 'Health Campus', programs: ['MD', 'Nursing'], hospital: 'Teaching Hospital' }
  },
  {
    category: 'campus',
    title: 'College of Computing and Informatics',
    description: 'The technology hub of BDU, offering Computer Science, Information Systems, and related programs with state-of-the-art labs.',
    keywords: ['computing', 'informatics', 'computer science', 'IT', 'technology', 'software'],
    details: { location: 'Main Campus', programs: ['CS', 'IS', 'IT'] }
  },

  // Facilities
  {
    category: 'facility',
    title: 'Main Library',
    description: 'The central library with extensive collections of books, journals, and digital resources. Open to all students and staff.',
    keywords: ['library', 'books', 'journals', 'study', 'resources'],
    details: { location: 'Main Campus', hours: '7AM-10PM', resources: '100,000+ books' }
  },
  {
    category: 'facility',
    title: 'Computer Labs',
    description: 'Modern computer laboratories with high-speed internet access for students across all campuses.',
    keywords: ['computer lab', 'lab', 'internet', 'wifi', 'computing'],
    details: { location: 'Multiple campuses', computers: 1000, internet: 'High speed' }
  },
  {
    category: 'facility',
    title: 'Student Hostels',
    description: 'On-campus housing for students with various facilities including dining, recreation, and study areas.',
    keywords: ['hostel', 'dorm', 'dormitory', 'housing', 'accommodation'],
    details: { location: 'Main & Polytechnic campuses', capacity: 10000, facilities: ['Dining', 'WiFi', 'Laundry'] }
  },
  {
    category: 'facility',
    title: 'Sports Complex',
    description: 'Sports facilities including football field, basketball court, tennis court, and gymnasium.',
    keywords: ['sports', 'football', 'gym', 'fitness', 'basketball', 'exercise'],
    details: { location: 'Main Campus', facilities: ['Football field', 'Basketball', 'Tennis', 'Gym'] }
  },
  {
    category: 'facility',
    title: 'Student Center',
    description: 'Recreation and student activity center with meeting rooms, entertainment areas, and student organization offices.',
    keywords: ['student center', 'club', 'meeting', 'recreation'],
    details: { location: 'Main Campus', facilities: ['Meeting rooms', 'Cafe', 'Entertainment'] }
  },

  // Admission
  {
    category: 'admission',
    title: 'Undergraduate Admission',
    description: 'General admission requirements for undergraduate programs. Students must complete Ethiopian Secondary School Certificate (ESSSC) with minimum cutoff points.',
    keywords: ['admission', 'apply', 'undergraduate', 'requirement', 'eligibility', 'entrance'],
    details: { exam: 'ESSSC', minScore: 'Variable by department', deadline: 'July-August' }
  },
  {
    category: 'admission',
    title: 'Graduate Admission',
    description: 'Admission requirements for graduate programs (Masters and PhD). Requires relevant undergraduate degree and minimum GPA.',
    keywords: ['masters', 'phd', 'graduate', 'postgraduate', 'masters program'],
    details: { requirement: 'Bachelor degree', minGPA: '2.5/4.0', exams: ['GRE/GATE sometimes required'] }
  },
  {
    category: 'admission',
    title: 'International Student Admission',
    description: 'Procedures for international students to join BDU. Requires credential evaluation and English proficiency proof.',
    keywords: ['international', 'foreign', 'exchange', 'visa'],
    details: { requirement: ['Credential evaluation', 'English proficiency'], toefl: '550+', process: 'Through Ministry of Education' }
  },

  // Overview
  {
    category: 'overview',
    title: 'Bahir Dar University Overview',
    description: 'Bahir Dar University (BDU) is one of the leading universities in Ethiopia. Established in 2001, it offers comprehensive undergraduate and graduate programs across multiple disciplines.',
    keywords: ['university', 'about', 'overview', 'history', 'bdu', 'ethiopia'],
    details: { established: 2001, students: 50000, faculties: 12, ranking: 'Top 5 in Ethiopia' }
  },
  {
    category: 'overview',
    title: 'Academic Programs',
    description: 'BDU offers over 50 undergraduate and 100 graduate programs across various faculties including Engineering, Business, Health Sciences, and Technology.',
    keywords: ['programs', 'courses', 'degree', 'faculty', 'education'],
    details: { undergraduate: 50, graduate: 100, faculties: ['Engineering', 'Business', 'Health', 'Computing', 'Law', 'Agriculture'] }
  },

  // Services
  {
    category: 'service',
    title: 'Student Support Services',
    description: 'Various support services including academic counseling, career guidance, psychological counseling, and disability services.',
    keywords: ['support', 'counseling', 'help', 'student services', 'career'],
    details: { services: ['Academic counseling', 'Career center', 'Health services', 'Disability support'] }
  },
  {
    category: 'service',
    title: 'IT Services',
    description: 'University IT services including student email, learning management system, and internet services.',
    keywords: ['IT', 'email', 'internet', 'lms', 'technology', 'wifi'],
    details: { email: 'student@bdu.edu.et', lms: 'Online platform', wifi: 'Campus-wide' }
  },
  {
    category: 'service',
    title: 'Career Services',
    description: 'Career center providing job placement assistance, internship opportunities, and career counseling for students and graduates.',
    keywords: ['career', 'job', 'employment', 'internship', 'placement'],
    details: { services: ['Job placement', 'Internship', 'Career counseling', 'CV review'] }
  },

  // History
  {
    category: 'history',
    title: 'History of Bahir Dar University',
    description: 'Bahir Dar University was established in 2001 by merging the former Bahir Dar College and several regional institutions. It has grown to become one of Ethiops largest and most prestigious universities.',
    keywords: ['history', 'established', 'founding', 'origin'],
    details: { established: 2001, predecessor: 'Bahir Dar College', growth: 'From 2000 to 50000 students' }
  }
];

const seedBDUInfo = async () => {
  try {
    const count = await BDUInfo.countDocuments();
    if (count === 0) {
      await BDUInfo.insertMany(bduInfoData);
      console.log('BDU Info seeded successfully');
    } else {
      console.log('BDU Info already exists');
    }
  } catch (error) {
    console.error('Error seeding BDU Info:', error);
  }
};

const seedDepartments = async () => {
  try {
    const count = await Department.countDocuments();
    if (count === 0) {
      await Department.insertMany(departments);
      console.log('Departments seeded successfully');
    } else {
      console.log('Departments already exist');
    }
  } catch (error) {
    console.error('Error seeding departments:', error);
  }
};

const seedAll = async () => {
  await seedDepartments();
  await seedBDUInfo();
};

export default seedAll;