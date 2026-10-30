import {
  User,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  Announcement,
  TrainingProgram,
  NotificationItem,
  PerformanceReview,
  Department
} from '../types/hrm';

export const DEMO_USERS: Record<string, User> = {
  hr: {
    id: 'usr_hr_01',
    employeeId: 'EMP-1001',
    name: 'Elena Rostova',
    email: 'elena.rostova@nexushr.io',
    role: 'hr',
    department: 'People & Culture',
    designation: 'VP of Human Resources',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678',
    token: 'jwt_mock_token_elena_hr_admin_2026'
  },
  manager: {
    id: 'usr_mgr_01',
    employeeId: 'EMP-1002',
    name: 'Marcus Vance',
    email: 'marcus.vance@nexushr.io',
    role: 'manager',
    department: 'Engineering',
    designation: 'Director of Software Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6789',
    token: 'jwt_mock_token_marcus_manager_2026'
  },
  employee: {
    id: 'usr_emp_01',
    employeeId: 'EMP-1003',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@nexushr.io',
    role: 'employee',
    department: 'Engineering',
    designation: 'Senior Full-Stack Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 456-7890',
    token: 'jwt_mock_token_sarah_employee_2026'
  }
};

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept_eng',
    name: 'Engineering',
    code: 'ENG',
    managerId: 'usr_mgr_01',
    managerName: 'Marcus Vance',
    employeeCount: 14,
    budgetAnnual: 1850000
  },
  {
    id: 'dept_prod',
    name: 'Product & Design',
    code: 'PRD',
    managerId: 'usr_mgr_02',
    managerName: 'Julian Croft',
    employeeCount: 8,
    budgetAnnual: 920000
  },
  {
    id: 'dept_hr',
    name: 'People & Culture',
    code: 'P&C',
    managerId: 'usr_hr_01',
    managerName: 'Elena Rostova',
    employeeCount: 5,
    budgetAnnual: 480000
  },
  {
    id: 'dept_mkt',
    name: 'Marketing & Sales',
    code: 'MKT',
    managerId: 'usr_mgr_03',
    managerName: 'Amara Okafor',
    employeeCount: 11,
    budgetAnnual: 1150000
  },
  {
    id: 'dept_fin',
    name: 'Finance & Operations',
    code: 'FIN',
    managerId: 'usr_mgr_04',
    managerName: 'David Sterling',
    employeeCount: 6,
    budgetAnnual: 650000
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'usr_emp_01',
    employeeId: 'EMP-1003',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@nexushr.io',
    phone: '+1 (555) 456-7890',
    department: 'Engineering',
    designation: 'Senior Full-Stack Engineer',
    salary: 135000,
    dateOfJoining: '2022-03-15',
    status: 'active',
    managerId: 'usr_mgr_01',
    managerName: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Michael Jenkins',
      relation: 'Spouse',
      phone: '+1 (555) 987-6543'
    },
    skills: ['TypeScript', 'React.js', 'Node.js', 'GraphQL', 'AWS Cloud', 'Docker', 'PostgreSQL'],
    address: '442 Silicon Blvd, Suite 300, San Francisco, CA',
    leaveBalance: {
      annual: 14,
      sick: 8,
      casual: 4,
      maternity: 60
    },
    performanceScore: 4.8
  },
  {
    id: 'usr_emp_02',
    employeeId: 'EMP-1004',
    name: 'Alex Chen',
    email: 'alex.chen@nexushr.io',
    phone: '+1 (555) 567-8901',
    department: 'Engineering',
    designation: 'DevOps & Cloud Architect',
    salary: 142000,
    dateOfJoining: '2021-08-01',
    status: 'active',
    managerId: 'usr_mgr_01',
    managerName: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Linda Chen',
      relation: 'Sister',
      phone: '+1 (555) 876-5432'
    },
    skills: ['Kubernetes', 'Terraform', 'CI/CD Pipelines', 'GCP', 'Linux Kernel', 'Prometheus'],
    address: '108 Market Street, Apt 5B, Oakland, CA',
    leaveBalance: {
      annual: 10,
      sick: 9,
      casual: 5,
      maternity: 0
    },
    performanceScore: 4.6
  },
  {
    id: 'usr_emp_03',
    employeeId: 'EMP-1005',
    name: 'Priya Sharma',
    email: 'priya.sharma@nexushr.io',
    phone: '+1 (555) 678-9012',
    department: 'Engineering',
    designation: 'Frontend UI/UX Engineer',
    salary: 118000,
    dateOfJoining: '2023-01-10',
    status: 'active',
    managerId: 'usr_mgr_01',
    managerName: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Rohan Sharma',
      relation: 'Brother',
      phone: '+1 (555) 765-4321'
    },
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Figma', 'Web Accessibility (a11y)', 'Design Systems'],
    address: '77 Mission Plaza, San Jose, CA',
    leaveBalance: {
      annual: 18,
      sick: 10,
      casual: 3,
      maternity: 60
    },
    performanceScore: 4.7
  },
  {
    id: 'usr_mgr_01',
    employeeId: 'EMP-1002',
    name: 'Marcus Vance',
    email: 'marcus.vance@nexushr.io',
    phone: '+1 (555) 345-6789',
    department: 'Engineering',
    designation: 'Director of Software Engineering',
    salary: 178000,
    dateOfJoining: '2020-04-12',
    status: 'active',
    managerId: 'usr_hr_01',
    managerName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Victoria Vance',
      relation: 'Spouse',
      phone: '+1 (555) 654-3210'
    },
    skills: ['Engineering Management', 'Microservices', 'Distributed Systems', 'Agile Coaching', 'Budgeting'],
    address: '920 Hilltop Way, Palo Alto, CA',
    leaveBalance: {
      annual: 16,
      sick: 10,
      casual: 5,
      maternity: 0
    },
    performanceScore: 4.9
  },
  {
    id: 'usr_hr_01',
    employeeId: 'EMP-1001',
    name: 'Elena Rostova',
    email: 'elena.rostova@nexushr.io',
    phone: '+1 (555) 234-5678',
    department: 'People & Culture',
    designation: 'VP of Human Resources',
    salary: 185000,
    dateOfJoining: '2019-11-01',
    status: 'active',
    managerId: 'usr_exec_01',
    managerName: 'Board of Directors',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Dmitri Rostov',
      relation: 'Brother',
      phone: '+1 (555) 543-2109'
    },
    skills: ['HR Strategy', 'Organizational Development', 'Talent Acquisition', 'Labor Law', 'Payroll Analytics'],
    address: '15 Embarcadero Center, San Francisco, CA',
    leaveBalance: {
      annual: 20,
      sick: 12,
      casual: 6,
      maternity: 60
    },
    performanceScore: 5.0
  },
  {
    id: 'usr_emp_04',
    employeeId: 'EMP-1006',
    name: 'David Sterling',
    email: 'david.sterling@nexushr.io',
    phone: '+1 (555) 789-0123',
    department: 'Finance & Operations',
    designation: 'Financial Controller',
    salary: 130000,
    dateOfJoining: '2021-06-15',
    status: 'active',
    managerId: 'usr_hr_01',
    managerName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Carol Sterling',
      relation: 'Spouse',
      phone: '+1 (555) 432-1098'
    },
    skills: ['Financial Modeling', 'Budget Auditing', 'GAAP', 'QuickBooks Enterprise', 'Cash Flow Analysis'],
    address: '320 Pine Street, Berkeley, CA',
    leaveBalance: {
      annual: 12,
      sick: 8,
      casual: 4,
      maternity: 0
    },
    performanceScore: 4.5
  },
  {
    id: 'usr_emp_05',
    employeeId: 'EMP-1007',
    name: 'Maya Lin',
    email: 'maya.lin@nexushr.io',
    phone: '+1 (555) 890-1234',
    department: 'Product & Design',
    designation: 'Lead Product Designer',
    salary: 128000,
    dateOfJoining: '2022-09-01',
    status: 'active',
    managerId: 'usr_mgr_01',
    managerName: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Ken Lin',
      relation: 'Father',
      phone: '+1 (555) 321-0987'
    },
    skills: ['Figma', 'User Research', 'Design Systems', 'Interactive Prototyping', 'Design Sprint Facilitation'],
    address: '88 Fremont St, San Francisco, CA',
    leaveBalance: {
      annual: 15,
      sick: 7,
      casual: 3,
      maternity: 60
    },
    performanceScore: 4.8
  },
  {
    id: 'usr_emp_06',
    employeeId: 'EMP-1008',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@nexushr.io',
    phone: '+1 (555) 901-2345',
    department: 'Marketing & Sales',
    designation: 'Senior Enterprise Account Executive',
    salary: 110000,
    dateOfJoining: '2023-04-18',
    status: 'probation',
    managerId: 'usr_hr_01',
    managerName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Sofia Mendoza',
      relation: 'Spouse',
      phone: '+1 (555) 210-9876'
    },
    skills: ['B2B Sales', 'Salesforce CRM', 'Contract Negotiation', 'Lead Qualification', 'Enterprise Demos'],
    address: '500 Grand Ave, Oakland, CA',
    leaveBalance: {
      annual: 8,
      sick: 5,
      casual: 2,
      maternity: 0
    },
    performanceScore: 4.2
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_01',
    employeeId: 'EMP-1003',
    employeeName: 'Sarah Jenkins',
    department: 'Engineering',
    date: new Date().toISOString().split('T')[0],
    clockIn: '09:02:14',
    clockOut: undefined,
    totalHours: undefined,
    status: 'present',
    workMode: 'remote',
    location: 'Home Office - San Francisco',
    notes: 'Sprint 24 feature delivery & code review'
  },
  {
    id: 'att_02',
    employeeId: 'EMP-1004',
    employeeName: 'Alex Chen',
    department: 'Engineering',
    date: new Date().toISOString().split('T')[0],
    clockIn: '08:45:10',
    clockOut: undefined,
    totalHours: undefined,
    status: 'present',
    workMode: 'office',
    location: 'SF HQ - Floor 4',
    notes: 'Kubernetes cluster maintenance'
  },
  {
    id: 'att_03',
    employeeId: 'EMP-1005',
    employeeName: 'Priya Sharma',
    department: 'Engineering',
    date: new Date().toISOString().split('T')[0],
    clockIn: '09:42:00',
    clockOut: undefined,
    totalHours: undefined,
    status: 'late',
    workMode: 'office',
    location: 'SF HQ - Floor 4',
    notes: 'Commute delay on Caltrain'
  },
  {
    id: 'att_04',
    employeeId: 'EMP-1002',
    employeeName: 'Marcus Vance',
    department: 'Engineering',
    date: new Date().toISOString().split('T')[0],
    clockIn: '08:30:00',
    clockOut: undefined,
    totalHours: undefined,
    status: 'present',
    workMode: 'office',
    location: 'SF HQ - Executive Pod',
    notes: 'Quarterly planning sessions'
  },
  {
    id: 'att_05',
    employeeId: 'EMP-1001',
    employeeName: 'Elena Rostova',
    department: 'People & Culture',
    date: new Date().toISOString().split('T')[0],
    clockIn: '08:50:22',
    clockOut: undefined,
    totalHours: undefined,
    status: 'present',
    workMode: 'office',
    location: 'SF HQ - Executive Suite',
    notes: 'Executive board prep & HRM review'
  },
  {
    id: 'att_06',
    employeeId: 'EMP-1006',
    employeeName: 'David Sterling',
    department: 'Finance & Operations',
    date: new Date().toISOString().split('T')[0],
    clockIn: '09:05:00',
    clockOut: undefined,
    totalHours: undefined,
    status: 'present',
    workMode: 'remote',
    location: 'Remote - Berkeley'
  },
  {
    id: 'att_07',
    employeeId: 'EMP-1007',
    employeeName: 'Maya Lin',
    department: 'Product & Design',
    date: new Date().toISOString().split('T')[0],
    clockIn: '09:12:00',
    clockOut: undefined,
    totalHours: undefined,
    status: 'present',
    workMode: 'hybrid',
    location: 'SF HQ Design Studio'
  },
  {
    id: 'att_08',
    employeeId: 'EMP-1008',
    employeeName: 'Carlos Mendoza',
    department: 'Marketing & Sales',
    date: new Date().toISOString().split('T')[0],
    clockIn: '00:00:00',
    status: 'on_leave',
    workMode: 'remote',
    notes: 'Approved sick leave'
  },
  // Yesterday's records
  {
    id: 'att_y_01',
    employeeId: 'EMP-1003',
    employeeName: 'Sarah Jenkins',
    department: 'Engineering',
    date: getPastDate(1),
    clockIn: '08:58:12',
    clockOut: '17:34:40',
    totalHours: 8.6,
    status: 'present',
    workMode: 'office',
    location: 'SF HQ - Floor 4'
  },
  {
    id: 'att_y_02',
    employeeId: 'EMP-1004',
    employeeName: 'Alex Chen',
    department: 'Engineering',
    date: getPastDate(1),
    clockIn: '09:00:00',
    clockOut: '18:15:00',
    totalHours: 9.25,
    status: 'present',
    workMode: 'remote',
    location: 'Home Office'
  },
  {
    id: 'att_y_03',
    employeeId: 'EMP-1005',
    employeeName: 'Priya Sharma',
    department: 'Engineering',
    date: getPastDate(1),
    clockIn: '09:05:10',
    clockOut: '17:35:00',
    totalHours: 8.5,
    status: 'present',
    workMode: 'office',
    location: 'SF HQ'
  },
  {
    id: 'att_y_04',
    employeeId: 'EMP-1003',
    employeeName: 'Sarah Jenkins',
    department: 'Engineering',
    date: getPastDate(2),
    clockIn: '09:10:00',
    clockOut: '17:40:00',
    totalHours: 8.5,
    status: 'present',
    workMode: 'remote'
  },
  {
    id: 'att_y_05',
    employeeId: 'EMP-1003',
    employeeName: 'Sarah Jenkins',
    department: 'Engineering',
    date: getPastDate(3),
    clockIn: '08:50:00',
    clockOut: '17:15:00',
    totalHours: 8.4,
    status: 'present',
    workMode: 'office'
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'leave_01',
    employeeId: 'EMP-1003',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    managerId: 'usr_mgr_01',
    leaveType: 'annual',
    startDate: getFutureDate(12),
    endDate: getFutureDate(16),
    daysCount: 5,
    reason: 'Annual family summer vacation trip to the Pacific Northwest. Handover doc prepared.',
    status: 'pending',
    appliedAt: getPastDate(2)
  },
  {
    id: 'leave_02',
    employeeId: 'EMP-1004',
    employeeName: 'Alex Chen',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    managerId: 'usr_mgr_01',
    leaveType: 'casual',
    startDate: getFutureDate(3),
    endDate: getFutureDate(4),
    daysCount: 2,
    reason: 'Attending KubeCon North America tech conference and architectural workshop.',
    status: 'pending',
    appliedAt: getPastDate(1)
  },
  {
    id: 'leave_03',
    employeeId: 'EMP-1008',
    employeeName: 'Carlos Mendoza',
    employeeAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    department: 'Marketing & Sales',
    managerId: 'usr_hr_01',
    leaveType: 'sick',
    startDate: new Date().toISOString().split('T')[0],
    endDate: getFutureDate(1),
    daysCount: 2,
    reason: 'Seasonal viral flu and doctor recommended resting.',
    status: 'approved',
    appliedAt: getPastDate(1),
    reviewedBy: 'Elena Rostova',
    reviewerRole: 'HR VP',
    managerComment: 'Approved. Rest well and get better Carlos!',
    reviewedAt: getPastDate(1)
  },
  {
    id: 'leave_04',
    employeeId: 'EMP-1005',
    employeeName: 'Priya Sharma',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    managerId: 'usr_mgr_01',
    leaveType: 'sick',
    startDate: getPastDate(14),
    endDate: getPastDate(13),
    daysCount: 2,
    reason: 'Dental surgery and post-op care.',
    status: 'approved',
    appliedAt: getPastDate(16),
    reviewedBy: 'Marcus Vance',
    reviewerRole: 'Engineering Director',
    managerComment: 'Approved. Take care of yourself.',
    reviewedAt: getPastDate(15)
  },
  {
    id: 'leave_05',
    employeeId: 'EMP-1007',
    employeeName: 'Maya Lin',
    employeeAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Product & Design',
    managerId: 'usr_mgr_01',
    leaveType: 'annual',
    startDate: getPastDate(30),
    endDate: getPastDate(26),
    daysCount: 5,
    reason: 'Personal retreat.',
    status: 'approved',
    appliedAt: getPastDate(35),
    reviewedBy: 'Marcus Vance',
    reviewerRole: 'Engineering Director',
    managerComment: 'Approved.',
    reviewedAt: getPastDate(34)
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_01',
    title: 'Company-Wide Q4 All-Hands & Product Roadmap Reveal',
    content: 'Join us this Thursday at 10:00 AM PST in the Main Auditorium or via the high-def live stream link. Executive leadership will present our Q4 milestones, financial health summary, and the 2027 enterprise product roadmap. Q&A session will follow with refreshments provided.',
    department: 'All Departments',
    priority: 'urgent',
    authorName: 'Elena Rostova',
    authorRole: 'VP of People & Culture',
    date: getPastDate(1),
    tags: ['Town Hall', 'Leadership', 'Q4 Strategy'],
    isPinned: true
  },
  {
    id: 'ann_02',
    title: 'Updated Healthcare & Wellness Benefit Enhancements for 2026/2027',
    content: 'We are thrilled to announce expanded mental health coverage, increased annual wellness stipends ($1,200/year), and zero-copay telehealth consults effective next month. Please check your benefits portal or reach out to HR for enrolment adjustments.',
    department: 'All Departments',
    priority: 'high',
    authorName: 'Elena Rostova',
    authorRole: 'VP of People & Culture',
    date: getPastDate(3),
    tags: ['Benefits', 'Health & Wellness', 'Compensation'],
    isPinned: true
  },
  {
    id: 'ann_03',
    title: 'Engineering Hackathon & AI Innovation Days Announced',
    content: 'Calling all engineers, product managers, and designers! Our bi-annual Innovation Sprint kicks off on the 18th. Form cross-functional teams of up to 4 people to tackle customer friction points and explore generative AI integrations. Exciting prizes and incubation opportunities await!',
    department: 'Engineering',
    priority: 'normal',
    authorName: 'Marcus Vance',
    authorRole: 'Director of Software Engineering',
    date: getPastDate(5),
    tags: ['Engineering', 'Hackathon', 'Innovation'],
    isPinned: false
  },
  {
    id: 'ann_04',
    title: 'New Cybersecurity Compliance & Multi-Factor Auth Requirement',
    content: 'In accordance with our SOC2 Type II audit, all employee hardware and single-sign-on accounts must enable hardware token or authenticator app MFA by end of this week. Legacy SMS verification will be deprecated.',
    department: 'All Departments',
    priority: 'high',
    authorName: 'Alex Chen',
    authorRole: 'DevOps & Cloud Architect',
    date: getPastDate(8),
    tags: ['Security', 'SOC2', 'Compliance'],
    isPinned: false
  }
];

export const INITIAL_TRAININGS: TrainingProgram[] = [
  {
    id: 'trn_01',
    title: 'Enterprise Cloud Security & Zero-Trust Architecture',
    description: 'Master defense-in-depth principles, IAM least-privilege configurations, automated secret scanning, and incident response runbooks in cloud environments.',
    category: 'Security & Compliance',
    instructor: 'Alex Chen (Principal Cloud Architect)',
    durationHours: 6,
    enrolledCount: 24,
    enrolledEmployeeIds: ['usr_emp_01', 'usr_emp_02', 'usr_emp_03', 'usr_mgr_01'],
    modules: [
      { id: 'm1', title: 'Principles of Zero Trust & Network Microsegmentation', durationMinutes: 45, completed: true, summary: 'Understanding boundaryless defense and identity verification.' },
      { id: 'm2', title: 'Hardening Cloud Infrastructure & Kubernetes Secrets', durationMinutes: 60, completed: true, summary: 'Configuring KMS keys, secrets rotation, and Pod security standards.' },
      { id: 'm3', title: 'Threat Modeling & OWASP API Top 10 Mitigation', durationMinutes: 50, completed: true, summary: 'Proactive vulnerability assessments and penetration testing approaches.' },
      { id: 'm4', title: 'SOC2 & ISO 27001 Audit Readiness Walkthrough', durationMinutes: 45, completed: true, summary: 'Maintaining audit logs, access reviews, and data residency guarantees.' }
    ],
    status: 'completed',
    completionDate: getPastDate(4),
    certificateIssued: true,
    certificateId: 'NX-CERT-2026-88412'
  },
  {
    id: 'trn_02',
    title: 'Advanced Full-Stack Performance & Micro-Frontend Architecture',
    description: 'Deep dive into rendering optimization, SSR/RSC patterns, distributed caching with Redis, and decoupling monolithic UI applications.',
    category: 'Engineering',
    instructor: 'Staff Software Architect Team',
    durationHours: 8,
    enrolledCount: 18,
    enrolledEmployeeIds: ['usr_emp_01', 'usr_emp_03'],
    modules: [
      { id: 'm21', title: 'Core Web Vitals & Real-User Performance Profiling', durationMinutes: 60, completed: true, summary: 'LCP, INP, and CLS tuning in production environments.' },
      { id: 'm22', title: 'Distributed State & Event-Driven Cache Invalidation', durationMinutes: 75, completed: true, summary: 'Designing predictable cache layers and background workers.' },
      { id: 'm23', title: 'Micro-Frontend Module Federation & Boundary Isolation', durationMinutes: 90, completed: false, summary: 'Composing runtime decoupled micro-apps without bundle bloat.' },
      { id: 'm24', title: 'Automated Load Testing with k6 & Chaos Engineering', durationMinutes: 60, completed: false, summary: 'Simulating traffic spikes and graceful fallback modes.' }
    ],
    status: 'in_progress',
    certificateIssued: false
  },
  {
    id: 'trn_03',
    title: 'High-Impact Technical Leadership & Empathetic Management',
    description: 'Equip aspiring tech leads and managers with strategic communication frameworks, 1-on-1 coaching models, delegation tactics, and conflict resolution techniques.',
    category: 'Management',
    instructor: 'Elena Rostova & Guest Executives',
    durationHours: 10,
    enrolledCount: 12,
    enrolledEmployeeIds: ['usr_mgr_01', 'usr_emp_01'],
    modules: [
      { id: 'm31', title: 'The Manager Shift: From Individual Contributor to Multiplier', durationMinutes: 60, completed: false, summary: 'Rethinking value creation through team enablement.' },
      { id: 'm32', title: 'Constructive Feedback Frameworks & Psychological Safety', durationMinutes: 60, completed: false, summary: 'Creating environments where high performers take smart risks.' },
      { id: 'm33', title: 'Quarterly OKR Alignment & Engineering Capacity Planning', durationMinutes: 75, completed: false, summary: 'Translating business goals into roadmap velocity.' },
      { id: 'm34', title: 'Performance Turnarounds & Career Ladder Mentorship', durationMinutes: 60, completed: false, summary: 'Conducting equitable appraisals and supporting promotions.' }
    ],
    status: 'enrolled',
    certificateIssued: false
  },
  {
    id: 'trn_04',
    title: 'Design Systems at Enterprise Scale',
    description: 'Learn component tokens, multi-brand theming, design-to-code synchronizations, and accessibility compliance across modern digital products.',
    category: 'Design',
    instructor: 'Maya Lin (Lead Product Designer)',
    durationHours: 5,
    enrolledCount: 15,
    enrolledEmployeeIds: ['usr_emp_03', 'usr_emp_05'],
    modules: [
      { id: 'm41', title: 'Atomic Foundations: Tokens, Typography & Spacing Matrices', durationMinutes: 50, completed: true, summary: 'Building rock-solid token foundations in code and Figma.' },
      { id: 'm42', title: 'WCAG 2.2 AA Compliance & Screen Reader Testing', durationMinutes: 50, completed: true, summary: 'Making enterprise apps natively accessible.' },
      { id: 'm43', title: 'Component Versioning & Breaking Change Management', durationMinutes: 60, completed: true, summary: 'Publishing stable npm libraries for multiple product teams.' }
    ],
    status: 'available',
    certificateIssued: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    userId: 'usr_emp_01',
    title: 'Annual Leave Application Submitted',
    message: 'Your 5-day leave request for Pacific Northwest vacation is currently under review by Marcus Vance.',
    type: 'leave',
    timestamp: '2 hours ago',
    read: false,
    linkTab: 'leaves'
  },
  {
    id: 'notif_02',
    userId: 'usr_mgr_01',
    title: 'Pending Leave Approvals (2)',
    message: 'Sarah Jenkins and Alex Chen have submitted leave requests waiting for your approval.',
    type: 'leave',
    timestamp: '3 hours ago',
    read: false,
    linkTab: 'leaves'
  },
  {
    id: 'notif_03',
    userId: 'usr_emp_01',
    title: 'Certificate Ready to Download',
    message: 'Congratulations! You completed "Enterprise Cloud Security & Zero-Trust Architecture". Your official verified certificate is ready.',
    type: 'training',
    timestamp: '1 day ago',
    read: false,
    linkTab: 'trainings'
  },
  {
    id: 'notif_04',
    userId: 'all',
    title: 'New Announcement Posted',
    message: 'Elena Rostova posted: "Company-Wide Q4 All-Hands & Product Roadmap Reveal". Check out the details.',
    type: 'announcement',
    timestamp: '1 day ago',
    read: true,
    linkTab: 'announcements'
  },
  {
    id: 'notif_05',
    userId: 'usr_hr_01',
    title: 'Monthly Attendance Roster Ready',
    message: 'Overall org attendance achieved 96.4% this month. Download the CSV report for payroll auditing.',
    type: 'attendance',
    timestamp: '2 days ago',
    read: true,
    linkTab: 'reports'
  }
];

export const INITIAL_PERFORMANCE_REVIEWS: PerformanceReview[] = [
  {
    id: 'rev_01',
    employeeId: 'EMP-1003',
    employeeName: 'Sarah Jenkins',
    reviewerId: 'usr_mgr_01',
    reviewerName: 'Marcus Vance',
    reviewPeriod: 'Q3 2026',
    date: getPastDate(15),
    rating: 4.8,
    categories: {
      technicalSkills: 5,
      communication: 4.8,
      punctuality: 4.7,
      problemSolving: 5,
      teamwork: 4.7
    },
    strengths: 'Outstanding technical architecture contributions during our core service migration. Consistently mentors junior engineers and writes exemplary documentation.',
    areasForImprovement: 'Could delegate more implementation tasks to junior engineers to preserve bandwidth for system architecture leadership.',
    managerNotes: 'Recommended for Staff Software Engineer promotion review next cycle. Key pillar of our engineering department.',
    goalsNextQuarter: [
      'Spearhead the Micro-Frontend decoupling initiative',
      'Mentor 2 mid-level engineers through system design milestones',
      'Complete the High-Impact Technical Leadership module'
    ],
    status: 'acknowledged'
  },
  {
    id: 'rev_02',
    employeeId: 'EMP-1004',
    employeeName: 'Alex Chen',
    reviewerId: 'usr_mgr_01',
    reviewerName: 'Marcus Vance',
    reviewPeriod: 'Q3 2026',
    date: getPastDate(18),
    rating: 4.6,
    categories: {
      technicalSkills: 5,
      communication: 4.2,
      punctuality: 4.6,
      problemSolving: 4.8,
      teamwork: 4.4
    },
    strengths: 'World-class DevOps infrastructure setup. Reduced CI/CD build times by 42% and maintains 99.99% cloud uptime.',
    areasForImprovement: 'Cross-functional documentation and proactive notifications to product teams during infrastructure changes.',
    managerNotes: 'Terrific performance, strongly technically adept.',
    goalsNextQuarter: [
      'Complete automated secret rotation across all microservices',
      'Conduct 2 DevOps best practices brown-bag sessions'
    ],
    status: 'submitted'
  }
];

// Helper functions for realistic dynamic dates
function getPastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}
