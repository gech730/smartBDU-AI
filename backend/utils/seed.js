import Department from '../models/Department.js';
import BDUInfo from '../models/BDUInfo.js';

const departments = [
  {
    name: 'Computer Science',
    code: 'CS',
    faculty: 'Faculty of Computing and Informatics',
    description: 'Study of computation, algorithms, and information processing. Covers programming, software development, AI, databases, and computer systems. This program prepares students for the rapidly evolving tech industry with hands-on projects and research opportunities.',
    duration: '4 years',
    requirements: ['Strong math skills', 'Logical thinking', 'Problem-solving ability', 'Interest in technology'],
    skills: ['Programming', 'Data Structures', 'Algorithms', 'Machine Learning', 'Database Management', 'Software Engineering', 'Web Development', 'Cloud Computing'],
    courses: [
      { code: 'CS101', name: 'Introduction to Programming', description: 'Basic programming concepts using Python' },
      { code: 'CS102', name: 'Discrete Mathematics', description: 'Mathematical foundations for CS' },
      { code: 'CS201', name: 'Data Structures', description: 'Arrays, linked lists, trees, graphs' },
      { code: 'CS202', name: 'Algorithms', description: 'Algorithm design and analysis' },
      { code: 'CS301', name: 'Database Systems', description: 'Relational databases and SQL' },
      { code: 'CS302', name: 'Operating Systems', description: 'OS concepts and Linux' },
      { code: 'CS401', name: 'Machine Learning', description: 'ML algorithms and applications' },
      { code: 'CS402', name: 'Software Engineering', description: 'SDLC and project management' }
    ],
    careerOpportunities: ['Software Developer', 'Data Scientist', 'AI Engineer', 'Web Developer', 'Database Administrator', 'Systems Analyst', 'DevOps Engineer', 'Cybersecurity Analyst'],
    salaryRange: { min: 15000, max: 80000, currency: 'ETB' },
    popularity: 95
  },
  {
    name: 'Information Systems',
    code: 'IS',
    faculty: 'Faculty of Computing and Informatics',
    description: 'Focus on business processes and technology integration. Combines business knowledge with IT skills to design and manage information systems. Students learn to bridge the gap between business needs and technology solutions.',
    duration: '4 years',
    requirements: ['Business acumen', 'Communication skills', 'Technical interest', 'Analytical thinking'],
    skills: ['Business Analysis', 'Database Design', 'Project Management', 'System Analysis', 'ERP Systems', 'Data Analytics', 'Business Intelligence', 'Requirements Engineering'],
    courses: [
      { code: 'IS101', name: 'Introduction to IS', description: 'Fundamentals of information systems' },
      { code: 'IS102', name: 'Business Fundamentals', description: 'Basic business concepts' },
      { code: 'IS201', name: 'Database Management', description: 'Database design and implementation' },
      { code: 'IS301', name: 'Systems Analysis', description: 'Business process modeling' },
      { code: 'IS302', name: 'Project Management', description: 'IT project methodologies' },
      { code: 'IS401', name: 'Business Intelligence', description: 'Data analytics for business' },
      { code: 'IS402', name: 'ERP Systems', description: 'SAP/Oracle ERP training' }
    ],
    careerOpportunities: ['Business Analyst', 'Systems Analyst', 'IT Consultant', 'Database Administrator', 'Project Manager', 'Data Analyst', 'IT Manager', 'Product Owner'],
    salaryRange: { min: 12000, max: 60000, currency: 'ETB' },
    popularity: 85
  },
  {
    name: 'Electrical Engineering',
    code: 'EE',
    faculty: 'Faculty of Engineering',
    description: 'Study of electricity, electronics, and electromagnetism. Covers circuit design, power systems, electronics, and communication systems. This field powers everything from smartphones to power grids.',
    duration: '5 years',
    requirements: ['Strong physics and math', 'Analytical thinking', 'Practical skills', 'Problem-solving mindset'],
    skills: ['Circuit Analysis', 'Electronics', 'Power Systems', 'Signal Processing', 'Control Systems', 'Embedded Systems', 'PLC Programming', 'Renewable Energy'],
    courses: [
      { code: 'EE101', name: 'Circuit Theory', description: 'Basic circuit analysis' },
      { code: 'EE102', name: 'Physics for Engineers', description: 'EM fields and waves' },
      { code: 'EE201', name: 'Electronics', description: 'Electronic devices and circuits' },
      { code: 'EE202', name: 'Digital Logic Design', description: 'Boolean algebra and circuits' },
      { code: 'EE301', name: 'Power Systems', description: 'Generation and distribution' },
      { code: 'EE302', name: 'Control Systems', description: 'Control theory and applications' },
      { code: 'EE401', name: 'Renewable Energy', description: 'Solar and wind systems' },
      { code: 'EE402', name: 'Communication Systems', description: 'Signal transmission' }
    ],
    careerOpportunities: ['Electrical Engineer', 'Electronics Engineer', 'Power Engineer', 'Telecommunications Engineer', 'Embedded Systems Developer', 'Maintenance Engineer', 'Renewable Energy Engineer', 'Automation Engineer'],
    salaryRange: { min: 18000, max: 75000, currency: 'ETB' },
    popularity: 88
  },
  {
    name: 'Mechanical Engineering',
    code: 'ME',
    faculty: 'Faculty of Engineering',
    description: 'Design and analysis of mechanical systems. Covers thermodynamics, mechanics, materials science, and manufacturing processes. Mechanical engineers design everything from engines to robots.',
    duration: '5 years',
    requirements: ['Physics and math strength', 'Design interest', 'Problem-solving skills', 'Spatial visualization'],
    skills: ['Thermodynamics', 'Mechanics', 'CAD Design', 'Manufacturing', 'Materials Science', 'Machine Design', 'Finite Element Analysis', 'Robotics'],
    courses: [
      { code: 'ME101', name: 'Engineering Mechanics', description: 'Statics and dynamics' },
      { code: 'ME102', name: 'Engineering Drawing', description: 'Technical drawing and AutoCAD' },
      { code: 'ME201', name: 'Thermodynamics', description: 'Heat and energy transfer' },
      { code: 'ME202', name: 'Strength of Materials', description: 'Material behavior' },
      { code: 'ME301', name: 'Machine Design', description: 'Mechanical component design' },
      { code: 'ME302', name: 'Manufacturing Processes', description: 'Production methods' },
      { code: 'ME401', name: 'Fluid Mechanics', description: 'Fluid dynamics' },
      { code: 'ME402', name: 'Robotics', description: 'Robot design and control' }
    ],
    careerOpportunities: ['Mechanical Engineer', 'Design Engineer', 'Manufacturing Engineer', 'Automotive Engineer', 'Aerospace Engineer', 'Quality Engineer', 'HVAC Engineer', 'Project Engineer'],
    salaryRange: { min: 15000, max: 70000, currency: 'ETB' },
    popularity: 82
  },
  {
    name: 'Civil Engineering',
    code: 'CE',
    faculty: 'Faculty of Engineering',
    description: 'Design and construction of infrastructure. Covers structural analysis, transportation, water resources, and environmental engineering. Civil engineers build the foundation of modern society.',
    duration: '5 years',
    requirements: ['Physics and math', 'Project management', 'Attention to detail', 'Interest in construction'],
    skills: ['Structural Analysis', 'Surveying', 'Construction Management', 'Water Resources', 'Transportation', 'Geotechnical Engineering', 'BIM', 'Highway Design'],
    courses: [
      { code: 'CE101', name: 'Surveying', description: 'Land measurement and mapping' },
      { code: 'CE102', name: 'Engineering Geology', description: 'Soil and rock properties' },
      { code: 'CE201', name: 'Structural Mechanics', description: 'Structural analysis' },
      { code: 'CE202', name: 'Construction Materials', description: 'Building materials properties' },
      { code: 'CE301', name: 'Reinforced Concrete', description: 'Concrete design' },
      { code: 'CE302', name: 'Transportation Engineering', description: 'Road and traffic design' },
      { code: 'CE401', name: 'Water Resources', description: 'Hydraulic systems' },
      { code: 'CE402', name: 'Construction Management', description: 'Project planning and cost' }
    ],
    careerOpportunities: ['Civil Engineer', 'Structural Engineer', 'Construction Manager', 'Transportation Engineer', 'Water Resources Engineer', 'Project Manager', 'Site Engineer', 'Quantity Surveyor'],
    salaryRange: { min: 14000, max: 65000, currency: 'ETB' },
    popularity: 78
  },
  {
    name: 'Medicine',
    code: 'MD',
    faculty: 'Faculty of Health Sciences',
    description: 'Medical education preparing students to become physicians. Covers anatomy, physiology, pathology, and clinical skills. This prestigious program trains future doctors with extensive hospital rotations.',
    duration: '6 years',
    requirements: ['Biology and chemistry excellence', 'Compassion', 'Dedication', 'High academic achievement', 'Emotional resilience'],
    skills: ['Clinical Diagnosis', 'Patient Care', 'Medical Procedures', 'Research', 'Communication', 'Problem-Solving', 'Emergency Medicine', 'Surgical Techniques'],
    courses: [
      { code: 'MD101', name: 'Anatomy', description: 'Human body structure' },
      { code: 'MD102', name: 'Physiology', description: 'Body functions' },
      { code: 'MD201', name: 'Biochemistry', description: 'Chemical processes in body' },
      { code: 'MD202', name: 'Pathology', description: 'Disease mechanisms' },
      { code: 'MD301', name: 'Pharmacology', description: 'Drug interactions' },
      { code: 'MD302', name: 'Microbiology', description: 'Infectious diseases' },
      { code: 'MD401', name: 'Internal Medicine', description: 'Adult diseases' },
      { code: 'MD402', name: 'Surgery', description: 'Surgical principles' },
      { code: 'MD403', name: 'Pediatrics', description: 'Child healthcare' },
      { code: 'MD404', name: 'Obstetrics & Gynecology', description: "Women's health" }
    ],
    careerOpportunities: ['Physician', 'Surgeon', 'Medical Researcher', 'Hospital Administrator', 'Public Health Specialist', 'Medical Educator', 'Specialist Doctor', 'Medical Consultant'],
    salaryRange: { min: 25000, max: 150000, currency: 'ETB' },
    popularity: 92
  },
  {
    name: 'Nursing',
    code: 'NS',
    faculty: 'Faculty of Health Sciences',
    description: 'Healthcare profession focused on patient care. Covers nursing theory, clinical practice, and healthcare management. Nurses are the backbone of healthcare systems worldwide.',
    duration: '4 years',
    requirements: ['Compassion', 'Communication skills', 'Physical stamina', 'Biology background', 'Empathy'],
    skills: ['Patient Care', 'Clinical Skills', 'Healthcare Management', 'Emergency Care', 'Health Education', 'Communication', 'Medication Administration', 'Patient Assessment'],
    courses: [
      { code: 'NS101', name: 'Fundamentals of Nursing', description: 'Basic nursing principles' },
      { code: 'NS102', name: 'Anatomy and Physiology', description: 'Body systems' },
      { code: 'NS201', name: 'Medical-Surgical Nursing', description: 'Adult care nursing' },
      { code: 'NS202', name: 'Pharmacology for Nurses', description: 'Medication management' },
      { code: 'NS301', name: 'Pediatric Nursing', description: 'Child healthcare' },
      { code: 'NS302', name: 'Mental Health Nursing', description: 'Psychiatric care' },
      { code: 'NS401', name: 'Community Health', description: 'Public health nursing' },
      { code: 'NS402', name: 'Leadership in Nursing', description: 'Management skills' }
    ],
    careerOpportunities: ['Registered Nurse', 'Clinical Nurse', 'Nurse Manager', 'Community Health Nurse', 'ICU Nurse', 'Nurse Educator', 'Public Health Nurse', 'Nurse Practitioner'],
    salaryRange: { min: 10000, max: 45000, currency: 'ETB' },
    popularity: 80
  },
  {
    name: 'Business Administration',
    code: 'BA',
    faculty: 'Faculty of Business and Economics',
    description: 'Study of business management and operations. Covers marketing, finance, human resources, and strategic planning. Prepares students for leadership roles in various industries.',
    duration: '4 years',
    requirements: ['Communication skills', 'Leadership potential', 'Business interest', 'Analytical mindset'],
    skills: ['Marketing', 'Finance', 'Strategic Planning', 'Leadership', 'Project Management', 'Analytical Thinking', 'Financial Analysis', 'Organizational Behavior'],
    courses: [
      { code: 'BA101', name: 'Principles of Management', description: 'Management fundamentals' },
      { code: 'BA102', name: 'Business Mathematics', description: 'Quantitative methods' },
      { code: 'BA201', name: 'Marketing Management', description: 'Marketing strategies' },
      { code: 'BA202', name: 'Financial Accounting', description: 'Accounting basics' },
      { code: 'BA301', name: 'Financial Management', description: 'Corporate finance' },
      { code: 'BA302', name: 'Human Resource Management', description: 'HR practices' },
      { code: 'BA401', name: 'Strategic Management', description: 'Business strategy' },
      { code: 'BA402', name: 'Entrepreneurship', description: 'Startup management' }
    ],
    careerOpportunities: ['Business Manager', 'Marketing Manager', 'Financial Analyst', 'HR Manager', 'Entrepreneur', 'Consultant', 'Operations Manager', 'Product Manager'],
    salaryRange: { min: 12000, max: 70000, currency: 'ETB' },
    popularity: 90
  },
  {
    name: 'Economics',
    code: 'EC',
    faculty: 'Faculty of Business and Economics',
    description: 'Study of production, distribution, and consumption of goods and services. Covers microeconomics, macroeconomics, and econometrics. Economics graduates understand how economies work.',
    duration: '4 years',
    requirements: ['Math skills', 'Analytical thinking', 'Interest in market dynamics', 'Data interpretation'],
    skills: ['Economic Analysis', 'Data Analysis', 'Financial Modeling', 'Policy Analysis', 'Research', 'Quantitative Methods', 'Statistical Analysis', 'Forecasting'],
    courses: [
      { code: 'EC101', name: 'Microeconomics', description: 'Individual market behavior' },
      { code: 'EC102', name: 'Mathematics for Economists', description: 'Mathematical economics' },
      { code: 'EC201', name: 'Macroeconomics', description: 'National economy' },
      { code: 'EC202', name: 'Statistics for Economics', description: 'Statistical methods' },
      { code: 'EC301', name: 'Econometrics', description: 'Statistical methods in economics' },
      { code: 'EC302', name: 'Development Economics', description: 'Economic development' },
      { code: 'EC401', name: 'International Economics', description: 'Global trade' },
      { code: 'EC402', name: 'Public Finance', description: 'Government economics' }
    ],
    careerOpportunities: ['Economist', 'Financial Analyst', 'Policy Analyst', 'Researcher', 'Business Consultant', 'Data Analyst', 'Bank Economist', 'Market Researcher'],
    salaryRange: { min: 11000, max: 55000, currency: 'ETB' },
    popularity: 75
  },
  {
    name: 'Law',
    code: 'LW',
    faculty: 'Faculty of Law',
    description: 'Study of legal systems and regulations. Covers constitutional law, civil law, criminal law, and international law. Law graduates pursue careers in justice and governance.',
    duration: '4 years',
    requirements: ['Analytical thinking', 'Communication skills', 'Research ability', 'Interest in justice', 'Public speaking'],
    skills: ['Legal Analysis', 'Research', 'Courtroom Practice', 'Contract Drafting', 'Negotiation', 'Critical Thinking', 'Legal Writing', 'Mediation'],
    courses: [
      { code: 'LW101', name: 'Introduction to Law', description: 'Legal foundations' },
      { code: 'LW102', name: 'Legal Methods', description: 'Case analysis' },
      { code: 'LW201', name: 'Constitutional Law', description: 'Constitutional principles' },
      { code: 'LW202', name: 'Criminal Law', description: 'Criminal justice system' },
      { code: 'LW301', name: 'Civil Procedure', description: 'Court procedures' },
      { code: 'LW302', name: 'International Law', description: 'Global legal frameworks' },
      { code: 'LW401', name: 'Commercial Law', description: 'Business law' },
      { code: 'LW402', name: 'Public International Law', description: 'International relations' }
    ],
    careerOpportunities: ['Lawyer', 'Judge', 'Legal Consultant', 'Corporate Counsel', 'Legal Researcher', 'Public Prosecutor', 'Human Rights Advocate', 'Mediator'],
    salaryRange: { min: 15000, max: 100000, currency: 'ETB' },
    popularity: 83
  },
  {
    name: 'Agriculture',
    code: 'AG',
    faculty: 'Faculty of Agriculture',
    description: 'Study of agricultural science and practices. Covers crop production, animal husbandry, agricultural economics, and sustainable farming. Agriculture is vital to Ethiopia economy.',
    duration: '4 years',
    requirements: ['Interest in farming', 'Biology background', 'Environmental concern', 'Fieldwork willingness'],
    skills: ['Crop Management', 'Animal Science', 'Soil Science', 'Agribusiness', 'Sustainable Agriculture', 'Research', 'Farm Management', 'Pest Control'],
    courses: [
      { code: 'AG101', name: 'Introduction to Agriculture', description: 'Agricultural basics' },
      { code: 'AG102', name: 'Chemistry for Agriculture', description: 'Agricultural chemistry' },
      { code: 'AG201', name: 'Crop Science', description: 'Crop production' },
      { code: 'AG202', name: 'Soil Science', description: 'Soil management' },
      { code: 'AG301', name: 'Animal Science', description: 'Livestock management' },
      { code: 'AG302', name: 'Agricultural Economics', description: 'Farm business management' },
      { code: 'AG401', name: 'Plant Protection', description: 'Pest and disease management' },
      { code: 'AG402', name: 'Sustainable Agriculture', description: 'Modern farming techniques' }
    ],
    careerOpportunities: ['Agricultural Scientist', 'Farm Manager', 'Agribusiness Manager', 'Agricultural Economist', 'Extension Officer', 'Researcher', 'Food Inspector', 'Horticulturist'],
    salaryRange: { min: 10000, max: 50000, currency: 'ETB' },
    popularity: 70
  },
  {
    name: 'Architecture',
    code: 'AR',
    faculty: 'Faculty of Technology',
    description: 'Design of buildings and structures. Covers architectural design, building construction, urban planning, and architectural history. Architects shape the built environment.',
    duration: '5 years',
    requirements: ['Creative skills', 'Drawing ability', 'Design interest', 'Spatial thinking', 'Artistic sensibility'],
    skills: ['Architectural Design', 'Building Construction', 'Urban Planning', 'CAD Software', '3D Modeling', 'Visualization', 'Sustainable Design', 'Structural Basics'],
    courses: [
      { code: 'AR101', name: 'Architectural Design', description: 'Design fundamentals' },
      { code: 'AR102', name: 'Building Construction', description: 'Construction methods' },
      { code: 'AR201', name: 'Architectural History', description: 'Design movements' },
      { code: 'AR202', name: 'Structural Design', description: 'Building structures' },
      { code: 'AR301', name: 'Urban Planning', description: 'City design' },
      { code: 'AR302', name: 'Building Materials', description: 'Material selection' },
      { code: 'AR401', name: 'Sustainable Design', description: 'Green architecture' },
      { code: 'AR402', name: 'Interior Design', description: 'Space planning' }
    ],
    careerOpportunities: ['Architect', 'Urban Planner', 'Interior Designer', 'Landscape Architect', 'Construction Manager', 'Design Consultant', 'Conservation Architect', 'Project Architect'],
    salaryRange: { min: 15000, max: 80000, currency: 'ETB' },
    popularity: 76
  },
  {
    name: 'Chemistry',
    code: 'CH',
    faculty: 'Faculty of Science',
    description: 'Study of matter, its properties, composition, and reactions. Covers organic, inorganic, physical, and analytical chemistry. Chemistry is fundamental to many industries.',
    duration: '4 years',
    requirements: ['Strong chemistry and math', 'Laboratory skills', 'Research interest', 'Attention to detail'],
    skills: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Techniques', 'Laboratory Skills', 'Spectroscopy', 'Research Methods', 'Quality Control'],
    courses: [
      { code: 'CH101', name: 'General Chemistry', description: 'Chemistry fundamentals' },
      { code: 'CH102', name: 'Organic Chemistry', description: 'Carbon compounds' },
      { code: 'CH201', name: 'Inorganic Chemistry', description: 'Non-carbon compounds' },
      { code: 'CH202', name: 'Physical Chemistry', description: 'Chemical thermodynamics' },
      { code: 'CH301', name: 'Analytical Chemistry', description: 'Chemical analysis' },
      { code: 'CH302', name: 'Biochemistry', description: 'Chemistry of life' },
      { code: 'CH401', name: 'Industrial Chemistry', description: 'Chemical industry' },
      { code: 'CH402', name: 'Environmental Chemistry', description: 'Green chemistry' }
    ],
    careerOpportunities: ['Chemist', 'Research Scientist', 'Quality Assurance', 'Pharmaceutical Scientist', 'Environmental Chemist', 'Food Scientist', 'Laboratory Manager', 'Chemical Engineer'],
    salaryRange: { min: 12000, max: 55000, currency: 'ETB' },
    popularity: 68
  },
  {
    name: 'Physics',
    code: 'PH',
    faculty: 'Faculty of Science',
    description: 'Study of matter, energy, and their interactions. Covers mechanics, electromagnetism, quantum physics, and astrophysics. Physics is the foundation of all sciences.',
    duration: '4 years',
    requirements: ['Strong math and physics', 'Analytical thinking', 'Problem-solving skills', 'Research curiosity'],
    skills: ['Mechanics', 'Electromagnetism', 'Quantum Physics', 'Mathematical Modeling', 'Data Analysis', 'Programming', 'Research Methods', 'Experimental Design'],
    courses: [
      { code: 'PH101', name: 'Classical Mechanics', description: 'Newtonian physics' },
      { code: 'PH102', name: 'Mathematics for Physics', description: 'Advanced math' },
      { code: 'PH201', name: 'Electromagnetism', description: 'Electric and magnetic fields' },
      { code: 'PH202', name: 'Quantum Mechanics', description: 'Quantum physics' },
      { code: 'PH301', name: 'Thermodynamics', description: 'Heat and energy' },
      { code: 'PH302', name: 'Statistical Physics', description: 'Statistical mechanics' },
      { code: 'PH401', name: 'Nuclear Physics', description: 'Atomic nuclei' },
      { code: 'PH402', name: 'Astrophysics', description: 'Space science' }
    ],
    careerOpportunities: ['Physicist', 'Research Scientist', 'Data Analyst', 'Academician', 'Engineer', 'Science Writer', 'Meteorologist', 'Medical Physicist'],
    salaryRange: { min: 12000, max: 60000, currency: 'ETB' },
    popularity: 65
  }
];

const bduInfoData = [
  // Campuses
  {
    category: 'campus',
    title: 'Bahir Dar Polytechnic Institute (BDPI)',
    description: 'The main polytechnic campus of Bahir Dar University, offering technical and vocational programs. Located near the main campus, it provides hands-on training in various engineering and technology fields. BDPI focuses on practical skills and industry partnerships.',
    keywords: ['poly', 'polytechnic', 'technical', 'vocational', 'BDPI', 'poly campus', 'hands-on', 'skills'],
    details: { location: 'Bahir Dar', established: 2005, programs: ['Engineering', 'Technology', 'Vocational'], students: 8000, features: ['Modern workshops', 'Industry partnerships', 'Practical training'] }
  },
  {
    category: 'campus',
    title: 'Main Campus (Tana)',
    description: 'The central campus of Bahir Dar University located near Lake Tana. Houses most faculties including Engineering, Business, and Health Sciences. Features beautiful landscapes and modern academic buildings.',
    keywords: ['main', 'tana', 'central', 'headquarters', 'lake', 'beautiful'],
    details: { location: 'Bahir Dar', near: 'Lake Tana', faculties: 12, students: 30000, buildings: 50 }
  },
  {
    category: 'campus',
    title: 'College of Business and Economics',
    description: 'Located on the main campus, this college offers degrees in Business Administration, Economics, and Accounting. Known for producing business leaders and entrepreneurs across Ethiopia.',
    keywords: ['business', 'economics', 'cbe', 'college', 'accounting', 'management'],
    details: { location: 'Main Campus', faculties: ['Business Admin', 'Economics', 'Accounting'], accreditation: 'AACSB', notable: 'Top business school in Ethiopia' }
  },
  {
    category: 'campus',
    title: 'Faculty of Medicine',
    description: 'The health sciences campus houses the Medicine and Nursing programs. Includes teaching hospitals and clinical training facilities. One of the most prestigious medical schools in East Africa.',
    keywords: ['medicine', 'medical', 'nursing', 'health', 'hospital', 'doctor', 'clinical'],
    details: { location: 'Health Campus', programs: ['MD', 'Nursing', 'Pharmacy'], hospital: 'Teaching Hospital', beds: 500, accreditation: 'WHO recognized' }
  },
  {
    category: 'campus',
    title: 'College of Computing and Informatics',
    description: 'The technology hub of BDU, offering Computer Science, Information Systems, and related programs with state-of-the-art labs. Prepares students for the tech industry with cutting-edge curriculum.',
    keywords: ['computing', 'informatics', 'computer science', 'IT', 'technology', 'software', 'programming', 'AI'],
    details: { location: 'Main Campus', programs: ['CS', 'IS', 'IT'], labs: 10, computers: 500, focus: ['Software Development', 'AI', 'Data Science'] }
  },
  {
    category: 'campus',
    title: 'Faculty of Engineering',
    description: 'The engineering campus offers various engineering disciplines including Civil, Electrical, Mechanical, and more. Features extensive laboratories and research facilities.',
    keywords: ['engineering', 'mechanical', 'electrical', 'civil', 'architectural'],
    details: { location: 'Engineering Campus', programs: ['CE', 'EE', 'ME', 'AR', 'CHE'], labs: 15, research: ['Renewable Energy', 'Construction', 'Automation'] }
  },
  {
    category: 'campus',
    title: 'Ethiopian Institute of Textile and Fashion Technology',
    description: 'Specialized institute for textile and fashion technology. Trains professionals for the growing textile and garment industry in Ethiopia.',
    keywords: ['textile', 'fashion', 'garment', 'clothing', 'fabric'],
    details: { location: 'Main Campus', focus: ['Textile Engineering', 'Fashion Design', 'Garment Technology'], industry: 'Partnerships with textile factories' }
  },
  {
    category: 'campus',
    title: 'Faculty of Agriculture',
    description: 'Agricultural sciences faculty focused on sustainable farming, food security, and agricultural development for Ethiopia. Includes experimental farms.',
    keywords: ['agriculture', 'farming', 'crop', 'food', 'sustainable', 'livestock'],
    details: { location: 'Agricultural Campus', programs: ['Crop Science', 'Animal Science', 'Agricultural Economics'], farms: 'Experimental farms for hands-on learning' }
  },

  // Facilities
  {
    category: 'facility',
    title: 'Main Library',
    description: 'The central library with extensive collections of books, journals, and digital resources. Open to all students and staff. Features study rooms, computer stations, and 24/7 digital access.',
    keywords: ['library', 'books', 'journals', 'study', 'resources', 'research', 'reading'],
    details: { location: 'Main Campus', hours: '7AM-10PM', resources: '100,000+ books', digital: '50,000+ e-books', studyRooms: 20, computers: 100 }
  },
  {
    category: 'facility',
    title: 'Computer Labs',
    description: 'Modern computer laboratories with high-speed internet access for students across all campuses. Equipped with latest software for programming, design, and research.',
    keywords: ['computer lab', 'lab', 'internet', 'wifi', 'computing', 'software', 'programming'],
    details: { location: 'Multiple campuses', computers: 1000, internet: 'High speed 1Gbps', software: ['Microsoft Office', 'AutoCAD', 'Matlab', 'Programming IDEs'], hours: '8AM-10PM' }
  },
  {
    category: 'facility',
    title: 'Student Hostels',
    description: 'On-campus housing for students with various facilities including dining, recreation, and study areas. Separate hostels for male and female students with 24/7 security.',
    keywords: ['hostel', 'dorm', 'dormitory', 'housing', 'accommodation', 'room', 'living'],
    details: { location: 'Main & Polytechnic campuses', capacity: 10000, facilities: ['Dining', 'WiFi', 'Laundry', 'Study rooms', 'Recreation'], security: '24/7 security', internet: 'Free WiFi' }
  },
  {
    category: 'facility',
    title: 'Sports Complex',
    description: 'Comprehensive sports facilities including football field, basketball court, tennis court, volleyball, and modern gymnasium. Regular tournaments and inter-faculty competitions.',
    keywords: ['sports', 'football', 'gym', 'fitness', 'basketball', 'exercise', 'volleyball', 'tennis'],
    details: { location: 'Main Campus', facilities: ['Football field', 'Basketball courts', 'Tennis courts', 'Volleyball', 'Gymnasium', 'Athletics track'], activities: ['Inter-faculty sports', 'Tournaments', 'Fitness training'] }
  },
  {
    category: 'facility',
    title: 'Student Center',
    description: 'Recreation and student activity center with meeting rooms, entertainment areas, and student organization offices. Hub for student clubs and activities.',
    keywords: ['student center', 'club', 'meeting', 'recreation', 'activities', 'entertainment'],
    details: { location: 'Main Campus', facilities: ['Meeting rooms', 'Cafeteria', 'Entertainment hall', 'Club offices'], clubs: '50+ student organizations' }
  },
  {
    category: 'facility',
    title: 'Science Laboratories',
    description: 'Well-equipped science labs for Physics, Chemistry, and Biology experiments. Safety equipment and modern instruments for hands-on learning.',
    keywords: ['science', 'lab', 'physics', 'chemistry', 'biology', 'experiment'],
    details: { location: 'Science Campus', types: ['Physics Lab', 'Chemistry Lab', 'Biology Lab', 'Computer Lab'], equipment: ['Spectrometers', 'Microscopes', 'Oscilloscopes'], safety: 'Full safety equipment' }
  },
  {
    category: 'facility',
    title: 'Engineering Workshops',
    description: 'Practical engineering workshops with metalworking, woodworking, and electronic fabrication facilities. Students gain hands-on experience with industry-standard equipment.',
    keywords: ['workshop', 'engineering', 'fabrication', 'metal', 'wood', 'practical'],
    details: { location: 'Engineering Campus', equipment: ['CNC machines', 'Lathes', 'Welding', '3D printers'], training: 'Industry certifications available' }
  },
  {
    category: 'facility',
    title: 'Medical Simulation Center',
    description: 'State-of-the-art simulation center for medical students. Features patient simulators, anatomy labs, and clinical skills training rooms.',
    keywords: ['medical', 'simulation', 'training', 'hospital', 'clinical'],
    details: { location: 'Health Campus', features: ['Patient simulators', 'Anatomy lab', 'Skills labs', 'OSCE stations'], training: 'Hands-on clinical skills' }
  },
  {
    category: 'facility',
    title: 'Cafeterias and Food Services',
    description: 'Multiple cafeterias across campuses offering affordable meals. Vegetarian and special dietary options available. Clean, safe dining environments.',
    keywords: ['food', 'cafeteria', 'restaurant', 'meal', 'eating', 'dining'],
    details: { location: 'All campuses', options: ['Standard meals', 'Vegetarian', 'Special diets'], price: 'Subsidized for students', hours: '6AM-9PM' }
  },
  {
    category: 'facility',
    title: 'Research Centers',
    description: 'Various research centers focusing on areas like renewable energy, water resources, and ICT. Opportunities for undergraduate and graduate research.',
    keywords: ['research', 'center', 'innovation', 'technology', 'development'],
    details: { locations: 'Main & Engineering campuses', focus: ['Renewable Energy', 'Water Resources', 'ICT', 'Agriculture'], opportunities: ['Student research', 'Publications', 'Grants'] }
  },

  // Admission
  {
    category: 'admission',
    title: 'Undergraduate Admission Requirements',
    description: 'General admission requirements for undergraduate programs. Students must complete Ethiopian Secondary School Certificate (ESSSC) with minimum cutoff points determined by Ministry of Education. Selection based on national exam scores.',
    keywords: ['admission', 'apply', 'undergraduate', 'requirement', 'eligibility', 'entrance', 'ESSSC'],
    details: { exam: 'ESSSC (Ethiopian Secondary School Certificate)', minScore: 'Variable by department (typically 300-500)', deadline: 'July-August annually', quota: 'Government-sponsored and self-sponsored seats' }
  },
  {
    category: 'admission',
    title: 'Department Selection Process',
    description: 'How students are assigned to departments based on their interests, exam scores, and seat availability. Understanding the placement system helps students make informed choices.',
    keywords: ['department', 'placement', 'choice', 'selection', 'score'],
    details: { criteria: ['National exam score', 'Choice preference', 'Seat availability'], cutoff: 'Varies by department competitiveness', tips: ['Research departments thoroughly', 'Consider job market', 'Match your skills'] }
  },
  {
    category: 'admission',
    title: 'Self-Sponsored Programs',
    description: 'Alternative admission route for students who dont meet government sponsorship criteria. Higher tuition fees but same degree and facilities.',
    keywords: ['self-sponsored', 'private', 'fee-paying', 'extension'],
    details: { eligibility: 'Any qualified ESSSC graduate', fees: 'Higher than government-sponsored', benefits: ['Flexible admission', 'More program options'], programs: 'Most undergraduate programs available' }
  },
  {
    category: 'admission',
    title: 'Graduate Admission Requirements',
    description: 'Admission requirements for graduate programs (Masters and PhD). Requires relevant undergraduate degree and minimum GPA. Some programs require entrance exams or interviews.',
    keywords: ['masters', 'phd', 'graduate', 'postgraduate', 'masters program', 'doctoral'],
    details: { requirement: 'Relevant Bachelor degree', minGPA: '2.5/4.0 (varies by program)', exams: ['GRE/GATE sometimes required', 'Program-specific exams'], documents: ['Transcripts', 'Recommendations', 'Research proposal (PhD)'] }
  },
  {
    category: 'admission',
    title: 'International Student Admission',
    description: 'Procedures for international students to join BDU. Requires credential evaluation, English proficiency proof, and visa processing through Ministry of Education.',
    keywords: ['international', 'foreign', 'exchange', 'visa', 'global'],
    details: { requirements: ['Credential evaluation', 'English proficiency (TOEFL 550+ or equivalent)', 'Valid passport', 'Health insurance'], process: 'Through Ministry of Education', programs: 'Undergraduate and Graduate available', support: 'International student office' }
  },
  {
    category: 'admission',
    title: 'Application Timeline and Deadlines',
    description: 'Important dates for undergraduate and graduate applications. Understanding the timeline helps prospective students plan their applications effectively.',
    keywords: ['timeline', 'deadline', 'dates', 'schedule', 'apply'],
    details: { undergraduate: 'Applications open July, close August', graduate: 'Varies by program (typically December-March)', results: '2-4 weeks after application deadline', enrollment: 'September (main semester)' }
  },
  {
    category: 'admission',
    title: 'Required Documents for Admission',
    description: 'Complete list of documents needed for undergraduate and graduate admission applications. Proper documentation ensures smooth application processing.',
    keywords: ['documents', 'required', 'certificates', 'transcripts', 'application'],
    details: { undergraduate: ['ESSSC certificate', 'National exam result', 'Identity card', 'Photos'], graduate: ['Bachelor transcript', 'Degree certificate', 'Recommendation letters', 'CV/Resume', 'Research proposal (PhD)'], international: ['Credential evaluation', 'English test', 'Passport copy'] }
  },

  // Student Life
  {
    category: 'student-life',
    title: 'Student Organizations and Clubs',
    description: 'Over 50 student organizations including academic clubs, cultural groups, sports teams, and volunteer organizations. Find your community and develop leadership skills.',
    keywords: ['clubs', 'organizations', 'student life', 'activities', 'leadership'],
    details: { types: ['Academic clubs', 'Cultural groups', 'Sports teams', 'Volunteer groups', 'Religious organizations'], benefits: ['Leadership experience', 'Networking', 'Skill development'], howToJoin: 'Visit student center or attend club fairs' }
  },
  {
    category: 'student-life',
    title: 'Cultural Activities and Festivals',
    description: 'Rich cultural scene with celebrations of Ethiopian traditions, international days, music festivals, and art exhibitions. Experience diverse cultural expressions.',
    keywords: ['culture', 'festival', 'music', 'art', 'tradition', 'celebration'],
    details: { events: ['Ethiopian New Year', 'Irreecha celebration', 'Cultural day', 'Music festivals', 'Art exhibitions'], participation: 'All students welcome', venues: ['Main auditorium', 'Student center', 'Open grounds'] }
  },
  {
    category: 'student-life',
    title: 'Sports and Recreation',
    description: 'Active sports culture with inter-faculty competitions, recreational activities, and fitness programs. Stay healthy and compete at various levels.',
    keywords: ['sports', 'football', 'basketball', 'volleyball', 'fitness', 'competition'],
    details: { competitive: ['Football league', 'Basketball tournament', 'Athletics'], recreational: ['Gym membership', 'Swimming', 'Tennis', 'Table tennis'], facilities: ['Stadium', 'Sports hall', 'Fitness center'] }
  },
  {
    category: 'student-life',
    title: 'Student Health Services',
    description: 'Comprehensive health services including on-campus clinic, counseling, and referral to hospitals. Mental health support and wellness programs available.',
    keywords: ['health', 'clinic', 'counseling', 'medical', 'wellness', 'mental'],
    details: { services: ['On-campus clinic', 'Emergency care', 'Mental health counseling', 'Health education'], hours: '24/7 emergency', referral: 'Connection to major hospitals', counseling: 'Free confidential sessions' }
  },
  {
    category: 'student-life',
    title: 'Transportation and Getting Around',
    description: 'Transportation options for students including university shuttles, public transport, and bike sharing. Easy access to all campuses and city center.',
    keywords: ['transport', 'bus', 'shuttle', 'transportation', 'commute'],
    details: { university: 'Free shuttle between campuses', public: 'City buses and Bajaj (auto-rickshaw)', options: ['Walking (pedestrian-friendly campus)', 'Cycling', 'University shuttle'], tips: ['Get student bus pass', 'Use shuttle for inter-campus travel'] }
  },
  {
    category: 'student-life',
    title: 'Part-Time Work and Internships',
    description: 'Opportunities for part-time work on campus and internships with local companies. Gain work experience while studying.',
    keywords: ['work', 'internship', 'job', 'employment', 'experience', 'part-time'],
    details: { onCampus: ['Library assistant', 'Lab assistant', 'Research assistant', 'Administrative support'], offCampus: ['IT companies', 'Engineering firms', 'NGOs', 'Government'], benefits: ['Work experience', 'Networking', 'Income', 'Resume building'] }
  },

  // Career and Employment
  {
    category: 'career',
    title: 'Career Center Services',
    description: 'Comprehensive career services including job placement assistance, internship opportunities, CV writing workshops, and interview preparation.',
    keywords: ['career', 'job', 'employment', 'placement', 'guidance'],
    details: { services: ['Job placement', 'Internship coordination', 'Career counseling', 'CV review', 'Mock interviews'], events: ['Job fairs', 'Company presentations', 'Networking events'], location: 'Student Center, 2nd floor' }
  },
  {
    category: 'career',
    title: 'Graduate Employment Statistics',
    description: 'Information about employment rates and career outcomes for BDU graduates. Most graduates find employment within 6-12 months of graduation.',
    keywords: ['employment', 'jobs', 'career', 'statistics', 'graduates', 'hiring'],
    details: { employmentRate: '85% within 12 months', topEmployers: ['Government', 'Private sector', 'NGOs', 'Banking', 'Telecommunications'], averageSalary: '15,000-50,000 ETB/month (varies by field)' }
  },
  {
    category: 'career',
    title: 'Alumni Network and Mentorship',
    description: 'Strong alumni network providing mentorship, networking opportunities, and career guidance for current students.',
    keywords: ['alumni', 'mentor', 'network', 'guidance', 'support'],
    details: { network: '50,000+ alumni worldwide', mentorship: 'Alumni mentorship program', events: ['Alumni reunions', 'Networking events', 'Guest lectures'], benefits: ['Career advice', 'Job referrals', 'Industry connections'] }
  },

  // Overview
  {
    category: 'overview',
    title: 'Bahir Dar University Overview',
    description: 'Bahir Dar University (BDU) is one of the leading universities in Ethiopia and East Africa. Established in 2001, it offers comprehensive undergraduate and graduate programs across multiple disciplines. Known for academic excellence and research impact.',
    keywords: ['university', 'about', 'overview', 'history', 'bdu', 'ethiopia', 'leading'],
    details: { established: 2001, students: 50000, faculties: 12, ranking: 'Top 3 in Ethiopia', international: '200+ partner universities', research: '200+ research publications annually' }
  },
  {
    category: 'overview',
    title: 'Academic Programs and Degrees',
    description: 'BDU offers over 50 undergraduate and 100 graduate programs across various faculties including Engineering, Business, Health Sciences, Computing, Law, and Agriculture.',
    keywords: ['programs', 'courses', 'degree', 'faculty', 'education', 'undergraduate', 'graduate'],
    details: { undergraduate: 50, graduate: 100, doctorate: 20, faculties: ['Engineering', 'Business', 'Health Sciences', 'Computing', 'Law', 'Agriculture', 'Science', 'Humanities'], languages: ['English', 'Amharic'] }
  },
  {
    category: 'overview',
    title: 'Accreditation and Rankings',
    description: 'BDU is accredited by Ethiopian Higher Education QA Agency and ranked among top universities in Africa. Several programs have international accreditation.',
    keywords: ['accreditation', 'ranking', 'quality', 'international', 'recognition'],
    details: { local: 'Ministry of Education accredited', international: 'Partner with 200+ universities', rankings: ['Top 3 in Ethiopia', 'Top 50 in Africa'], quality: 'QA Agency certified' }
  },

  // Services
  {
    category: 'service',
    title: 'Student Support Services',
    description: 'Various support services including academic counseling, career guidance, psychological counseling, disability services, and financial aid assistance.',
    keywords: ['support', 'counseling', 'help', 'student services', 'career', 'disability', 'financial aid'],
    details: { services: ['Academic counseling', 'Career center', 'Health services', 'Disability support', 'Financial aid', 'Psychological counseling'], contact: 'Student Affairs Office' }
  },
  {
    category: 'service',
    title: 'IT Services and Technology',
    description: 'University IT services including student email, learning management system (LMS), high-speed internet, and technical support.',
    keywords: ['IT', 'email', 'internet', 'lms', 'technology', 'wifi', 'computer'],
    details: { email: 'student@bdu.edu.et', lms: 'Online learning platform', wifi: 'Campus-wide coverage', internet: '1 Gbps backbone', support: 'IT Help Desk' }
  },
  {
    category: 'service',
    title: 'Financial Services and Payment',
    description: 'Information about tuition fees, payment methods, scholarships, and financial aid options for students.',
    keywords: ['fees', 'payment', 'tuition', 'scholarship', 'financial', 'money'],
    details: { government: 'Subsidized tuition for sponsored students', selfSponsored: 'Higher fees, payment per semester', scholarships: ['Merit-based', 'Need-based', 'Government grants'], payment: 'Bank transfer, mobile money, on-campus payment' }
  },
  {
    category: 'service',
    title: 'Library and Research Services',
    description: 'Comprehensive library services including book loans, digital resources, research databases, and study spaces.',
    keywords: ['library', 'research', 'database', 'books', 'journal', 'study'],
    details: { physical: '100,000+ books', digital: '50,000+ e-books', databases: ['JSTOR', 'ScienceDirect', 'ACM', 'IEEE'], services: ['Inter-library loan', 'Research assistance', 'Study rooms'] }
  },

  // History
  {
    category: 'history',
    title: 'History of Bahir Dar University',
    description: 'Bahir Dar University was established in 2001 by merging the former Bahir Dar College and several regional institutions. It has grown to become one of Africas largest and most prestigious universities.',
    keywords: ['history', 'established', 'founding', 'origin', 'timeline'],
    details: { established: 2001, predecessor: 'Bahir Dar College (1960s)', growth: 'From 2,000 to 50,000 students', milestones: ['2001: University established', '2010: University status', '2020: 50,000 students milestone'] }
  },
  {
    category: 'history',
    title: 'Vision and Mission',
    description: 'BDU is committed to becoming a world-class university through quality education, research, and community service. Vision to be the leading university in Africa.',
    keywords: ['vision', 'mission', 'goals', 'values', 'objectives'],
    details: { vision: 'To be a center of academic excellence in Africa', mission: 'Quality education, research, and community service', values: ['Excellence', 'Innovation', 'Integrity', 'Social responsibility'] }
  },

  // Fees and Costs
  {
    category: 'fees',
    title: 'Tuition Fees Structure',
    description: 'Comprehensive breakdown of tuition fees for government-sponsored and self-sponsored students across different faculties and programs.',
    keywords: ['fees', 'tuition', 'cost', 'price', 'payment', 'expenses'],
    details: { government: '3,000-8,000 ETB per year', selfSponsored: '15,000-50,000 ETB per year', engineering: 'Higher fees due to labs (25,000-40,000 ETB)', medicine: 'Premium fees (35,000-50,000 ETB)', paymentSchedule: 'Per semester or annual' }
  },
  {
    category: 'fees',
    title: 'Living Costs and Budgeting',
    description: 'Estimated living costs for students in Bahir Dar including accommodation, food, transportation, and personal expenses.',
    keywords: ['living', 'cost', 'budget', 'expense', 'money', 'accommodation'],
    details: { hostel: '2,000-5,000 ETB per month', food: '2,000-4,000 ETB per month', transport: '500-1,500 ETB per month', books: '1,000-3,000 ETB per semester', totalEstimate: '5,000-15,000 ETB per month' }
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